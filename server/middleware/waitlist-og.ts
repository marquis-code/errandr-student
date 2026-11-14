/**
 * Link previews for waitlist forms.
 *
 * This app is a client-side SPA (ssr: false), so the HTML a crawler receives is the empty shell —
 * WhatsApp, Telegram, Twitter and Facebook cannot run the JavaScript that would fill in the title.
 * Google can, but a shared link is exactly where a waitlist spreads, so it is the case that matters.
 *
 * For crawler user-agents only, this fetches the form and rewrites the shell's meta tags in place.
 * Humans are untouched and still get the real app.
 */

const CRAWLERS = /whatsapp|facebookexternalhit|twitterbot|telegrambot|linkedinbot|slackbot|discordbot|googlebot|bingbot|embedly|pinterest|redditbot|applebot|skypeuripreview/i;

const escape = (v: string) =>
  String(v || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  if (event.method !== 'GET') return;
  if (!/^\/waitlist\/[^/]+$/.test(url.pathname)) return;

  const ua = getHeader(event, 'user-agent') || '';
  if (!CRAWLERS.test(ua)) return;

  const slug = url.pathname.split('/').pop() || '';
  const subdomain = url.hostname.split('.').length >= 3 ? url.hostname.split('.')[0] : (url.searchParams.get('store') || '');
  const apiBase = (process.env.NUXT_PUBLIC_API_BASE || 'https://api.erranders.org').replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

  let title = 'Waitlist';
  let description = 'Join the waitlist.';
  let image = '';
  let storeName = '';

  try {
    const data: any = await $fetch(`${apiBase}/api/v1/waitlist/public/${subdomain}/${slug}`, { timeout: 4000 });
    const form = data?.form || {};
    storeName = data?.vendor?.storeName || '';
    title = storeName ? `${form.title || 'Waitlist'} · ${storeName}` : (form.title || 'Waitlist');
    description = form.description || `Join the waitlist for ${storeName || 'this store'} on Erranders.`;
    image = form.bannerImage || data?.vendor?.logo || '';
  } catch {
    // Keep generic tags rather than serving a broken shell.
  }

  const pageUrl = url.toString();
  const meta = [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:url" content="${escape(pageUrl)}" />`,
    image ? `<meta property="og:image" content="${escape(image)}" />` : '',
    image ? `<meta name="twitter:card" content="summary_large_image" />` : `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escape(title)}" />`,
    `<meta name="twitter:description" content="${escape(description)}" />`,
    image ? `<meta name="twitter:image" content="${escape(image)}" />` : '',
    `<link rel="canonical" href="${escape(pageUrl)}" />`,
    `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: pageUrl,
      ...(storeName ? { publisher: { '@type': 'Organization', name: storeName } } : {}),
      potentialAction: {
        '@type': 'RegisterAction',
        target: pageUrl,
        name: 'Join the waitlist',
      },
    })}</script>`,
  ].filter(Boolean).join('\n    ');

  const html: string = await $fetch(pageUrl, { headers: { 'user-agent': 'node' } }).then((r) => String(r)).catch(() => '');

  if (!html) {
    return new Response(`<!DOCTYPE html><html><head>${meta}</head><body></body></html>`, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  // Drop the shell's generic tags so ours are the ones a crawler reads first.
  const cleaned = html
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta[^>]+name="description"[^>]*>/gi, '')
    .replace(/<meta[^>]+property="og:[^"]+"[^>]*>/gi, '')
    .replace(/<meta[^>]+name="twitter:[^"]+"[^>]*>/gi, '')
    .replace(/<\/head>/i, `  ${meta}\n  </head>`);

  return new Response(cleaned, { headers: { 'content-type': 'text/html; charset=utf-8' } });
});
