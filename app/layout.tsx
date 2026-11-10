import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReviewCraft AI - Amazon・楽天URLからWordPressレビュー記事を自動生成",
  description:
    "ハルシネーション対策済み。商品URLを入力するだけで、スペック表・忖度なしのデメリット・口コミ要約・CTA付きWordPress用HTMLを即時生成するアフィリエイト支援ツール。",
  openGraph: {
    title: "ReviewCraft AI - Amazon・楽天URLからWordPressレビュー記事を自動生成",
    description: "ハルシネーション対策済みの高品質アフィリエイトレビュー記事を即座に自動生成。",
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
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-amber-500 selection:text-zinc-950">
        {children}
      </body>
    </html>
  );
}
