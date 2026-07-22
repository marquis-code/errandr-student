const axios = require('axios');
async function run() {
  try {
    const res = await axios.get('https://api.erranders.org/api/v1/vendors/public');
    const iyabo = res.data.data.find(v => v.storeName.includes('Iyabo'));
    if (!iyabo) { console.log('Not found'); return; }
    console.log('Vendor:', iyabo._id, iyabo.businessType, iyabo.vendorType, iyabo.category);
    
    // check products API
    const products = await axios.get('https://api.erranders.org/api/v1/products/vendor/' + iyabo._id);
    console.log('Products:', JSON.stringify(products.data.data.slice(0, 2), null, 2));
    
  } catch (e) {
    console.error(e.message);
  }
}
run();
