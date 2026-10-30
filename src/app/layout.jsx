import { SiteHeader } from "@/components/header/site-header";
import { siteConfig } from "@/config/site";
import { instrumentSerif, inter, syne } from "./fonts";
import "./globals.css";

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
};

export const viewport = {
  themeColor: "#0b0b0d",
  colorScheme: "dark",
};

// The site is Night-first: the body carries the tone, so every component
// reads Paper text and soft mint from the role tokens.
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} ${instrumentSerif.variable}`}>
      <body data-tone="night">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
