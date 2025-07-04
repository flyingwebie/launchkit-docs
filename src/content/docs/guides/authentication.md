---
title: User Authentication
description: Set up user authentication with Supabase Auth.
---

LaunchKit uses **Supabase Auth** to authenticate users. You can configure it using the Supabase client in your components and API routes.

## Built-in Authentication Methods

There are 2 built-in ways to authenticate users with LaunchKit:

- **Magic Links** - Passwordless authentication via email
- **Google OAuth** - Sign in with Google

## Setup Authentication

1. **Configure Supabase Auth**: In your Supabase dashboard, go to Authentication > Settings and configure your site URL and redirect URLs.

2. **Configure Redirect URLs**:
   - Go to your Supabase Dashboard
   - Navigate to Authentication > URL Configuration
   - Set your **Site URL** to your production URL (e.g., `https://yourdomain.com`)
   - Add **Redirect URLs** to the allow list:
     - For local development: `http://localhost:3000/**`
     - For production: `https://yourdomain.com/**`
     - For Netlify previews: `https://**--your_org.netlify.app/**`
     - For Vercel previews: `https://*-your-team-slug.vercel.app/**`

   **Note**: You can use wildcards (`*`, `**`, `?`) in redirect URLs to support preview deployments. The `**` wildcard matches any sequence of characters, while `*` matches any sequence of non-separator characters.

3. **Add Environment Variables**: Create a `.env.local` file with the following variables:

```shell
# -----------------------------------------------------------------------------
# Resend
# -----------------------------------------------------------------------------
RESEND_API_KEY=

# -----------------------------------------------------------------------------
# Database URI
# -----------------------------------------------------------------------------
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# -----------------------------------------------------------------------------
# Stripe
# -----------------------------------------------------------------------------
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Magic Links Setup

Magic links allow users to sign in via a link sent to their email.

1. In your Supabase dashboard, go to Authentication > Settings
2. Enable "Enable email confirmations"
3. Configure your email templates under Authentication > Email Templates

## Google OAuth Setup

1. Create a Google OAuth app in the [Google Cloud Console](https://console.cloud.google.com/)
2. Add your OAuth credentials to Supabase:
   - Go to Authentication > Providers in your Supabase dashboard
   - Enable Google provider
   - Add your Google Client ID and Client Secret

## Using Authentication in Components

Here's how to implement a sign-in button:

```jsx
"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const SignInButton = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleMagicLink = async (email) => {
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={handleSignIn}>
        Sign in with Google
      </button>

      <button
        className="btn btn-secondary"
        onClick={() => handleMagicLink("user@example.com")}
      >
        Send Magic Link
      </button>
    </div>
  );
};

export default SignInButton;
```

## Auth Callback Route

Create an auth callback route at `/app/auth/callback/route.js`:

```javascript
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to dashboard or home page
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
```

## Protected Routes

To protect routes, use middleware or check auth status in your components:

```jsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {session.user.email}!</p>
    </div>
  );
}
```

## Sign Out

To sign out users:

```jsx
const handleSignOut = async () => {
  await supabase.auth.signOut();
  router.push("/");
};
```

Your authentication system is now ready! Users can sign in with Google OAuth or magic links, and you can protect routes as needed.
