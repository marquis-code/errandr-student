export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', async (html, { event }) => {
    const host = getRequestHeader(event, 'host') || '';
    
    // Ignore vercel deployments (default domains)
    if (host.includes('vercel.app')) return;
    
    const parts = host.split('.');
    const isLocalhost = host === 'localhost' || host === '127.0.0.1' || host.startsWith('localhost:');
    const hasSubdomain = parts.length >= 3 || (parts.length >= 2 && parts[parts.length - 1].includes('localhost'));
    
    if (!isLocalhost && hasSubdomain && !['www', 'student', 'vendor', 'errandr-student'].includes(parts[0])) {
      const subdomain = parts[0];
      try {
        const config = useRuntimeConfig();
        const apiBase = config.public.apiBase || 'https://api.erranders.org';
        const res = await fetch(`${apiBase}/vendors/subdomain/${subdomain}`);
        
        if (res.ok) {
          const vendor = await res.json();
          const title = `${vendor.storeName} - Errander`;
          const description = vendor.description || 'Order food and groceries from your favorite campus vendors.';
          const image = vendor.logo || vendor.banner || 'https://erranders.org/og-image.jpg';
          
          // These tags will be injected before </head>
          const metaTags = [
            `<meta property="og:title" content="${title}">`,
            `<meta property="og:description" content="${description}">`,
            `<meta property="og:image" content="${image}">`,
            `<meta property="og:type" content="website">`,
            `<meta name="twitter:title" content="${title}">`,
            `<meta name="twitter:description" content="${description}">`,
            `<meta name="twitter:image" content="${image}">`
          ];
          
          html.head.push(...metaTags);
        }
      } catch (err) {
        console.error('Error fetching vendor for OG tags:', err);
      }
    }
  });
});
