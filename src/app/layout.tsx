import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "디스콜 공식판매몰 | 거품치약 전문 쇼핑몰",
  description:
    "온 가족이 안심하고 사용할 수 있는 프리미엄 거품치약. 성인용, 어린이용, 영유아용 다양한 라인업을 만나보세요.",
  keywords: [
    "디스콜",
    "거품치약",
    "성인용치약",
    "어린이용치약",
    "영유아용치약",
    "구강관리",
  ],
  openGraph: {
    title: "디스콜 공식판매몰",
    description: "온 가족이 안심하고 사용할 수 있는 프리미엄 거품치약",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
