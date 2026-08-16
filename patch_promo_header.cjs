const fs = require('fs');
const filePath = '/Users/marquis/erranders/student/components/core/PromoCarousel.vue';
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(/from-violet-600 via-fuchsia-600 to-orange-500/g, 'from-red-600 to-orange-500');

fs.writeFileSync(filePath, code);
