---
title: Error Handling
description: Graceful error handling and user experience in LaunchKit
---

LaunchKit provides comprehensive error handling to ensure a smooth user experience even when things go wrong.

## Error Pages

### Global Error Boundary

Create a global error boundary that catches JavaScript errors:

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
    // Log error to monitoring service
    console.error('Application error:', error);

    // Optional: Send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, etc.
      // captureException(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong!
          </h2>
          <p className="text-gray-600 mb-6">
            We apologize for the inconvenience. Our team has been notified and
            is working on a fix.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>

          <ButtonSupport className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
            Contact Support
          </ButtonSupport>

          <a
            href="/"
            className="block w-full text-blue-600 hover:text-blue-800 transition-colors"
          >
            Return to homepage
          </a>
        </div>
      </div>
    </div>
  );
}
```

### 404 Not Found Page

```tsx
// app/not-found.tsx
import Link from 'next/link';
import ButtonSupport from '@/components/ButtonSupport';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-blue-600">404</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>

          <ButtonSupport className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
            Need Help?
          </ButtonSupport>
        </div>
      </div>
    </div>
  );
}
```

### Loading States

Create loading components for better UX:

```tsx
// app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
```

## API Error Handling

### Error Response Format

Standardize API error responses:

```typescript
// types/api.ts
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
```

### API Route Error Handler

Create a wrapper for consistent error handling:

```typescript
// libs/api-handler.ts
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';

export function withErrorHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error('API Error:', error);

      const response: ApiResponse = {
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
      };

      return NextResponse.json(response, { status: 500 });
    }
  };
}
```

### Example API Route with Error Handling

```typescript
// app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { withErrorHandler } from '@/libs/api-handler';
import { ApiResponse } from '@/types/api';

async function handler(request: NextRequest) {
  if (request.method !== 'POST') {
    const response: ApiResponse = {
      success: false,
      error: {
        message: 'Method not allowed',
        code: 'METHOD_NOT_ALLOWED',
      },
    };
    return NextResponse.json(response, { status: 405 });
  }

  const { email } = await request.json();

  // Validation
  if (!email || typeof email !== 'string') {
    const response: ApiResponse = {
      success: false,
      error: {
        message: 'Email is required',
        code: 'VALIDATION_ERROR',
        field: 'email',
      },
    };
    return NextResponse.json(response, { status: 400 });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const response: ApiResponse = {
      success: false,
      error: {
        message: 'Invalid email format',
        code: 'INVALID_EMAIL',
        field: 'email',
      },
    };
    return NextResponse.json(response, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from('leads')
    .insert({ email })
    .select();

  if (error) {
    // Handle specific Supabase errors
    if (error.code === '23505') {
      // Unique constraint violation
      const response: ApiResponse = {
        success: false,
        error: {
          message: 'Email already exists',
          code: 'EMAIL_EXISTS',
          field: 'email',
        },
      };
      return NextResponse.json(response, { status: 409 });
    }

    throw new Error(`Database error: ${error.message}`);
  }

  const response: ApiResponse = {
    success: true,
    data: { lead: data[0] },
  };

  return NextResponse.json(response);
}

export const POST = withErrorHandler(handler);
```

## Client-Side Error Handling

### API Client with Error Handling

```typescript
// libs/api-client.ts
import { ApiResponse } from '@/types/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new ApiError(data.error?.message || 'Request failed', data.error);
    }

    return data.data as T;
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }
}

export class ApiError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = new ApiClient();
```

### React Hook for Error Handling

```typescript
// hooks/useErrorHandler.ts
import { useState, useCallback } from 'react';
import { ApiError } from '@/libs/api-client';

export function useErrorHandler() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsync = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      onSuccess?: (result: T) => void,
      onError?: (error: Error) => void
    ) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await asyncFn();

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? err.message
            : 'An unexpected error occurred';

        setError(errorMessage);

        if (onError) {
          onError(err as Error);
        }

        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isLoading,
    handleAsync,
    clearError,
  };
}
```

### Error Display Component

```tsx
// components/ErrorMessage.tsx
interface ErrorMessageProps {
  message?: string | null;
  onDismiss?: () => void;
  className?: string;
}

export default function ErrorMessage({
  message,
  onDismiss,
  className = '',
}: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-800">{message}</p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className="text-red-400 hover:text-red-600"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Error Monitoring

### Integration with Error Tracking Services

```typescript
// libs/error-tracking.ts
export function initErrorTracking() {
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry integration
    // import * as Sentry from '@sentry/nextjs';
    // Sentry.init({
    //   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    // });
  }
}

export function captureException(error: Error, context?: any) {
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service
    console.error('Captured error:', error, context);
    // Sentry.captureException(error, { extra: context });
  } else {
    console.error('Development error:', error, context);
  }
}
```

This comprehensive error handling system ensures that your LaunchKit application gracefully handles errors and provides a great user experience even when things go wrong.
