# LaunchKit Documentation

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

> 📚 **Official documentation for LaunchKit** - The modern full-stack boilerplate to ship your startup fast.

## 🚀 About LaunchKit

LaunchKit is a modern, full-stack boilerplate built with **Next.js**, **Supabase**, and **TypeScript**. It's designed to help you ship your startup idea fast with all the essential features you need:

- 🔐 **Authentication** - Supabase Auth with magic links and OAuth
- 💾 **Database** - PostgreSQL with Supabase
- 💳 **Payments** - Stripe integration
- 📧 **Emails** - Transactional emails with Resend
- 🎨 **UI Components** - Beautiful, responsive components
- 🚀 **Deployment** - Easy deployment to Vercel

## 📖 Documentation Structure

This documentation site contains:

```
src/content/docs/
├── guides/
│   ├── getting-started.mdx      # Quick setup guide
│   ├── ship-in-5-minutes.md     # Fastest way to deploy
│   ├── authentication.md        # Auth setup and configuration
│   ├── database.mdx             # Supabase database setup
│   ├── payments.md              # Stripe integration
│   ├── emails.mdx               # Email configuration
│   ├── deployment.mdx           # Production deployment
│   ├── error-handling.md        # Error handling best practices
│   ├── customer-support.md      # Support system setup
│   └── seo.md                   # SEO optimization
└── reference/
    ├── api.md                   # API reference
    └── components.md            # Component library
```

## 🛠️ Development Commands

All commands are run from the root of the project, from a terminal:

| Command               | Action                                           |
| :-------------------- | :----------------------------------------------- |
| `bun install`         | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |

## 🌟 Getting Started

1. **Clone the LaunchKit repository** (main project)
2. **Visit this documentation** to follow the setup guides
3. **Start with** [Getting Started](/guides/getting-started/) or [Ship in 5 Minutes](/guides/ship-in-5-minutes/)

## 📝 Contributing to Documentation

This documentation is built with [Astro Starlight](https://starlight.astro.build/). To contribute:

1. Fork this repository
2. Make your changes to the markdown files in `src/content/docs/`
3. Test locally with `bun dev`
4. Submit a pull request

## 🔗 Links

- [LaunchKit Main Repository](#) <!-- Add actual repo link -->
- [Live Documentation](https://launchkit-docs.vercel.app) <!-- Add actual docs URL -->
- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Documentation](https://docs.astro.build)

---

Ready to build that startup, FAST 🚀

```
yarn create astro@latest -- --template starlight
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/starlight/tree/main/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/starlight/tree/main/examples/basics)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/withastro/starlight&create_from_path=examples/basics)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwithastro%2Fstarlight%2Ftree%2Fmain%2Fexamples%2Fbasics&project-name=my-starlight-docs&repository-name=my-starlight-docs)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro + Starlight project, you'll see the following folders and files:

```
.
├── public/
├── src/
│   ├── assets/
│   ├── content/
│   │   ├── docs/
│   └── content.config.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Starlight looks for `.md` or `.mdx` files in the `src/content/docs/` directory. Each file is exposed as a route based on its file name.

Images can be added to `src/assets/` and embedded in Markdown with a relative link.

Static assets, like favicons, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `yarn install`         | Installs dependencies                            |
| `yarn dev`             | Starts local dev server at `localhost:4321`      |
| `yarn build`           | Build your production site to `./dist/`          |
| `yarn preview`         | Preview your build locally, before deploying     |
| `yarn astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `yarn astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Check out [Starlight's docs](https://starlight.astro.build/), read [the Astro documentation](https://docs.astro.build), or jump into the [Astro Discord server](https://astro.build/chat).
