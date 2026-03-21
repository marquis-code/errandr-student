import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: false,

  site: {
    url: 'https://errandr.com',
    name: 'Errandr',
    description: 'Order food, groceries, and essentials from your favorite campus vendors. Delivered right to your hostel.',
    defaultLocale: 'en',
  },

  devServer: {
    port: 3003,
    host: 'localhost'
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
      title: 'Errandr - Student Portal',
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },

        // ✅ SEO meta
        {
          name: "description",
          content: 'Order food, groceries, and essentials from your favorite campus vendors. Delivered right to your hostel.'
        },
        {
          name: "keywords",
          content: 'Student delivery, campus food delivery, Errandr, food ordering, university delivery'
        },
        { name: "author", content: "Errandr" },

        // ✅ Open Graph (for social previews)
        { property: "og:title", content: "Errandr — Student Portal" },
        {
          property: "og:description",
          content:
            "Order food, groceries, and essentials from your favorite campus vendors. Delivered right to your hostel.",
        },
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
        {
          src: "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
          type: "text/javascript",
        },
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
      apiBase: process.env.API_BASE_URL || 'http://localhost:3000',
      wsBase: process.env.WS_BASE_URL || 'http://localhost:3000',
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
      firebaseApiKey: process.env.FIREBASE_API_KEY || '',
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
    },
  },

  compatibilityDate: '2025-01-01',
});
