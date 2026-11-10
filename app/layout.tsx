import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MerEx AI (メルエクス) - AliExpressからメルカリ出品文を一瞬で自動生成",
  description:
    "AliExpress等の海外商品情報から、メルカリ・メルカリShopsで『検索に引っかかり売れる』40字タイトルとトラブル防止付き説明文を1クリックで自動生成。",
  openGraph: {
    title: "MerEx AI - AliExpress輸入セラー特化のメルカリ出品文自動生成ツール",
    description: "コピペで即出品。検索キーワード・輸入免責文・クリック率特化タイトルを瞬時に構築。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
