<template>
  <section class="py-16 px-4 space-y-12 bg-white">
    <div class="text-center space-y-3">
      <h2 class="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-none">What Students Say</h2>
      <p class="text-sm font-bold text-gray-500">Stories from the campus community.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
      <div 
        v-for="(t, i) in testimonials" 
        :key="i"
        class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 group relative overflow-hidden flex flex-col justify-between"
      >
        <div class="absolute -right-8 -top-8 w-24 h-24 bg-gray-50 rounded-full blur-2xl group-hover:bg-parentPrimary/5 transition-colors" />
        
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center text-xl shadow-sm group-hover:-translate-y-1 transition-transform">
             {{ t.emoji }}
          </div>
          <div>
            <h4 class="font-bold text-gray-900 tracking-tight leading-none text-base">{{ t.name }}</h4>
            <p class="text-[10px] font-bold text-parentPrimary uppercase tracking-widest mt-0.5">{{ t.tag }}</p>
          </div>
        </div>

        <p class="text-gray-600 font-medium text-sm leading-relaxed italic tracking-tight mb-6">"{{ t.quote }}"</p>
        
        <div class="pt-4 border-t border-gray-50 flex items-center gap-1.5 mt-auto">
           <div v-for="j in 5" :key="j" class="w-1.5 h-1.5 rounded-full bg-amber-400" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const testimonials = [
  {
    name: "Bolaji",
    tag: "Hostel 3 Resident",
    emoji: "😴",
    quote: "Mavise's Jollof is the only reason I wake up. Now that it comes to my door, I don't even have to put on shoes. This app is dangerously convenient!"
  },
  {
    name: "Chijioke",
    tag: "Engineering Student",
    emoji: "📄",
    quote: "I needed to send a document to my HOD but I was still in my pajamas. Requested an Errand and it reached the department in minutes. Errandr saved me!"
  },
  {
    name: "Chioma",
    tag: "Economics Major",
    emoji: "📊",
    quote: "The meal planner is the only thing standing between me and being 'broke but eating well'. I used to spend all my allowance, now I actually can save. Thanks Errandr!"
  }
];
</script>
