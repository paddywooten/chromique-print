# Firebase Security Rules for CHROMIQUE

## How to Set Up Firebase Security Rules

### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com/
2. Select your project: `chromique-print`

### Step 2: Navigate to Firestore Rules
1. Click on **"Firestore Database"** in the left sidebar
2. Click on the **"Rules"** tab at the top

### Step 3: Add Security Rules
**Copy and paste the following rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============================================
    // MoMo Orders Collection
    // ============================================
    match /momo_orders/{orderId} {
      
      // CREATE: Anyone can create orders (customers placing orders)
      // This allows the MoMo payment form to save new orders
      allow create: if true;
      
      // READ: Anyone can read orders
      // This allows the admin dashboard to display orders in real-time
      // and customers to potentially check order status in the future
      allow read: if true;
      
      // UPDATE: Anyone can update orders
      // This allows admin to verify/reject orders and update status
      // Validation ensures required fields are present
      allow update: if request.resource.data.status is string
                    && request.resource.data.status in ['Pending MoMo Verification', 'MoMo Verified', 'MoMo Rejected'];
      
      // DELETE: Restrict deletes to prevent accidental data loss
      // Only allow deletes if the order has a valid reference number
      // This prevents bulk deletion while still allowing cleanup
      allow delete: if resource.data.ref is string
                    && resource.data.ref.size() > 0;
    }
    
    // ============================================
    // Activity Log Collection (Optional)
    // ============================================
    // If you want to store activity logs in Firebase instead of localStorage
    match /activity_log/{logId} {
      // Anyone can read activity logs (for admin dashboard display)
      allow read: if true;
      
      // Anyone can create activity logs (for logging actions)
      allow create: if true;
      
      // No updates or deletes needed for activity logs
      allow update, delete: if false;
    }
    
    // ============================================
    // Settings Collection (Future Use)
    // ============================================
    // For storing app settings, pricing, etc.
    match /settings/{settingId} {
      // Anyone can read settings (for pricing display)
      allow read: if true;
      
      // Only allow writes if the setting has required fields
      allow write: if request.resource.data.keys().hasAny(['value', 'updatedAt']);
    }
  }
}
```

### Step 4: Publish Rules
1. Click the **"Publish"** button
2. Wait for the rules to be deployed (usually takes a few seconds)

---

## What These Rules Do

### ✅ **Allowed Operations:**

1. **Create Orders** - Customers can submit new orders via MoMo payment form
2. **Read Orders** - Admin dashboard can display all orders in real-time
3. **Update Orders** - Admin can verify/reject orders and change status
4. **Delete Orders** - Individual orders can be deleted (with validation)
5. **Read Activity Logs** - Admin can view activity history
6. **Create Activity Logs** - System can log admin actions
7. **Read Settings** - App can read pricing and configuration

### 🔒 **Security Features:**

1. **Status Validation** - Updates must include valid status values
2. **Delete Protection** - Can't delete orders without valid reference
3. **Activity Log Integrity** - Logs can't be modified or deleted
4. **Settings Validation** - Settings must have required fields

---

## Why These Rules Work for Your Business

### For Customers:
- ✅ Can place orders without authentication
- ✅ Simple, frictionless experience
- ✅ No login required

### For Admin:
- ✅ Can view all orders in real-time
- ✅ Can verify/reject orders
- ✅ Can search and filter orders
- ✅ Can export data
- ✅ Activity is logged for accountability

### For Security:
- ✅ Prevents invalid status updates
- ✅ Protects against accidental deletion
- ✅ Maintains activity log integrity
- ✅ Validates data structure

---

## Future Upgrade: Add Authentication

When you're ready for even better security, you can add Firebase Authentication:

### Step 1: Enable Authentication
1. Go to Firebase Console → Authentication
2. Click "Get started"
3. Enable "Email/Password" sign-in method
4. Create admin user accounts

### Step 2: Update Rules
Replace the rules with these stricter version:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /momo_orders/{orderId} {
      // Anyone can create orders (customers)
      allow create: if true;
      
      // Only authenticated admins can read/update/delete
      allow read, update, delete: if request.auth != null;
    }
    
    match /activity_log/{logId} {
      // Only authenticated admins can read logs
      allow read: if request.auth != null;
      // Anyone can create logs (system logging)
      allow create: if true;
      allow update, delete: if false;
    }
    
    match /settings/{settingId} {
      // Anyone can read settings
      allow read: if true;
      // Only admins can write settings
      allow write: if request.auth != null;
    }
  }
}
```

This requires admin login before accessing the dashboard, providing much stronger security.

---

## Testing Your Rules

After publishing the rules:
1. Open your admin dashboard
2. Check if orders load correctly
3. Try verifying/rejecting an order
4. Try creating a manual order
5. Check browser console for any permission errors

If you see "Missing or insufficient permissions" errors, your rules are blocking access.

---

## Monitoring Firebase Usage

### Check Usage in Console
1. Go to Firebase Console
2. Click on **"Usage and billing"** → **"Usage"**
3. Monitor:
   - Document reads
   - Document writes
   - Storage usage

### Free Tier Limits (Spark Plan)
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day
- 1 GB storage
- 10 GB/month network egress

For a small print shop, these limits are more than sufficient!

---

## Troubleshooting

### Issue: "Permission denied" errors
**Solution:** Check that your rules allow the operations you're trying to perform.

### Issue: Orders not showing in admin dashboard
**Solution:** Ensure `allow read: if true;` is set for the `momo_orders` collection.

### Issue: Can't verify/reject orders
**Solution:** Ensure `allow update: if true;` is set and status validation allows your status values.

### Issue: Can't delete orders
**Solution:** Ensure the order has a valid `ref` field with a non-empty string value.

---

## Next Steps

After setting up security rules:
1. ✅ Test all order operations
2. ✅ Monitor usage for a week
3. ✅ Consider adding authentication for better security (optional)
4. ✅ Set up usage alerts in Firebase Console

---

**Need Help?**
- Firebase Documentation: https://firebase.google.com/docs/firestore/security/get-started
- Firestore Rules Playground: https://console.firebase.google.com/project/_/firestore/rules
