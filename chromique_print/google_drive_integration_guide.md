# 📁 Secure Google Drive Automation Guide: Chromique Print
*A 100% free, automated, and secure way to transfer customer uploads directly into your Google Drive!*

To let your clients upload high-resolution files and have them transfer **automatically** into your Google Drive (linked with their order details) without exposing your private Google password or API keys to the public, we utilize a **Google Apps Script Web App**.

This service is **100% free**, hosted directly by Google inside your Google account, and requires no monthly server fees!

---

## How It Works Behind the Scenes:
1. When a client adds their print job, the website converts their uploaded file into a secure digital string (Base64).
2. On checkout, the site sends this file along with the order details (Name, Email, Size, Reference) to your private Google Apps Script.
3. Google Apps Script securely creates a folder named **"Chromique Print Orders"** in your Google Drive, saves the file inside, and names it (e.g., `Kofi_Boateng_labels_artwork.pdf`).
4. Google returns a secure **Google Drive View/Download Link** of that file back to your website.
5. This link is saved so when you log into your **Admin Dashboard (`print_admin_dashboard.html`)**, the order row automatically displays an active, clickable link to open and download the file directly from your Google Drive!

---

## 🛠️ Step-by-Step Google Drive Setup (Only Takes 3 Minutes)

### Step 1: Create Your Google Apps Script
1. Go to your [Google Drive](https://drive.google.com/) and make sure you are signed in.
2. Click **New > More > Google Apps Script** (If you don't see it, go to [script.google.com](https://script.google.com/) and click "New Project").
3. Delete any default code in the editor, and **copy & paste** the following code block:

```javascript
/**
 * CHROMIQUE PRINT - AUTOMATED GOOGLE DRIVE FILE INGESTION
 * Securely receives artwork files and metadata, saves them to Drive, and returns download links.
 */
function doPost(e) {
  try {
    // Parse incoming data package
    var data = JSON.parse(e.postData.contents);
    
    // Find or create a designated master folder in your Google Drive
    var folderName = "Chromique Print Orders";
    var folders = DriveApp.getFoldersByName(folderName);
    var targetFolder;
    
    if (folders.hasNext()) {
      targetFolder = folders.next();
    } else {
      targetFolder = DriveApp.createFolder(folderName);
    }
    
    // Decode the Base64 file string
    var contentType = data.mimeType;
    var decodedFile = Utilities.base64Decode(data.fileData);
    var blob = Utilities.newBlob(decodedFile, contentType, data.fileName);
    
    // Save file directly inside your folder
    var savedFile = targetFolder.createFile(blob);
    
    // Enable "Anyone with link can view" permission so you can open it from your dashboard
    savedFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Get the direct Google Drive URL
    var fileUrl = savedFile.getUrl();
    var downloadUrl = savedFile.getDownloadUrl();
    
    // Return the secure Google Drive links back to your website
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      fileUrl: fileUrl,
      downloadUrl: downloadUrl,
      message: "File successfully saved to Google Drive folder!"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

### Step 2: Deploy Your Script as a Web App
For your website to communicate with your Google script, you must publish it:
1. In the top right corner of the Google Apps Script screen, click the blue **Deploy** button and select **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configure these exact settings:
   * **Description**: `Chromique Print Ingestion API`
   * **Execute as**: **`Me (your_email@gmail.com)`** *(This gives the script permission to write to your Drive)*
   * **Who has access**: **`Anyone`** *(This allows the website to securely send client files)*
4. Click **Deploy**.
5. Google will pop up a window asking you to **"Authorize Access"**. Click *Authorize*, select your Google account, click *Advanced* (at the bottom), and click *Go to Untitled project (unsafe)* to grant write permissions.
6. Once deployed, Google will display a **Web App URL** (looks like `https://script.google.com/macros/s/AKfycb.../exec`).
7. **Copy this Web App URL!**

---

### Step 3: Connect It to Your Storefront
Now, paste your Google Web App URL into your **Developer Setup Drawer** (or edit the variable in your code) and your entire system is completely automated!

1. Open your print shop homepage (`print_index.html`) locally.
2. Click the floating **Setup Paystack & Pricing Matrix** button in the bottom-left corner.
3. You will see a new input field: **`Google Apps Script Web App URL`**.
4. Paste your copied Google Web App URL, and click **Save Configuration**.

**Boom!** Your site is now fully integrated with Google Drive. Customer uploads will automatically fly straight into your Google Drive, and their file download links will populate your private Admin Console orders table automatically!
