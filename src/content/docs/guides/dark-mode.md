---
title: Dark Mode Implementation
description: Complete guide to implementing dark mode with next-themes and shadcn/ui components.
---

LaunchKit includes a complete **dark mode implementation** using `next-themes` and shadcn/ui components, providing seamless theme switching with system preference detection.

## 🚀 Features

- **Seamless Theme Switching**: Toggle between light, dark, and system themes
- **System Theme Detection**: Automatically respects user's system preference
- **No Flash on Load**: Proper hydration handling prevents theme flash
- **Persistent Theme**: User's theme preference is saved in localStorage
- **Accessible**: Full keyboard navigation and screen reader support

## Quick Setup

Dark mode is already configured in LaunchKit! The implementation includes:

1. **Theme Provider**: Wraps the entire application with theme context
2. **Toggle Components**: Ready-to-use theme switcher components
3. **CSS Variables**: Predefined color schemes for light/dark modes
4. **Configuration**: Centralized theme settings in `config.ts`

## 📦 Dependencies

The required dependency is already included in LaunchKit:

```shell
# Already installed in LaunchKit
next-themes
```

If you need to install it manually:

```shell
bun add next-themes
# or
npm install next-themes
```

## 🏗️ Implementation Details

### 1. Theme Provider Setup

The `ThemeProvider` component wraps your entire application:

```tsx
// components/theme-provider.tsx
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### 2. Root Layout Configuration

The root layout includes the ThemeProvider with optimal configuration:

```tsx
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider";
import config from "@/config";

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme={config.theme.defaultTheme}
          enableSystem={config.theme.enableSystem}
          disableTransitionOnChange={config.theme.disableTransitionOnChange}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 3. Theme Toggle Components

LaunchKit provides two theme toggle components:

#### Simple Toggle Button

```tsx
// components/ui/theme-toggle.tsx
// Cycles through: light → dark → system → light
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const handleToggle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <Button variant="outline" size="icon" onClick={handleToggle}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

#### Dropdown Menu Toggle

```tsx
// components/ui/theme-toggle-dropdown.tsx
// Shows all options in a dropdown menu
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggleDropdown() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### 4. Configuration

Theme settings are centralized in `config.ts`:

```typescript
// config.ts
const config = {
  // ... other config
  theme: {
    defaultTheme: "system", // "light" | "dark" | "system"
    enableSystem: true,
    disableTransitionOnChange: true,
    themes: ["light", "dark", "system"],
  },
};
```

## 🎨 CSS Variables

LaunchKit uses CSS custom properties for theming, defined in `globals.css`:

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}
```

## 🔧 Usage

### Using the Theme Toggle

Import and use the theme toggle component anywhere in your app:

```tsx
import { ThemeToggle } from "@/components/ui/theme-toggle";
// or
import { ThemeToggleDropdown } from "@/components/ui/theme-toggle-dropdown";

function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4">
      <div>LaunchKit</div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {/* or */}
        <ThemeToggleDropdown />
      </div>
    </nav>
  );
}
```

### Accessing Theme in Components

Use the `useTheme` hook to access theme state:

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ThemeAwareComponent() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>System theme: {systemTheme}</p>
      <button onClick={() => setTheme("dark")}>Switch to Dark</button>
    </div>
  );
}
```

### Conditional Styling

Use Tailwind's dark mode classes for conditional styling:

```tsx
function Card() {
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">
        This adapts to the current theme
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Content that changes based on theme
      </p>
    </div>
  );
}
```

## 🎯 Best Practices

1. **Use CSS Variables**: Leverage the predefined CSS variables for consistent theming
2. **Test Both Themes**: Always test your components in both light and dark modes
3. **Respect System Preference**: Default to "system" theme for better UX
4. **Avoid Theme Flash**: Use `suppressHydrationWarning` on the html element
5. **Accessible Icons**: Ensure theme toggle icons have proper ARIA labels
6. **Handle Hydration**: Use `mounted` state to prevent hydration mismatches

## 🔍 Troubleshooting

### Theme Flash on Load

If you see a flash of the wrong theme on page load:

```tsx
// ✅ Correct: Add suppressHydrationWarning
<html suppressHydrationWarning>
  <body>
    <ThemeProvider disableTransitionOnChange>{children}</ThemeProvider>
  </body>
</html>
```

### Theme Not Persisting

If the theme doesn't persist across page reloads:

- Verify localStorage is available in your environment
- Check that the ThemeProvider is properly wrapping your app
- Ensure you're not overriding the theme elsewhere

### Styles Not Updating

If styles don't update when switching themes:

```javascript
// tailwind.config.js - Ensure darkMode is configured
module.exports = {
  darkMode: ["class"], // ✅ Enable class-based dark mode
  // ... rest of config
};
```

## 📱 Mobile Considerations

The theme toggle works seamlessly on mobile devices:

- **Touch-friendly**: Proper touch target sizes
- **Responsive**: Adapts to different screen sizes
- **Accessible**: Works with screen readers
- **Fast**: No performance impact on mobile

```tsx
// Mobile-optimized theme toggle
<div className="flex items-center gap-2 sm:gap-4">
  <span className="text-sm hidden sm:inline">Theme:</span>
  <ThemeToggle />
</div>
```

## 🎨 Customization

### Adding Custom Themes

To add custom themes beyond light/dark:

1. **Update config.ts**:

```typescript
theme: {
  themes: ["light", "dark", "system", "purple", "blue"],
}
```

2. **Add CSS variables**:

```css
.purple {
  --primary: 270 95% 75%;
  --primary-foreground: 270 10% 15%;
  /* ... other variables */
}
```

3. **Update toggle component**:

```tsx
<DropdownMenuItem onClick={() => setTheme("purple")}>
  <Palette className="mr-2 h-4 w-4" />
  Purple
</DropdownMenuItem>
```

### Styling the Toggle Button

Customize the theme toggle using shadcn/ui variants:

```tsx
<Button
  variant="ghost" // Change variant: ghost, outline, secondary
  size="sm" // Change size: sm, default, lg
  className="rounded-full" // Add custom classes
>
  {/* Toggle content */}
</Button>
```

## 🚀 Advanced Features

### Theme-Aware Images

Switch images based on theme:

```tsx
import { useTheme } from "next-themes";
import Image from "next/image";

function Logo() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <Image
      src={currentTheme === "dark" ? "/logo-dark.png" : "/logo-light.png"}
      alt="LaunchKit"
      width={120}
      height={40}
    />
  );
}
```

### Theme-Based Animations

Create theme-aware animations:

```tsx
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

function AnimatedBackground() {
  const { theme } = useTheme();

  return (
    <motion.div
      className="absolute inset-0"
      animate={{
        background:
          theme === "dark"
            ? "linear-gradient(45deg, #1a1a1a, #2d2d2d)"
            : "linear-gradient(45deg, #ffffff, #f8f9fa)",
      }}
      transition={{ duration: 0.5 }}
    />
  );
}
```

Your dark mode implementation is ready! LaunchKit provides everything you need for a professional theme switching experience that your users will love.
