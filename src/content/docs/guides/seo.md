---
title: SEO & Marketing
description: Optimize your LaunchKit app for search engines and content marketing
---

LaunchKit comes with built-in SEO optimization and tools to help your startup get discovered.

## SEO Setup

### Basic Configuration

1. **Configure SEO defaults** in your `config.ts` file:

```typescript
export const config = {
  appName: 'LaunchKit',
  appDescription:
    'Ship your startup idea fast with Next.js + Supabase + TypeScript',
  domainName: 'https://yourlaunchkit.com',
  // ... other config
};
```

2. **SEO Helper Functions** - LaunchKit includes SEO utilities in `/libs/seo.ts`:

```typescript
import { Metadata } from 'next';

export function getSEOTags({
  title,
  description,
  canonicalUrlRelative,
  extraTags,
}: {
  title?: string;
  description?: string;
  canonicalUrlRelative?: string;
  extraTags?: Metadata;
}): Metadata {
  return {
    title: title || config.appName,
    description: description || config.appDescription,
    keywords: ['startup', 'saas', 'nextjs', 'supabase', 'typescript'],
    authors: [{ name: config.appName }],
    creator: config.appName,
    openGraph: {
      title: title || config.appName,
      description: description || config.appDescription,
      url: canonicalUrlRelative
        ? `${config.domainName}${canonicalUrlRelative}`
        : config.domainName,
      siteName: config.appName,
      images: [
        {
          url: `${config.domainName}/og-image.png`,
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title || config.appName,
      description: description || config.appDescription,
      images: [`${config.domainName}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
    ...extraTags,
  };
}
```

3. **Page-specific SEO** - Add custom SEO to any page:

```typescript
// app/pricing/page.tsx
import { getSEOTags } from '@/libs/seo';

export const metadata = getSEOTags({
  title: 'Pricing - LaunchKit',
  description: 'Choose the perfect plan for your startup',
  canonicalUrlRelative: '/pricing',
});

export default function PricingPage() {
  return <div>{/* Your pricing page content */}</div>;
}
```

### Structured Data

Add structured data for better search engine understanding:

```typescript
// libs/seo.ts
export function renderSchemaTags() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: config.appName,
    description: config.appDescription,
    url: config.domainName,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Sitemap Generation

LaunchKit uses `next-sitemap` for automatic sitemap generation:

1. **Configure** `next-sitemap.config.js`:

```javascript
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_URL || 'https://yourlaunchkit.com',
  generateRobotsTxt: true,
  exclude: ['/api/*', '/admin/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
  },
};
```

2. **Add to package.json**:

```json
{
  "scripts": {
    "postbuild": "next-sitemap"
  }
}
```

## Content Marketing

### Blog System

LaunchKit includes a built-in MDX blog system for content marketing:

1. **Create blog posts** in `/app/blog/posts/`:

```mdx
---
title: 'How to Ship Your Startup Fast'
description: 'Learn the essential steps to launch your startup quickly'
date: '2024-01-15'
author: 'Your Name'
image: '/blog/ship-fast.jpg'
---

# How to Ship Your Startup Fast

Your blog content here...
```

2. **Blog configuration** in `config.ts`:

```typescript
export const blog = {
  title: 'LaunchKit Blog',
  description: 'Insights on building and shipping startups fast',
  defaultAuthor: 'LaunchKit Team',
};
```

### SEO Best Practices

1. **Meta Tags**: Every page should have unique title and description
2. **Open Graph**: Social media sharing optimization
3. **Twitter Cards**: Enhanced Twitter sharing
4. **Canonical URLs**: Prevent duplicate content issues
5. **Structured Data**: Help search engines understand your content
6. **Site Speed**: Optimized images and code splitting
7. **Mobile-First**: Responsive design for all devices

### Google Search Console

1. **Verify domain ownership** with Google Search Console
2. **Submit sitemap**: `https://yourlaunchkit.com/sitemap.xml`
3. **Monitor performance**: Track clicks, impressions, and rankings
4. **Fix issues**: Address crawl errors and indexing problems

### Content Strategy

1. **Problem-Solution Content**: Address your target audience's pain points
2. **How-to Guides**: Educational content that provides value
3. **Case Studies**: Success stories and real-world examples
4. **Industry Insights**: Share expertise and thought leadership
5. **SEO Keywords**: Research and target relevant search terms

## Analytics Integration

Track your SEO performance with built-in analytics:

```typescript
// components/Analytics.tsx
'use client';

import { useEffect } from 'react';

export default function Analytics() {
  useEffect(() => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
      script.async = true;
      document.head.appendChild(script);

      window.gtag =
        window.gtag ||
        function () {
          (window.gtag.q = window.gtag.q || []).push(arguments);
        };
      window.gtag('js', new Date());
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID);
    }
  }, []);

  return null;
}
```

This comprehensive SEO setup ensures your LaunchKit application is optimized for search engines and ready for content marketing from day one.
