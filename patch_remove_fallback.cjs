const fs = require('fs');
const filePath = '/Users/marquis/erranders/student/pages/cart.vue';
let code = fs.readFileSync(filePath, 'utf8');

const oldLogicRegex = /\/\/ Fallback old logic[\s\S]*?discount \+= vendorDiscount;\n\s*\}\n\s*\}\n\s*\}/g;

code = code.replace(oldLogicRegex, '// Fallback old logic removed to prevent bug');

fs.writeFileSync(filePath, code);
