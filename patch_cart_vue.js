const fs = require('fs');
const filePath = '/Users/marquis/erranders/student/pages/cart.vue';
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(/discount \+\= 1000;/g, 'discount += (vendor.prepaidPromo && vendor.prepaidPromo.discountValue) ? vendor.prepaidPromo.discountValue : 1000;');
code = code.replace(/return discount \> 1000 \? 1000 \: discount;/g, 'return discount;');

fs.writeFileSync(filePath, code);
