# 🔑 Owner's Edit Guide: Customizing Your Code & Passcodes
*A simple, quick-reference guide for Patrick to manually change the passcode and default prices inside the code.*

---

## 1. How to Change Your Admin Passcode (PIN)
If you want to change your passcode from **`2026`** to any other custom password or pin:

### Step-by-Step:
1. Open the file **`print_admin_dashboard.html`** in any text editor (like Notepad, TextEdit, or VS Code).
2. Scroll all the way down to the very bottom of the file (around line 185) where you see the `<script>` tag.
3. Locate this exact line:
   ```javascript
   const ADMIN_PASSCODE = "2026";
   ```
4. Change `"2026"` to your new desired passcode inside the quotation marks. For example:
   ```javascript
   const ADMIN_PASSCODE = "Venture777";
   ```
5. Save the file. **That's it!** The next time you open your dashboard, the page will require your new passcode.

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
       bannerCostPerSqFt: 15.0,     // Default GHS cost per sqft for Banners
       stickerCostPerSqFt: 12.0,    // Default GHS cost per sqft for Stickers
       labelsCostPerSheet: 15.0,    // Default GHS cost per sheet for Labels
       dtfA4Cost: 15.0,             // Default GHS cost for DTF A4
       dtfA3Cost: 25.0,             // Default GHS cost for DTF A3
       sublimationA4Cost: 15.0,     // Default GHS cost for Sublimation A4
       sublimationA3Cost: 25.0,     // Default GHS cost for Sublimation A3
       paystackKey: 'pk_test_a0d8ea9c81523cbf729119632832810cd8ea3120'
   };
   ```
3. Edit any of the numeric values on the right side of the colons (e.g. change `12.0` to `13.50` or `15.0` to `18.0`).
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
