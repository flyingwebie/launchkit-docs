---
title: Components
description: Pre-built components for your LaunchKit application.
---

LaunchKit comes with a comprehensive collection of pre-built components built on top of **shadcn/ui** and **Radix UI**. All components are fully typed with TypeScript and styled with Tailwind CSS.

## UI Foundation (shadcn/ui)

LaunchKit uses shadcn/ui as its component foundation, providing accessible and customizable primitives.

### Button

The core button component with multiple variants and sizes.

```tsx
import { Button } from '@/components/ui/button';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="wide">Wide Button</Button>
<Button size="icon">🚀</Button>
```

**Variants:**

- `default` - Primary button style
- `destructive` - For dangerous actions
- `outline` - Outlined button
- `secondary` - Secondary styling
- `ghost` - Transparent background
- `link` - Link-styled button

**Sizes:**

- `default` - Standard size (h-10 px-4 py-2)
- `sm` - Small (h-9 px-3)
- `lg` - Large (h-11 px-8)
- `icon` - Square icon button (h-10 w-10)
- `wide` - Wide button (min-w-[200px])

### Input

Form input component with consistent styling.

```tsx
import { Input } from '@/components/ui/input';

<Input type="email" placeholder="Enter your email" required />;
```

### Card

Card components for content containers.

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>;
```

### Avatar

User avatar component with fallback support.

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src="/user-avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>;
```

### Dropdown Menu

Accessible dropdown menu component.

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>;
```

### Theme Components

Dark/light mode toggle components.

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ThemeToggleDropdown } from '@/components/ui/theme-toggle-dropdown';

<ThemeToggle />
<ThemeToggleDropdown />
```

## Layout Components

### Header

Main navigation header with authentication and theme toggle.

```tsx
import Header from '@/components/Header';

<Header />;
```

**Features:**

- Responsive navigation
- Authentication buttons
- Theme toggle
- Mobile menu support

### Footer

Application footer with links and branding.

```tsx
import Footer from '@/components/Footer';

<Footer />;
```

**Features:**

- Multi-column layout
- Social links
- Legal pages
- Responsive design

## Landing Page Components

### Hero

Hero section with call-to-action and testimonials.

```tsx
import Hero from '@/components/Hero';

<Hero />;
```

**Features:**

- Product Hunt badge integration
- Responsive layout
- TestimonialsAvatars integration
- Image optimization with Next.js

### Problem

Problem/solution section for landing pages.

```tsx
import Problem from '@/components/Problem';

<Problem />;
```

### FeaturesAccordion

Expandable feature list in accordion format.

```tsx
import FeaturesAccordion from '@/components/FeaturesAccordion';

<FeaturesAccordion />;
```

### FeaturesGrid

Grid layout for feature showcase.

```tsx
import FeaturesGrid from '@/components/FeaturesGrid';

<FeaturesGrid />;
```

### FeaturesListicle

Detailed feature list with descriptions.

```tsx
import FeaturesListicle from '@/components/FeaturesListicle';

<FeaturesListicle />;
```

### Pricing

Pricing table with Stripe integration.

```tsx
import Pricing from '@/components/Pricing';

<Pricing />;
```

**Features:**

- Multiple pricing tiers
- Stripe checkout integration
- Popular plan highlighting
- Feature comparison

### WithWithout

Before/after comparison component.

```tsx
import WithWithout from '@/components/WithWithout';

<WithWithout />;
```

### FAQ

Frequently asked questions component.

```tsx
import FAQ from '@/components/FAQ';

<FAQ />;
```

### CTA

Call-to-action section for conversions.

```tsx
import CTA from '@/components/CTA';

<CTA />;
```

## Button Components

### ButtonLead

Lead generation button with email collection.

```tsx
import ButtonLead from '@/components/ButtonLead';

<ButtonLead />
<ButtonLead extraStyle="!max-w-none !w-full" />
```

**Props:**

- `extraStyle` (optional) - Additional Tailwind classes

**Features:**

- Email validation
- Loading states
- Toast notifications
- API integration with `/api/lead`

### ButtonSignin

Authentication button for user sign-in.

```tsx
import ButtonSignin from '@/components/ButtonSignin';

<ButtonSignin />;
```

**Features:**

- Supabase Auth integration
- Loading states
- Error handling

### ButtonCheckout

Stripe checkout button for payments.

```tsx
import ButtonCheckout from '@/components/ButtonCheckout';

<ButtonCheckout priceId="price_1234567890" />;
```

**Props:**

- `priceId` (required) - Stripe price ID

**Features:**

- Stripe Checkout integration
- User authentication check
- Loading states

### ButtonAccount

User account management button.

```tsx
import ButtonAccount from '@/components/ButtonAccount';

<ButtonAccount />;
```

**Features:**

- Customer portal access
- Subscription management
- User dropdown menu

### ButtonSupport

Customer support integration button.

```tsx
import ButtonSupport from '@/components/ButtonSupport';

<ButtonSupport />;
```

**Features:**

- Crisp chat integration
- User context passing

### ButtonPopover

Advanced popover button component.

```tsx
import ButtonPopover from '@/components/ButtonPopover';

<ButtonPopover />;
```

### ButtonGradient

Gradient-styled button component.

```tsx
import ButtonGradient from '@/components/ButtonGradient';

<ButtonGradient />;
```

## Utility Components

### BetterIcon

Enhanced icon component with better styling.

```tsx
import BetterIcon from '@/components/BetterIcon';

<BetterIcon name="star" className="w-5 h-5" />;
```

**Props:**

- `name` (required) - Icon name
- `className` (optional) - Additional CSS classes

### Modal

Reusable modal component with backdrop.

```tsx
import Modal from '@/components/Modal';

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <h2>Modal Content</h2>
  <p>Your modal content here...</p>
</Modal>;
```

**Props:**

- `isOpen` (required) - Boolean to control modal visibility
- `onClose` (required) - Function to close modal
- `children` (required) - Modal content

### Tabs

Tabbed interface component.

```tsx
import Tabs from '@/components/Tabs';

const tabData = [
  { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
  { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
];

<Tabs tabs={tabData} />;
```

**Props:**

- `tabs` (required) - Array of tab objects with id, label, and content

### LayoutClient

Client-side layout wrapper with providers.

```tsx
import LayoutClient from '@/components/LayoutClient';

<LayoutClient>
  <YourAppContent />
</LayoutClient>;
```

**Features:**

- Theme provider integration
- Toast notifications
- Client-side only rendering

## Testimonial Components

### TestimonialsAvatars

Compact testimonial avatars display.

```tsx
import TestimonialsAvatars from '@/components/TestimonialsAvatars';

<TestimonialsAvatars priority={true} />;
```

**Props:**

- `priority` (optional) - Image loading priority

### Testimonials1

Single testimonial display.

```tsx
import Testimonials1 from '@/components/Testimonials1';

<Testimonials1 />;
```

### Testimonials3

Three testimonials in a row.

```tsx
import Testimonials3 from '@/components/Testimonials3';

<Testimonials3 />;
```

### Testimonials11

Large testimonial grid layout.

```tsx
import Testimonials11 from '@/components/Testimonials11';

<Testimonials11 />;
```

### Testimonial1Small

Compact single testimonial.

```tsx
import Testimonial1Small from '@/components/Testimonial1Small';

<Testimonial1Small />;
```

### TestimonialRating

Testimonial with rating display.

```tsx
import TestimonialRating from '@/components/TestimonialRating';

<TestimonialRating />;
```

## Advanced UI Components

### Google Gemini Effect

Advanced animated background effect.

```tsx
import { GoogleGeminiEffect } from '@/components/ui/google-gemini-effect';

<GoogleGeminiEffect />;
```

**Features:**

- Animated gradient background
- Performance optimized
- Customizable colors

### Separator

Visual separator component.

```tsx
import { Separator } from '@/components/ui/separator';

<Separator />
<Separator orientation="vertical" />
```

## Theme Integration

LaunchKit includes a complete theme system with dark/light mode support:

```tsx
import { ThemeProvider } from '@/components/theme-provider';

// Wrap your app
<ThemeProvider>
  <YourApp />
</ThemeProvider>;
```

## Best Practices

### Component Organization

- **UI Components** (`/components/ui/`) - shadcn/ui primitives
- **Feature Components** (`/components/`) - Application-specific components
- **Layout Components** - Page structure components

### TypeScript Usage

All components include proper TypeScript definitions:

```tsx
interface ComponentProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

const MyComponent: React.FC<ComponentProps> = ({
  title,
  className = '',
  children,
}) => {
  return (
    <div className={cn('base-styles', className)}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};
```

### Styling Guidelines

- Use **Tailwind CSS** for styling
- Use `cn()` utility for conditional classes
- Follow **shadcn/ui** patterns for consistency
- Implement proper responsive design

### Creating Custom Components

1. Create new file in `/components`
2. Use TypeScript for type safety
3. Include proper props interface
4. Follow naming conventions (PascalCase)
5. Export as default

```tsx
import { cn } from '@/libs/utils';

interface CustomComponentProps {
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

const CustomComponent: React.FC<CustomComponentProps> = ({
  variant = 'default',
  size = 'md',
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        'base-component-styles',
        {
          'variant-default': variant === 'default',
          'variant-primary': variant === 'primary',
          'size-sm': size === 'sm',
          'size-lg': size === 'lg',
        },
        className
      )}
    >
      {children}
    </div>
  );
};

export default CustomComponent;
```

## Integration with APIs

Many components integrate directly with LaunchKit's API routes:

- **ButtonLead** → `/api/lead` (email collection)
- **ButtonCheckout** → `/api/stripe/create-checkout` (payments)
- **ButtonAccount** → Stripe Customer Portal (account management)
- **ButtonSignin** → Supabase Auth (authentication)

These components provide a complete foundation for building modern SaaS applications with LaunchKit!
