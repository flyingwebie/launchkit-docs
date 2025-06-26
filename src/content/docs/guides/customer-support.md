---
title: Customer Support
description: Set up customer support with chat integration and help systems
---

LaunchKit includes built-in customer support features to help you provide excellent service to your users.

## Crisp Chat Integration

### Setup

1. **Create a Crisp Account** at [crisp.chat](https://crisp.chat/en/)

2. **Create a new website** and copy the website ID from the Integrations menu, in the HTML option (called `CRISP_WEBSITE_ID`)

3. **Configure in your app** by adding the Crisp website ID to your `config.ts`:

```typescript
export const config = {
  // ... other config
  crisp: {
    id: 'your-crisp-website-id', // Get this from Crisp dashboard
  },
};
```

4. **Add the Crisp component** to your layout:

```tsx
// components/CrispChat.tsx
'use client';

import { useEffect } from 'react';
import { config } from '@/config';

export default function CrispChat() {
  useEffect(() => {
    if (config.crisp?.id) {
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = config.crisp.id;

      const script = document.createElement('script');
      script.src = 'https://client.crisp.chat/l.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
```

5. **Include in your main layout**:

```tsx
// app/layout.tsx
import CrispChat from '@/components/CrispChat';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <CrispChat />
      </body>
    </html>
  );
}
```

## Support Button Component

Create a reusable support button that opens the chat or email client:

```tsx
// components/ButtonSupport.tsx
'use client';

import { config } from '@/config';

interface ButtonSupportProps {
  className?: string;
  children?: React.ReactNode;
}

export default function ButtonSupport({
  className = 'btn btn-primary',
  children = 'Get Help',
}: ButtonSupportProps) {
  const handleSupport = () => {
    if (config.crisp?.id && window.$crisp) {
      // Open Crisp chat
      window.$crisp.push(['do', 'chat:open']);
    } else {
      // Fallback to email
      const subject = encodeURIComponent('Support Request');
      const body = encodeURIComponent('Hi, I need help with...');
      window.location.href = `mailto:${config.email.support}?subject=${subject}&body=${body}`;
    }
  };

  return (
    <button onClick={handleSupport} className={className}>
      {children}
    </button>
  );
}
```

## Error Page Integration

Integrate support into your error pages:

```tsx
// app/error.tsx
'use client';

import { useEffect } from 'react';
import ButtonSupport from '@/components/ButtonSupport';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">
          We apologize for the inconvenience. Our team has been notified.
        </p>

        <div className="space-y-4">
          <button onClick={reset} className="btn btn-primary w-full">
            Try again
          </button>

          <ButtonSupport className="btn btn-outline w-full">
            Contact Support
          </ButtonSupport>
        </div>
      </div>
    </div>
  );
}
```

## 404 Page Integration

```tsx
// app/not-found.tsx
import Link from 'next/link';
import ButtonSupport from '@/components/ButtonSupport';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist.
        </p>

        <div className="space-y-4">
          <Link href="/" className="btn btn-primary w-full">
            Go Home
          </Link>

          <ButtonSupport className="btn btn-outline w-full">
            Need Help?
          </ButtonSupport>
        </div>
      </div>
    </div>
  );
}
```

## Support Features

### 1. User Context

Automatically provide user context to support:

```tsx
// components/CrispChat.tsx (enhanced)
'use client';

import { useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { config } from '@/config';

export default function CrispChat() {
  const { user } = useUser();

  useEffect(() => {
    if (config.crisp?.id) {
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = config.crisp.id;

      // Set user data when available
      if (user) {
        window.$crisp.push(['set', 'user:email', user.email]);
        window.$crisp.push([
          'set',
          'user:nickname',
          user.full_name || user.email,
        ]);
        window.$crisp.push([
          'set',
          'session:data',
          [
            ['user_id', user.id],
            ['plan', user.subscription?.plan || 'free'],
            ['signup_date', user.created_at],
          ],
        ]);
      }

      const script = document.createElement('script');
      script.src = 'https://client.crisp.chat/l.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, [user]);

  return null;
}
```

### 2. Support Triggers

Add contextual support triggers:

```tsx
// components/SupportTrigger.tsx
'use client';

import { useState } from 'react';
import ButtonSupport from './ButtonSupport';

interface SupportTriggerProps {
  context: string;
  message?: string;
}

export default function SupportTrigger({
  context,
  message = 'Need help with this?',
}: SupportTriggerProps) {
  const [showTrigger, setShowTrigger] = useState(false);

  const handleSupport = () => {
    if (window.$crisp) {
      window.$crisp.push([
        'do',
        'message:send',
        ['text', `I need help with: ${context}`],
      ]);
      window.$crisp.push(['do', 'chat:open']);
    }
  };

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShowTrigger(true)}
        onMouseLeave={() => setShowTrigger(false)}
        onClick={handleSupport}
        className="text-blue-600 hover:text-blue-800 text-sm"
      >
        ?
      </button>

      {showTrigger && (
        <div className="absolute bottom-full left-0 mb-2 p-2 bg-black text-white text-xs rounded whitespace-nowrap">
          {message}
        </div>
      )}
    </div>
  );
}
```

### 3. Help Documentation

Create a help center:

```tsx
// app/help/page.tsx
import Link from 'next/link';

const helpTopics = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of using LaunchKit',
    href: '/help/getting-started',
  },
  {
    title: 'Account Management',
    description: 'Manage your account settings and billing',
    href: '/help/account',
  },
  {
    title: 'Troubleshooting',
    description: 'Common issues and solutions',
    href: '/help/troubleshooting',
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Help Center</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {helpTopics.map((topic) => (
          <Link
            key={topic.href}
            href={topic.href}
            className="block p-6 border rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold mb-2">{topic.title}</h3>
            <p className="text-gray-600 text-sm">{topic.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          Can't find what you're looking for?
        </p>
        <ButtonSupport>Contact Support</ButtonSupport>
      </div>
    </div>
  );
}
```

## Configuration

Update your `config.ts` to include support settings:

```typescript
export const config = {
  // ... other config
  email: {
    support: 'support@yourlaunchkit.com',
    noreply: 'noreply@yourlaunchkit.com',
  },
  crisp: {
    id: process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID,
  },
};
```

## Best Practices

1. **Response Time**: Set expectations for response times
2. **User Context**: Provide relevant user information to support agents
3. **Escalation**: Have a clear escalation process for complex issues
4. **Knowledge Base**: Maintain up-to-date help documentation
5. **Proactive Support**: Use triggers to offer help before users ask
6. **Feedback**: Collect feedback on support interactions

This comprehensive support system ensures your users can get help when they need it, improving user satisfaction and retention.
