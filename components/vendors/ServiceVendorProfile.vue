<template>
  <div class="min-h-screen bg-white text-gray-900 font-sans pb-12">
    <!-- Hero Banner (Full Edge-to-Edge, No White Bar) -->
    <div class="relative w-full h-[300px] md:h-[420px] overflow-hidden bg-gray-900">
      <img v-if="vendor.banner || vendor.logo" :src="vendor.banner || vendor.logo" class="absolute inset-0 w-full h-full object-cover opacity-80" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>

      <!-- Floating Navigation (Overlaid on Banner) -->
      <div class="absolute top-0 inset-x-0 z-30 px-4 md:px-8 py-4 flex items-center justify-between">
        <button @click="$router.back()" class="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-colors border border-white/10">
          <ArrowLeft class="w-4.5 h-4.5 text-white" />
        </button>
        <div class="flex items-center gap-3">
          <button @click="handleShare" class="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-colors border border-white/10">
            <Share2 class="w-4.5 h-4.5 text-white" />
          </button>
          <button @click="handleToggleFavorite" :disabled="togglingFavorite" class="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all border border-white/10" :class="isFavorited ? 'bg-rose-500/80 hover:bg-rose-600/80' : 'bg-black/30 hover:bg-black/50'">
            <Heart class="w-4.5 h-4.5 transition-all" :class="isFavorited ? 'text-white fill-white' : 'text-white'" />
          </button>
        </div>
      </div>

      <!-- Store Info (Overlaid on Banner Bottom) -->
      <div class="absolute bottom-0 inset-x-0 p-6 md:p-8 max-w-7xl mx-auto">
        <div class="flex flex-col gap-2">
          <span v-if="vendor.isOnline" class="inline-flex w-fit items-center px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold backdrop-blur-sm border border-emerald-500/30">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            Open Now
          </span>
          <span v-else class="inline-flex w-fit items-center px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold backdrop-blur-sm border border-red-500/30">
            Closed
          </span>
          <h1 class="text-3xl md:text-5xl font-bold text-white tracking-tight">{{ vendor.storeName }}</h1>
          <div class="flex flex-wrap items-center gap-3 mt-1 text-white/90 text-sm font-medium">
            <button v-if="vendor.rating" @click="showReviewsModal = true" class="flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors active:scale-95">
              <Star class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span class="font-bold">{{ vendor.rating?.toFixed(1) }}</span>
              <span class="text-white/70">({{ vendor.totalRatings || 0 }} reviews)</span>
              <ChevronRight class="w-3 h-3 ml-0.5 opacity-60" />
            </button>
            <div v-if="vendor.category" class="flex items-center gap-1 text-xs bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm capitalize">
              <Sparkles class="w-3.5 h-3.5" />
              {{ vendor.category.replace(/_/g, ' ') }}
            </div>
            <div v-if="vendor.address" class="flex items-center gap-1 text-xs bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
              <MapPin class="w-3.5 h-3.5" />
              <span class="truncate max-w-[200px]">{{ vendor.address }}</span>
            </div>
            <div v-if="vendor.serviceLocation" class="flex items-center gap-1 text-xs bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm capitalize">
              <Navigation class="w-3.5 h-3.5" />
              {{ vendor.serviceLocation === 'mobile_operator' ? 'Comes to You' : vendor.serviceLocation.replace(/_/g, ' ') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-4 md:px-8 -mt-6 relative z-10">
      <div class="flex flex-col lg:flex-row gap-8 relative">
        
        <!-- Left Content Column -->
        <div class="flex-1 space-y-6 bg-white rounded-2xl p-6 md:p-8 border-[0.5px] border-gray-100">
          
          <!-- About Section -->
          <section v-if="vendor.description">
            <h2 class="text-lg font-bold tracking-tight mb-3 text-gray-900">About Us</h2>
            <p class="text-gray-600 leading-relaxed text-sm">
              {{ vendor.description }}
            </p>
          </section>

          <!-- Services Section -->
          <section>
            <h2 class="text-lg font-bold tracking-tight mb-4 text-gray-900">Our Services</h2>
            
            <template v-if="filteredServices.length > 0">
              <!-- Category Pills -->
              <div class="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                <button 
                  v-for="cat in categories" 
                  :key="cat"
                  @click="activeCategory = cat"
                  class="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold border-[0.5px] transition-all"
                  :class="activeCategory === cat ? 'bg-parentPrimary text-white border-parentPrimary' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100'"
                >
                  {{ cat }}
                </button>
              </div>

              <!-- Service List -->
              <div class="space-y-3 mt-2">
                <div 
                  v-for="service in filteredServices" 
                  :key="service._id"
                  class="flex items-center justify-between p-4 rounded-xl bg-white border-[0.5px] border-gray-100 hover:border-parentPrimary/30 transition-all group"
                >
                  <div class="pr-4">
                    <h3 class="font-bold text-sm text-gray-900 group-hover:text-parentPrimary transition-colors">{{ service.name }}</h3>
                    <p class="text-xs font-medium text-gray-500 mt-1 flex items-center gap-1.5">
                      <Clock class="w-3.5 h-3.5 text-gray-400" />
                      {{ service.variants?.length ? `${service.durationInMinutes} mins - ${Math.max(...service.variants.map((v:any)=>v.durationInMinutes))} mins` : `${service.durationInMinutes} mins` }}
                    </p>
                    <p class="text-sm font-bold text-gray-900 mt-2">
                      {{ service.variants?.length ? 'from ' : '' }}₦{{ service.price.toLocaleString() }}
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button 
                      @click="messageVendor(service)"
                      class="px-5 py-2 rounded-full bg-white text-gray-700 font-bold text-xs transition-colors shrink-0 border-[0.5px] border-gray-200 hover:border-gray-400"
                    >
                      Message
                    </button>
                    <button 
                      @click="openBookingFlow(service)"
                      class="px-5 py-2 rounded-full bg-gray-50 text-parentPrimary font-bold text-xs transition-colors shrink-0 border-[0.5px] border-gray-200 hover:border-parentPrimary"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- View All Button -->
              <div v-if="vendorServices.length > 5 && activeCategory === 'Featured'" class="mt-6 flex justify-center">
                <NuxtLink 
                  :to="`/vendors/${vendor._id}/services`"
                  class="px-6 py-2.5 rounded-full border-[0.5px] border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 hover:text-parentPrimary hover:border-parentPrimary/30 transition-all"
                >
                  View all services
                </NuxtLink>
              </div>
            </template>
            <div v-else class="text-gray-500 text-sm py-10 bg-gray-50 rounded-2xl text-center border border-dashed border-gray-200 flex flex-col items-center justify-center">
              <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 border border-gray-100">
                <span class="text-xl">✨</span>
              </div>
              <p class="font-bold text-gray-900 text-sm">No services yet</p>
              <p class="mt-1 text-xs">This vendor hasn't added any services yet.</p>
            </div>
          </section>
        </div>

        <!-- Right Sticky Sidebar -->
        <div class="hidden lg:block w-[320px] shrink-0">
          <div class="sticky top-8 bg-white border border-gray-100 rounded-2xl p-6">
            <button 
              @click="openBookingFlow()"
              class="w-full py-3 bg-parentPrimary text-white rounded-xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all mb-6 flex justify-center items-center gap-2"
            >
              Book Appointment
            </button>

            <div class="space-y-5">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <Clock class="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Availability</h4>
                  <p v-if="vendor.isOnline" class="text-xs font-bold text-emerald-600">Currently Open</p>
                  <p v-else class="text-xs font-bold text-red-600">Closed</p>
                </div>
              </div>
              
              <div class="flex items-start gap-3" v-if="vendor.address">
                <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <MapPin class="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Location</h4>
                  <p class="text-xs font-bold text-gray-900 leading-relaxed">
                    {{ vendor.address }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3" v-if="vendor.serviceLocation">
                <div class="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                  <Navigation class="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Service Type</h4>
                  <p class="text-xs font-bold text-gray-900 capitalize">
                    {{ vendor.serviceLocation === 'mobile_operator' ? 'Mobile – Comes to you' : vendor.serviceLocation.replace(/_/g, ' ') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Quick Share Section -->
            <div class="mt-6 pt-6 border-t border-gray-50">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Share This Vendor</p>
              <div class="flex items-center gap-2">
                <a :href="whatsappShareUrl" target="_blank" rel="noopener" class="w-9 h-9 rounded-full bg-[#25D366]/10 flex items-center justify-center hover:bg-[#25D366]/20 transition-colors" title="Share on WhatsApp">
                  <svg class="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.588-.826-6.32-2.207l-.44-.352-3.265 1.094 1.094-3.265-.352-.44A9.956 9.956 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
                </a>
                <a :href="twitterShareUrl" target="_blank" rel="noopener" class="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors" title="Share on X">
                  <svg class="w-4 h-4 text-gray-900" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a :href="facebookShareUrl" target="_blank" rel="noopener" class="w-9 h-9 rounded-full bg-[#1877F2]/10 flex items-center justify-center hover:bg-[#1877F2]/20 transition-colors" title="Share on Facebook">
                  <svg class="w-4 h-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <button @click="copyShareLink" class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors" title="Copy Link">
                  <LinkIcon v-if="!linkCopied" class="w-4 h-4 text-gray-500" />
                  <Check v-else class="w-4 h-4 text-emerald-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Mobile Sticky Book Button -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 lg:hidden z-40">
      <button 
        @click="openBookingFlow()"
        class="w-full py-3 bg-parentPrimary text-white rounded-xl font-bold text-sm active:scale-95 transition-transform"
      >
        Book Appointment
      </button>
    </div>

    <!-- Booking Flow Full-Screen Overlay -->
    <BookingFlow 
      v-if="isBookingFlowOpen"
      :vendor="vendor"
      :services="vendorServices"
      :initialService="selectedServiceForBooking"
      @close="isBookingFlowOpen = false"
    />

    <!-- Reviews Modal -->
    <VendorReviewsModal 
      :isOpen="showReviewsModal" 
      :vendor="vendor" 
      @close="showReviewsModal = false" 
      @review-added="fetchVendorDetails"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ArrowLeft, Share2, Heart, Star, Clock, MapPin, Sparkles, Navigation, Link as LinkIcon, Check, ChevronRight } from 'lucide-vue-next';
import { services_api } from '@/api_factory/modules/services';
import { vendors_api } from '@/api_factory/modules/vendors';
import { useFavorites } from '@/composables/modules/favorites';
import BookingFlow from '@/components/vendors/booking/BookingFlow.vue';
import VendorReviewsModal from '@/components/vendors/VendorReviewsModal.vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  vendor: any;
  isHybrid?: boolean;
}>();

const { toggleFavorite, isVendorFavorited, fetchFavorites, favoriteVendorIds } = useFavorites();

const vendorServices = ref<any[]>([]);
const activeCategory = ref('Featured');
const isBookingFlowOpen = ref(false);
const showReviewsModal = ref(false);
const selectedServiceForBooking = ref<any>(null);
const togglingFavorite = ref(false);
const linkCopied = ref(false);

const isFavorited = computed(() => isVendorFavorited(props.vendor._id));

const fetchVendorDetails = async () => {
  try {
    const res = await vendors_api.getVendorById(props.vendor._id);
    if (res.data) {
      Object.assign(props.vendor, res.data);
    }
  } catch (err) {
    console.error('Failed to fetch updated vendor details', err);
  }
};

// --- Share URLs ---
const shareUrl = computed(() => {
  const protocol = window.location.protocol;
  const host = window.location.host;
  if (props.vendor.subdomain) {
    // If we're already on the vendor's subdomain, just use the current origin
    if (host.startsWith(props.vendor.subdomain + '.')) {
      return `${protocol}//${host}`;
    }
    // Build subdomain-based URL
    const parts = host.split('.');
    let baseHost = host;
    if (parts.length >= 2) {
      // Remove any existing subdomain prefix (student., vendor., admin., etc.)
      const knownPrefixes = ['student', 'vendor', 'admin', 'www'];
      if (knownPrefixes.includes(parts[0])) {
        baseHost = parts.slice(1).join('.');
      }
    }
    return `${protocol}//${props.vendor.subdomain}.${baseHost}`;
  }
  return `${protocol}//${host}/vendors/${props.vendor._id}`;
});

const shareText = computed(() => `Check out ${props.vendor.storeName} on Errandr! ${props.vendor.description ? props.vendor.description.slice(0, 80) : ''}`);

const whatsappShareUrl = computed(() => `https://wa.me/?text=${encodeURIComponent(shareText.value + ' ' + shareUrl.value)}`);
const twitterShareUrl = computed(() => `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText.value)}&url=${encodeURIComponent(shareUrl.value)}`);
const facebookShareUrl = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`);

const handleShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.vendor.storeName,
        text: shareText.value,
        url: shareUrl.value,
      });
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error('Share failed:', e);
      }
    }
  } else {
    // Fallback: copy to clipboard
    await copyShareLink();
  }
};

const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    linkCopied.value = true;
    setTimeout(() => { linkCopied.value = false; }, 2000);
  } catch (e) {
    console.error('Clipboard copy failed:', e);
  }
};

const handleToggleFavorite = async () => {
  togglingFavorite.value = true;
  try {
    await toggleFavorite({ vendorId: props.vendor._id });
  } finally {
    togglingFavorite.value = false;
  }
};

const categories = computed(() => {
  const cats = ['Featured'];
  vendorServices.value.forEach(s => {
    if (s.category && !cats.includes(s.category)) cats.push(s.category);
  });
  return cats;
});

const filteredServices = computed(() => {
  if (activeCategory.value === 'Featured') return vendorServices.value.slice(0, 5);
  return vendorServices.value.filter(s => s.category === activeCategory.value);
});

const router = useRouter();

const messageVendor = (service: any) => {
  router.push({
    path: '/dashboard/chat',
    query: {
      vendorId: props.vendor.owner,
      prefill: `Hi, I have a question about the service: ${service.name}.`
    }
  });
};

const openBookingFlow = (service: any = null) => {
  selectedServiceForBooking.value = service;
  isBookingFlowOpen.value = true;
};

onMounted(async () => {
  // Load favorites so we know if this vendor is already favorited
  fetchFavorites();

  try {
    const res = await services_api.getVendorServices(props.vendor._id);
    vendorServices.value = res.data || [];
  } catch(e) {
    console.error('Failed to load services', e);
  }
});
</script>
