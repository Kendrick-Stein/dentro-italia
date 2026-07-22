import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "http://localhost:3000";
const pageUrl = `${siteOrigin}${basePath}/`;
const cardUrl = `${siteOrigin}${basePath}/og.png`;
const title = "Dentro l’Italia — Un viaggio nella lingua e nell’arte";
const description = "Un maestro e tre studenti attraversano l’arte italiana in un viaggio interattivo.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: pageUrl,
  },
  icons: {
    icon: `${basePath}/characters/teacher.webp`,
    shortcut: `${basePath}/characters/teacher.webp`,
  },
  openGraph: {
    title,
    description,
    url: pageUrl,
    type: "website",
    locale: "it_IT",
    images: [
      {
        url: cardUrl,
        width: 1200,
        height: 630,
        alt: "Dentro l’Italia — quattro viaggiatori attraversano l’arte italiana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [cardUrl],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
