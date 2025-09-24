# QA Checklist — Onboarding & Become a Vendor

Purpose: Pared-down step-by-step QA checklist for the onboarding flows and "Become a Vendor" path. Each test step lists the UI action (button/click), the file(s) implementing behavior, and the expected outcome.

Environment / Preconditions
- App running at the dev preview URL (e.g., https://<preview-host>/).
- Use two test accounts: one authenticated user (test@example.com) and an unauthenticated browser session (incognito).
- Ensure backend APIs are reachable and file uploads allowed.

Files of interest (for debugging or tracing handlers)
- client/components/ServiceHeader.tsx — header CTA behavior for "Become a Travel Vendor".
- client/pages/Index.tsx — landing page CTAs.
- client/components/AuthModal.tsx — sign-in / sign-up handling and next redirect.
- client/pages/Onboarding.tsx — role selection, step navigation and internal onboarding flow.
- client/pages/VendorCategories.tsx — vendor category selection and mapping to onboarding routes.
- client/pages/PropertyOwnerOnboarding.tsx — property owner multi-step onboarding implementation.
- client/components/ui/* (card.tsx, button.tsx, progress.tsx, toast.tsx, input.tsx) — shared UI behaviour.

Quick conventions used in this README
- Action: UI action to perform.
- Expected: What should happen in the UI and backend.
- Debug: files to inspect if behavior is different.

---

1) Landing → Become a Travel Vendor (Header CTA)
- Action: Click "Become a Travel Vendor" in the header (client/components/ServiceHeader.tsx).
- Expected (Signed-in): Browser navigates to `/vendors` and Vendor Categories page loads.
- Expected (Signed-out): Browser navigates to `/?auth=signin&next=/vendors`; AuthModal opens or auth UI visible. After sign-in or sign-up complete, user is redirected to `/vendors`.
- Debug: Check ServiceHeader.tsx for sign-in branch and AuthModal.tsx for navigation handling.

2) Landing → Become a Travel Vendor (Index page CTA)
- Action: On client/pages/Index.tsx click the "Become a Travel Vendor" button.
- Expected: Same behavior as header CTA; signed-in users go to `/vendors`, signed-out users get auth flow with next param.
- Debug: Inspect Index.tsx Link/handler and router history.

3) Auth flow (AuthModal)
- Action A: Click "Sign In" and sign in with valid credentials.
- Expected: AuthModal closes, navigate to `next` parameter if present (e.g., `/vendors`) or to home otherwise.
- Action B: Click "Create Account" (Sign Up) and register.
- Expected: On success, modal closes and app navigates to `next` or `/onboarding` by default.
- Debug: AuthModal.tsx success handler and navigate(nextPath || '/onboarding'). Verify network calls to auth endpoints.

4) Onboarding landing (Role selection) — Step 1 of 6
- Action: Open `/onboarding` (or after sign-up you are redirected here). Observe header "Welcome to Travel Connect!" and progress bar (client/components/ui/progress.tsx).
- Action A: Click the Traveler card.
  - Expected: Card visually selected; user remains in /onboarding and Continue advances to next internal step (Step 2). The code sets profile.role to "traveler" and setCurrentStep("themes").
- Action B: Click the Travel Vendor card.
  - Expected: Immediate navigation to `/vendors` (client/pages/Onboarding.tsx handleRoleSelect handles this). No further /onboarding steps occur.
- Action C: Click Travel Agent or Admin cards.
  - Expected: Redirect to the respective onboarding path (`/travel-agent-onboarding`, `/admin-onboarding`) if implemented.
- Action D: Click Continue when a Traveler is selected.
  - Expected: Validate selection and progress to step 2. If none selected, show inline validation and/or toast.
- Debug: Onboarding.tsx for handleRoleSelect and continue/back button logic. Verify progress bar updates.

5) Vendor Categories (`/vendors`) — choose vendor type
- Action: Visit `/vendors` (client/pages/VendorCategories.tsx). Click each category card (e.g., "Stays", "Airlines").
- Expected: Clicking a category navigates to the category-specific onboarding route (e.g., `/property-onboarding`, `/flights-onboarding`). If unauthenticated, the app should redirect to `/?auth=signin&next=<category-route>`.
- Debug: VendorCategories.tsx categories array mapping `to` values; router guards that check auth.

6) Property Owner Onboarding — Step-by-step (PropertyOwnerOnboarding.tsx)
General note: The property onboarding is a multi-step wizard. Each step uses Back and Continue (client/components/ui/button.tsx) and a progress bar.

Step A — Property Details
- Action: Fill in required fields: Property Name, Location, Property Type, Star Rating, Number of Rooms.
- Buttons:
  - Continue: Validates fields. Expected: If valid, persists state (local and/or backend) and advances to Amenities step; progress bar increments.
  - Back: If present, returns to the previous step (disabled on first).
- Expected: On success, no error toasts; on validation error, inline error messages + toast.
- Debug: Check validations in PropertyOwnerOnboarding.tsx and API call payload.

Step B — Amenities
- Action: Select some amenities checkboxes.
- Buttons: Continue, Back.
- Expected: Selections saved, moving forward persists state; Continue disabled (or errors) if necessary constraints exist.

Step C — Media Upload
- Action: Click Upload/Add Image, choose allowed file type and size.
- Buttons:
  - Upload: Opens file selector and triggers client-side validation then upload network request.
  - Continue: Only allowed if at least one media item present if required.
- Expected: File preview appears; upload success triggers toast; failures show toast with retry.
- Debug: Confirm file size/type checks and backend storage endpoint.

Step D — Pricing & Inventory
- Action: Add a pricing rule, set rates, min stay, seasons.
- Buttons: Add Pricing, Save, Continue, Back.
- Expected: Pricing saved; Continue moves to Verify.

Step E — Verify Documents & Banking
- Action: Upload ID/business license and optionally add bank details.
- Buttons: Upload Documents, Submit Verification, Back.
- Expected: Submitting packages verification for review; show toast "Verification submitted" and display status Pending Review.
- Debug: Check verification endpoints and email notifications.

Step F — Done / Publish
- Action: Finalize and click Done / Publish.
- Expected: Listing created with status Published or Pending Review; show confirmation UI and CTA to View Listing or Go to Dashboard.

7) Flights / Experiences / Events onboarding (other categories)
- Action: On respective onboarding pages, complete category-specific forms (API keys, inventory fields, schedules, capacities).
- Expected: Same pattern — Back / Continue, validations, upload assets, submit verification as necessary.

8) Global / Auxiliary behaviors
- Toast messages (client/components/ui/toast.tsx): Any async action (save, upload, submit) should display a toast indicating success or failure.
- Progress bar (client/components/ui/progress.tsx): Continue button updates the bar; Back reduces progress.
- Disabled states: Back disabled on first step; Continue disabled while network requests are in-flight or required fields invalid.

9) Edge-case tests
- Unauthenticated navigation: Attempt to open `/property-onboarding` in incognito. Expected: redirect to `/?auth=signin&next=/property-onboarding`.
- Network failure during save: Simulate network error (throttle or stop API). Expected: toast error, form preserves inputs locally, retry available.
- Large file upload: Try uploading an oversized media file. Expected: client-side rejection with error toast and no upload attempt.

10) Quick trace locations (if a test fails)
- Header CTA & Index CTA: client/components/ServiceHeader.tsx and client/pages/Index.tsx
- Auth and redirect: client/components/AuthModal.tsx
- Role selection and onboarding controller: client/pages/Onboarding.tsx
- Vendor categories list: client/pages/VendorCategories.tsx
- Property onboarding wizard: client/pages/PropertyOwnerOnboarding.tsx
- Shared UI issues (toasts, buttons, progress): client/components/ui/*

---

Recommended test execution order for QA
1. Start with the unauthenticated user (incognito) and validate landing CTAs + auth redirect behavior.
2. Sign up a new user and verify redirect to /onboarding and role-selection logic.
3. For a test vendor account, go through /vendors -> choose a category -> complete category onboarding (use allowed test data only).
4. Test file uploads, verify server responses, and watch toasts.
5. Test resume behavior: save draft (if implemented) or simulate leaving mid-flow and returning.
6. Run edge-case tests (network failures, unauthenticated direct route access, large file uploads).

Notes
- Use the dev preview URL and browser devtools to inspect network calls and console logs for debugging.
- If backend returns errors, capture request/response JSON to diagnose validation mismatches.

File saved: docs/QA_Onboarding_README.md
