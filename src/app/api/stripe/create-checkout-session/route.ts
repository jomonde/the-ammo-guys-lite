import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
  typescript: true,
});

export async function POST(request: Request) {
  try {
    const {
      priceId,
      customerEmail,
      userId,
      metadata = {},
      successUrl,
      cancelUrl,
    } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Get or create customer in Stripe
    let customer: Stripe.Customer | undefined;
    const supabase = createClient();

    if (userId) {
      // Check if user already has a Stripe customer ID
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', userId)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error fetching user:', userError);
        throw userError;
      }

      if (userData?.stripe_customer_id) {
        // Retrieve existing customer
        customer = await stripe.customers.retrieve(
          userData.stripe_customer_id
        ) as Stripe.Customer;
      } else if (customerEmail) {
        // Create new customer in Stripe
        customer = await stripe.customers.create({
          email: customerEmail,
          metadata: {
            userId,
            ...metadata,
          },
        });

        // Save Stripe customer ID to user's profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ stripe_customer_id: customer.id })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating user with Stripe customer ID:', updateError);
          throw updateError;
        }
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}${cancelUrl}`,
      customer: customer?.id,
      customer_email: customer ? undefined : customerEmail,
      metadata: {
        userId,
        ...metadata,
      },
      subscription_data: {
        metadata: {
          userId,
          ...metadata,
        },
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
