import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
  typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Helper to get raw body for webhook verification
async function getRawBody(readable: any) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(request: Request) {
  const payload = await getRawBody(request.body);
  const signature = request.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret || '');
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  const supabase = createClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        if (userId) {
          // Update user's subscription in the database
          await supabase
            .from('subscriptions')
            .upsert(
              {
                user_id: userId,
                stripe_subscription_id: subscriptionId,
                stripe_customer_id: customerId,
                status: 'active',
                current_period_end: new Date(
                  (session.subscription as any)?.current_period_end * 1000
                ).toISOString(),
                metadata: session.metadata,
              },
              { onConflict: 'user_id' }
            );
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get user ID from customer metadata or database
        const { data: user } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (user) {
          if (subscription.status === 'canceled' || subscription.cancel_at_period_end) {
            // Subscription was canceled or will be canceled at period end
            await supabase
              .from('subscriptions')
              .update({
                status: subscription.cancel_at_period_end ? 'canceled' : 'inactive',
                cancel_at_period_end: subscription.cancel_at_period_end || false,
                canceled_at: subscription.canceled_at
                  ? new Date(subscription.canceled_at * 1000).toISOString()
                  : null,
                current_period_end: new Date(
                  subscription.current_period_end * 1000
                ).toISOString(),
              })
              .eq('stripe_subscription_id', subscription.id);
          } else {
            // Subscription was updated
            await supabase
              .from('subscriptions')
              .upsert(
                {
                  user_id: user.id,
                  stripe_subscription_id: subscription.id,
                  stripe_customer_id: customerId,
                  status: subscription.status,
                  current_period_end: new Date(
                    subscription.current_period_end * 1000
                  ).toISOString(),
                  cancel_at_period_end: subscription.cancel_at_period_end || false,
                },
                { onConflict: 'stripe_subscription_id' }
              );
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        const customerId = invoice.customer as string;

        if (invoice.billing_reason === 'subscription_create') {
          // Handle initial subscription creation
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const userId = subscription.metadata?.userId;

          if (userId) {
            await supabase
              .from('subscriptions')
              .update({
                status: 'active',
                current_period_end: new Date(
                  subscription.current_period_end * 1000
                ).toISOString(),
              })
              .eq('user_id', userId);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const subscriptionId = invoice.subscription as string;

        // Update subscription status to past_due
        await supabase
          .from('subscriptions')
          .update({
            status: 'past_due',
          })
          .eq('stripe_subscription_id', subscriptionId);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
