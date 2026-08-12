# BarberBay API Reference

> Comprehensive, human-readable API documentation for the BarberBay multi-tenant salon & barbershop platform.

## Overview

- **Base URL:** `EXPO_PUBLIC_SERVER_URL` (configured in `@/lib/env`)
- **Authentication:** Bearer token in request headers (`Authorization: Bearer <access_token>`)
- **Format:** Standard JSON (`Content-Type: application/json`)

## Table of Contents

- [AUTH](#auth)
- [BARBERS](#barbers)
- [BOOKINGS](#bookings)
- [CONTACT](#contact)
- [DASHBOARD](#dashboard)
- [FAQS](#faqs)
- [NOTIFICATIONS](#notifications)
- [PAYMENTS](#payments)
- [POLICY](#policy)
- [REVIEWS](#reviews)
- [SCHEDULE](#schedule)
- [SHOPS](#shops)
- [TERMS](#terms)
- [Services](#services)

---

## AUTH

### register create

**Method & Path:** `POST /v1/auth/register/`

**Description:** Register a new user account.

**Request Body Payload:**

```json
{
  "email": "masipulislam@gmail.com",
  "password": "Test!@#123",
  "confirm_password": "Test!@#123",
  "full_name": "Test user",
  "phone": "01751379009"
}
```

**Sample Response (201 Created):**

```json
{
  "email": "hGVFhla@MDLRsmRASybOKOiojEpSVkLReIgx.otc",
  "password": "string",
  "confirm_password": "string",
  "full_name": "string",
  "phone": "string"
}
```

---

### register otp verify

**Method & Path:** `POST /v1/auth/verify-email/`

**Description:** Verify a password reset OTP.

**Request Body Payload:**

```json
{
  "email": "masipulislam@gmail.com",
  "otp": "213993"
}
```

**Sample Response (201 Created):**

```json
{
  "email": "yYc2mbsZ9@erWjttBpmvfISYOXDEEyXEtFqTBIS.rhs",
  "otp": "string"
}
```

---

### resent otp

**Method & Path:** `POST /v1/auth/resend-otp/`

**Description:** Verify a password reset OTP.

**Request Body Payload:**

```json
{
  "email": "masipulislam@gmail.com",
  "type": "register"
}
```

**Sample Response (201 Created):**

```json
{
  "email": "yYc2mbsZ9@erWjttBpmvfISYOXDEEyXEtFqTBIS.rhs",
  "otp": "string"
}
```

---

### login

**Method & Path:** `POST /v1/auth/login/`

**Description:** Login via email and password. Returns JWT tokens + user profile.

**Request Body Payload:**

```json
{
  "email": "masipulislam@gmail.com",
  "password": "Test!@#123"
}
```

**Sample Response (201 Created):**

```json
{
  "email": "3R2hBq8yRBedyp@CIqNTecCDQMjCiIxz.wxf",
  "password": "string"
}
```

---

### password change

**Method & Path:** `POST /v1/auth/password/change/`

**Description:** Change password using current password.

**Request Body Payload:**

```json
{
  "password": "Test!@#1234",
  "new_password": "Test!@#123",
  "confirm_password": "Test!@#123"
}
```

**Sample Response (201 Created):**

```json
{
  "password": "string",
  "new_password": "string",
  "confirm_password": "string"
}
```

---

### password forgot create

**Method & Path:** `POST /v1/auth/password/forgot/`

**Description:** Request a password reset OTP via email.

**Request Body Payload:**

```json
{
  "email": "masipulislam@gmail.com"
}
```

**Sample Response (201 Created):**

```json
{
  "email": "mk645j176O1@hlUexISOSjeEArfceN.jjf"
}
```

---

### password reset create

**Method & Path:** `POST /v1/auth/password/reset/`

**Description:** Reset password using OTP.

**Request Body Payload:**

```json
{
  "email": "61K6ju96bHCTIe@eiKuXtjyrAnrqELhPlZ.lo",
  "otp": "string",
  "new_password": "string",
  "confirm_password": "string"
}
```

**Sample Response (201 Created):**

```json
{
  "email": "61K6ju96bHCTIe@eiKuXtjyrAnrqELhPlZ.lo",
  "otp": "string",
  "new_password": "string",
  "confirm_password": "string"
}
```

---

### password verify-otp create

**Method & Path:** `POST /v1/auth/password/verify-otp/`

**Description:** Verify a password reset OTP.

**Request Body Payload:**

```json
{
  "email": "masipulislam@gmail.com",
  "otp": "767765"
}
```

**Sample Response (201 Created):**

```json
{
  "email": "yYc2mbsZ9@erWjttBpmvfISYOXDEEyXEtFqTBIS.rhs",
  "otp": "string"
}
```

---

### profile read

**Method & Path:** `GET /v1/auth/profile/`

**Description:** Get the authenticated user's profile.

**Sample Response (200 OK):**

```json
{
  "id": "35658ed2-2cda-b4ff-b18c-e3c3dd86c0ee",
  "email": "yIfpH-8mZASzZ3I@FIuSsqaQZMWtstLWPimbqUUspBOF.ys",
  "username": "string",
  "role": "ADMIN",
  "full_name": "string",
  "image": "https://JsyJZdlgIONDgQLSWSBOQVdsOLwthjaWC.iyrK.xoYNKzr,",
  "phone": "string",
  "address": "string",
  "last_active_at": "1947-08-26T21:39:12.938Z",
  "date_joined": "1998-04-15T07:37:50.507Z"
}
```

---

### profile location

**Method & Path:** `GET /v1/auth/profile/location/`

**Description:** Get, create, or update the current user's location service.

**Query Parameters:**

| Parameter   | Description                                    |
| ----------- | ---------------------------------------------- |
| `search`    | A search term.                                 |
| `ordering`  | Which field to use when ordering the results.  |
| `page`      | A page number within the paginated result set. |
| `page_size` | Number of results to return per page.          |

**Sample Response (200 OK):**

```json
{
  "count": 8354,
  "results": [
    {
      "id": 9563,
      "location_name": "string",
      "location_link": "https://dNXPVUfFEhRMQsNQJoHnVQCyCxCtjNGLc.jidfystybUDVNoDjTYiUOt59lRSJT,31Bof,KiPyDVm2"
    },
    {
      "id": 7848,
      "location_name": "string",
      "location_link": "https://JDVXuhTyw.cuqYufUcngv4VlyHxKYdDAo7DItgSV"
    }
  ],
  "next": "https://EmZyyneLyQPKO.uaVwxF6+Upux1aADuegmbEJ11lecQwF.E,bu91lOELOfBaR",
  "previous": "https://DrHvcKZqCOFpEAVIrk.eesn9,J+PXb08cWT.dT98T469oKxg3dnjptgf-eQ5D5NtlXfOxzyfGvpNPXpeJ"
}
```

---

### profile location create

**Method & Path:** `POST /v1/auth/profile/location/`

**Description:** Get, create, or update the current user's location service.

**Request Body Payload:**

```json
{
  "location_name": "Dhaka",
  "location_link": "https://maps.app.goo.gl/LidwUzUUgdkuCazA7"
}
```

**Sample Response (201 Created):**

```json
{
  "id": 9741,
  "location_name": "string",
  "location_link": "http://ArtUParWcwQrpuLxfDHjEpzvbAHwt.iydb6XB6D1kXgWl40V+wwprHTISlpzY270BBGtvJOjPjGidGz6UdePuowL+6fnaTVGoyBQQ,+"
}
```

---

### profile location update

**Method & Path:** `PUT /v1/auth/profile/location/`

**Description:** Get, create, or update the current user's location service.

**Request Body Payload:**

```json
{
  "location_name": "string",
  "location_link": "https://maps.app.goo.gl/LidwUzUUgdkuCazA7"
}
```

**Sample Response (200 OK):**

```json
{
  "id": 9741,
  "location_name": "string",
  "location_link": "http://ArtUParWcwQrpuLxfDHjEpzvbAHwt.iydb6XB6D1kXgWl40V+wwprHTISlpzY270BBGtvJOjPjGidGz6UdePuowL+6fnaTVGoyBQQ,+"
}
```

---

### profile update partial update

**Method & Path:** `PATCH /v1/auth/profile/update/`

**Description:** Update the authenticated user's profile.

**Sample Response (200 OK):**

```json
{
  "full_name": "string",
  "image": "http://hhTjQbzL.xgtdRA8FAKVU.aGZJypjP-mWlHENRN,,bOCcExCGDYi4mR",
  "phone": "string",
  "address": "string"
}
```

---

### token refresh create

**Method & Path:** `POST /v1/auth/token/refresh/`

**Description:** Custom token refresh view that returns a standardized success response.

**Request Body Payload:**

```json
{
  "refresh": "string"
}
```

**Sample Response (201 Created):**

```json
{
  "refresh": "string",
  "access": "string"
}
```

---

## BARBERS

### v1 barbers list

**Method & Path:** `GET /v1/barbers/`

---

### v1 barbers create

**Method & Path:** `POST /v1/barbers/`

---

### v1 barbers read

**Method & Path:** `GET /v1/barbers/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 barbers update

**Method & Path:** `PUT /v1/barbers/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 barbers delete

**Method & Path:** `DELETE /v1/barbers/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

## BOOKINGS

### v1 bookings available-slots list

**Method & Path:** `GET /v1/bookings/available-slots/`

---

### v1 bookings create create

**Method & Path:** `POST /v1/bookings/create/`

---

### v1 bookings partial update

**Method & Path:** `PATCH /v1/bookings/:id/`

**Description:** PUT/PATCH: Update a booking.

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 bookings calendar-link list

**Method & Path:** `GET /v1/bookings/:id/calendar-link/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 bookings cancel create

**Method & Path:** `POST /v1/bookings/:id/cancel/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

## CONTACT

### v1 contact create

**Method & Path:** `POST /v1/contact/`

**Description:** Submit a contact form (public endpoint).

**Request Body Payload:**

```json
{
  "full_name": "string",
  "email": "iKh@HTuLBlyOxPCTDMlsGBTYXkEldTVbPv.ynp",
  "message": "string",
  "phone": "string"
}
```

**Sample Response (201 Created):**

```json
{
  "full_name": "string",
  "email": "vwBmOp@rJkvYNOROyPOfFDzLl.hmu",
  "message": "string",
  "id": 515,
  "phone": "string",
  "is_replied": false,
  "created_at": "1983-08-27T18:01:46.406Z"
}
```

---

### v1 contact list list

**Method & Path:** `GET /v1/contact/list/`

**Description:** List all contact messages (admin only).

**Query Parameters:**

| Parameter   | Description                                    |
| ----------- | ---------------------------------------------- |
| `search`    | A search term.                                 |
| `ordering`  | Which field to use when ordering the results.  |
| `page`      | A page number within the paginated result set. |
| `page_size` | Number of results to return per page.          |

**Sample Response (200 OK):**

```json
{
  "count": 2235,
  "results": [
    {
      "full_name": "string",
      "email": "PKWyGTFEMS@vQihdeMtnglAbBA.uau",
      "message": "string",
      "id": 6338,
      "phone": "string",
      "is_replied": true,
      "created_at": "1953-06-05T21:14:23.295Z"
    },
    {
      "full_name": "string",
      "email": "Whvma@aVruR.rr",
      "message": "string",
      "id": 5541,
      "phone": "string",
      "is_replied": false,
      "created_at": "1956-02-10T02:42:11.043Z"
    }
  ],
  "next": "https://usXTMHhiqnV.ifwgzsjIylHGB4oNwH3NqE9ppV4.SUEYsbnF177quYXPQNMscfFXyQCzjo8uo+1v3Kyorq",
  "previous": "http://HylpDphpGnnAdpBoEQnqRqkzhq.fzzkPLwkYCOGJlQl3fpp99Ii,RAPKuETqb2Nr"
}
```

---

## DASHBOARD

### v1 dashboard list

**Method & Path:** `GET /v1/dashboard/`

---

### v1 dashboard shops client-groups list

**Method & Path:** `GET /v1/dashboard/shops/:shop_id/client-groups/`

**Description:** Manage client groups.

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `shop_id` | Required path parameter |

---

### v1 dashboard shops client-groups create

**Method & Path:** `POST /v1/dashboard/shops/:shop_id/client-groups/`

**Description:** Manage client groups.

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `shop_id` | Required path parameter |

---

### v1 dashboard shops clients list

**Method & Path:** `GET /v1/dashboard/shops/:shop_id/clients/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `shop_id` | Required path parameter |

---

### v1 dashboard shops clients import list

**Method & Path:** `GET /v1/dashboard/shops/:shop_id/clients/import/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `shop_id` | Required path parameter |

---

### v1 dashboard shops clients import create

**Method & Path:** `POST /v1/dashboard/shops/:shop_id/clients/import/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `shop_id` | Required path parameter |

---

### v1 dashboard shops clients create

**Method & Path:** `POST /v1/dashboard/shops/:shop_id/clients/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `shop_id` | Required path parameter |

---

### v1 dashboard shops clients read

**Method & Path:** `GET /v1/dashboard/shops/:shop_id/clients/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `shop_id` | Required path parameter |
| `id`      | Required path parameter |

---

### v1 dashboard shops reviews list

**Method & Path:** `GET /v1/dashboard/shops/:shop_id/reviews/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `shop_id` | Required path parameter |

---

### v1 dashboard shops send-messages create

**Method & Path:** `POST /v1/dashboard/shops/:shop_id/send-messages/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `shop_id` | Required path parameter |

---

### v1 dashboard shops staff partial update

**Method & Path:** `PATCH /v1/dashboard/shops/:shop_id/staff/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `shop_id` | Required path parameter |
| `id`      | Required path parameter |

---

### v1 dashboard shops staff delete

**Method & Path:** `DELETE /v1/dashboard/shops/:shop_id/staff/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `shop_id` | Required path parameter |
| `id`      | Required path parameter |

---

### v1 dashboard shops staff list

**Method & Path:** `GET /v1/dashboard/shops/:shop_id/staff/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `shop_id` | Required path parameter |

---

### v1 dashboard shops staff create

**Method & Path:** `POST /v1/dashboard/shops/:shop_id/staff/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `shop_id` | Required path parameter |

---

## FAQS

### v1 faqs read

**Method & Path:** `GET /v1/faqs/:id/`

**Description:** Retrieve, update, or delete a FAQ.

**Path Parameters:**

| Parameter | Description                                  |
| --------- | -------------------------------------------- |
| `id`      | A unique integer value identifying this FAQ. |

**Sample Response (200 OK):**

```json
{
  "question": "string",
  "answer": "string",
  "id": 9413,
  "order": 8808734614552216000,
  "status": 0,
  "created_at": "1982-04-15T04:46:39.311Z",
  "updated_at": "2018-07-20T04:07:00.224Z"
}
```

---

### v1 faqs partial update

**Method & Path:** `PATCH /v1/faqs/:id/`

**Description:** Retrieve, update, or delete a FAQ.

**Path Parameters:**

| Parameter | Description                                  |
| --------- | -------------------------------------------- |
| `id`      | A unique integer value identifying this FAQ. |

**Request Body Payload:**

```json
{
  "question": "string",
  "answer": "string",
  "order": -5392266993145709000,
  "status": 2
}
```

**Sample Response (200 OK):**

```json
{
  "question": "string",
  "answer": "string",
  "id": 9413,
  "order": 8808734614552216000,
  "status": 0,
  "created_at": "1982-04-15T04:46:39.311Z",
  "updated_at": "2018-07-20T04:07:00.224Z"
}
```

---

### v1 faqs delete

**Method & Path:** `DELETE /v1/faqs/:id/`

**Description:** Retrieve, update, or delete a FAQ.

**Path Parameters:**

| Parameter | Description                                  |
| --------- | -------------------------------------------- |
| `id`      | A unique integer value identifying this FAQ. |

---

### v1 faqs list

**Method & Path:** `GET /v1/faqs/`

**Description:** List all FAQs or create a new one.

**Query Parameters:**

| Parameter   | Description                                    |
| ----------- | ---------------------------------------------- |
| `search`    | A search term.                                 |
| `ordering`  | Which field to use when ordering the results.  |
| `page`      | A page number within the paginated result set. |
| `page_size` | Number of results to return per page.          |

**Sample Response (200 OK):**

```json
{
  "count": 4163,
  "results": [
    {
      "question": "string",
      "answer": "string",
      "id": 460,
      "order": 6072525752076988000,
      "status": 2,
      "created_at": "1984-08-31T13:30:15.127Z",
      "updated_at": "1966-11-24T11:29:20.608Z"
    },
    {
      "question": "string",
      "answer": "string",
      "id": 4639,
      "order": -3594236798521147400,
      "status": 3,
      "created_at": "1949-11-01T10:08:41.237Z",
      "updated_at": "1979-12-29T13:03:41.471Z"
    }
  ],
  "next": "http://pdF.jsrurF,s2q7Qxu+Q.wSFUW-,MNcnCQpAmmL11k2Phs0K90rctg5O",
  "previous": "https://gDrrEmnmvjwoGSylYtKWMBmu.kyhyi63sZGvoPuMRAmXuFX16n.dHPE,go.,eXl+FIhb2OChzvRxbew-sFVOFIGbBcARssao9E8MVEMbGd8"
}
```

---

### v1 faqs create

**Method & Path:** `POST /v1/faqs/`

**Description:** List all FAQs or create a new one.

**Request Body Payload:**

```json
{
  "question": "string",
  "answer": "string",
  "order": -5392266993145709000,
  "status": 2
}
```

**Sample Response (201 Created):**

```json
{
  "question": "string",
  "answer": "string",
  "id": 9413,
  "order": 8808734614552216000,
  "status": 0,
  "created_at": "1982-04-15T04:46:39.311Z",
  "updated_at": "2018-07-20T04:07:00.224Z"
}
```

---

## NOTIFICATIONS

### v1 notifications send create

**Method & Path:** `POST /v1/notifications/send/`

---

### v1 notifications list

**Method & Path:** `GET /v1/notifications/`

---

### v1 notifications create

**Method & Path:** `POST /v1/notifications/`

**Description:** Mark notification(s) as read.

---

## PAYMENTS

### v1 payments export list

**Method & Path:** `GET /v1/payments/export/`

---

### v1 payments manual read

**Method & Path:** `GET /v1/payments/manual/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 payments manual partial update

**Method & Path:** `PATCH /v1/payments/manual/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 payments manual delete

**Method & Path:** `DELETE /v1/payments/manual/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 payments manual list

**Method & Path:** `GET /v1/payments/manual/`

---

### v1 payments manual create

**Method & Path:** `POST /v1/payments/manual/`

---

### v1 payments webhook revenuecat create

**Method & Path:** `POST /v1/payments/webhook/revenuecat/`

---

## POLICY

### v1 policy read

**Method & Path:** `GET /v1/policy/`

**Description:** Retrieve or update privacy policy.

**Sample Response (200 OK):**

```json
{
  "id": 6718,
  "title": "string",
  "content": "string",
  "created_at": "2014-01-16T15:42:32.886Z",
  "updated_at": "2026-03-31T13:10:00.716Z"
}
```

---

### v1 policy partial update

**Method & Path:** `PATCH /v1/policy/`

**Description:** Retrieve or update privacy policy.

**Request Body Payload:**

```json
{
  "title": "string",
  "content": "string"
}
```

**Sample Response (200 OK):**

```json
{
  "id": 6718,
  "title": "string",
  "content": "string",
  "created_at": "2014-01-16T15:42:32.886Z",
  "updated_at": "2026-03-31T13:10:00.716Z"
}
```

---

## REVIEWS

### v1 reviews read

**Method & Path:** `GET /v1/reviews/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 reviews update

**Method & Path:** `PUT /v1/reviews/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 reviews delete

**Method & Path:** `DELETE /v1/reviews/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 reviews list

**Method & Path:** `GET /v1/reviews/`

---

### v1 reviews create

**Method & Path:** `POST /v1/reviews/`

---

## SCHEDULE

### v1 schedule breaks list

**Method & Path:** `GET /v1/schedule/breaks/`

---

### v1 schedule breaks partial update

**Method & Path:** `PATCH /v1/schedule/breaks/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 schedule breaks delete

**Method & Path:** `DELETE /v1/schedule/breaks/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 schedule breaks create

**Method & Path:** `POST /v1/schedule/breaks/`

---

### v1 schedule business-hours read

**Method & Path:** `GET /v1/schedule/business-hours/:shop_id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `shop_id` | Required path parameter |

---

### v1 schedule business-hours update

**Method & Path:** `PUT /v1/schedule/business-hours/:shop_id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `shop_id` | Required path parameter |

---

### v1 schedule shifts partial update

**Method & Path:** `PATCH /v1/schedule/shifts/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 schedule shifts delete

**Method & Path:** `DELETE /v1/schedule/shifts/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 schedule shifts list

**Method & Path:** `GET /v1/schedule/shifts/`

---

### v1 schedule shifts create

**Method & Path:** `POST /v1/schedule/shifts/`

---

### v1 schedule time-off partial update

**Method & Path:** `PATCH /v1/schedule/time-off/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 schedule time-off delete

**Method & Path:** `DELETE /v1/schedule/time-off/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 schedule time-off list

**Method & Path:** `GET /v1/schedule/time-off/`

---

### v1 schedule time-off create

**Method & Path:** `POST /v1/schedule/time-off/`

---

## SHOPS

### v1 shops list

**Method & Path:** `GET /v1/shops/`

---

### v1 shops create

**Method & Path:** `POST /v1/shops/`

---

### v1 shops gallery list

**Method & Path:** `GET /v1/shops/gallery/`

---

### v1 shops gallery read

**Method & Path:** `GET /v1/shops/gallery/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 shops gallery update

**Method & Path:** `PUT /v1/shops/gallery/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 shops gallery delete

**Method & Path:** `DELETE /v1/shops/gallery/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 shops gallery create

**Method & Path:** `POST /v1/shops/gallery/`

---

### v1 shops read

**Method & Path:** `GET /v1/shops/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 shops google-reviews list

**Method & Path:** `GET /v1/shops/:id/google-reviews/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 shops update

**Method & Path:** `PUT /v1/shops/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 shops payment-settings list

**Method & Path:** `GET /v1/shops/:id/payment-settings/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 shops payment-settings partial update

**Method & Path:** `PATCH /v1/shops/:id/payment-settings/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 shops delete

**Method & Path:** `DELETE /v1/shops/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

## TERMS

### v1 terms read

**Method & Path:** `GET /v1/terms/`

**Description:** Retrieve or update terms and conditions.

**Sample Response (200 OK):**

```json
{
  "id": 6718,
  "title": "string",
  "content": "string",
  "created_at": "2014-01-16T15:42:32.886Z",
  "updated_at": "2026-03-31T13:10:00.716Z"
}
```

---

### v1 terms partial update

**Method & Path:** `PATCH /v1/terms/`

**Description:** Retrieve or update terms and conditions.

**Request Body Payload:**

```json
{
  "title": "string",
  "content": "string"
}
```

**Sample Response (200 OK):**

```json
{
  "id": 6718,
  "title": "string",
  "content": "string",
  "created_at": "2014-01-16T15:42:32.886Z",
  "updated_at": "2026-03-31T13:10:00.716Z"
}
```

---

## SERVICES

### v1 read

**Method & Path:** `GET /v1/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 partial update

**Method & Path:** `PATCH /v1/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---

### v1 delete

**Method & Path:** `DELETE /v1/:id/`

**Path Parameters:**

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | Required path parameter |

---
