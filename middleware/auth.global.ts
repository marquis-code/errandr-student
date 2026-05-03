export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('errandr_token')

  // If user is not logged in and trying to access any dashboard path
  if (!token.value && to.path.startsWith('/dashboard')) {
    return navigateTo('/auth/login')
  }
})
