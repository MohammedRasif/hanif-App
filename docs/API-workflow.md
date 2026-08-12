# API Layer — Implementation Guide

> A generic, reusable guideline for building a consistent, type-safe API layer using
> **TanStack Query (React Query)** + **Ky** + **TypeScript**.
> Follow this guide across every project to guarantee the same folder structure,
> naming conventions, and patterns every time.

---

## Core Philosophy

The API layer is split into **two strict layers**. Neither layer bleeds into the other,
and neither layer touches UI, routing, or business logic.

| Layer          | Folder                | Purpose                                                 |
| -------------- | --------------------- | ------------------------------------------------------- |
| **Query List** | `src/api/query-list/` | Pure API definitions — TypeScript interfaces + Ky calls |
| **API Hooks**  | `src/api/api-hooks/`  | React Query hooks that wrap and expose Layer 1          |

---

## Folder Structure

```
src/
├── lib/
│   └── ky.ts                # Ky HTTP client instance + error helpers
└── api/
    ├── query-list/          # Layer 1
    │   ├── <module>.query.ts
    │   └── admin/
    │       └── <module>-query.ts
    │
    └── api-hooks/           # Layer 2
        ├── <module>.api-hook.ts
        └── admin/
            └── <module>.api-hooks.ts
```

### File Naming Rules

| Scope  | Query List file           | Hook file                     |
| ------ | ------------------------- | ----------------------------- |
| Public | `<module>.query.ts`       | `<module>.api-hook.ts`        |
| Admin  | `admin/<module>-query.ts` | `admin/<module>.api-hooks.ts` |

---

## Central HTTP Client (`src/lib/ky.ts`)

`kyClient` is pre-configured with the base server URL (`EXPO_PUBLIC_SERVER_URL`), standard retries, timeout options, and lifecycle hooks for authentication and automatic error response parsing.

```typescript
import ky, { HTTPError, isHTTPError } from "ky";
import { env } from "@/lib/env";

export type ApiErrorData = {
  message?: string;
  detail?: string;
  error?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
};

export const kyClient = ky.create({
  prefix: env.EXPO_PUBLIC_SERVER_URL,
  timeout: 10000,
  retry: {
    limit: 2,
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        // Inject Auth token here (e.g. request.headers.set("Authorization", `Bearer ${token}`))
        void request;
      },
    ],
    beforeError: [
      ({ error }) => {
        return error;
      },
    ],
  },
});

export const getApiErrorMessage = (
  error: unknown,
  fallback = "An unexpected error occurred",
): string => {
  if (isHTTPError(error)) {
    const data = error.data as ApiErrorData | undefined;
    if (typeof data?.message === "string") {
      return data.message;
    }
    if (typeof data?.detail === "string") {
      return data.detail;
    }
    if (typeof data?.error === "string") {
      return data.error;
    }
    return `Error ${error.response.status}: ${error.response.statusText || fallback}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

export { HTTPError, isHTTPError };
```

---

## Layer 1 — Query List

### Rules

- Only import `kyClient` and utility helpers. **No React. No hooks.**
- Define all TypeScript interfaces in this file and export them.
- Export a single API object (named `<module>Api`) with one method per endpoint.
- Handle `FormData` construction here, never in hooks.
- Use Ky's `searchParams` option for query string filters (e.g. `{ searchParams: filters }`).
- Call `.json<T>()` on Ky response promises to return parsed response bodies directly.

### Interface Naming Convention

| Interface              | Purpose                                             |
| ---------------------- | --------------------------------------------------- |
| `<Entity>`             | Core data model                                     |
| `<Entity>Response`     | API response wrapper (`success`, `message`, `data`) |
| `<Entity>ListResponse` | Paginated list response                             |
| `Create<Entity>Data`   | POST request payload                                |
| `Update<Entity>Data`   | PATCH / PUT request payload                         |
| `<Entity>Filters`      | Optional query parameters                           |

### Example

```typescript
import { kyClient } from "@/lib/ky";

export interface Product {
  /* fields */
}
export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}
export interface CreateProductData {
  /* required fields */
}
export interface ProductFilters {
  page?: number;
  category?: string;
}

export const productApi = {
  getAll: (filters?: ProductFilters) =>
    kyClient
      .get("products", { searchParams: filters as Record<string, any> })
      .json<ProductResponse>(),
  getById: (id: number | string) =>
    kyClient.get(`products/${id}`).json<ProductResponse>(),
  create: (data: CreateProductData) =>
    kyClient.post("products", { json: data }).json<ProductResponse>(),
  update: (id: number | string, data: Partial<CreateProductData>) =>
    kyClient.patch(`products/${id}`, { json: data }).json<ProductResponse>(),
  remove: (id: number | string) =>
    kyClient.delete(`products/${id}`).json<void>(),
};
```

---

## Layer 2 — API Hooks

### Rules

- Only import from `@tanstack/react-query`, `ky` (`HTTPError`), toast library, error helper, and Layer 1 files.
- **Never** import from `src/app`, `src/components`, or any UI layer.
- Define a `*_KEYS` constant at the **top** of every hook file — never inline.
- Use `useQuery` for GET requests, `useMutation` for POST / PATCH / PUT / DELETE.
- Use `select` to extract `response.data` or unwrap payloads when needed.
- Always show a toast on success and on error for mutations.
- Always invalidate the relevant cache keys after a successful mutation.

### Query Key Shape

```typescript
const PRODUCT_KEYS = {
  all: () => ["products"] as const,
  lists: () => ["products", "list"] as const,
  detail: (id: number | string) => ["products", "detail", id] as const,
};
```

> **Admin keys** must be prefixed with `'admin'` to avoid cache collisions:
> `['admin', 'products']`

### useQuery — Reads (GET)

```typescript
// List
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.lists(),
    queryFn: () => productApi.getAll(filters),
    select: (response) => response.data,
  });
};

// Single item — only fetch when id is available
export const useProduct = (id?: number | string) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id ?? "unknown"),
    queryFn: () => productApi.getById(id!),
    enabled: !!id,
    select: (response) => response.data,
  });
};
```

### useMutation — Writes (POST / PATCH / DELETE)

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type HTTPError, getApiErrorMessage } from "@/lib/ky";
import {
  type CreateProductData,
  productApi,
} from "@/api/query-list/product.query";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductData) => productApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all() });
      toast.success("Created successfully");
    },
    onError: (error: HTTPError) => {
      toast.error(getApiErrorMessage(error, "Failed to create"));
    },
  });
};
```

> For **PATCH/PUT**, pass both `id` and `data` as a single object in `mutationFn`.
> For **DELETE**, pass only the `id`. Invalidate the same keys as POST.

---

## Implementation Workflow

When adding a new API module, always follow these steps **in order**:

### 1. Create the Query List file

- Define all interfaces for the module.
- Export the API object with one method per endpoint using `kyClient`.
- No logic beyond HTTP calls and payload construction.

### 2. Create the API Hook file

- Declare `*_KEYS` at the top.
- Write `useQuery` hooks for every GET endpoint.
- Write `useMutation` hooks for every write endpoint.
- Wire up toast feedback and cache invalidation using `getApiErrorMessage(error)`.

### 3. Hand off

Your job ends at `src/api/`. Component integration is handled separately.

---

## Boundaries — What Belongs Here vs. Not

| Belongs in `src/api/`              | Does NOT belong here          |
| ---------------------------------- | ----------------------------- |
| TypeScript interfaces for API data | UI components or layouts      |
| Ky endpoint methods                | Navigation / routing logic    |
| Query keys                         | Form validation schemas       |
| React Query hooks                  | Global state management       |
| Toast notifications for mutations  | Business rules / calculations |
| Cache invalidation                 | Auth redirect logic           |

---

## Quick Reference

| Need                         | Solution                                            |
| ---------------------------- | --------------------------------------------------- |
| Fetch a list                 | `useQuery` + `lists()` key                          |
| Fetch one item (optional id) | `useQuery` + `enabled: !!id`                        |
| Fetch with filters           | Include filters object in `queryKey`                |
| Create                       | `useMutation` + invalidate `all()`                  |
| Update                       | `useMutation` + invalidate `all()` and `detail(id)` |
| Delete                       | `useMutation` + invalidate `all()`                  |
| Unwrap response data         | `select: (r) => r.data`                             |
| Unwrap nested response       | `select: (r) => r.data.data`                        |
| Error message from API       | `getApiErrorMessage(error, 'fallback')`             |
