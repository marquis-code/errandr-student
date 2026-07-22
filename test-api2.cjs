const axios = require('axios');
async function run() {
  try {
    const res = await axios.get('https://api.erranders.org/api/v1/menu/items/vendor/6a5d7e761fc745ed38497e26');
    console.log(JSON.stringify(res.data, null, 2));
  } catch (e) {
    console.error(e.message);
  }
}
run();
