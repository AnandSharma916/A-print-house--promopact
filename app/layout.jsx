import './styles/style.css';
import './styles/animations.css';
import { FONT_STYLESHEETS, VENDOR_STYLESHEETS } from '@/lib/vendors';
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL('https://www.aiphplayingcards.in'),
  title: {
    default: 'A India Print House — Leading Playing Cards Manufacturer in India',
    template: '%s',
  },
  icons: {
    icon: [
      { url: '/img/favicon.ico', sizes: 'any' },
      { url: '/img/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/img/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [{ url: '/img/apple-touch-icon.png', sizes: '180x180' }],
  },
  verification: {
    google: '4BikwGhq2ymnSfqD9Tg3XlO18t3SWOdKQkPl5_uXfI8',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Fonts and vendor CSS stay on their CDNs so the cascade matches the
            original site exactly; the JS counterparts load from lib/vendors.js. */}
        {[...FONT_STYLESHEETS, ...VENDOR_STYLESHEETS].map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KL7W1JL8T1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-KL7W1JL8T1');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
