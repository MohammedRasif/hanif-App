

BUSINESS REQUIREMENTS DOCUMENT

Multi-Location Salon & Barbershop Booking Platform

Prepared for: Mr. Hanif



Document Type:  Business Requirements Document (BRD)

Prepared By:  Business Analyst

Status:  Draft — Pending Client Confirmation

Version:  1.0





1. Document Control



2. Executive Summary

The client, Mr. Hanif, operates multiple hairdressing/barbering salons and requires a single mobile application that allows customers to discover and book appointments across any of the owner's locations, while giving barbers (largely self-employed) control over their own availability, services and client relationships. The platform is best understood as a SaaS-style, multi-tenant booking system — similar in concept to Booksy or Fresha — rather than a simple single-shop booking app.

This document consolidates the requirements gathered from direct client conversation, the feature list subsequently extracted from that conversation, and the in-progress Figma prototype, into a structured Business Requirements Document (BRD). Because the client engaged informally over chat and has not yet answered a number of structural questions (multi-tenancy model, commission handling, permission granularity, etc.), this BRD explicitly separates confirmed requirements from open items that must be resolved with the client before detailed technical design and estimation can be finalised.

3. Business Objectives

Enable customers to discover, book, reschedule, cancel and pay for salon/barber appointments from a single mobile app.

Allow the owner to manage multiple salon locations from one platform, with centralised oversight and per-salon operational control.

Give self-employed barbers autonomy over their own schedule, services and client base within the rules set by the owner/salon manager.

Reduce no-shows and manual admin work through automated reminders and notifications.

Strengthen the salons' online presence and reputation through social media integration and review collection.

Provide the owner with visibility into revenue, occupancy and staff performance across all locations.



4. Project Background

The requirement originated from an ongoing chat-based discussion with the client. The client initially described wanting “an appointment app for hairdressing and barbering,” with the key distinguishing requirement that “one app must be able to hold multiple sites for the owner to go through,” referencing Booksy/Fresha as reference platforms. The client also confirmed a need for staff and client interaction features and, separately, requested social media integration (initially described ambiguously, later clarified as the ability to post from the app to Facebook/Instagram).

Given the client's limited availability for calls (“I can't at the moment, I've dropped everything, later part next week”), requirements were gathered primarily asynchronously via chat, and a detailed set of clarifying questions was prepared for the client to answer before the developer brief is finalised. These clarifying questions are carried forward into Section 10 of this document.



5. Scope

5.1 In Scope

Customer-facing mobile app: browsing, booking, payment, reminders, reviews.

Barber/Admin-facing tools: availability management, appointment dashboard, client history, reporting.

Owner/Super Admin capability to manage multiple salon locations from a single account.

Integrations: social media booking links/posting, Telegram confirmation bot, automated email/SMS, Google Reviews prompts.

Unified communication inbox with automated message triggers.

Design deliverables: wireframes, design system, mobile-first responsive layouts, clickable prototype.

5.2 Out of Scope (Unless Confirmed by Client)

Accounting software integrations (e.g., Xero, QuickBooks) — pending confirmation (Section 10).

White-label resale of the platform to other salon groups — pending confirmation (Section 10).

Franchise-specific functionality beyond the initial set of salons — pending confirmation (Section 10).

Automatic invoice generation for self-employed barbers' tax records — pending confirmation (Section 10).



6. Stakeholders



7. User Roles & Permissions

The platform requires tenant-level control (owner) combined with individual practitioner autonomy (self-employed barbers). Roles below are based on the client's stated model; the exact permission boundaries between Owner, Salon Manager and Barber still require client confirmation (see Section 10).



8. Functional Requirements

Functional requirements are grouped by application area, consistent with the feature breakdown reviewed with the client.

8.1 Customer-Facing Features



8.2 Barber / Admin-Facing Features



8.3 Third-Party Integrations



8.4 Communication Hub



8.5 Multi-Location (Multi-Salon) Management

The owner must be able to manage all salon locations from a single account, similar to platforms such as Booksy or Fresha. Core requirements:

Owner/super-admin dashboard providing a consolidated view across all salons.

Ability to add, remove and configure individual salon locations.

Per-salon configuration of opening hours, services, pricing and staff.

Data isolation between salons, with the exception of barbers who may be permitted to work across multiple locations (to be confirmed).



8.6 Availability & Booking Logic

The booking engine must support the specific dynamics of a self-employed staff model:

Barber-level availability that operates within (or independently of, pending confirmation) salon opening hours.

Time-off / holiday requests, with a process for approval (self-approved vs. manager-approved) to be confirmed.

Automatic calendar blocking once time off or an appointment is confirmed.

Support for split shifts and custom break times.

Configurable buffer time between appointments for cleaning/setup.

Support for walk-in availability alongside scheduled bookings, where a barber can mark themselves available for walk-ins.



8.7 Services & Pricing Management

Service menu with categories, pricing and duration, manageable at owner, salon-manager and/or barber level (governance model to be confirmed).

Support for barber-specific custom services in addition to the standard salon menu (to be confirmed).

Support for fixed vs. barber-adjustable service durations (to be confirmed).



8.8 Payments & Commission

The client has confirmed a need for an in-app payment flow. The underlying commission/chair-rent model requires confirmation:

In-app secure payment processing (e.g., via Stripe or a comparable payment gateway) at minimum for booking-flow checkout.

Booking screen displays a total amount and references a cancellation/no-show fee policy prior to payment.

Commission split logic between owner/salon and self-employed barber (or booking-only model), to be confirmed.

Tip handling and payout logic, to be confirmed.

No-show / cancellation fee ownership and policy configuration, to be confirmed.



8.9 Barber-Specific Features

Personal dashboard showing individual earnings and client rebooking rates (to be confirmed).

Private client notes for cuts/preferences.

Portfolio photo uploads visible on the barber's public profile.

Personal waitlist for clients when the barber is fully booked (to be confirmed).

Recurring booking support (e.g., “every 3 weeks with Jake”) (to be confirmed).



8.10 Reporting & Analytics

Owner-level reporting: revenue per salon, revenue per barber, occupancy rates, no-show rates.

Barber-level reporting: own earnings, client count, average booking value.

Real-time dashboard vs. periodic (daily/weekly) summary reporting — cadence to be confirmed.



8.11 Notifications & Communication

Automated appointment reminders (push/email/SMS) ahead of scheduled bookings.

Automated triggers on booking, 24-hour reminder and post-appointment follow-up.

Post-appointment Google Reviews prompt.

Unified inbox aggregating messages across channels.

In-app messaging between barber and client (to be confirmed).

Ownership of SMS costs and whether notification settings are barber-level or salon-wide policy (to be confirmed).



9. Non-Functional Requirements

Mobile-first, responsive design across supported devices.

Secure handling of payment data (PCI-compliant payment gateway integration).

GDPR-compliant handling of client personal data, including consent capture and right-to-deletion support.

Reliable, real-time (or near real-time) availability updates to prevent double-booking across salons and barbers.

Scalable architecture capable of supporting growth beyond the initial set of salons.

Role-based access control enforced consistently across owner, manager, barber and customer experiences.



10. Open Questions Requiring Client Confirmation

The following items were raised with the client as clarifying questions during discovery and remain unanswered at the time of this document. These must be resolved before final solution architecture, effort estimation and detailed wireframing can be completed.



11. Assumptions

The client's reference to “7 salons” during discovery is treated as the current known scale; final number of locations to be confirmed.

Social media integration for automatic posting will require approval and API access from Meta's Business Platform, which may extend timelines beyond the client's control.

Payments will be processed through a third-party payment gateway rather than a custom-built payment engine.

The Figma prototype currently in progress reflects the primary customer booking journey and will be extended to cover admin/owner and barber workflows.



12. Constraints

Client availability for real-time discussion has been limited; requirements gathering has proceeded primarily via asynchronous chat.

Certain structural decisions (multi-tenancy architecture, commission model, permission granularity) are dependent on client input and are currently blocking detailed technical design.

Third-party platform dependencies (Meta Business API, Telegram Bot API, payment gateway, SMS provider) introduce external approval and cost dependencies outside the project team's direct control.



13. Design Reference

An in-progress Figma prototype has been shared as a working reference for the customer booking flow and is to be used as the visual baseline for the remaining specification. It currently covers:

Onboarding & authentication: splash screens, welcome/sign-in, create account, forgot password, OTP verification, change/reset password.

Customer home & discovery: salon listing, salon detail, categories, special offers, reviews.

Booking flow: select date & time, choose shop, confirm appointment (services, date/time, total amount), payment, booking confirmation.

Appointment management: appointment dashboard (upcoming/completed/cancelled), appointment detail, reschedule flow, cancellation flow with reason capture, map/directions view.

Reviews: post-appointment review submission screen.

Figma file: https://www.figma.com/design/vPw5w8BmdJW4vNflQxWwla/personal?node-id=0-1&p=f&t=sHICeXbA6oJGbJX9-0

Note: the Figma file currently covers primarily the customer-side happy path. Wireframes for the admin/owner dashboard, multi-salon management and barber-specific tools are outstanding deliverables (see Section 14).



14. Deliverables

Wireframes: customer booking flow.

Wireframes: admin/owner dashboard.

Design system and component library.

Mobile-first responsive layouts.

Clickable prototype of the happy path.

Per the client's stated preference, the recommended sequencing is to design and validate the booking and calendar flow first, with subsequent modules (admin dashboard, multi-location management, barber tools, integrations) following in a phased approach rather than designing the entire system at once.



15. Recommended Next Steps

Share this BRD with the client and obtain written answers to the open questions in Section 10.

Confirm the multi-tenancy architecture and permission model, as this materially affects the technical approach and cost estimate.

Extend the Figma prototype to cover the admin/owner dashboard and barber-specific screens.

Confirm the payment/commission model with the client and select a payment gateway accordingly.

Finalise the project proposal and estimate based on confirmed scope.

Schedule a short call with the client, subject to availability, to walk through any remaining ambiguities.



16. Approval / Sign-off