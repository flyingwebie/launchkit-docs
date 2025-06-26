---
title: Payments
description: Set up Stripe payments and subscriptions in LaunchKit.
---

LaunchKit integrates with **Stripe** to handle payments and subscriptions seamlessly. This guide will walk you through setting up Stripe for your application.

## Setup Stripe

1. **Create a Stripe Account**: Go to [stripe.com](https://stripe.com) and create an account.

2. **Get Your API Keys**: In your Stripe dashboard, go to Developers > API keys to find your:

   - Publishable key (starts with `pk_`)
   - Secret key (starts with `sk_`)

3. **Add Environment Variables**: Add your Stripe credentials to `.env.local`:

```shell
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Create Products and Prices

In your Stripe dashboard:

1. Go to Products and create your subscription plans
2. Set up pricing (monthly/yearly)
3. Copy the Price IDs for your application

Example price structure:

- Starter Plan: `price_starter_monthly`
- Pro Plan: `price_pro_monthly`
- Enterprise Plan: `price_enterprise_monthly`

## Checkout Implementation

### ButtonCheckout Component

Use the pre-built checkout button:

```jsx
import ButtonCheckout from '@/components/ButtonCheckout';

<ButtonCheckout priceId="price_starter_monthly" className="btn btn-primary">
  Subscribe to Starter Plan
</ButtonCheckout>;
```

### Custom Checkout Flow

For more control, create a custom checkout flow:

```jsx
'use client';

import { useState } from 'react';

const CustomCheckout = ({ priceId }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="btn btn-primary"
    >
      {loading ? 'Loading...' : 'Subscribe Now'}
    </button>
  );
};

export default CustomCheckout;
```

## API Routes

### Checkout Session Creation

Create `/app/api/checkout/route.js`:

```javascript
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { priceId, successUrl, cancelUrl } = await request.json();

    // Get authenticated user
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: session.user.email,
      client_reference_id: session.user.id,
      metadata: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
```

### Webhook Handler

Create `/app/api/webhook/stripe/route.js`:

```javascript
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session) {
  const userId = session.client_reference_id;
  const customerId = session.customer;

  // Update user with Stripe customer ID
  await supabase
    .from('profiles')
    .update({ stripe_customer_id: customerId })
    .eq('id', userId);
}

async function handleSubscriptionCreated(subscription) {
  // Save subscription to database
  await supabase.from('subscriptions').insert({
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    current_period_start: new Date(subscription.current_period_start * 1000),
    current_period_end: new Date(subscription.current_period_end * 1000),
  });
}

async function handleSubscriptionUpdated(subscription) {
  // Update subscription in database
  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handleSubscriptionDeleted(subscription) {
  // Mark subscription as canceled
  await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_subscription_id', subscription.id);
}
```

## Database Schema

Add subscription tables to your Supabase database:

```sql
-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT NOT NULL,
  price_id TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add stripe_customer_id to profiles
ALTER TABLE public.profiles
ADD COLUMN stripe_customer_id TEXT;

-- Row Level Security
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own customer data" ON customers
  FOR SELECT USING (auth.uid() = user_id);
```

## Customer Portal

Allow users to manage their subscriptions:

```jsx
'use client';

const CustomerPortalButton = () => {
  const handlePortal = async () => {
    try {
      const response = await fetch('/api/customer-portal', {
        method: 'POST',
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Portal error:', error);
    }
  };

  return (
    <button onClick={handlePortal} className="btn btn-secondary">
      Manage Subscription
    </button>
  );
};

export default CustomerPortalButton;
```

Create `/app/api/customer-portal/route.js`:

```javascript
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', session.user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'No customer found' }, { status: 404 });
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
```

## Checking Subscription Status

Create a utility to check user subscription:

```javascript
// lib/subscription.js
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getUserSubscription(userId) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  return subscription;
}

export function hasActiveSubscription(subscription) {
  return subscription && subscription.status === 'active';
}

export function isSubscriptionExpired(subscription) {
  if (!subscription) return true;

  const now = new Date();
  const endDate = new Date(subscription.current_period_end);

  return now > endDate;
}
```

## Testing Payments

1. **Use Test Mode**: Always test with Stripe's test keys first
2. **Test Cards**: Use Stripe's test card numbers:
   - Success: `4242424242424242`
   - Decline: `4000000000000002`
3. **Webhook Testing**: Use Stripe CLI to test webhooks locally:

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

Your LaunchKit payment system is now ready to handle subscriptions and one-time payments! 💳
