import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "http://localhost:3000";
const pageUrl = `${siteOrigin}${basePath}/`;
const cardUrl = `${siteOrigin}${basePath}/og.png`;
const title = "Dentro l’Italia — 我们的意大利语旅程";
const description = "一位男老师、三位学生，穿行在意大利名画与雕塑中的互动式语言学习故事。";

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
        alt: "Dentro l’Italia — four people travelling through Italian art",
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
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
