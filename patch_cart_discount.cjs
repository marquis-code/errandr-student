const fs = require('fs');
const filePath = '/Users/marquis/erranders/student/pages/cart.vue';
let code = fs.readFileSync(filePath, 'utf8');

const injection = `
    // Check new prepaidPromo logic first
    if (vendor?.prepaidPromo?.enabled) {
      if (vendor.prepaidPromo.usedOrders < vendor.prepaidPromo.maxOrders) {
        if (subtotal >= vendor.prepaidPromo.budgetPerOrder) {
          let vendorDiscount = (vendor.prepaidPromo && vendor.prepaidPromo.discountValue) ? vendor.prepaidPromo.discountValue : 1000;
          // Ensure discount doesn't exceed subtotal to prevent negative totals
          if (vendorDiscount > subtotal) {
            vendorDiscount = subtotal;
          }
          discount += vendorDiscount;
          continue;
        }
      }
    }
`;

code = code.replace(/\/\/ Check new prepaidPromo logic first[\s\S]*?\}\n\s*\}\n\s*\}/, injection.trim());

fs.writeFileSync(filePath, code);
