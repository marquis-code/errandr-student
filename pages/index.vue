<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
    <!-- Navbar -->
    <nav class="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300" :class="{'py-4': !scrolled, 'py-3 shadow-sm': scrolled}">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-parentPrimary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm shadow-parentPrimary/20">
              <ShoppingBag class="w-5 h-5 text-white" />
            </div>
            <span class="text-2xl font-black text-parentPrimary tracking-tighter">Errandr</span>
          </div>
          
          <div class="hidden md:flex items-center gap-8">
            <a href="#how-it-works" class="text-sm font-semibold text-gray-600 hover:text-parentPrimary transition-colors">How it works</a>
            <a href="#featured" class="text-sm font-semibold text-gray-600 hover:text-parentPrimary transition-colors">Featured Venues</a>
            <a href="#categories" class="text-sm font-semibold text-gray-600 hover:text-parentPrimary transition-colors">Categories</a>
          </div>

          <div class="flex items-center gap-4">
            <NuxtLink to="/auth/login" class="hidden md:flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-parentPrimary transition-colors">
              <LogIn class="w-4 h-4" /> Log in
            </NuxtLink>
            <NuxtLink to="/auth/register" class="px-6 py-2.5 bg-parentPrimary text-white text-sm font-bold rounded-xl shadow-lg shadow-parentPrimary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Sign up
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <!-- High-end ambient background -->
      <div class="absolute inset-0 z-0 bg-gray-50">
        <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-parentPrimary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
              <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Live on Campus
            </div>
            <h1 class="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-6 text-gray-900">
              Craving it? <br />
              <span class="text-parentPrimary relative inline-block">
                We'll bring it.
                <svg class="absolute w-full h-4 -bottom-1 left-0 text-amber-400 opacity-60" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q50 20 100 10" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>
              </span>
            </h1>
            <p class="text-xl text-gray-500 font-medium mb-10 leading-relaxed max-w-lg">
              The fastest food delivery for students. From your favorite campus restaurants straight to your hostel door in minutes.
            </p>
            
            <div class="flex flex-col sm:flex-row items-center gap-4">
              <NuxtLink to="/auth/login" class="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-black transition-all text-center flex items-center justify-center gap-2 group">
                <Utensils class="w-5 h-5" />
                Order Now
                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NuxtLink>
              <a href="#how-it-works" class="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold text-lg shadow-sm hover:border-parentPrimary/30 hover:bg-gray-50 transition-all text-center flex items-center justify-center gap-2">
                <PlayCircle class="w-5 h-5 text-gray-400" />
                See How It Works
              </a>
            </div>
            
            <div class="mt-12 flex items-center gap-4 pt-8 border-t border-gray-100">
              <div class="flex -space-x-4">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" class="w-12 h-12 rounded-full border-4 border-white object-cover shadow-sm" />
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" class="w-12 h-12 rounded-full border-4 border-white object-cover shadow-sm" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" class="w-12 h-12 rounded-full border-4 border-white object-cover shadow-sm" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" class="w-12 h-12 rounded-full border-4 border-white object-cover shadow-sm" />
                <div class="w-12 h-12 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm">+2k</div>
              </div>
              <p class="text-sm font-semibold text-gray-500">Trusted by over 2,000+ students daily</p>
            </div>
          </div>
          
          <div class="relative hidden py-10 lg:block">
             <div class="relative z-10">
                <img src="https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&h=1000&fit=crop" alt="Premium Food Delivery" class="rounded-[3rem] shadow-2xl object-cover h-[600px] w-full border-8 border-white transform rotate-1 hover:rotate-0 transition-transform duration-700" />
                
                <!-- Floating Card 1 -->
                <div class="absolute -left-12 top-20 bg-white p-4 rounded-3xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce" style="animation-duration: 3.5s;">
                  <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <Clock class="w-6 h-6" />
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Arriving In</p>
                    <p class="text-xl font-black text-gray-900 tracking-tight">12 mins</p>
                  </div>
                </div>

                <!-- Floating Card 2 -->
                <div class="absolute -right-8 bottom-32 bg-white p-4 rounded-3xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce" style="animation-duration: 4.2s; animation-delay: 1s;">
                  <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop" class="w-14 h-14 rounded-2xl object-cover" />
                  <div>
                    <p class="font-bold text-gray-900 text-sm">Spicy Pepperoni Pizza</p>
                    <div class="flex items-center gap-1 mt-1 text-amber-400">
                      <Star class="w-3 h-3 fill-current" />
                      <Star class="w-3 h-3 fill-current" />
                      <Star class="w-3 h-3 fill-current" />
                      <Star class="w-3 h-3 fill-current" />
                      <Star class="w-3 h-3 fill-current" />
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Carousel: Featured Vendors -->
    <section id="featured" class="py-24 bg-white overflow-hidden border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div class="flex items-end justify-between">
          <div>
            <div class="inline-flex items-center gap-2 text-parentPrimary font-bold text-sm tracking-widest uppercase mb-3">
              <Store class="w-4 h-4" /> Top Rated
            </div>
            <h2 class="text-4xl font-black text-gray-900 tracking-tight">Campus Favorites</h2>
          </div>
          <div class="hidden sm:flex gap-2">
            <button @click="scrollCarousel('left', 'vendor-carousel')" class="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-parentPrimary transition-colors text-gray-600">
              <ChevronLeft class="w-6 h-6" />
            </button>
            <button @click="scrollCarousel('right', 'vendor-carousel')" class="w-12 h-12 rounded-full bg-parentPrimary text-white flex items-center justify-center hover:bg-parentPrimary/90 transition-colors shadow-lg shadow-parentPrimary/20">
              <ChevronRight class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carousel Container -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="vendor-carousel" class="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div v-for="vendor in vendors" :key="vendor.id" class="snap-start flex-none w-[280px] sm:w-[320px] group cursor-pointer relative">
            <div class="relative h-[220px] w-full rounded-3xl overflow-hidden mb-4 shadow-sm border border-gray-100">
              <img :src="vendor.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Vendor Cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
              <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/30 truncate max-w-[120px]">
                  {{ vendor.category }}
                </span>
                <span class="flex items-center gap-1 bg-white rounded-full px-2 py-1 text-xs font-bold text-gray-900 shadow-lg">
                  <Star class="w-3 h-3 text-amber-400 fill-current" /> {{ vendor.rating }}
                </span>
              </div>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-1 group-hover:text-parentPrimary transition-colors">{{ vendor.name }}</h3>
            <div class="flex items-center gap-4 text-sm text-gray-500 font-medium">
              <span class="flex items-center gap-1"><Clock class="w-4 h-4" /> {{ vendor.time }}</span>
              <span class="flex items-center gap-1"><MapPin class="w-4 h-4" /> {{ vendor.distance }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section id="how-it-works" class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-parentPrimary font-bold tracking-widest uppercase text-sm mb-3">Simple Process</h2>
          <h3 class="text-4xl font-black text-gray-900 tracking-tight mb-4">From craving to eating in 3 steps</h3>
          <p class="text-gray-500 font-medium text-lg">We've streamlined the entire process so you can focus on studying (or Netflixing) while we handle the food.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <!-- Connecting Line (Desktop) -->
          <div class="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          
          <div v-for="(step, index) in steps" :key="index" class="relative z-10 flex flex-col items-center text-center">
            <div class="w-24 h-24 bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center justify-center text-parentPrimary mb-6 transform group hover:-translate-y-2 transition-transform">
              <component :is="step.icon" class="w-10 h-10" />
              <div class="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs ring-4 ring-gray-50 shadow-sm">
                {{ index + 1 }}
              </div>
            </div>
            <h4 class="text-xl font-bold text-gray-900 tracking-tight mb-2">{{ step.title }}</h4>
            <p class="text-gray-500 font-medium leading-relaxed px-4">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Grid (Real Icons) -->
    <section id="categories" class="py-24 overflow-hidden border-t border-gray-100 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-12">
          <div>
            <h2 class="text-4xl font-black text-gray-900 tracking-tight mb-3">Craving Anything Specific?</h2>
            <p class="text-gray-500 font-medium text-lg max-w-xl">Explore the most ordered categories on campus today.</p>
          </div>
          <NuxtLink to="/auth/login" class="hidden sm:flex items-center gap-2 text-parentPrimary font-bold hover:gap-3 transition-all px-6 py-3 rounded-xl bg-parentPrimary/5 border border-parentPrimary/10 hover:bg-parentPrimary/10">
            View full menu <ArrowRight class="w-5 h-5" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div v-for="cat in categories" :key="cat.name" class="group cursor-pointer">
            <div class="relative h-40 md:h-48 rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
              <img :src="cat.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Category Image" />
              <div class="absolute inset-0 bg-gray-900/40 group-hover:bg-gray-900/50 transition-colors"></div>
              <div class="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                 <component :is="cat.icon" class="w-8 h-8 mb-3 opacity-90 group-hover:scale-110 transition-transform" />
                 <h4 class="font-bold text-lg tracking-wide">{{ cat.name }}</h4>
                 <p class="text-xs text-gray-200 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Explore options &rarr;</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section id="benefits" class="py-24 bg-white relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gray-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
          <div class="absolute -top-40 -right-40 w-[500px] h-[500px] bg-parentPrimary/20 rounded-full blur-[100px]"></div>
          <div class="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
          
          <div class="relative z-10 max-w-3xl">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 mb-8 backdrop-blur-md border border-white/20 text-white">
              <Rocket class="w-10 h-10" />
            </div>
            <h2 class="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-[1.1]">
              Ready to satisfy your cravings?
            </h2>
            <p class="text-xl text-gray-400 font-medium mb-10 leading-relaxed">
              Join thousands of students who trust Errandr for their daily meals and essentials. Fast delivery, student-friendly prices.
            </p>
            <NuxtLink to="/auth/register" class="inline-flex items-center justify-center px-10 py-5 bg-parentPrimary text-white rounded-2xl font-black text-lg shadow-xl shadow-parentPrimary/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-parentPrimary/30 transition-all">
              Create Free Account
            </NuxtLink>
            <p class="mt-6 text-sm text-gray-500 font-medium">Already have an account? <NuxtLink to="/auth/login" class="text-white hover:underline underline-offset-4 cursor-pointer">Log in here</NuxtLink></p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-200 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div class="md:col-span-1">
            <div class="flex items-center gap-2 mb-6">
              <div class="w-8 h-8 bg-parentPrimary rounded-lg flex items-center justify-center text-white font-bold shadow-sm">E</div>
              <span class="text-xl font-black text-parentPrimary tracking-tighter">Errandr</span>
            </div>
            <p class="text-gray-500 text-sm leading-relaxed mb-6 font-medium">The premium food delivery network built exclusively for the modern student community.</p>
            <div class="flex items-center gap-4">
              <a href="#" class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-parentPrimary hover:border-parentPrimary transition-colors shadow-sm">
                <Twitter class="w-4 h-4"/>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-parentPrimary hover:border-parentPrimary transition-colors shadow-sm">
                <Instagram class="w-4 h-4"/>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-parentPrimary hover:border-parentPrimary transition-colors shadow-sm">
                <Facebook class="w-4 h-4"/>
              </a>
            </div>
          </div>
          
          <div>
            <h4 class="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Platform</h4>
            <ul class="space-y-4 text-sm font-medium text-gray-500">
              <li><NuxtLink to="/about" class="hover:text-parentPrimary transition-colors">About Us</NuxtLink></li>
              <li><NuxtLink to="/contact" class="hover:text-parentPrimary transition-colors">Contact Support</NuxtLink></li>
              <li><NuxtLink to="/faq" class="hover:text-parentPrimary transition-colors">FAQ & Help</NuxtLink></li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Legal</h4>
            <ul class="space-y-4 text-sm font-medium text-gray-500">
              <li><NuxtLink to="/terms" class="hover:text-parentPrimary transition-colors">Terms of Service</NuxtLink></li>
              <li><NuxtLink to="/terms" class="hover:text-parentPrimary transition-colors">Privacy Policy</NuxtLink></li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Join Us</h4>
            <ul class="space-y-4 text-sm font-medium text-gray-500">
              <li><a href="http://vendor.localhost:3000" class="hover:text-parentPrimary transition-colors flex items-center gap-2"><Store class="w-4 h-4" /> Open a Store</a></li>
              <li><a href="http://errander.localhost:3000" class="hover:text-parentPrimary transition-colors flex items-center gap-2"><Bike class="w-4 h-4" /> Become a Rider</a></li>
            </ul>
          </div>
        </div>
        
        <div class="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-sm font-medium text-gray-400">
            &copy; {{ new Date().getFullYear() }} Errandr Inc. All rights reserved.
          </p>
          <div class="flex gap-4">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" class="h-6 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"/>
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" class="h-6 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"/>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  ArrowRight, Twitter, Instagram, Facebook,
  LogIn, ShoppingBag, Utensils, PlayCircle,
  Clock, MapPin, Star, Store, Bike, ChevronLeft, ChevronRight,
  ShieldCheck, CreditCard, Rocket,
  Pizza, Flame, Beef, Coffee
} from 'lucide-vue-next'

definePageMeta({
  layout: false
})

useHead({
  title: 'Errandr | Premium Campus Delivery',
  meta: [
    { name: 'description', content: 'The fastest food delivery for students. From your favorite campus restaurants straight to your hostel door.' }
  ]
})

const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const scrollCarousel = (direction: 'left' | 'right', id: string) => {
  const container = document.getElementById(id)
  if (container) {
    const scrollAmount = direction === 'left' ? -340 : 340
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
}

// Data
const vendors = [
  { id: 1, name: 'Campus Grill House', category: 'Burger & Fries', rating: '4.8', distance: '1.2km', time: '15-20 min', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop' },
  { id: 2, name: 'Spice Route Eats', category: 'Local Dishes', rating: '4.6', distance: '0.8km', time: '10-15 min', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop' },
  { id: 3, name: 'Mama\'s Kitchen', category: 'Rice & Stew', rating: '4.9', distance: '2.0km', time: '20-25 min', image: 'https://images.unsplash.com/photo-1543352634-99a5d50ae78e?w=600&h=400&fit=crop' },
  { id: 4, name: 'Fresh Bites Bakery', category: 'Pastries', rating: '4.7', distance: '0.5km', time: '10 min', image: 'https://images.unsplash.com/photo-1509358271058-acd22ccec36b?w=600&h=400&fit=crop' },
  { id: 5, name: 'Pizza Hub', category: 'Fast Food', rating: '4.5', distance: '1.5km', time: '25-30 min', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop' },
]

const steps = [
  { icon: Store, title: 'Browse Menus', description: 'Explore local campus restaurants and select your favorite meals or groceries.' },
  { icon: CreditCard, title: 'Checkout Securely', description: 'Pay securely using your preferred method. Student discounts are automatically applied.' },
  { icon: Bike, title: 'Fast Delivery', description: 'A fellow student drops it off right at your hostel door in minutes.' }
]

const categories = [
  { name: 'Fast Food', icon: Pizza, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&h=400&fit=crop' },
  { name: 'Healthy & Fresh', icon: Flame, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop' },
  { name: 'Local Soups', icon: Beef, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop' },
  { name: 'Coffee & Drinks', icon: Coffee, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&h=400&fit=crop' },
]
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
