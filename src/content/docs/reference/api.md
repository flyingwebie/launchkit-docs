---
title: API Reference
description: API endpoints and utilities for LaunchKit.
---

LaunchKit provides several API routes to handle common functionality like authentication, payments, and data management. All routes are built with Next.js 15 App Router and TypeScript.

## Authentication API

### `/api/auth/callback`

Handles authentication callbacks from Supabase Auth.

**Method:** `GET`

**Description:** Processes authentication tokens and redirects users after successful login.

**Implementation:**

```typescript
// app/api/auth/callback/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/libs/supabase/server';
import config from '@/config';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + config.auth.callbackUrl);
}
```

## Lead Management API

### `/api/lead`

Handles email lead collection for waitlists and marketing.

**Method:** `POST`

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true
}
```

**Implementation:**

```typescript
// app/api/lead/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/libs/supabase/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // Here you can add your own logic
    // For instance, sending a welcome email (use the sendEmail helper function from /libs/resend)
    // For instance, saving the lead in the database (uncomment the code below)

    // const supabase = createClient();
    // await supabase.from('leads').insert({ email: body.email });

    return NextResponse.json({});
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
```

## Stripe Integration API

### `/api/stripe/create-checkout`

Creates Stripe checkout sessions for payments and subscriptions.

**Method:** `POST`

**Request Body:**

```json
{
  "priceId": "price_123",
  "mode": "subscription",
  "successUrl": "https://yourdomain.com/success",
  "cancelUrl": "https://yourdomain.com/cancel"
}
```

**Response:**

```json
{
  "url": "https://checkout.stripe.com/pay/..."
}
```

**Implementation:**

```typescript
// app/api/stripe/create-checkout/route.ts
import { createCheckout } from '@/libs/stripe';
import { createClient } from '@/libs/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.priceId) {
    return NextResponse.json(
      { error: 'Price ID is required' },
      { status: 400 }
    );
  } else if (!body.successUrl || !body.cancelUrl) {
    return NextResponse.json(
      { error: 'Success and cancel URLs are required' },
      { status: 400 }
    );
  } else if (!body.mode) {
    return NextResponse.json(
      {
        error:
          'Mode is required (either "payment" for one-time payments or "subscription" for recurring subscription)',
      },
      { status: 400 }
    );
  }

  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { priceId, mode, successUrl, cancelUrl } = body;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single();

    const stripeSessionURL = await createCheckout({
      priceId,
      mode,
      successUrl,
      cancelUrl,
      clientReferenceId: user?.id,
      user: {
        email: data?.email,
        customerId: data?.customer_id,
      },
    });

    return NextResponse.json({ url: stripeSessionURL });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
```

### `/api/webhook/stripe`

Handles Stripe webhook events for subscription management.

**Method:** `POST`

**Description:** Processes Stripe webhook events and updates user database records.

**Key Events Handled:**

- `checkout.session.completed` - Grant access after successful payment
- `checkout.session.expired` - Handle expired checkout sessions
- `customer.subscription.updated` - Handle plan changes
- `customer.subscription.deleted` - Revoke access when subscription ends
- `invoice.paid` - Grant access for recurring payments
- `invoice.payment_failed` - Handle failed payments

**Implementation:**

```typescript
// app/api/webhook/stripe/route.ts
import configFile from '@/config';
import { findCheckoutSession } from '@/libs/stripe';
import { SupabaseClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
  typescript: true,
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  let eventType;
  let event;

  const supabase = new SupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  eventType = event.type;

  try {
    switch (eventType) {
      case 'checkout.session.completed': {
        // Grant access to the product
        const stripeObject: Stripe.Checkout.Session = event.data
          .object as Stripe.Checkout.Session;

        const session = await findCheckoutSession(stripeObject.id);
        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price.id;
        const userId = stripeObject.client_reference_id;

        await supabase
          .from('profiles')
          .update({
            customer_id: customerId,
            price_id: priceId,
            has_access: true,
          })
          .eq('id', userId);

        break;
      }

      case 'customer.subscription.deleted': {
        // Revoke access when subscription ends
        const stripeObject: Stripe.Subscription = event.data
          .object as Stripe.Subscription;

        await supabase
          .from('profiles')
          .update({ has_access: false })
          .eq('customer_id', stripeObject.customer);
        break;
      }

      case 'invoice.paid': {
        // Grant access for recurring payments
        const stripeObject: Stripe.Invoice = event.data
          .object as Stripe.Invoice;

        await supabase
          .from('profiles')
          .update({ has_access: true })
          .eq('customer_id', stripeObject.customer);
        break;
      }

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error('stripe error: ', e.message);
  }

  return NextResponse.json({});
}
```

## Utility Libraries

### Supabase Client Helpers

LaunchKit uses the new Supabase SSR package for seamless authentication across client and server components.

```typescript
// libs/supabase/client.ts - Client-side Supabase client
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

```typescript
// libs/supabase/server.ts - Server-side Supabase client
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
```

### Email Utilities

```typescript
// libs/resend.ts
import { Resend } from 'resend';
import config from '@/config';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string | string[];
}) => {
  const { data, error } = await resend.emails.send({
    from: config.resend.fromAdmin,
    to,
    subject,
    text,
    html,
    ...(replyTo && { replyTo }),
  });

  if (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }

  return data;
};
```

### Stripe Utilities

```typescript
// libs/stripe.ts
import Stripe from 'stripe';

interface CreateCheckoutParams {
  priceId: string;
  mode: 'payment' | 'subscription';
  successUrl: string;
  cancelUrl: string;
  couponId?: string | null;
  clientReferenceId?: string;
  user?: {
    customerId?: string;
    email?: string;
  };
}

export const createCheckout = async ({
  user,
  mode,
  clientReferenceId,
  successUrl,
  cancelUrl,
  priceId,
  couponId,
}: CreateCheckoutParams): Promise<string> => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16',
      typescript: true,
    });

    const extraParams: {
      customer?: string;
      customer_creation?: 'always';
      customer_email?: string;
      invoice_creation?: { enabled: boolean };
      payment_intent_data?: { setup_future_usage: 'on_session' };
      tax_id_collection?: { enabled: boolean };
    } = {};

    if (user?.customerId) {
      extraParams.customer = user.customerId;
    } else {
      if (mode === 'payment') {
        extraParams.customer_creation = 'always';
        extraParams.payment_intent_data = { setup_future_usage: 'on_session' };
      }
      if (user?.email) {
        extraParams.customer_email = user.email;
      }
      extraParams.tax_id_collection = { enabled: true };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      mode,
      allow_promotion_codes: true,
      client_reference_id: clientReferenceId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      discounts: couponId
        ? [
            {
              coupon: couponId,
            },
          ]
        : [],
      success_url: successUrl,
      cancel_url: cancelUrl,
      ...extraParams,
    });

    return stripeSession.url;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const createCustomerPortal = async ({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}): Promise<string> => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16',
    typescript: true,
  });

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return portalSession.url;
};

export const findCheckoutSession = async (sessionId: string) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16',
      typescript: true,
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    return session;
  } catch (e) {
    console.error(e);
    return null;
  }
};
```

### SEO Utilities

```typescript
// libs/seo.tsx
import type { Metadata } from 'next';
import config from '@/config';

export const getSEOTags = ({
  title,
  description,
  keywords,
  openGraph,
  canonicalUrlRelative,
  extraTags,
}: Metadata & {
  canonicalUrlRelative?: string;
  extraTags?: Record<string, any>;
} = {}) => {
  return {
    title: title || config.appName,
    description: description || config.appDescription,
    keywords: keywords || [config.appName],
    applicationName: config.appName,
    metadataBase: new URL(
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/'
        : `https://${config.domainName}/`
    ),

    openGraph: {
      title: openGraph?.title || config.appName,
      description: openGraph?.description || config.appDescription,
      url: openGraph?.url || `https://${config.domainName}/`,
      siteName: openGraph?.title || config.appName,
      locale: 'en_US',
      type: 'website',
    },

    twitter: {
      title: openGraph?.title || config.appName,
      description: openGraph?.description || config.appDescription,
      card: 'summary_large_image',
      creator: '@marc_louvion',
    },

    ...(canonicalUrlRelative && {
      alternates: { canonical: canonicalUrlRelative },
    }),

    ...extraTags,
  };
};

export const renderSchemaTags = () => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'http://schema.org',
          '@type': 'SoftwareApplication',
          name: config.appName,
          description: config.appDescription,
          image: `https://${config.domainName}/icon.png`,
          url: `https://${config.domainName}/`,
          author: {
            '@type': 'Person',
            name: 'Davide Lou',
          },
          datePublished: '2023-08-01',
          applicationCategory: 'EducationalApplication',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '12',
          },
          offers: [
            {
              '@type': 'Offer',
              price: '9.00',
              priceCurrency: 'USD',
            },
          ],
        }),
      }}
    ></script>
  );
};
```

## Error Handling

All API routes include proper error handling with TypeScript:

```typescript
export async function POST(request: NextRequest) {
  try {
    // Your API logic here

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Environment Variables

Required environment variables for LaunchKit:

```bash
# Resend for email functionality
RESEND_API_KEY=

# Supabase for database and authentication
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe for payments
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Testing API Endpoints

Use tools like Postman or curl to test your API endpoints:

```bash
# Test lead collection
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Test checkout creation (requires authentication)
curl -X POST http://localhost:3000/api/stripe/create-checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "priceId": "price_123",
    "mode": "subscription",
    "successUrl": "http://localhost:3000/success",
    "cancelUrl": "http://localhost:3000/cancel"
  }'
```

These API endpoints provide the foundation for your LaunchKit application's backend functionality with type-safe implementations using Next.js 15 and TypeScript!
