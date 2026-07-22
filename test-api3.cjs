const axios = require('axios');
async function run() {
  try {
    const res = await axios.get('https://api.erranders.org/api/v1/vendors/public');
    const iyabo = res.data.data.find(v => v.storeName.includes('Iyabo'));
    console.log('Vendor:', iyabo._id, iyabo.businessType, iyabo.vendorType, iyabo.category);
    
    const items = await axios.get('https://api.erranders.org/api/v1/menu/items/vendor/' + iyabo._id);
    console.log('Menu Items:', JSON.stringify(items.data, null, 2));
    
  } catch (e) {
    console.error(e.message);
  }
}
run();
