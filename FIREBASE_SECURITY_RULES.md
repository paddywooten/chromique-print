# Firebase Security Rules for CHROMIQUE

## How to Set Up Firebase Security Rules

### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com/
2. Select your project: `chromique-print`

### Step 2: Navigate to Firestore Rules
1. Click on **"Firestore Database"** in the left sidebar
2. Click on the **"Rules"** tab at the top

### Step 3: Add Security Rules
Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // MoMo Orders Collection
    match /momo_orders/{orderId} {
      // Anyone can create orders (customers placing orders)
      allow create: if true;
      
      // Anyone can read orders (for admin dashboard real-time sync)
      allow read: if true;
      
      // Anyone can update orders (for verify/reject actions)
      // In production, you might want to add authentication here
      allow update: if true;
      
      // Anyone can delete orders (for clearing orders)
      // In production, you might want to restrict this
      allow delete: if true;
    }
    
    // Activity Log Collection (optional - if you want to store activity logs in Firebase)
    match /activity_log/{logId} {
      allow read, write: if true;
    }
  }
}
```

### Step 4: Publish Rules
1. Click the **"Publish"** button
2. Wait for the rules to be deployed (usually takes a few seconds)

---

## Security Considerations

### Current Rules (Development Mode)
The rules above are **permissive** and suitable for development/small business use:
- ✅ Anyone can create orders (customers)
- ✅ Anyone can read orders (admin dashboard)
- ✅ Anyone can update orders (verify/reject)
- ⚠️ No authentication required

### Production-Ready Rules (Recommended for Future)
For better security, consider adding Firebase Authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /momo_orders/{orderId} {
      // Anyone can create orders
      allow create: if true;
      
      // Only authenticated admins can read/update/delete
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

This would require:
1. Setting up Firebase Authentication
2. Creating admin user accounts
3. Logging in before accessing the admin dashboard

---

## Testing Your Rules

After publishing the rules:
1. Open your admin dashboard
2. Check if orders load correctly
3. Try verifying/rejecting an order
4. Check browser console for any permission errors

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
**Solution:** Ensure `allow update: if true;` is set for the `momo_orders` collection.

---

## Next Steps

After setting up security rules:
1. ✅ Test all order operations
2. ✅ Monitor usage for a week
3. ✅ Consider adding authentication for better security
4. ✅ Set up usage alerts in Firebase Console

---

**Need Help?**
- Firebase Documentation: https://firebase.google.com/docs/firestore/security/get-started
- Firestore Rules Playground: https://console.firebase.google.com/project/_/firestore/rules
