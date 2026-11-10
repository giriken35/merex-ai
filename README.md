# Azorb SaaS 量産用スターターテンプレート

Next.js (App Router) + Tailwind CSS + TypeScript で構築された、マイクロSaaS / AIツール量産用の最小構成ボイラープレートです。

## ✨ 特徴

1. **コピペですぐ動く最小モダン構成**
   - Vercel / Linear 風の洗練されたダークテーマ UI
   - レスポンシブ対応、Tailwind CSS + Lucide Icons
2. **AIコア機能の差し替えプレースホルダー配置**
   - 画面中央に、今後AIが自動生成・構築するメイン機能コンポーネントを埋め込める専用エリアを完備。
   - すぐに動作確認できるインタラクティブな入力・出力デモ付き。
3. **Stripe / Gumroad 決済導線（購入ボタン）をビルトイン**
   - 画面最下部に「購入CTA（料金プラン、特徴リスト、決済リンク）」を配置済み。
   - `.env.local` または `app/page.tsx` の設定値を書き換えるだけで決済URLを切り替え可能。

---

## 🚀 クイックスタート

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 開発サーバーの起動
```bash
npm run dev
```
ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

---

## 🛠 SaaS量産時のカスタマイズ手順（3分で完了）

### ステップ1: 基本情報と決済URLを変更する
[`app/page.tsx`](./app/page.tsx) の先頭にある `SAAS_CONFIG` オブジェクトを編集します：

```ts
const SAAS_CONFIG = {
  name: "あなたのSaaS名",
  badgeText: "🚀 新機能リリース",
  heroTitle: "キャッチコピー",
  heroTitleHighlight: "ハイライト部分",
  heroSubtitle: "サービス説明文...",
  
  // Stripe Payment Link または Gumroad 商品URL
  checkoutUrl: process.env.NEXT_PUBLIC_CHECKOUT_URL || "https://buy.stripe.com/...",
  checkoutProvider: "Stripe", // または "Gumroad"

  pricing: {
    planName: "プロ版（買い切り）",
    price: "¥2,980",
    originalPrice: "¥9,800",
    badge: "期間限定 70% OFF",
    features: [
      "機能1",
      "機能2",
      ...
    ],
  },
};
```

### ステップ2: 画面中央のプレースホルダーにAI機能を差し込む
[`app/page.tsx`](./app/page.tsx) 内の `#feature-core` （AI Core Placeholder）部分に、AIモデル（Gemini API、OpenAI APIなど）の呼び出し処理や専用コンポーネントを配置します。

### ステップ3: デプロイ
Vercel や Cloudflare Pages、Netlify 等にリポジトリをプッシュしてデプロイします。
環境変数 `NEXT_PUBLIC_CHECKOUT_URL` に本番の Stripe / Gumroad 決済URLを設定すれば完了です。
