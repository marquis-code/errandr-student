<template>
  <section class="py-32 px-4 space-y-16">
    <div class="text-center space-y-4">
      <h2 class="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-none">What Students Say</h2>
      <p class="text-sm font-bold text-gray-400">Stories from the campus community.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      <div 
        v-for="(t, i) in testimonials" 
        :key="i"
        class="bg-white p-10 rounded-3xl md:rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-700 group relative overflow-hidden"
      >
        <div class="absolute -right-10 -top-10 w-32 h-32 bg-gray-50 rounded-full blur-3xl group-hover:bg-parentPrimary/5 transition-colors" />
        
        <div class="flex items-center gap-4 mb-8">
          <div class="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-2xl shadow-lg group-hover:rotate-12 transition-transform">
             {{ t.emoji }}
          </div>
          <div>
            <h4 class="font-bold text-gray-900 tracking-tight leading-none">{{ t.name }}</h4>
            <p class="text-[11px] font-bold text-parentPrimary uppercase tracking-widest">{{ t.tag }}</p>
          </div>
        </div>

        <p class="text-gray-600 font-bold text-lg leading-relaxed italic tracking-tight">"{{ t.quote }}"</p>
        
        <div class="mt-8 pt-8 border-t border-gray-50 flex items-center gap-2">
           <div v-for="j in 5" :key="j" class="w-2 h-2 rounded-full bg-amber-400" />
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
