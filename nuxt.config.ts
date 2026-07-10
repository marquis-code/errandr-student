import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: false,

  site: {
    url: 'https://erranders.org',
    name: 'Errander',
    description: 'Order food, groceries, and essentials from your favorite campus vendors. Delivered right to your hostel.',
    defaultLocale: 'en',
  },

  nitro: {
    preset: process.env.VERCEL ? 'vercel' : undefined,
    prerender: {
      routes: ['/', '/404.html', '/200.html'],
      ignore: ['/dynamic-routes', '/api'],
      failOnError: false
    },
    // ⬇ ensures the built/preview server also binds to 3001 (devServer.port only covers `nuxt dev`)
    devProxy: undefined,
  },

  devServer: {
    port: Number(process.env.NUXT_PORT || process.env.PORT || 3001),
    host: process.env.NUXT_HOST || 'localhost'
  },

  imports: {
    dirs: [
      'composables',
      'composables/**'
    ]
  },

  postcss: {
    plugins: {
      "postcss-import": {},
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      title: 'Errander',
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },
        { name: "description", content: 'Order food, groceries, and essentials from your favorite campus vendors. Delivered right to your hostel.' },
        { name: "keywords", content: 'Student delivery, campus food delivery, Errander, food ordering, university delivery' },
        { name: "author", content: "Errander" },
        { property: "og:title", content: "Errander — Student Portal" },
        { property: "og:description", content: "Order food, groceries, and essentials from your favorite campus vendors. Delivered right to your hostel." },
        { property: "og:type", content: "website" },
      ],
      link: [
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "manifest", href: "/site.webmanifest" }
      ],
      script: [
        { src: "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js", type: "text/javascript" },
      ],
    },
  },

  build: {
    transpile: ["lucide-vue-next"],
  },

  css: ["/assets/css/main.css", "/assets/font/stylesheet.css"],

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "@nuxtjs/seo",
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.VITE_API_BASE_URL || "https://api.erranders.org",
      wsBase: process.env.WS_BASE_URL || process.env.VITE_WS_URL || "https://api.erranders.org",
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
      firebaseApiKey: process.env.FIREBASE_API_KEY || '',
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
      paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
      mapboxToken: process.env.NUXT_PUBLIC_MAPBOX_TOKEN
    },
  },

  compatibilityDate: '2025-01-01',
});