/**
 * Submit every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam, …).
 *
 * IndexNow pushes URLs to participating search engines instantly instead of
 * waiting for a crawl — run this after imports or big content changes:
 *
 *   node scripts/indexnow-submit.mjs
 *
 * The key is proven by /​<key>.txt served from public/ (already committed).
 * Protocol: https://www.indexnow.org/documentation — max 10,000 URLs per POST.
 */

const SITE_URL = "https://www.blinkgames.fun";
const KEY = "e4dc5f95498bf03ecc38c928d06111bb";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH = 10_000;

async function getSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml fetch failed: ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!urls.length) throw new Error("no <loc> entries found in sitemap.xml");
  return urls;
}

async function submit(urlList) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key: KEY,
      keyLocation: `${SITE_URL}/${KEY}.txt`,
      urlList,
    }),
  });
  // 200 = submitted, 202 = accepted (key validation pending) — both fine.
  if (res.status !== 200 && res.status !== 202) {
    throw new Error(`IndexNow rejected batch: ${res.status} ${await res.text()}`);
  }
  return res.status;
}

const urls = await getSitemapUrls();
console.log(`Sitemap has ${urls.length} URLs; submitting in batches of ${BATCH}…`);
for (let i = 0; i < urls.length; i += BATCH) {
  const batch = urls.slice(i, i + BATCH);
  const status = await submit(batch);
  console.log(`  batch ${i / BATCH + 1}: ${batch.length} URLs → HTTP ${status}`);
}
console.log("Done. Engines typically process within hours; recrawl is up to them.");
