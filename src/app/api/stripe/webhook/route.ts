import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '../../../../lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-06-30.basil',
  typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Helper to get raw body for webhook verification
async function getRawBody(readable: ReadableStream<Uint8Array> | null): Promise<Buffer> {
  if (!readable) {
    throw new Error('Readable stream is null');
  }
  
  const reader = readable.getReader();
  const chunks: Uint8Array[] = [];
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    return Buffer.concat(chunks);
  } finally {
    reader.releaseLock();
  }
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventData = event.data as any; // Type assertion needed for Stripe webhook

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = eventData.object as Stripe.Checkout.Session;
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
                  (typeof session.subscription === 'object' && session.subscription !== null && 'current_period_end' in session.subscription)
                    ? (session.subscription as { current_period_end: number }).current_period_end * 1000
                    : Date.now()
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
        const subscriptionId = (event.data.object as Stripe.Subscription).id;

        // Get the subscription with expanded customer
        const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ['customer']
        });
        
        // Get the subscription data with proper typing
        const subscriptionData = subscriptionResponse as unknown as {
          id: string;
          status: string;
          current_period_end: number;
          cancel_at_period_end: boolean;
          cancel_at: number | null;
          metadata: Record<string, string>;
          customer: string | Stripe.Customer;
        };
        
        // Type assertion to handle the Stripe subscription response
        const customer = subscriptionData.customer;
        const customerId = typeof customer === 'string' ? customer : customer?.id || '';
        
        // Create a properly typed subscription object
        const subscription = {
          id: subscriptionData.id,
          status: subscriptionData.status,
          current_period_end: subscriptionData.current_period_end,
          cancel_at_period_end: subscriptionData.cancel_at_period_end,
          canceled_at: subscriptionData.cancel_at,
          metadata: subscriptionData.metadata,
          customer: customerId
        };

        // Get the user associated with this subscription
        const { data: user } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('stripe_customer_id', subscription.customer)
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
        const invoice = event.data.object as Stripe.Invoice & {
          subscription: string;
        };
        const subscriptionId = invoice.subscription;
        
        // Get the subscription to update the current_period_end
        const subscription = await stripe.subscriptions.retrieve(subscriptionId) as unknown as {
          id: string;
          status: string;
          current_period_end: number;
          metadata: { userId?: string };
        };
        
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
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice & {
          subscription: string;
        };
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
