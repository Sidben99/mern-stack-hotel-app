# LankaStay — App Design

## Actors (3 Roles)

| Role | What they can do |
|---|---|
| **User** | Browse hotels, view details, book a stay, manage their bookings |
| **Owner** | All user abilities + create/manage their own properties, view bookings on their properties |
| **Admin** | Approve owner requests, approve/reject properties, manage users, oversee bookings |

Single login form. Role determines what you see after login (conditional rendering in header/dashboard).

---

## Owner Flow (Hybrid Model)

### Step 1 — Identity Check (One-Time)

1. Registered user clicks "Become an Owner"
2. Submits phone number + national ID
3. `ownerStatus` on User model set to `"pending"`
4. Admin dashboard shows all pending requests
5. Admin approves → `role = "owner"`, `ownerStatus = "approved"`
6. Admin rejects → `ownerStatus = "rejected"` (optional rejection reason)

### Step 2 — Per-Property Approval

1. Approved owner creates a Property
2. Property starts as `approvalStatus: "pending"`
3. Admin reviews and approves/rejects each property
4. Only approved properties are visible to users

---

## Property Model (No Rooms)

Each property is a single type of unit with `roomCount` identical units:

```
Property {
  name, city, country, description, pricePerNight, roomCount,
  amenities[], images[], ownerId,
  approvalStatus: "pending" | "approved" | "rejected"
}
```

Availability is calculated dynamically:

```
available = roomCount - bookings overlapping the requested dates
```

---

## Booking Model

```
Booking {
  property, user,
  checkIn, checkOut,
  totalPrice,
  status: "pending" | "confirmed" | "cancelled"
}
```

---

## Revenue Model — Commission (Phase 2 with Stripe)

- Guest pays full price
- Platform takes a % (e.g., 15%)
- Owner receives the rest

Phase 1: no payments. Track bookings with statuses only. Money handled off-platform.

---

## What Admins Do

- **Owner requests** — approve/reject identity submissions
- **Properties** — approve/reject each listing
- **Users** — suspend/ban problematic accounts
- **Bookings** — view all bookings (support/disputes)
- Future: platform stats (users, bookings, revenue)

---

## What Owners Do

- **CRUD properties** (create, edit, delete their own)
- **View bookings** on their properties (guest name, dates, status)
- **Cancel a booking** on their property
- **Set unavailable dates** (block off dates without a booking)

---

## Frontend Pages (To Build)

| Route | Page | Access |
|---|---|---|
| `/` | Home — browse/search hotels | Public |
| `/hotels/:id` | Property detail + booking form | Public (book requires login) |
| `/my-bookings` | User's bookings | Protected (user) |
| `/owner/properties` | Owner's listings + create/edit | Protected (owner) |
| `/owner/bookings` | Bookings on owner's properties | Protected (owner) |
| `/owner/request` | Become an owner form | Protected (user) |
| `/admin/owner-requests` | Approve/reject owners | Protected (admin) |
| `/admin/properties` | Approve/reject listings | Protected (admin) |
| `/dashboard` | Role-based dashboard | Protected (all roles) |

---

## Build Order

1. Add owner fields to User model (`phone`, `nationalId`, `ownerStatus`)
2. Create Property model + CRUD API (owner create, admin approval)
3. Create owner request flow + admin approval endpoint
4. Build property listing/detail pages (frontend)
5. Create Booking model + API
6. Build booking flow (frontend)
7. Owner dashboard (manage properties, view bookings)
8. Admin dashboard (approve owners + properties)
9. Future: Stripe payments, search/filters, email notifications
