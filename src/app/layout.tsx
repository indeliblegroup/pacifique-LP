import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body-family",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-heading-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PACIFIQUE! - Camara Privada de Conciliacao e Mediacao",
  description:
    "Resolucao pacifica de conflitos com excelencia, seguranca juridica e celeridade. Credenciada pelo CNJ e TJPE. Recife/PE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${merriweather.variable} scroll-smooth`}
    >
      <body className="font-body text-text-body antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
