import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdSlot } from "@/components/AdSlot";
import { Offcanvas } from "@/components/Offcanvas";
import { getCategories, getRecentGames } from "@/lib/games";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BlinkGames — Play Free Online Games. Always On.",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Play hundreds of free online games at BlinkGames — puzzle, arcade, action, racing, sports and .io games. No downloads, no sign-up. Instant play on mobile and desktop.",
  applicationName: SITE_NAME,
  keywords: [
    "free online games",
    "browser games",
    "games no download",
    "play games online",
    "html5 games",
    "puzzle games",
    "arcade games",
    "io games",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_GB",
  },
  twitter: { card: "summary" },
};

export const viewport: Viewport = {
  themeColor: "#7de9cf",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Publisher ID is public by nature (visible in page source and ads.txt);
// env var only exists to override or disable it per-deployment.
const ADSENSE = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-1833443006240029";
// Single env var so you can pull GTM out after the investigation week: just delete it.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
// Google Analytics 4 (gtag.js). Remove the env var to pull it out.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
// OneSignal web push (re-engagement). Unset = nothing loads.
const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Offcanvas search drawer content (Poko design) — shared on every page.
  const [categories, recent] = await Promise.all([getCategories(), getRecentGames(13)]);
  return (
    <html lang="en-GB">
      <head>
        {/* Warm up connections to third parties the page always talks to. */}
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
        )}
        {(GTM_ID || GA_ID) && (
          <link rel="preconnect" href="https://www.googletagmanager.com" />
        )}
        {ADSENSE && (
          <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        )}
        {GTM_ID && (
          <Script id="gtm-base" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
        {GA_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-base" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
        {ADSENSE && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {ONESIGNAL_APP_ID && (
          <>
            <Script
              src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
              strategy="afterInteractive"
            />
            <Script id="onesignal-init" strategy="afterInteractive">
              {`window.OneSignalDeferred = window.OneSignalDeferred || [];
OneSignalDeferred.push(async function(OneSignal) {
  await OneSignal.init({ appId: "${ONESIGNAL_APP_ID}" });
});`}
            </Script>
          </>
        )}
      </head>
      <body>
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <Offcanvas categories={categories} recent={recent} />
        <Header />
        {children}
        <Footer />
        <AdSlot variant="anchor" />
      </body>
    </html>
  );
}
