# 🔑 Owner's Edit Guide: Customizing Your Code & Passcodes
*A simple, quick-reference guide for Patrick to manually change the passcode and default prices inside the code.*

---

## 1. How to Change Your Admin Passcode (PIN)
Your passcode is no longer stored as readable text — it is stored as a **SHA-256 hash** (a scrambled fingerprint), so nobody who views the code or the database can read your actual passcode.

### ✅ Recommended: Use the Dashboard (No Coding Needed!)
1. Log into your **Admin Dashboard** (`admin_console.html`).
2. Click the **"Change Manager Passcode"** button at the bottom.
3. Follow the steps: select your name → receive the OTP code by email → enter it → set your new passcode.
4. The new passcode is saved (as a secure hash) to Firebase automatically, and works everywhere immediately.

*The staff passcode works the same way — use the **"Change Staff Passcode"** button in the dashboard.*

### 🛠️ Advanced: Change the Default Fallback in the Code
The default passcode (used only when Firebase has no saved passcode) is **`2026`**. To change this fallback:
1. Open **`admin_console.html`** in a text editor and find this line near the bottom `<script>` section:
   ```javascript
   let ADMIN_PASSCODE_HASH = "158a323a7ba44870f23d96f1516dd70aa48e9a72db4ebb026b0a89e212a208ab";
   ```
2. Generate the SHA-256 hash of your new passcode. The easiest way: open your website, press **F12** to open the browser console, and run:
   ```javascript
   sha256Hex("YourNewPasscode").then(console.log)
   ```
   (Run this on the admin dashboard page — the helper function is built in.)
3. Copy the 64-character result and paste it between the quotes, replacing the old hash.
4. Do the same for `STAFF_PASSCODE_HASH` in **`admin_console.html`** and **`staff_console.html`** if you want to change the staff default too.
5. Save the file(s).

---

## 2. How to Change Your Fallback Base Prices
If you ever want to change the default prices that load when a customer first visits the website (before you adjust them in the Admin Console):

### Step-by-Step:
1. Open the file **`print_app.js`** inside the `chromique_print/` folder.
2. Locate the **`appSettings`** block at the very top of the file:
   ```javascript
   let appSettings = {
       currency: 'GHS',
       currencySymbol: 'GH¢',
       exchangeRate: 1.0,
       bannerCostPerSqFt: 15.0,     // Default GHS cost per sqft for Banners / Custom
       stickerCostPerSqFt: 2.5,     // Default GHS cost per sqft for Stickers
       printAndCutCostPerSqFt: 5.0, // Default GHS cost per sqft for Print & Cut
       labelsA4Cost: 15.0,          // Default GHS cost for Labels A4
       labelsA3Cost: 25.0,          // Default GHS cost for Labels A3
       dtfA4Cost: 15.0,             // Default GHS cost for DTF A4
       dtfA3Cost: 25.0,             // Default GHS cost for DTF A3
       sublimationA4Cost: 15.0,     // Default GHS cost for Sublimation A4
       sublimationA3Cost: 25.0      // Default GHS cost for Sublimation A3
   };
   ```
3. Edit any of the numeric values on the right side of the colons (e.g. change `2.5` to `3.50` or `15.0` to `18.0`).
4. Save the file.

---

## 3. Recommended Tools for Quick Edits
You don't need any complex programming software to make these changes. You can open and edit these files using:
* **Visual Studio Code (VS Code)**: (Highly Recommended) Free, clean, and highlights lines in color for easy reading.
* **Sublime Text** or **Notepad++**: Lightweight and fast code editors.
* **Built-in System Editors**: Standard **Notepad** (on Windows) or **TextEdit** (on Mac). *Just make sure to save the files with their original extensions (`.html` or `.js`) and not as `.txt` files.*

---

## 4. Going Live with Your Edits
Because your website is composed of static HTML/CSS/JS files, going live after making an edit is incredibly simple:
1. Save your changes inside your folder.
2. Simply **Drag-and-drop the entire folder back onto Netlify** (or push/upload the edited files to your GitHub repository).
3. Your live website will update **instantly**!
