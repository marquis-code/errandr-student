export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const host = window.location.hostname
    
    // Ensure we only process subdomains if it's not a localhost dev URL without one,
    // and not the main domain or common subdomains like 'www'
    const parts = host.split('.')
    const isLocalhost = host === 'localhost' || host === '127.0.0.1'
    const hasSubdomain = parts.length >= 3 || (parts.length >= 2 && parts[parts.length - 1] === 'localhost')
    
    if (!isLocalhost && hasSubdomain && parts[0] !== 'www' && parts[0] !== 'student' && parts[0] !== 'vendor') {
      const subdomain = parts[0]
      
      // If the user lands on the root path, automatically redirect them to the vendor's page
      if (to.path === '/') {
        return navigateTo(`/vendors/${subdomain}`)
      }
    }
  }
})
