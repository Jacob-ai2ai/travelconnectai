# Vendor Dashboard and Listing Flows

This document describes all four vendor onboarding and listing scenarios in the TravelTheWorld.ai application.

## Scenario 1: Unregistered User → Vendor

**Flow**: Guest User → Sign Up → Role Selection → Vendor Type Selection → Listing Creation

**Steps**:
1. User clicks "Join as Vendor" button in Header (when not signed in)
   - Routes to: `/?auth=signup`
2. AuthModal opens on Signup tab
3. User completes signup form and clicks "Create Account"
4. Account created, AuthModal closes
5. RoleSelectionDialog automatically appears
6. User clicks "Become a Vendor"
7. Redirects to: `/vendor/select-type`
8. User selects vendor type (Stays, Flights, Experiences, Events, Essentials)
9. Redirects to appropriate onboarding:
   - Stays → `/property-onboarding`
   - Flights → `/flights-onboarding`
   - Experiences → `/experiences-onboarding`
   - Events → `/events-onboarding`
   - Essentials/Products → `/products-onboarding`
10. User completes vendor-specific onboarding
11. Vendor account created, user redirected to: `/vendor-dashboard`

**Key Components**:
- `Header.tsx` - "Join as Vendor" button
- `AuthModal.tsx` - Signup form + RoleSelectionDialog
- `RoleSelectionDialog.tsx` - Choose role dialog
- `VendorTypeSelect.tsx` - Vendor type selection
- Vendor-specific onboarding pages

---

## Scenario 2: Registered Traveler → Vendor

**Flow**: Traveler → Become a Vendor → Vendor Type Selection → Listing Creation

**Steps**:
1. Registered traveler user logs in
   - User role stored as `traveler` in localStorage
2. User clicks "Become a Travel Vendor" button in Header
   - Routes to: `/vendor/select-type`
3. User selects vendor type (Stays, Flights, Experiences, Events, Essentials)
4. Redirects to appropriate onboarding (same as Scenario 1, steps 9-11)

**Key Components**:
- `Header.tsx` - "Become a Travel Vendor" button (shown for non-vendors)
- `VendorTypeSelect.tsx` - Vendor type selection
- Vendor-specific onboarding pages

---

## Scenario 3: Registered Vendor → Add New Listing

**Flow**: Vendor Dashboard → Add New Listing → List Service

**Steps**:
1. Registered vendor logs in and is identified as vendor
   - User role stored as `vendor` in localStorage
2. User clicks username icon in Header to access profile
   - Routes to: `/profile`
3. ProfilePage shows "Go to Vendor Dashboard" button
4. User clicks button → routes to: `/vendor-dashboard`
5. Dashboard displays vendor info, listings, orders, etc.
6. User clicks "Add New Listing" button
   - Routes to: `/vendor/create-listing`
7. User selects listing type from options
8. User fills in listing details (title, description, price, location, etc.)
9. User clicks "Create Listing"
10. Listing saved to localStorage
11. Redirects back to: `/vendor-dashboard`

**Listing Types Available**:
- Accommodation (Stays)
- Flights & Transport
- Experiences
- Events
- Travel Essentials

**Key Components**:
- `Header.tsx` - Username icon + "Vendor Dashboard" button
- `ProfilePage.tsx` - "Go to Vendor Dashboard" button (for vendors)
- `VendorDashboard.tsx` - Main vendor dashboard with all cards
- `VendorListingCreate.tsx` - Listing creation form with type selector

---

## Scenario 4: AI-Assisted Listing (Future Enhancement)

**Note**: This scenario is for future implementation with Nova AI integration.

**Proposed Flow**: Vendor → Ask AI → AI Generates Listing

**Steps**:
1. User on VendorDashboard or VendorListingCreate
2. User clicks "Create with AI" or similar button
3. Nova AI chat interface opens
4. User describes their service in natural language
5. AI generates listing details (title, description, highlights, pricing suggestions)
6. User reviews and confirms details
7. Listing created with AI-suggested content

---

## Data Storage & User Roles

### User Object Structure (localStorage)
```javascript
{
  id: "user-id",
  username: "username",
  email: "user@example.com",
  role: "traveler" | "vendor",        // User type
  vendorType: "stays" | "flights" | "experiences" | "events" | "essentials",  // For vendors
  bio: "user bio",
  avatar: "avatar-url",
  // ... other fields
}
```

### Authentication Flags
```javascript
// localStorage keys
"isSignedIn" = "true" | "false"        // User authenticated
"user" = JSON.stringify(userObject)    // User data
```

### Listings Storage (localStorage)
```javascript
{
  id: "unique-listing-id",
  type: "stays" | "flights" | "experiences" | "events" | "essentials",
  title: "Listing Title",
  description: "Full description",
  price: "99.99",
  currency: "USD",
  location: "Location/Area",
  capacity: "4",      // For stays
  duration: "2",      // For experiences/events
  createdAt: "ISO-timestamp",
  // ... other fields
}
```

---

## Navigation Routes

### Public Routes
- `/` - Home page
- `/onboarding` - Onboarding flow
- `/?auth=signup` - Signup modal on home page
- `/?auth=signin` - Sign in modal on home page

### Vendor Routes
- `/vendor-dashboard` - Main vendor dashboard (vendor only)
- `/vendor/select-type` - Vendor type selection (new vendors)
- `/vendor/create-listing` - Listing creation form (vendor only)

### Vendor-Specific Onboarding
- `/property-onboarding` - For accommodation hosts
- `/flights-onboarding` - For flight/transport vendors
- `/experiences-onboarding` - For experience providers
- `/events-onboarding` - For event organizers
- `/products-onboarding` - For essential services

### Traveler Routes (Existing)
- `/profile` - User profile page
- `/edit-profile` - Profile editor
- `/trips` - User trips/itineraries
- `/discover` - Discovery page
- `/stays`, `/flights`, `/xperiences`, `/events`, `/essentials` - Service browsing

---

## Role Switching (Future Enhancement)

Users with both traveler and vendor accounts can switch between modes:
- Current implementation: Vendors can view profile, vendors can access vendor dashboard
- Future: Toggle switch in profile to seamlessly switch between traveler and vendor experiences

---

## Implementation Notes

1. **Authorization**: Check `isSignedIn` flag and `user.role` before accessing vendor routes
2. **Vendor Dashboard**: Protected route - redirect to home if not vendor
3. **Role Selection**: Shows automatically after signup via RoleSelectionDialog component
4. **Local Storage**: Used for demo purposes - should be replaced with database in production
5. **Vendor Type**: Stored in user object for quick reference and filtering
6. **Listings**: Each vendor can have multiple listings of different types

---

## Testing the Flows

### Test Scenario 1: New Vendor Signup
1. Open app in private window
2. Click "Join as Vendor"
3. Complete signup form
4. Verify role selection dialog appears
5. Click "Become a Vendor"
6. Select vendor type
7. Complete vendor onboarding
8. Verify redirected to vendor dashboard

### Test Scenario 2: Traveler to Vendor
1. Sign up as traveler (complete role selection as traveler)
2. Click "Become a Travel Vendor" in header
3. Select vendor type
4. Complete vendor onboarding
5. Verify redirected to vendor dashboard

### Test Scenario 3: Vendor Listing Management
1. Sign up as vendor (complete full flow)
2. Verify on vendor dashboard
3. Click "Add New Listing"
4. Create a test listing
5. Verify listing appears in "My Listings" section

---

## Files Modified/Created

**New Files**:
- `client/pages/VendorDashboard.tsx` - Main vendor dashboard
- `client/pages/VendorTypeSelect.tsx` - Vendor type selection
- `client/pages/VendorListingCreate.tsx` - Listing creation form
- `client/components/RoleSelectionDialog.tsx` - Role selection dialog

**Modified Files**:
- `client/App.tsx` - Added vendor routes
- `client/components/Header.tsx` - Updated vendor buttons logic
- `client/components/AuthModal.tsx` - Integrated RoleSelectionDialog
- `client/pages/ProfilePage.tsx` - Added vendor dashboard toggle button

---

## Future Enhancements

1. **AI-Assisted Listing** (Scenario 4): Integration with Nova AI
2. **Role Switching**: Toggle between traveler and vendor modes
3. **Multiple Vendor Types**: Support vendors offering multiple types of services
4. **Dashboard Analytics**: Advanced metrics and insights
5. **Team Management**: Invite co-workers and manage permissions
6. **Promotions & Discounts**: Create special offers
7. **Live Streaming**: Host live sessions to showcase services
8. **Booking Management**: Handle reservations and payments

