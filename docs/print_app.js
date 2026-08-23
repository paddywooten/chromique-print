/**
 * CHROMIQUE - GLOBAL CALCULATOR & SETTINGS ENGINE
 * Handles custom print math, dimension unit conversions, full-matrix developer pricing,
 * quote hand-off to the MoMo payment page, and shared UI helpers (toasts, mobile menu,
 * scroll-to-top). Used by the storefront, admin dashboard, and staff console.
 */

let appSettings = {
    currency: 'GHS',
    currencySymbol: 'GH¢',
    exchangeRate: 1.0,
    bannerCostPerSqFt: 15.0,     // Default GHS cost per square foot for Banners / Custom
    stickerCostPerSqFt: 2.5,     // Default GHS cost per square foot for Stickers
    printAndCutCostPerSqFt: 5.0, // Default GHS cost per square foot for Print & Cut
    labelsA4Cost: 15.0,          // Default GHS cost for Labels A4
    labelsA3Cost: 25.0,          // Default GHS cost for Labels A3
    dtfA4Cost: 15.0,             // Default GHS cost for DTF A4
    dtfA3Cost: 25.0,             // Default GHS cost for DTF A3
    sublimationA4Cost: 15.0,     // Default GHS cost for Sublimation A4
    sublimationA3Cost: 25.0,     // Default GHS cost for Sublimation A3
    googleDriveScriptUrl: '',    // Custom Google Apps Script webhook URL
};

let calculator = {
    qty: 1,
    totalGHS: 0
};

// ----------------------------------------------------
// Toast Notification System
// ----------------------------------------------------
function showToast(message, type = 'success') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-bold text-sm transition-all duration-300 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
    }`;
    
    // Add icon based on type
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    
    toast.innerHTML = `<i class="fa-solid ${icon} mr-2"></i>${message}`;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ----------------------------------------------------
// 1. Initializations & Configurations
// ----------------------------------------------------
function initPrintStore() {
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

    // Load Custom Cost per Sq Ft for Print & Cut
    const savedPrintAndCutCost = localStorage.getItem('print_and_cut_cost_print');
    const printAndCutCostInput = document.getElementById('print-and-cut-cost-input');
    if (savedPrintAndCutCost) {
        appSettings.printAndCutCostPerSqFt = parseFloat(savedPrintAndCutCost);
        if (printAndCutCostInput) printAndCutCostInput.value = savedPrintAndCutCost;
    } else {
        if (printAndCutCostInput) printAndCutCostInput.value = "5.00";
    }

    // Load Labels Sheet Pricing
    const savedLabelsA4 = localStorage.getItem('labels_a4_cost_print');
    const labelsA4Input = document.getElementById('labels-a4-cost-input');
    if (savedLabelsA4) {
        appSettings.labelsA4Cost = parseFloat(savedLabelsA4);
        if (labelsA4Input) labelsA4Input.value = savedLabelsA4;
    } else {
        if (labelsA4Input) labelsA4Input.value = "15.00";
    }

    const savedLabelsA3 = localStorage.getItem('labels_a3_cost_print');
    const labelsA3Input = document.getElementById('labels-a3-cost-input');
    if (savedLabelsA3) {
        appSettings.labelsA3Cost = parseFloat(savedLabelsA3);
        if (labelsA3Input) labelsA3Input.value = savedLabelsA3;
    } else {
        if (labelsA3Input) labelsA3Input.value = "25.00";
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
}

function saveDevSettings() {
    const currVal = document.getElementById('currency-select').value;
    const scriptUrlInput = document.getElementById('google-script-url-input');
    const scriptUrlVal = scriptUrlInput ? scriptUrlInput.value.trim() : '';
    
    // Grabbing pricing values
    const bannerVal = document.getElementById('banner-cost-input').value.trim();
    const stickerVal = document.getElementById('sticker-cost-input').value.trim();
    const printAndCutVal = document.getElementById('print-and-cut-cost-input') ? document.getElementById('print-and-cut-cost-input').value.trim() : '';
    const labelsA4Val = document.getElementById('labels-a4-cost-input').value.trim();
    const labelsA3Val = document.getElementById('labels-a3-cost-input').value.trim();
    const dtfA4Val = document.getElementById('dtf-a4-cost-input').value.trim();
    const dtfA3Val = document.getElementById('dtf-a3-cost-input').value.trim();
    const subA4Val = document.getElementById('sub-a4-cost-input').value.trim();
    const subA3Val = document.getElementById('sub-a3-cost-input').value.trim();
    
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
    saveValue('print_and_cut_cost_print', printAndCutVal, 'printAndCutCostPerSqFt');
    saveValue('labels_a4_cost_print', labelsA4Val, 'labelsA4Cost');
    saveValue('labels_a3_cost_print', labelsA3Val, 'labelsA3Cost');
    saveValue('dtf_a4_cost_print', dtfA4Val, 'dtfA4Cost');
    saveValue('dtf_a3_cost_print', dtfA3Val, 'dtfA3Cost');
    saveValue('sub_a4_cost_print', subA4Val, 'sublimationA4Cost');
    saveValue('sub_a3_cost_print', subA3Val, 'sublimationA3Cost');

    localStorage.setItem('store_currency_print', currVal);
    appSettings.currency = currVal;
    
    updateCurrency();
    
    // Log the activity
    if (typeof logActivity === 'function') {
        const manager = sessionStorage.getItem('chromique_logged_in_manager') || 'Unknown';
        logActivity('SAVE_SETTINGS', `Updated pricing matrix: Banner GH¢${bannerVal}/sqft, Sticker GH¢${stickerVal}/sqft, Print&Cut GH¢${printAndCutVal}/sqft`);
        if (typeof loadActivityLog === 'function') {
            loadActivityLog();
        }
        showToast(`Configurations saved by ${manager}!`, 'success');
    } else {
        showToast('Configurations saved! Print rates updated.', 'success');
    }
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
    if (ps3) ps3.innerText = formatPrice(appSettings.labelsA4Cost) + " / A4 sheet";
    if (ps4) ps4.innerText = formatPrice(appSettings.dtfA4Cost) + " / A4 sheet";
    
    const ps5 = document.getElementById('price-s5');
    if (ps5) ps5.innerText = formatPrice(appSettings.printAndCutCostPerSqFt) + " / sq ft";
    

    
    // Update labels in option select boxes dynamically if they exist!
    const optDtfA4 = document.getElementById('opt-dtf-a4');
    const optDtfA3 = document.getElementById('opt-dtf-a3');
    if (optDtfA4) optDtfA4.innerText = `A4 Sizing (${formatPrice(appSettings.dtfA4Cost)})`;
    if (optDtfA3) optDtfA3.innerText = `A3 Sizing (${formatPrice(appSettings.dtfA3Cost)})`;
    
    calculatePrice();
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
    
    // Validate quantity
    if (qty < 1) {
        qty = 1;
        qtyInput.value = 1;
    }
    if (qty > 1000) {
        qty = 1000;
        qtyInput.value = 1000;
        showToast('Maximum quantity is 1000', 'warning');
    }
    
    let totalGHS = 0;
    let areaSqFt = 0;
    
    // A. For Sheet-Based Labels (Uses A4/A3 sheet pricing)
    if (service === 'labels') {
        let baseSheetPrice = appSettings.labelsA4Cost;
        if (sheetSizeSelect.value === 'a3') {
            baseSheetPrice = appSettings.labelsA3Cost;
        }
        totalGHS = baseSheetPrice * qty;
        if (areaSummaryEl) areaSummaryEl.innerText = `Standard Labels ${sheetSizeSelect.value.toUpperCase()} Sheet Sizing`;
        
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
        
        // Validate dimensions
        if (width < 0) {
            width = 0;
            wInput.value = 0;
        }
        if (height < 0) {
            height = 0;
            hInput.value = 0;
        }
        if (width > 100) {
            width = 100;
            wInput.value = 100;
            showToast('Maximum width is 100 feet', 'warning');
        }
        if (height > 100) {
            height = 100;
            hInput.value = 100;
            showToast('Maximum height is 100 feet', 'warning');
        }
        
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
        } else if (service === 'print_and_cut') {
            ratePerSqFt = appSettings.printAndCutCostPerSqFt; // Print & Cut specific rate (5 GHS)
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
    
    calculator.qty = qty;
    calculator.totalGHS = totalGHS;
    
    displayEl.innerText = formatPrice(totalGHS);
}

// ----------------------------------------------------
// 3. Quote Hand-off & Page Wiring
// ----------------------------------------------------

// Save current calculator quote to sessionStorage for MoMo payment page
function saveQuoteToSession() {
    const type = document.getElementById('print-type');
    const unit = document.getElementById('print-unit');
    const wInput = document.getElementById('print-width');
    const hInput = document.getElementById('print-height');
    const qtyInput = document.getElementById('print-qty');
    const displayEl = document.getElementById('calculated-print-price');
    const areaSummaryEl = document.getElementById('area-summary');

    const quote = {
        service: type ? type.options[type.selectedIndex].text : 'N/A',
        serviceValue: type ? type.value : '',
        unit: unit ? unit.value : '',
        width: wInput ? wInput.value : '',
        height: hInput ? hInput.value : '',
        qty: qtyInput ? qtyInput.value : '1',
        totalPrice: displayEl ? displayEl.innerText : '',
        areaSummary: areaSummaryEl ? areaSummaryEl.innerText : '',
        timestamp: new Date().toISOString()
    };

    sessionStorage.setItem('chromique_momo_quote', JSON.stringify(quote));
}

// Preselect a service in the calculator (used by the clickable service cards)
function selectService(code) {
    const type = document.getElementById('print-type');
    if (!type) return;
    type.value = code;
    toggleDimensionFields();
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
    
    if (service === 'banner' || service === 'stickers' || service === 'print_and_cut' || service === 'custom') {
        dimensionBox.classList.remove('hidden');
    }
    
    if (service === 'dtf' || service === 'sublimation' || service === 'labels') {
        sheetSizeBox.classList.remove('hidden');
        
        // Update option text based on service type
        const optA4 = document.getElementById('opt-dtf-a4');
        const optA3 = document.getElementById('opt-dtf-a3');
        
        if (service === 'dtf') {
            if (optA4) optA4.innerText = `A4 Sheet Sizing (${formatPrice(appSettings.dtfA4Cost)})`;
            if (optA3) optA3.innerText = `A3 Sheet Sizing (${formatPrice(appSettings.dtfA3Cost)})`;
        } else if (service === 'sublimation') {
            if (optA4) optA4.innerText = `A4 Sheet Sizing (${formatPrice(appSettings.sublimationA4Cost)})`;
            if (optA3) optA3.innerText = `A3 Sheet Sizing (${formatPrice(appSettings.sublimationA3Cost)})`;
        } else if (service === 'labels') {
            if (optA4) optA4.innerText = `A4 Sheet Sizing (${formatPrice(appSettings.labelsA4Cost)})`;
            if (optA3) optA3.innerText = `A3 Sheet Sizing (${formatPrice(appSettings.labelsA3Cost)})`;
        }
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
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.className = 'fa-solid fa-bars text-xl';
            } else {
                icon.className = 'fa-solid fa-xmark text-xl';
            }
        });
        
        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.querySelector('i').className = 'fa-solid fa-bars text-xl';
            });
        });
    }
    
    // Scroll to top button
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
