---
title: Ship in 5 Minutes
description: Get your startup in front of customers in 5 minutes.
---

Let's get your startup in front of your customers in 5 minutes ⚡️

We're building a beautiful landing page and adding forms to collect emails for a waitlist (optional)

## Steps

1. If you haven't already, clone the repo and run the server locally. See the [Get Started](/guides/getting-started) guide.

2. Delete everything in `/app/page.js`, and paste this:

```jsx
import { Suspense } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Problem from '@/components/Problem';
import FeaturesAccordion from '@/components/FeaturesAccordion';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main>
        <Hero />
        <Problem />
        <FeaturesAccordion />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
```

3. Edit the copy to fit your business logic. Each component has tips to help you write copy that sells—see the [components section](/reference/components). Congrats you have a beautiful landing page to show!

4. (Optional) To collect emails for a waitlist, [set up Supabase](/guides/database) and uncomment the code in `/api/lead/route.js` to save emails in your database.

5. (Optional) Replace the main call-to-action button in `Hero`, `Pricing`, and `CTA` with this:

```jsx
import ButtonLead from "@/components/ButtonLead";

// For the Hero & CTA use this 👇
<ButtonLead />

// For the Pricing use this instead 👇
<ButtonLead extraStyle="!max-w-none !w-full" />
```

6. It's time to deploy! If you need help, here's a [deployment guide](/guides/deployment)

7. (Optional) Track your traffic with analytics tools

## Next Steps

Congrats on crushing the first steps, legend! 🎉

Your LaunchKit app is now ready to collect users and validate your startup idea. Keep building and iterating based on user feedback!
