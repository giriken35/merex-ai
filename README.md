# MerEx AI (メルエクス)

> AliExpress等の海外商品から、メルカリ・メルカリShopsで「売れるタイトル・検索SEOキーワード・トラブル防止説明文」を10秒で自動生成する物販セラー特化SaaS。

## 🚀 特徴
- **40文字最適化タイトル**: メルカリの文字数制限とクリック率（CTR）を最大化する構成
- **海外製品免責文の自動挿入**: インポート品特有の初期キズ・スレに関するトラブル・低評価（★1）を未然に防止
- **検索キーワード・ハッシュタグ網羅**: 検索アルゴリズムを考慮した関連語句の自動展開
- **Stripe / Gumroad 決済直結**: 買い切り$19のライセンス販売モデル

## 🛠️ 技術スタック
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## 📦 セットアップ
```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 🌐 デプロイ
Vercelにリポジトリを連携するだけで、即座にビルド・公開されます。
環境変数:
- `NEXT_PUBLIC_CHECKOUT_URL`: StripeまたはGumroadの決済リンクURL
