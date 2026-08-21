# 🔐 Firebase Authentication Setup Guide — CHROMIQUE

The admin dashboard and staff console now use **real Firebase Authentication**
(email + password accounts) instead of shared passcodes. Firestore is locked
down so only signed-in managers/staff can read or manage orders.

Follow these one-time steps **in order**. Total time: ~10 minutes.

---

## Step 1: Enable Email/Password Sign-In

1. Go to https://console.firebase.google.com/ → project **chromique-print**
2. In the left sidebar click **Build → Authentication**
3. Click **Get started** (if you haven't before)
4. Open the **Sign-in method** tab
5. Click **Email/Password** → toggle **Enable** → **Save**

---

## Step 2: Create YOUR Manager Account (just you!)

You only need to bootstrap **one** manager — yourself (the director). Other
managers (e.g. Jessica) can be added later from inside the Admin Dashboard
(**Manage Team Accounts → Access Level: Manager**) without touching Firebase.

Still in **Authentication**:

1. Open the **Users** tab
2. Click **Add user**
3. Enter your email (e.g. `patrick@chromique.com`) and a strong password
4. Click **Add user** — note the **User UID** that appears in the list (you'll need it in Step 3)

> 💡 Managers can change their password later using **"Forgot password?"** on the
> dashboard login screen, or the **"Change My Password"** button inside the dashboard.

---

## Step 3: Grant the Manager Role (Bootstrap)

This is the only manual database step. For **each manager** created in Step 2:

1. Go to **Build → Firestore Database → Data** tab
2. Click **+ Start collection** (or open it if it exists) and set Collection ID: `user_roles`
3. For **Document ID**, paste your **User UID** from Step 2 (exactly — no spaces)
4. Add these fields:

   | Field | Type | Value |
   |---|---|---|
   | `role` | string | `manager` |
   | `active` | boolean | `true` |
   | `displayName` | string | e.g. `PATRICK (DIRECTOR)` |
   | `email` | string | e.g. `patrick@chromique.com` |

5. Click **Save**

> 💡 This console step is only needed for the FIRST manager. Once you can log
> in, add every other team member — staff AND managers — from the dashboard's
> **Manage Team Accounts** panel. Managers can never modify or remove their
> OWN role, so you can't accidentally lock yourself out.

---

## Step 4: Publish the Security Rules (one paste only)

> 💡 Easiest way: open **`setup_wizard.html`**, type your email in Step 2 and
> click **Generate My Rules** — it produces this exact ruleset with your email
> already filled in, plus a copy button.

1. Go to **Build → Firestore Database → Rules** tab
2. Delete everything and paste the full contents of **`firestore.rules`** (repo root)
   — if pasting manually, first replace `REPLACE-WITH-DIRECTOR-EMAIL@chromique.com`
   with the director's real login email (the "founder clause")
3. Click **Publish**

---

## Step 5: Test

1. Open `print_admin_dashboard.html` → sign in with a manager email/password → dashboard unlocks ✅
2. Try a wrong password → "Invalid email or password" ✅
3. Place a test order from the MoMo payment page (no login needed) → appears in dashboard ✅
4. Verify/reject the test order ✅
5. In the dashboard, click **Manage Team Accounts** → add team members
   (name, role, **login email**, phone, **temporary password**, and an
   **Access Level**: Staff or Manager). Add Jessica as a Manager here ✅
6. Open `staff_console.html` in a private/incognito window → sign in with the
   staff email + temporary password → console unlocks ✅
7. Deactivate the staff member in the dashboard → their next login is rejected ✅

---

## How It Works Now

| | Before | After |
|---|---|---|
| Manager login | Shared passcode (client-side check) | Personal email + password (Firebase Auth) |
| Staff login | Shared passcode + name dropdown | Personal email + password per staff member |
| Password change | OTP email via EmailJS | Firebase "Forgot password" reset email |
| Order data | Readable by anyone with project ID | Readable only by signed-in staff/managers |
| Order updates | Anyone could change status | Only signed-in staff/managers, status whitelist |
| Deleting orders | Anyone | Managers only |
| Staff onboarding | Add name to a list | Dashboard creates a real login account + role |
| Adding managers | Edit code / console work | Dashboard → Manage Team Accounts → Access Level: Manager |
| Revoking access | Change shared passcode for everyone | Deactivate/remove one person, instantly |

### Roles (`user_roles` collection, keyed by auth UID)
- **`manager`** — full dashboard: verify/reject/delete orders, manage staff, settings
- **`staff`** — staff console: view orders, update status, manual walk-in orders
- `active: false` instantly locks the account out of everything

### Notes
- **Customers never log in.** Placing MoMo orders stays public (with validation).
- Removing a staff member in the dashboard revokes access immediately (their role
  doc is deleted). To fully delete their login account, also remove them in
  **Firebase Console → Authentication → Users** (client apps aren't allowed to
  delete other users — that's a Firebase safety rule).
- Old `staff_profiles` entries created before this upgrade have no login accounts;
  they still appear in the staff list and can be deleted from the dashboard.
- The old `settings/admin_passcode` and `settings/staff_passcode` documents are
  no longer used — you can delete them from Firestore.
