import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Detector Mufa 2026 | Policía Federal de la Scaloneta",
  description: "Emití actas de infracción oficiales por mufa y salá a tus amigos. Análisis de riesgo, retos para anular, y penalizaciones instantáneas.",
  openGraph: {
    title: "Detector Mufa 2026 🚨",
    description: "Analizá el nivel de mufa de tus amigos y emití su acta de infracción para obligarlos a anularla.",
    type: "website",
    locale: "es_AR",
  },
  themeColor: "#ef4444",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
