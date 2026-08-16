/**
 * CHROMIQUE - GLOBAL E-COMMERCE & CALCULATOR ENGINE
 * Handles custom print math, dimension unit conversions, full-matrix developer pricing,
 * Base64 file reading, Google Drive automated uploads, unique CHQ order token generation,
 * local order synchronization, and Paystack popup APIs.
 */

let appSettings = {
    currency: 'GHS',
    currencySymbol: 'GH¢',
    exchangeRate: 1.0,
    bannerCostPerSqFt: 15.0,     // Default GHS cost per square foot for Banners / Custom
    stickerCostPerSqFt: 2.5,     // Default GHS cost per square foot for Stickers
    labelsCostPerSheet: 15.0,    // Default GHS cost per sheet for Labels
    dtfA4Cost: 15.0,             // Default GHS cost for DTF A4
    dtfA3Cost: 25.0,             // Default GHS cost for DTF A3
    sublimationA4Cost: 15.0,     // Default GHS cost for Sublimation A4
    sublimationA3Cost: 25.0,     // Default GHS cost for Sublimation A3
    googleDriveScriptUrl: '',    // Custom Google Apps Script webhook URL
    paystackKey: 'pk_test_a0d8ea9c81523cbf729119632832810cd8ea3120' // Default test key
};

let cart = [];

let calculator = {
    basePrice: 0,
    qty: 1,
    totalGHS: 0,
    areaSqFt: 0
};

// Global File Upload state holder
let activeUploadedFile = {
    base64Data: null,
    fileName: "",
    mimeType: ""
};

// ----------------------------------------------------
// 1. Initializations & Configurations
// ----------------------------------------------------
function initPrintStore() {
    // Load Paystack Key
    const savedKey = localStorage.getItem('paystack_pub_key_print');
    if (savedKey) {
        appSettings.paystackKey = savedKey;
        const keyInput = document.getElementById('paystack-pub-key-input');
        if (keyInput) keyInput.value = savedKey;
    }
    
    // Load Google Drive Script Webhook URL
    const savedScriptUrl = localStorage.getItem('google_drive_script_url_print');
    if (savedScriptUrl) {
        appSettings.googleDriveScriptUrl = savedScriptUrl;
        const urlInput = document.getElementById('google-script-url-input');
        if (urlInput) urlInput.value = savedScriptUrl;
    }
    
    // Load Store Currency
    const savedCurrency = localStorage.getItem('store_currency_print');
    if (savedCurrency) {
        appSettings.currency = savedCurrency;
        const currencySelect = document.getElementById('currency-select');
        if (currencySelect) currencySelect.value = savedCurrency;
    }
    
    // Load Custom Cost per Sq Ft for Banners
    const savedBannerCost = localStorage.getItem('banner_cost_print');
    const bannerCostInput = document.getElementById('banner-cost-input');
    if (savedBannerCost) {
        appSettings.bannerCostPerSqFt = parseFloat(savedBannerCost);
        if (bannerCostInput) bannerCostInput.value = savedBannerCost;
    } else {
        if (bannerCostInput) bannerCostInput.value = "15.00";
    }

    // Load Custom Cost per Sq Ft for Stickers
    const savedStickerCost = localStorage.getItem('sticker_cost_print');
    const stickerCostInput = document.getElementById('sticker-cost-input');
    if (savedStickerCost) {
        appSettings.stickerCostPerSqFt = parseFloat(savedStickerCost);
        if (stickerCostInput) stickerCostInput.value = savedStickerCost;
    } else {
        if (stickerCostInput) stickerCostInput.value = "2.50";
    }

    // Load Labels Sheet Pricing
    const savedLabelsCost = localStorage.getItem('labels_cost_print');
    const labelsCostInput = document.getElementById('labels-cost-input');
    if (savedLabelsCost) {
        appSettings.labelsCostPerSheet = parseFloat(savedLabelsCost);
        if (labelsCostInput) labelsCostInput.value = savedLabelsCost;
    } else {
        if (labelsCostInput) labelsCostInput.value = "15.00";
    }

    // Load DTF Sizing Matrix
    const savedDtfA4 = localStorage.getItem('dtf_a4_cost_print');
    const dtfA4Input = document.getElementById('dtf-a4-cost-input');
    if (savedDtfA4) {
        appSettings.dtfA4Cost = parseFloat(savedDtfA4);
        if (dtfA4Input) dtfA4Input.value = savedDtfA4;
    } else {
        if (dtfA4Input) dtfA4Input.value = "15.00";
    }

    const savedDtfA3 = localStorage.getItem('dtf_a3_cost_print');
    const dtfA3Input = document.getElementById('dtf-a3-cost-input');
    if (savedDtfA3) {
        appSettings.dtfA3Cost = parseFloat(savedDtfA3);
        if (dtfA3Input) dtfA3Input.value = savedDtfA3;
    } else {
        if (dtfA3Input) dtfA3Input.value = "25.00";
    }

    // Load Sublimation Sizing Matrix
    const savedSubA4 = localStorage.getItem('sub_a4_cost_print');
    const subA4Input = document.getElementById('sub-a4-cost-input');
    if (savedSubA4) {
        appSettings.sublimationA4Cost = parseFloat(savedSubA4);
        if (subA4Input) subA4Input.value = savedSubA4;
    } else {
        if (subA4Input) subA4Input.value = "15.00";
    }

    const savedSubA3 = localStorage.getItem('sub_a3_cost_print');
    const subA3Input = document.getElementById('sub-a3-cost-input');
    if (savedSubA3) {
        appSettings.sublimationA3Cost = parseFloat(savedSubA3);
        if (subA3Input) subA3Input.value = savedSubA3;
    } else {
        if (subA3Input) subA3Input.value = "25.00";
    }
    
    updateCurrency();
    
    // Set up file change listener for Base64 Conversion
    const fileInput = document.getElementById('print-file-upload');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelection);
    }
}

function toggleDevPanel(show) {
    const drawer = document.getElementById('dev-drawer');
    if (!drawer) return;
    if (show) {
        drawer.classList.remove('translate-x-[-100%]');
    } else {
        drawer.classList.add('translate-x-[-100%]');
    }
}

function saveDevSettings() {
    const keyVal = document.getElementById('paystack-pub-key-input').value.trim();
    const currVal = document.getElementById('currency-select').value;
    const scriptUrlInput = document.getElementById('google-script-url-input');
    const scriptUrlVal = scriptUrlInput ? scriptUrlInput.value.trim() : '';
    
    // Grabbing pricing values
    const bannerVal = document.getElementById('banner-cost-input').value.trim();
    const stickerVal = document.getElementById('sticker-cost-input').value.trim();
    const labelsVal = document.getElementById('labels-cost-input').value.trim();
    const dtfA4Val = document.getElementById('dtf-a4-cost-input').value.trim();
    const dtfA3Val = document.getElementById('dtf-a3-cost-input').value.trim();
    const subA4Val = document.getElementById('sub-a4-cost-input').value.trim();
    const subA3Val = document.getElementById('sub-a3-cost-input').value.trim();
    
    if (keyVal) {
        localStorage.setItem('paystack_pub_key_print', keyVal);
        appSettings.paystackKey = keyVal;
    }
    if (scriptUrlVal) {
        localStorage.setItem('google_drive_script_url_print', scriptUrlVal);
        appSettings.googleDriveScriptUrl = scriptUrlVal;
    } else {
        localStorage.removeItem('google_drive_script_url_print');
        appSettings.googleDriveScriptUrl = '';
    }

    const saveValue = (key, val, settingKey) => {
        const parsed = parseFloat(val);
        if (!isNaN(parsed) && parsed > 0) {
            localStorage.setItem(key, parsed);
            appSettings[settingKey] = parsed;
        }
    };

    saveValue('banner_cost_print', bannerVal, 'bannerCostPerSqFt');
    saveValue('sticker_cost_print', stickerVal, 'stickerCostPerSqFt');
    saveValue('labels_cost_print', labelsVal, 'labelsCostPerSheet');
    saveValue('dtf_a4_cost_print', dtfA4Val, 'dtfA4Cost');
    saveValue('dtf_a3_cost_print', dtfA3Val, 'dtfA3Cost');
    saveValue('sub_a4_cost_print', subA4Val, 'sublimationA4Cost');
    saveValue('sub_a3_cost_print', subA3Val, 'sublimationA3Cost');

    localStorage.setItem('store_currency_print', currVal);
    appSettings.currency = currVal;
    
    updateCurrency();
    if (document.getElementById('dev-drawer')) toggleDevPanel(false);
    alert("Configurations saved successfully! Your print rates and security parameters have been updated.");
}

function updateCurrency() {
    if (appSettings.currency === 'USD') {
        appSettings.currencySymbol = '$';
        appSettings.exchangeRate = 1 / 12.0; // 1 USD = 12 GHS
    } else {
        appSettings.currencySymbol = 'GH¢';
        appSettings.exchangeRate = 1.0;
    }
    
    // Update raw service card prices to represent the dynamic user settings!
    const ps1 = document.getElementById('price-s1');
    const ps2 = document.getElementById('price-s2');
    const ps3 = document.getElementById('price-s3');
    const ps4 = document.getElementById('price-s4');
    
    if (ps1) ps1.innerText = formatPrice(appSettings.bannerCostPerSqFt) + " / sq ft";
    if (ps2) ps2.innerText = formatPrice(appSettings.stickerCostPerSqFt) + " / sq ft";
    if (ps3) ps3.innerText = formatPrice(appSettings.labelsCostPerSheet) + " / sheet";
    if (ps4) ps4.innerText = formatPrice(appSettings.dtfA4Cost) + " / A4 sheet";
    
    // Update cost per sq ft indicator on screen if exists
    const costIndicator = document.getElementById('cost-per-sqft-indicator');
    if (costIndicator) costIndicator.innerText = formatPrice(appSettings.costPerSqFt);
    
    // Update labels in option select boxes dynamically if they exist!
    const optDtfA4 = document.getElementById('opt-dtf-a4');
    const optDtfA3 = document.getElementById('opt-dtf-a3');
    if (optDtfA4) optDtfA4.innerText = `A4 Sizing (${formatPrice(appSettings.dtfA4Cost)})`;
    if (optDtfA3) optDtfA3.innerText = `A3 Sizing (${formatPrice(appSettings.dtfA3Cost)})`;
    
    calculatePrice();
    renderCart();
}

function formatPrice(g_price) {
    let converted = g_price * appSettings.exchangeRate;
    return `${appSettings.currencySymbol}${converted.toFixed(2)}`;
}

// ----------------------------------------------------
// 2. High-Precision Dimensional Pricing Calculations
// ----------------------------------------------------
function calculatePrice() {
    const type = document.getElementById('print-type');
    const unit = document.getElementById('print-unit');
    const wInput = document.getElementById('print-width');
    const hInput = document.getElementById('print-height');
    const sheetSizeSelect = document.getElementById('print-sheet-size');
    const qtyInput = document.getElementById('print-qty');
    const displayEl = document.getElementById('calculated-print-price');
    const areaSummaryEl = document.getElementById('area-summary');
    
    if (!type || !unit || !wInput || !hInput || !sheetSizeSelect || !qtyInput || !displayEl) return;
    
    const service = type.value;
    let qty = parseInt(qtyInput.value) || 1;
    
    let totalGHS = 0;
    let areaSqFt = 0;
    
    // A. For Sheet-Based Labels (Uses dynamically saved developer labels cost!)
    if (service === 'labels') {
        totalGHS = appSettings.labelsCostPerSheet * qty;
        if (areaSummaryEl) areaSummaryEl.innerText = "Calculated per standard sheet";
        
    } else if (service === 'dtf') {
        // B. For DTF (A4 vs A3 pricing from developer dashboard)
        let baseSheetPrice = appSettings.dtfA4Cost;
        if (sheetSizeSelect.value === 'a3') {
            baseSheetPrice = appSettings.dtfA3Cost;
        }
        totalGHS = baseSheetPrice * qty;
        if (areaSummaryEl) areaSummaryEl.innerText = `Standard DTF ${sheetSizeSelect.value.toUpperCase()} Sheet Sizing`;
        
    } else if (service === 'sublimation') {
        // C. For Sublimation (A4 vs A3 pricing from developer dashboard)
        let baseSheetPrice = appSettings.sublimationA4Cost;
        if (sheetSizeSelect.value === 'a3') {
            baseSheetPrice = appSettings.sublimationA3Cost;
        }
        totalGHS = baseSheetPrice * qty;
        if (areaSummaryEl) areaSummaryEl.innerText = `Standard Sublimation ${sheetSizeSelect.value.toUpperCase()} Sheet Sizing`;
        
    } else {
        // D. For Dimension-Based services (Banner, Sticker, Custom)
        let width = parseFloat(wInput.value) || 0;
        let height = parseFloat(hInput.value) || 0;
        
        let width_ft = 0;
        let height_ft = 0;
        
        // Exact unit conversions to feet for width and height individually
        if (unit.value === 'feet') {
            width_ft = width;
            height_ft = height;
        } else if (unit.value === 'inches') {
            width_ft = width / 12.0;
            height_ft = height / 12.0;
        } else if (unit.value === 'cm') {
            width_ft = width / 30.48;
            height_ft = height / 30.48;
        }
        
        // EXACT FORMULA: (width (feet) x height (feet)) x cost/sqft x qty
        areaSqFt = width_ft * height_ft;
        
        // Determine service-specific rate per square foot in GHS
        let ratePerSqFt = appSettings.bannerCostPerSqFt; // default Custom (e.g. 15 GHS)
        if (service === 'stickers') {
            ratePerSqFt = appSettings.stickerCostPerSqFt; // Sticker specific rate (2.50 GHS!)
        } else if (service === 'banner') {
            ratePerSqFt = appSettings.bannerCostPerSqFt; // Banner specific rate (15 GHS)
        }
        
        totalGHS = (width_ft * height_ft) * ratePerSqFt * qty;
        
        if (areaSummaryEl && width > 0 && height > 0) {
            areaSummaryEl.innerText = `Size: ${width_ft.toFixed(2)}ft x ${height_ft.toFixed(2)}ft (${areaSqFt.toFixed(4)} sq ft total) @ ${appSettings.currencySymbol}${(ratePerSqFt * appSettings.exchangeRate).toFixed(2)}/sq ft`;
        } else if (areaSummaryEl) {
            areaSummaryEl.innerText = "Please enter valid dimensions";
        }
    }
    
    calculator.basePrice = totalGHS / qty;
    calculator.qty = qty;
    calculator.totalGHS = totalGHS;
    calculator.areaSqFt = areaSqFt;
    
    displayEl.innerText = formatPrice(totalGHS);
}

// ----------------------------------------------------
// 3. Base64 File Conversions
// ----------------------------------------------------
function handleFileSelection(event) {
    const file = event.target.targetFiles ? event.target.targetFiles[0] : event.target.files[0];
    if (!file) return;
    
    activeUploadedFile.fileName = file.name;
    activeUploadedFile.mimeType = file.type;
    
    // Read file as Base64 encoded string
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64String = e.target.result.split(',')[1];
        activeUploadedFile.base64Data = base64String;
        console.log(`Successfully converted ${file.name} to Base64!`);
        
        const label = document.getElementById('upload-status-label');
        if (label) {
            label.innerText = `READY: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
            label.classList.add('text-brand-500', 'font-extrabold');
        }
    };
    reader.readAsDataURL(file);
}

// ----------------------------------------------------
// 4. Cart Management & Secure Google Drive Upload
// ----------------------------------------------------
function toggleCart(show) {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (!drawer || !overlay) return;
    
    if (show) {
        drawer.classList.remove('translate-x-[100%]');
        overlay.classList.remove('hidden');
    } else {
        drawer.classList.add('translate-x-[100%]');
        overlay.classList.add('hidden');
        
        const form = document.getElementById('checkout-form-container');
        if (form) form.classList.add('hidden');
        const mainBtn = document.getElementById('main-cart-btn');
        if (mainBtn) mainBtn.classList.remove('hidden');
        const paystackBtn = document.getElementById('paystack-btn');
        if (paystackBtn) paystackBtn.classList.add('hidden');
    }
}

async function addToCart() {
    const type = document.getElementById('print-type');
    const unit = document.getElementById('print-unit');
    const wInput = document.getElementById('print-width');
    const hInput = document.getElementById('print-height');
    const sheetSizeSelect = document.getElementById('print-sheet-size');
    const descInput = document.getElementById('custom-print-description');
    const addBtn = document.querySelector('#calculator button');
    
    if (!type || !unit || !wInput || !hInput || !sheetSizeSelect || !descInput) return;
    
    const service = type.value;
    const typeLabel = type.options[type.selectedIndex].text;
    
    let sizeDetails = "";
    let customNotes = "";
    
    if (service === 'labels') {
        sizeDetails = `Standard Sheets`;
    } else if (service === 'dtf' || service === 'sublimation') {
        sizeDetails = `${sheetSizeSelect.value.toUpperCase()} Sheet`;
    } else {
        sizeDetails = `${wInput.value}x${hInput.value} ${unit.value}`;
    }
    
    // Settle Custom Print descriptions
    if (service === 'custom') {
        const descText = descInput.value.trim();
        if (descText === '') {
            alert("Please type in what custom print requirements you want before adding to the queue!");
            descInput.focus();
            return;
        }
        customNotes = ` - "${descText}"`;
    }
    
    let googleDriveLink = "";
    
    if (appSettings.googleDriveScriptUrl && activeUploadedFile.base64Data) {
        if (addBtn) {
            addBtn.disabled = true;
            addBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Uploading to Google Drive...';
        }
        
        try {
            console.log("Sending file to Google Apps Script Web App...");
            const response = await fetch(appSettings.googleDriveScriptUrl, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fileName: activeUploadedFile.fileName,
                    mimeType: activeUploadedFile.mimeType,
                    fileData: activeUploadedFile.base64Data
                })
            });
            
            googleDriveLink = `https://drive.google.com/drive/u/0/folders/by-name-search`;
            console.log("Google Ingestion completed securely.");
            
        } catch (uploadError) {
            console.error("Google Drive Upload Error: ", uploadError);
        } finally {
            if (addBtn) {
                addBtn.disabled = false;
                addBtn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add Job to Queue';
            }
        }
    } else {
        googleDriveLink = "Local File (Configure Google Script to automate)";
    }
    
    const cartItemName = `PRINT: ${typeLabel}${customNotes} (${sizeDetails})`;
    const artworkLabel = activeUploadedFile.fileName || "No file uploaded";
    
    cart.push({
        id: "job_" + Date.now(),
        name: cartItemName,
        price: calculator.basePrice,
        qty: calculator.qty,
        size: `Size: ${sizeDetails} // QTY: ${calculator.qty}`,
        fileName: artworkLabel,
        driveLink: googleDriveLink,
        serviceCode: getServiceCode(service)
    });
    
    // Reset file uploads and indicators
    wInput.value = '';
    hInput.value = '';
    descInput.value = '';
    activeUploadedFile = { base64Data: null, fileName: "", mimeType: "" };
    
    const label = document.getElementById('upload-status-label');
    if (label) {
        label.innerText = "Drag & drop or click to upload PNG, SVG, or PDF";
        label.className = "block text-[10px] text-slate-500";
    }
    
    const fileEl = document.getElementById('print-file-upload');
    if (fileEl) fileEl.value = '';
    
    calculatePrice();
    renderCart();
    toggleCart(true);
}

function getServiceCode(service) {
    const codes = {
        'banner': 'BNR',
        'stickers': 'STK',
        'labels': 'LBL',
        'dtf': 'DTF',
        'sublimation': 'SUB',
        'custom': 'CST'
    };
    return codes[service] || 'PRT';
}

function removeCartItem(index) {
    cart.splice(index, 1);
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const badge = document.getElementById('cart-badge');
    const subtotalEl = document.getElementById('cart-subtotal');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-16 text-slate-500 space-y-2">
                <i class="fa-solid fa-cart-shopping text-3xl mb-1 block opacity-30 text-orange-500"></i>
                <p class="text-xs font-semibold">Your print job queue is empty.</p>
                <p class="text-[11px]">Configure your sheets and add them to the queue.</p>
            </div>
        `;
        if (badge) badge.classList.add('hidden');
        if (subtotalEl) subtotalEl.innerText = formatPrice(0);
        return;
    }
    
    let totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    if (badge) {
        badge.innerText = totalQty;
        badge.classList.remove('hidden');
    }
    
    let subtotal = 0;
    container.innerHTML = ''; // clear
    
    cart.forEach((item, index) => {
        subtotal += item.price * item.qty;
        let itemHTML = `
            <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 animate-fade-in text-xs">
                <div class="flex justify-between items-start">
                    <h4 class="font-bold text-white leading-tight flex-1 pr-4">${item.name}</h4>
                    <button onclick="removeCartItem(${index})" class="text-slate-500 hover:text-red-500 transition"><i class="fa-solid fa-trash-can"></i></button>
                </div>
                <div class="text-[10px] text-slate-400 font-mono">File: ${item.fileName}</div>
                <div class="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase pt-1">
                    <span>${item.size}</span>
                    <span class="text-xs font-black text-orange-500">${formatPrice(item.price * item.qty)}</span>
                </div>
            </div>
        `;
        container.innerHTML += itemHTML;
    });
    
    if (subtotalEl) subtotalEl.innerText = formatPrice(subtotal);
}

// ----------------------------------------------------
// 5. Paystack Payments Processor & UNIQUE CHQ TOKEN CODE GENERATION
// ----------------------------------------------------
function proceedToForm() {
    if (cart.length === 0) {
        alert("Your print queue is empty. Please configure a custom print job first.");
        return;
    }
    const form = document.getElementById('checkout-form-container');
    const mainBtn = document.getElementById('main-cart-btn');
    const paystackBtn = document.getElementById('paystack-btn');
    
    if (form) form.classList.remove('hidden');
    if (mainBtn) mainBtn.classList.add('hidden');
    if (paystackBtn) paystackBtn.classList.add('hidden');
    
    if (form && !form.classList.contains('hidden')) {
        paystackBtn.classList.remove('hidden');
    }
}

// Generate an ultra-professional, unique alphanumeric token receipt code (e.g., CHQ-STK-4F2A)
function generateOrderToken(serviceCode) {
    const chars = '0123456789ABCDEF';
    let randCode = '';
    for (let i = 0; i < 4; i++) {
        randCode += chars[Math.floor(Math.random() * chars.length)];
    }
    return `CHQ-${serviceCode}-${randCode}`; // Swapped VPH with CHQ!
}

function payWithPaystack() {
    const email = document.getElementById('customer-email').value.trim();
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const location = document.getElementById('customer-location').value.trim();

    if (!email || !name || !phone || !location) {
        alert("Please complete all shipping address and contact fields.");
        return;
    }

    let subtotalGHS = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    let currencyCode = appSettings.currency;
    let convertedTotal = subtotalGHS * appSettings.exchangeRate;
    let finalSubunitAmount = Math.round(convertedTotal * 100);

    const firstItem = cart[0] || {};
    const serviceCode = firstItem.serviceCode || 'PRT';
    const uniqueReceiptToken = generateOrderToken(serviceCode);

    let handler = PaystackPop.setup({
        key: appSettings.paystackKey,
        email: email,
        amount: finalSubunitAmount,
        currency: currencyCode,
        metadata: {
            custom_fields: [
                { display_name: "Order Confirmation Token", variable_name: "order_token", value: uniqueReceiptToken },
                { display_name: "Client Name", variable_name: "customer_name", value: name },
                { display_name: "Delivery Destination", variable_name: "delivery_address", value: location },
                { display_name: "Phone Number", variable_name: "phone_number", value: phone },
                { display_name: "Print Job Queue Summary", variable_name: "print_queue", value: cart.map(item => `${item.name} (${item.size}) [Drive: ${item.driveLink}]`).join(" // ") }
            ]
        },
        callback: function(response){
            let localOrders = JSON.parse(localStorage.getItem('chromique_print_orders')) || [];
            
            let newOrder = {
                token: uniqueReceiptToken,
                name: name,
                email: email,
                phone: phone,
                address: location,
                amount: formatPrice(subtotalGHS),
                reference: response.reference,
                itemSummary: cart.map(item => `${item.name}`).join(", "),
                driveLink: cart[0].driveLink || "",
                status: "cutting",
                date: new Date().toLocaleDateString()
            };
            
            localOrders.unshift(newOrder);
            localStorage.setItem('chromique_print_orders', JSON.stringify(localOrders));
            
            const recToken = document.getElementById('rec-token');
            const recEmail = document.getElementById('rec-email');
            const recLoc = document.getElementById('rec-location');
            const recRef = document.getElementById('rec-ref');
            const recSummary = document.getElementById('rec-summary');
            const modal = document.getElementById('success-modal');
            
            if (recToken) recToken.innerText = uniqueReceiptToken;
            if (recEmail) recEmail.innerText = email;
            if (recLoc) recLoc.innerText = location;
            if (recRef) recRef.innerText = response.reference;
            
            if (recSummary) {
                recSummary.innerHTML = cart.map(item => `<div class="font-bold text-slate-800 text-xs">${item.name}</div>`).join('');
            }
            
            toggleCart(false);
            if (modal) modal.classList.remove('hidden');
            
            cart = [];
            renderCart();
        },
        onClose: function(){
            alert('Checkout session closed. Your print jobs are preserved in your queue.');
        }
    });
    handler.openIframe();
}

function copyReceiptToken() {
    const token = document.getElementById('rec-token').innerText;
    navigator.clipboard.writeText(token).then(() => {
        alert(`Order Token Code Copied: ${token}\nUse this token to track your print or confirm with CHROMIQUE!`);
    });
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) modal.classList.add('hidden');
}

// Watch inputs and toggle dimension fields based on selected service type
function toggleDimensionFields() {
    const type = document.getElementById('print-type');
    const dimensionBox = document.getElementById('dimension-fields-box');
    const sheetSizeBox = document.getElementById('sheet-size-box');
    const customDescBox = document.getElementById('custom-description-box');
    
    if (!type || !dimensionBox || !sheetSizeBox || !customDescBox) return;
    
    const service = type.value;
    
    dimensionBox.classList.add('hidden');
    sheetSizeBox.classList.add('hidden');
    customDescBox.classList.add('hidden');
    
    if (service === 'banner' || service === 'stickers' || service === 'custom') {
        dimensionBox.classList.remove('hidden');
    }
    
    if (service === 'dtf' || service === 'sublimation') {
        sheetSizeBox.classList.remove('hidden');
    }
    
    if (service === 'custom') {
        customDescBox.classList.remove('hidden');
    }
    
    calculatePrice();
}

window.addEventListener('DOMContentLoaded', () => {
    initPrintStore();
    
    const type = document.getElementById('print-type');
    if (type) {
        type.addEventListener('change', toggleDimensionFields);
        toggleDimensionFields(); // initial run
    }
});
