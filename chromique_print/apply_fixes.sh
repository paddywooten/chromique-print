#!/bin/bash

# Apply fixes to staff_console.html (same as admin_console.html)
echo "Applying fixes to staff_console.html..."

# 1. Add popup blocker check to generateReceipt
sed -i 's/const receiptWindow = window.open.*$/const receiptWindow = window.open('\'''\''\'\'', '\''_blank'\'', '\''width=800,height=900'\'');\n            if (!receiptWindow) {\n                showToast('\''Popup blocked. Please allow popups to view receipts.'\'', '\''error'\'');\n                return;\n            }/' staff_console.html

# 2. Copy the fixed functions from admin to staff
# This is complex, so let's do it manually

echo "Manual fixes needed for staff_console.html - see admin_console.html for reference"
