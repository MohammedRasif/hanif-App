# Barbers Bay - Route Tree & Directory Structure

This document outlines the complete directory structure and route tree for the Barbers Bay application. It details how the folder structure in `src/app/` maps to navigation paths (URLs) in **Expo Router**, highlighting Tab layouts and Stack layout overlays.

---

## 🗺️ Route Tree & Path Mapping

The table below maps the physical file paths in the codebase to their corresponding active navigation routes:

| File Path                                                                                                  | Route / URL                  | Navigation Type | Role / Screen Description                                             |
| :--------------------------------------------------------------------------------------------------------- | :--------------------------- | :-------------- | :-------------------------------------------------------------------- |
| [`src/app/_layout.tsx`](file:///c:/yeasin2002/office/Barbers-Bay/src/app/_layout.tsx)                      | _N/A_                        | Root Stack      | Global providers, theme, and stack navigation setup                   |
| [`src/app/index.tsx`](file:///c:/yeasin2002/office/Barbers-Bay/src/app/index.tsx)                          | `/`                          | Redirect Router | Root redirect logic (decides whether to push to `/splash` or `/main`) |
| [`src/app/splash.tsx`](file:///c:/yeasin2002/office/Barbers-Bay/src/app/splash.tsx)                        | `/splash`                    | Stack Screen    | Welcome screen, brand intro, and "Get Started" entry trigger          |
| **`(auth)/`**                                                                                              | _Ignored Group_              | Sub-Stack       | Group folder for unauthenticated flows (omitted from URL paths)       |
| ├── [`login.tsx`](<file:///c:/yeasin2002/office/Barbers-Bay/src/app/(auth)/login.tsx>)                     | `/login`                     | Stack Screen    | Login screen (email/password validation, social logins)               |
| ├── [`register.tsx`](<file:///c:/yeasin2002/office/Barbers-Bay/src/app/(auth)/register.tsx>)               | `/register`                  | Stack Screen    | Signup screen (name, email, phone, validation, terms checkbox)        |
| ├── [`forgot-password.tsx`](<file:///c:/yeasin2002/office/Barbers-Bay/src/app/(auth)/forgot-password.tsx>) | `/forgot-password`           | Stack Screen    | Password recovery email verification entry                            |
| ├── [`otp-code.tsx`](<file:///c:/yeasin2002/office/Barbers-Bay/src/app/(auth)/otp-code.tsx>)               | `/otp-code`                  | Stack Screen    | 4-digit OTP code entry with countdown and auto-submit                 |
| └── [`change-password.tsx`](<file:///c:/yeasin2002/office/Barbers-Bay/src/app/(auth)/change-password.tsx>) | `/change-password`           | Stack Screen    | Reset PIN/Password entry matching constraints                         |
| **`main/`**                                                                                                | _N/A_                        | Tab Navigator   | Main portal container tab layout (included in URL paths)              |
| ├── [`_layout.tsx`](file:///c:/yeasin2002/office/Barbers-Bay/src/app/main/_layout.tsx)                     | _N/A_                        | Tab Layout      | Definis bottom navigation tab tabs structure & style                  |
| ├── `index.tsx` _(Planned)_                                                                                | `/main`                      | Tab Screen      | **Home Tab**: browse salons, search bar, select categories            |
| ├── `bookings.tsx` _(Planned)_                                                                             | `/main/bookings`             | Tab Screen      | **Bookings Tab**: segments for upcoming/past appointments             |
| └── [`notification.tsx`](file:///c:/yeasin2002/office/Barbers-Bay/src/app/main/notification.tsx)           | `/main/notification`         | Tab Screen      | **Notifications Tab**: alert items list, All/Unread filters           |
| **`profile/`**                                                                                             | _N/A_                        | Sub-Stack       | Standalone pages under parent stack (hides tab bar)                   |
| ├── `personal-info.tsx` _(Planned)_                                                                        | `/profile/personal-info`     | Stack Screen    | **Edit Info**: Name, Email, Phone, Address form edits                 |
| ├── `location-services.tsx` _(Planned)_                                                                    | `/profile/location-services` | Stack Screen    | **Location Info**: view and edit user location pin on map             |
| ├── `change-password.tsx` _(Planned)_                                                                      | `/profile/change-password`   | Stack Screen    | **Change PIN**: update account credentials                            |
| └── `contact-us.tsx` _(Planned)_                                                                           | `/profile/contact-us`        | Stack Screen    | **Support Form**: submit tickets with description and attachments     |
| **`salon/`**                                                                                               | _N/A_                        | Sub-Stack       | Booking and reservation pages (hides tab bar)                         |
| ├── `[id].tsx` _(Planned)_                                                                                 | `/salon/[id]`                | Stack Screen    | **Salon Details**: cover image, tabs (About, Services, Reviews)       |
| ├── `book.tsx` _(Planned)_                                                                                 | `/salon/book`                | Stack Screen    | **Selection**: pick service, staff, date and time                     |
| ├── `choose-shop.tsx` _(Planned)_                                                                          | `/salon/choose-shop`         | Stack Screen    | **Location Select**: pick a franchise branch close by                 |
| └── `confirm.tsx` _(Planned)_                                                                              | `/salon/confirm`             | Stack Screen    | **Checkout**: review details, select options, and Pay                 |

---

## 📂 Directory Layout

Below is the visual folder representation of the path mappings:

```
src/
└── app/
    ├── _layout.tsx                     # Root stack layout provider stack
    ├── index.tsx                       # Initial redirect entry path
    ├── splash.tsx                      # Onboarding / Welcome screen
    │
    ├── (auth)/                         # Authentication Sub-Stack
    │   ├── login.tsx                   # Email/Password Sign in
    │   ├── register.tsx                # Create account
    │   ├── forgot-password.tsx         # Request reset token
    │   ├── otp-code.tsx                # Check validation pin code
    │   └── change-password.tsx         # Write new password
    │
    ├── main/                           # Bottom Tab Navigator Portal
    │   ├── _layout.tsx                 # Tab navigation items structure
    │   ├── index.tsx                   # Home Tab screen
    │   ├── bookings.tsx                # Bookings screen segments
    │   └── notification.tsx            # Filterable alerts list
    │
    ├── profile/                        # Profile nested stack pages (Hides Tabs)
    │   ├── personal-info.tsx           # Edit info inputs
    │   ├── location-services.tsx       # Location / Address coordinates
    │   ├── change-password.tsx         # Update credentials
    │   └── contact-us.tsx              # Write support description ticket
    │
    └── salon/                          # Salon & Reservation flow (Hides Tabs)
        ├── [id].tsx                    # Details, Reviews, Services List
        ├── book.tsx                    # Select staff / date calendar
        ├── choose-shop.tsx             # Select salon branch location
        └── confirm.tsx                 # Confirmation Checkout / Stripe pay
```

---

## 🛠️ Nested Sub-Page Routing & Flow Guide

This guide explains how tab screens navigate to and overlap with their nested sub-pages (e.g. from the Profile tab to Personal Info, or the Home tab to Booking flow) without showing the bottom tab bar on sub-pages.

> [!IMPORTANT]
> **Tab Bar Visibility Rule:**
>
> - **Tab Bar ON (Visible):** Only the main core views under the `main/` layout folder — **Home** (`/main`), **Bookings** (`/main/bookings`), **Notifications** (`/main/notification`), and **Profile / Settings** (`/main/profile`) — will render the bottom tab bar.
> - **Tab Bar OFF (Hidden):** All detailed sub-pages (like editing profile details, selecting booking dates, or viewing maps) live outside the tab layout. Pushing to them hides the bottom tab bar completely.

### 1. Conceptual Routing Architecture

Expo Router handles this behavior by nesting layouts. The root stack sits at the top level and holds the main Tab navigator as a single screen node. Sub-pages are placed in sibling folders to the Tab navigator, allowing them to stack cleanly on top:

```
[ Root Stack Navigator (src/app/_layout.tsx) ]
       │
       ├───> splash.tsx  (Welcome Onboarding)
       │
       ├───> (auth)/  [Sub-Stack] (login.tsx, register.tsx, etc.)
       │
       ├───> main/  [Tab Navigator]  (index.tsx, bookings.tsx, profile.tsx)
       │       │
       │       └───> Bottom Tab Bar visible only on these core pages
       │
       ├───> profile/  [Sub-Stack] (personal-info.tsx, change-password.tsx, etc.)
       │       │
       │       └───> Overlays Tab Bar (Hides Bottom Tab navigation)
       │
       └───> salon/  [Sub-Stack] ([id].tsx, book.tsx, confirm.tsx)
               │
               └───> Overlays Tab Bar (Hides Bottom Tab navigation)
```

---

### 2. Tab-to-Subpage Flow Maps

#### 👤 Profile Flow (Profile Tab ➡️ Standalone Profile Settings)

When a user clicks items on the **Profile Menu Tab**, the navigator pushes standalone stack screens, hiding the bottom tabs:

```
/main/profile (Profile Tab Screen)
   │
   ├───> Click "Personal Information" ──> /profile/personal-info (Name, Email, Phone edits)
   ├───> Click "Location Services"   ──> /profile/location-services (Map Pin selection)
   ├───> Click "Change Password"     ──> /profile/change-password (Update Password / PIN)
   └───> Click "Contact Us"          ──> /profile/contact-us (Support desk & attachment)
```

#### 🏠 Booking Flow (Home Tab ➡️ Salon Reservation Pipeline)

When a user begins booking a salon from the **Home Tab**, the app routes them through a linear checkout stack:

```
/main (Home Tab Screen)
   │
   └───> Click Salon Card ──> /salon/[id] (Salon Details, Services & Reviews tabs)
                                 │
                                 └───> Click "Book Appointment" ──> /salon/book (Date, Time, Barber)
                                                                       │
                                                                       └───> Click "Confirm" ──> /salon/confirm (Checkout summary & Payment)
```

---

### 3. Back Navigation Behavior

Because `/profile/` and `/salon/` sub-pages are registered under the root Stack layout, navigation is managed automatically:

- Navigating forward pushes the screen with standard slide animations.
- Calling `router.back()` pops the current screen, returning the user instantly to the active tab screen exactly where they left off.
