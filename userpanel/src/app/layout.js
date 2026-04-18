import "./globals.css";
import Script from "next/script";
import LayoutClient from "./LayoutClient";

export const metadata = {
  title: "AngelX → USDT selling Platform",
  description:
    "Log in to AngelX for instant USDT-to-INR conversions at the best market rates. Fast processing, secure payouts, reliable support—sell your crypto easily today.",
  keywords: [
    "angelx usdt price",
    "angelx crypto",
    "angelx usdt sell",
    "angelx login",
    "angelx pro",
    "angelx pro apk",
    "angelx usdt",
    "angelx exchange",
  ],
  alternates: {
    canonical: "https://www.angelx.com.in/",
  },
  robots: {
    index: true,
    follow: true,
    content: "index, follow",
    maxSnippet: -1,
    maxImagePreview: "large",
    maxVideoPreview: -1,
  },
  googleBot: {
    index: true,
    follow: true,
    content: "index, follow",
    maxSnippet: -1,
    maxImagePreview: "large",
    maxVideoPreview: -1,
  },
  bingbot: {
    index: true,
    follow: true,
    content: "index, follow",
    maxSnippet: -1,
    maxImagePreview: "large",
    maxVideoPreview: -1,
  },
  authors: [{ name: "AngelX" }],
  publisher: "AngelX",
  openGraph: {
    type: "website",
    title: "AngelX → India’s #1 Trusted USDT Exchange Platform",
    description:
      "Log in to AngelX for instant USDT-to-INR conversions at the best market rates. Fast processing, secure payouts, reliable support—quickly access your account and sell crypto easily.",
    url: "https://www.angelx.com.in/",
    siteName: "AngelX",
    locale: "en_IN",
    images: [
      {
        url: "https://www.angelx.com.in/images/logo-icon.png",
        width: 1200,
        height: 630,
        alt: "AngelX USDT Exchange Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AngelX → India’s #1 Trusted USDT Exchange Platform",
    description:
      "Log in to AngelX for instant USDT to INR conversions at the best market rates. Fast processing, secure payouts, reliable support—quickly access your account and sell crypto easily.",
    site: "@AngelX",
    images: ["https://www.angelx.com.in/images/logo-icon.png"],
  },
};


export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/images/fav.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Monda:wght@400..700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="/css/style.css" type="text/css" />
    
        <meta name="google-site-verification" content="jN9KYRmsTeSoX0Jz2UVfis9kotpOcqf6iYkhLnsh6y8" />
        {/* Google Analytics (G-142KL2HJJS) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-142KL2HJJS"
          strategy="afterInteractive"
        />
        <Script id="ga-main" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-142KL2HJJS');
          `}
        </Script>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "AngelX",
              "url": "https://www.angelx.com.in/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.angelx.com.in/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              "@id": "https://www.angelx.com.in/#organization",
              "name": "AngelX",
              "url": "https://www.angelx.com.in/",
              "logo": "https://www.angelx.com.in/images/logo-icon.png",
              "description": "Exchange USDT for INR instantly on AngelX—high rates, fast processing, immediate payouts, strong security, reliable support, and easy crypto selling for seamless trades.",
              "areaServed": {
                "@type": "Country",
                "name": "India"
              },
              "sameAs": [
                "https://www.instagram.com/angelxexchange",
                "https://twitter.com/angelxexchange"
              ]
            })
          }}
        />
        <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `
          {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "AngelX",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "17866",
              "reviewCount": "17866"
            }
          }
          `,
        }}
      />  
      </head>
      <body>
        <LayoutClient>{children}</LayoutClient>
        <Script
          src="https://code.jquery.com/jquery-3.6.0.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/bxslider/4.2.12/jquery.bxslider.min.js"
          strategy="afterInteractive"
        />
        {/* Register Service Worker for PWA/offline support */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                  // Registration successful
                  // console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, function(err) {
                  // Registration failed
                  // console.log('ServiceWorker registration failed: ', err);
                });
              });
            }
          `}
        </Script>

          <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is AngelX and how does it work for USDT to INR exchange?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "AngelX is a trusted India-based crypto exchange app founded in 2021, specializing in instant USDT to INR conversions without KYC. Download the AngelX Apk, sign in with your mobile number, deposit USDT via TRC20/BEP20/ERC20, and get INR payouts to any Indian bank in 30 minutes."
    }
  },{
    "@type": "Question",
    "name": "Can I sell USDT for INR on AngelX without KYC?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Right—AngelX does not perform KYC for any type of USDT-to-INR trade. No PAN, Aadhaar or documents needed."
    }
  },{
    "@type": "Question",
    "name": "What are the best USDT rates on AngelX?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "AngelX provides premium USDT rates above market levels for maximum INR payouts. Check live, transparent USDT pricing in the app, sourced from Binance and WazirX, with real-time data for TRC20, BEP20, and ERC20 networks—no hidden fees."
    }
  },{
    "@type": "Question",
    "name": "How long does it take to deposit USDT and withdraw INR on AngelX?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Deposits into your USDT wallet (a TRC20, BEP20 or ERC20 one) are confirmed super quickly in only 1-2 minutes. Your sell order now or INR is credited to your Indian bank instantaneously in 30 min via IMPS or RTGS which are relatively faster than the most platforms."
    }
  },{
    "@type": "Question",
    "name": "Is AngelX Apk safe and free to download?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Certainly, the AngelX Apk is 100% free and safe with auto-update. Since 2021, thousands of crypto users have relied upon it for some anonymous USDT to INR swaps and real-time portfolio tracking around the clock- without charges or risking privacy."
    }
  },{
    "@type": "Question",
    "name": "Which bank accounts can I link for AngelX INR payouts?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Link any Indian bank account (yours or even rental) on AngelX—no verification required."
    }
  },{
    "@type": "Question",
    "name": "Does AngelX support all USDT networks for deposits?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Yes, AngelX handles TRC20, BEP20, ERC20, and more for seamless USDT deposits from any wallet. Approvals are instant (1-2 minutes), making it the best crypto exchange for Indians converting stablecoins to INR."
    }
  },{
    "@type": "Question",
    "name": "How can I get 24/7 support for AngelX USDT to INR issues?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "AngelX offers round-the-clock live chat and phone support from real agents. Track transactions in-app, grab instant statements, or reach out anytime for help with rates, deposits, or withdrawals."
    }
  }]
}`
          }}
        />

<script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
            {
              "@context": "https://schema.org/",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Instant USDT-to-INR Exchange",
                  "item": "https://www.angelx.com.in/exchange"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Login to sell USDT",
                  "item": "https://www.angelx.com.in/login"
                }
              ]
            }
            `,
          }}
        />
          
      </body>
    </html>
  );
}
