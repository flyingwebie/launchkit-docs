// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'LaunchKit Docs',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/your-org/launchkit',
        },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Get Started', slug: 'guides/getting-started' },
            { label: 'Ship in 5 Minutes', slug: 'guides/ship-in-5-minutes' },
          ],
        },
        {
          label: 'Core Features',
          items: [
            { label: 'Authentication', slug: 'guides/authentication' },
            { label: 'Database', slug: 'guides/database' },
            { label: 'Payments', slug: 'guides/payments' },
            { label: 'Email Integration', slug: 'guides/emails' },
            { label: 'SEO & Marketing', slug: 'guides/seo' },
            { label: 'Deployment', slug: 'guides/deployment' },
          ],
        },
        {
          label: 'Support & Quality',
          items: [
            { label: 'Customer Support', slug: 'guides/customer-support' },
            { label: 'Error Handling', slug: 'guides/error-handling' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Components', slug: 'reference/components' },
            { label: 'API Reference', slug: 'reference/api' },
          ],
        },
      ],
    }),
  ],
});
