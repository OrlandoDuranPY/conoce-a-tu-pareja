import type { Metadata } from "next";
import { Dancing_Script, Nunito, Playfair_Display } from "next/font/google";
import { FloatingHeartsBg } from "@/components/floating-hearts-bg";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fontHeading = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const fontBody = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const fontScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Conoce a tu pareja",
  description:
    "Respondan preguntas juntos, descubran sus coincidencias y dejen una carta especial para la otra persona.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${fontHeading.variable} ${fontBody.variable} ${fontScript.variable} h-full antialiased`}
    >
      <body className="page-backdrop flex min-h-full flex-col">
        <FloatingHeartsBg />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
