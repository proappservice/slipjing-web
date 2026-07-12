import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "SlipJing — ตรวจสลิปโอนเงินจริงหรือปลอม ด้วย API เดียว",
  description:
    "API ตรวจสอบสลิปโอนเงินธนาคารไทย จับสลิปปลอมและสลิปซ้ำอัตโนมัติ รู้ผลใน 1 วินาที เริ่มใช้ฟรี 20 เครดิต",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${notoSansThai.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
