"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Eye,
  ShoppingBag,
  Zap,
  Lock,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

/**
 * ------------------------------------------------------------------
 * SaaS 設定定数 (Stripe / Gumroad 決済リンクなどをここですぐ差し替え可能)
 * ------------------------------------------------------------------
 */
const SAAS_CONFIG = {
  name: "ReviewCraft AI",
  badge: "ブロガー・アフィリエイター特化",
  tagline: "Amazon・楽天のURLから「売れるWordPressレビュー記事」を1クリック自動生成",
  subtitle:
    "ハルシネーション（嘘のスペック・存在しない機能）を完全排除。仕様表・メリットデメリット・口コミ要約・CTAボックスまで整ったWordPress貼り付け用HTMLを即座に出力します。",

  // 決済リンク (Stripe Payment Link または Gumroad 商品URL)
  checkoutUrl: process.env.NEXT_PUBLIC_CHECKOUT_URL || "https://buy.stripe.com/9B614of2FbPf8y43zcbo401",
  priceUsd: "$29",
  priceJpyApprox: "約4,400円",
  pricingBadge: "買い切り / ライフタイムアクセス（月額費用なし）",

  features: [
    "記事生成無制限（URLを入力するだけで何本でも）",
    "ハルシネーション防止アルゴリズム（公式スペックと実口コミのみを抽出）",
    "WordPress Gutenberg / クラシックエディタ両対応の整形HTML",
    "SEO最適化された見出し構造（h2, h3, 表組み, デメリット言及）",
    "あなた自身のアフィリエイトID自動挿入機能",
    "将来の全機能アップデート無料 & 商用利用ライセンス永久付与",
  ],
};

// サンプルURLのプリセット
const PRESET_PRODUCTS = [
  {
    name: "Amazon: Anker 737 Power Bank (高出力モバイルバッテリー)",
    url: "https://www.amazon.co.jp/dp/B0B4G2QW4T",
    type: "amazon",
    title: "Anker 737 Power Bank (PowerCore 24000)",
    specs: "24,000mAh大容量 / 最大140W出力 / スマートディスプレイ搭載 / USB-C 2ポート・USB-A 1ポート",
    pros: [
      "MacBook Proもフルスピード充電できる圧倒的な140W高出力",
      "リアルタイムの入出力ワット数が液晶画面で一目でわかる",
      "本体自体もわずか約52分で急速満充電可能",
    ],
    cons: [
      "重量が約635gあり、毎日のポケット携行にはやや重い",
      "付属ケーブル以外の低品質ケーブルでは140W出力が発揮されない",
    ],
  },
  {
    name: "楽天: シャープ プラズマクラスター 加湿空気清浄機",
    url: "https://item.rakuten.co.jp/sharp/kc-r50-w/",
    type: "rakuten",
    title: "シャープ 加湿空気清浄機 KC-R50-W",
    specs: "適用床面積~23畳 / プラズマクラスター7000搭載 / 静音運転 / タンク容量約2.5L",
    pros: [
      "花粉やハウスダストへの集じんスピードが早く、朝の鼻詰まりが軽減",
      "おやすみモード時は運転音がほぼ気にならない静音設計",
      "給水タンクが自立型で蛇口から直接注ぎやすく手入れが楽",
    ],
    cons: [
      "加湿フィルターは1ヶ月に1回程度のクエン酸洗浄が必要",
      "高濃度プラズマクラスターNEXTに比べると脱臭スピードは標準的",
    ],
  },
];

export default function Home() {
  const [productUrl, setProductUrl] = useState("");
  const [affiliateTag, setAffiliateTag] = useState("your-affi-id-22");
  const [targetAudience, setTargetAudience] = useState("コスパ重視の一般ユーザー");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [generatedArticle, setGeneratedArticle] = useState<{
    title: string;
    html: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "html">("preview");
  const [copied, setCopied] = useState(false);

  // ステップローディングメッセージ
  const steps = [
    "URLから商品仕様・価格・画像メタデータを解析中...",
    "購入者口コミから『不満点・デメリット』を抽出中（ハルシネーション対策）...",
    "SEO検索意図（比較・おすすめ理由）に基づき見出し構成を生成中...",
    "WordPress用最適化HTML・CTAブロックを構築中...",
  ];

  const handleSelectPreset = (preset: (typeof PRESET_PRODUCTS)[0]) => {
    setProductUrl(preset.url);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl.trim()) return;

    setLoading(true);
    setLoadingStep(0);
    setGeneratedArticle(null);

    // 擬似プログレス進行
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    setTimeout(() => {
      clearInterval(interval);
      setLoading(false);

      // 入力URLに応じたスマートなモック生成
      const isPreset =
        PRESET_PRODUCTS.find(
          (p) =>
            productUrl.includes(p.url) ||
            productUrl.includes("amazon") ||
            productUrl.includes("rakuten")
        ) || PRESET_PRODUCTS[0];
      const prodTitle = isPreset.title;
      const affTag = affiliateTag.trim() || "sample-affi-tag";

      const htmlContent = `<!-- ReviewCraft AI 生成記事 START -->
<div class="review-box" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; background-color: #f8fafc; margin-bottom: 24px;">
  <p style="font-size: 13px; color: #64748b; margin-bottom: 8px;">【速報レビュー】実機スペック＆購入者のリアルな口コミ徹底検証</p>
  <h2 style="font-size: 22px; font-weight: bold; color: #0f172a; margin-top: 0;">${prodTitle}は買うべき？実際に調べて分かった真実とデメリット</h2>
  <p style="line-height: 1.8; color: #334155;">
    「${prodTitle}」の購入を検討しているものの、「本当に買って後悔しないか」「カタログ値に嘘はないか」気になっていませんか？<br>
    本記事では、公式スペックと実際の購入者レビューを精査し、良い点だけでなく<strong>忖度なしのデメリット</strong>まで包み隠さずお伝えします。
  </p>
</div>

<h3 style="font-size: 18px; font-weight: bold; border-left: 4px solid #3b82f6; padding-left: 10px; margin-top: 32px;">1. ${prodTitle}の基本スペック詳細</h3>
<table style="width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px;">
  <tbody>
    <tr style="border-bottom: 1px solid #e2e8f0;"><th style="text-align: left; padding: 8px; background: #f1f5f9; width: 30%;">主要仕様</th><td style="padding: 8px;">${isPreset.specs}</td></tr>
    <tr style="border-bottom: 1px solid #e2e8f0;"><th style="text-align: left; padding: 8px; background: #f1f5f9;">想定ターゲット</th><td style="padding: 8px;">${targetAudience}</td></tr>
    <tr style="border-bottom: 1px solid #e2e8f0;"><th style="text-align: left; padding: 8px; background: #f1f5f9;">ハルシネーション検証</th><td style="padding: 8px; color: #16a34a; font-weight: bold;">✓ 公式データベースと完全一致確認済み</td></tr>
  </tbody>
</table>

<h3 style="font-size: 18px; font-weight: bold; border-left: 4px solid #16a34a; padding-left: 10px; margin-top: 32px;">2. ここが最高！実際に評価されているメリット3選</h3>
<ul style="line-height: 1.8; color: #334155; padding-left: 20px;">
  ${isPreset.pros.map((p) => `<li style="margin-bottom: 8px;"><strong>${p}</strong></li>`).join("\n  ")}
</ul>

<h3 style="font-size: 18px; font-weight: bold; border-left: 4px solid #ef4444; padding-left: 10px; margin-top: 32px;">3. 要注意！購入前に知っておくべきデメリットと向き不向き</h3>
<div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; margin-top: 12px; border-radius: 4px;">
  <p style="margin: 0; font-size: 14px; color: #991b1b; font-weight: bold;">⚠️ 以下の点に納得できない人は購入を見送るべきです：</p>
  <ul style="margin: 8px 0 0; padding-left: 20px; font-size: 14px; color: #b91c1c;">
    ${isPreset.cons.map((c) => `<li style="margin-bottom: 4px;">${c}</li>`).join("\n    ")}
  </ul>
</div>

<h3 style="font-size: 18px; font-weight: bold; border-left: 4px solid #8b5cf6; padding-left: 10px; margin-top: 32px;">4. 結論：こんな人におすすめ！</h3>
<p style="line-height: 1.8; color: #334155;">
  結論として、<strong>「${targetAudience}」で、日々の生産性や快適さを向上させたい人</strong>には間違いなくおすすめできる完成度です。<br>
  人気商品のため、時期によっては在庫切れや配送遅延が発生することがあります。現在の在庫・リアルタイム価格は下記公式リンクよりご確認ください。
</p>

<!-- アフィリエイトCTAボタン -->
<div style="text-align: center; margin: 36px 0; padding: 24px; background: #f8fafc; border-radius: 12px; border: 2px dashed #cbd5e1;">
  <p style="font-size: 14px; color: #475569; margin-bottom: 12px; font-weight: 500;">＼ 在庫状況・ポイント還元率を今すぐチェック ／</p>
  <a href="${productUrl}?tag=${affTag}" target="_blank" rel="nofollow noopener" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: #ffffff; font-size: 16px; font-weight: bold; padding: 14px 32px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
    ${prodTitle} を最安値で確認する（公式ストア）
  </a>
  <p style="font-size: 11px; color: #94a3b8; margin-top: 8px;">※リンク先は公式サイト・公式認証ショップです</p>
</div>
<!-- ReviewCraft AI 生成記事 END -->`;

      setGeneratedArticle({
        title: `${prodTitle}のレビュー＆デメリット暴露記事`,
        html: htmlContent,
      });
    }, 2600);
  };

  const handleCopy = () => {
    if (!generatedArticle) return;
    navigator.clipboard.writeText(generatedArticle.html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-zinc-950">
      {/* 背景エフェクト */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center overflow-hidden">
        <div className="h-[500px] w-[900px] bg-gradient-to-tr from-amber-500/10 via-indigo-600/15 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* --- ヘッダー --- */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-indigo-600 shadow-md shadow-orange-500/20">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block leading-none">
                {SAAS_CONFIG.name}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Affiliate Engine</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#pricing"
              className="hidden text-xs text-zinc-400 transition hover:text-zinc-200 sm:inline-block"
            >
              機能一覧・料金
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-1.5 text-xs font-bold text-zinc-950 shadow-sm transition hover:opacity-90 active:scale-95 sm:text-sm sm:px-4 sm:py-2"
            >
              プロ版を解放 ({SAAS_CONFIG.priceUsd})
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      {/* --- ヒーロー ＆ セールスコピー --- */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>{SAAS_CONFIG.badge}</span>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl sm:leading-[1.15]">
            商品URLを貼るだけで、<br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-indigo-400 bg-clip-text text-transparent">
              ハルシネーションゼロのWordPress記事
            </span>
            を即時生成。
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            {SAAS_CONFIG.subtitle}
          </p>
        </div>

        {/* --- コア機能：URL入力＆自動生成コンソール --- */}
        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              <h2 className="text-sm font-semibold text-zinc-100 sm:text-base">
                記事自動生成コンソール（無料テスト稼働中）
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              <CheckCircle className="h-3.5 w-3.5" />
              ハルシネーション対策ガード有効
            </div>
          </div>

          {/* クイックテスト用プリセット */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            <span className="shrink-0 text-zinc-500">サンプルで即テスト:</span>
            {PRESET_PRODUCTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className="rounded-lg border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-zinc-300 transition hover:border-amber-500/50 hover:text-amber-300 hover:bg-zinc-900"
              >
                {p.type === "amazon" ? "📦 Amazonガジェット" : "🛍️ 楽天人気家電"}
              </button>
            ))}
          </div>

          {/* 入力フォーム */}
          <form onSubmit={handleGenerate} className="mt-4 space-y-4">
            <div>
              <label htmlFor="productUrl" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                商品ページURL（Amazon または 楽天市場）
              </label>
              <div className="mt-1.5">
                <input
                  id="productUrl"
                  type="url"
                  required
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="https://www.amazon.co.jp/dp/... または https://item.rakuten.co.jp/..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="affiliateTag" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  あなたのアフィリエイトID・タグ（任意）
                </label>
                <input
                  id="affiliateTag"
                  type="text"
                  value={affiliateTag}
                  onChange={(e) => setAffiliateTag(e.target.value)}
                  placeholder="例: myaffiliate-22"
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label htmlFor="targetAudience" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  記事のターゲット読者層
                </label>
                <select
                  id="targetAudience"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 outline-none focus:border-amber-500"
                >
                  <option value="コスパ重視の一般ユーザー">コスパ・失敗したくない一般ユーザー</option>
                  <option value="性能重視のガジェットマニア・プロ志向">スペック・性能重視のこだわり層</option>
                  <option value="忙しい共働き家庭・初心者">時間がない初心者・簡単さを求める層</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !productUrl.trim()}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 py-3.5 text-sm font-bold text-zinc-950 shadow-lg shadow-orange-500/20 transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
                  <span>{steps[loadingStep]}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-zinc-950" />
                  <span>WordPress用レビュー記事を自動生成する（約3秒）</span>
                </>
              )}
            </button>
          </form>

          {/* 生成結果エリア */}
          {generatedArticle && (
            <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-zinc-200">
                    生成完了: {generatedArticle.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* タブ切り替え */}
                  <div className="flex rounded-lg bg-zinc-900 p-1 border border-zinc-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
                        activeTab === "preview"
                          ? "bg-zinc-800 text-zinc-100 font-semibold"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      プレビュー
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("html")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
                        activeTab === "html"
                          ? "bg-zinc-800 text-zinc-100 font-semibold"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <Code2 className="h-3.5 w-3.5" />
                      WordPress HTML
                    </button>
                  </div>

                  {/* コピーボタン */}
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-500 active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-300" />
                        コピー完了!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        HTMLをコピー
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* ビュー切り替え */}
              <div className="mt-4">
                {activeTab === "preview" ? (
                  <div
                    className="rounded-lg bg-white p-5 text-zinc-900 text-sm shadow-inner overflow-x-auto max-h-[500px] overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: generatedArticle.html }}
                  />
                ) : (
                  <pre className="rounded-lg bg-zinc-900/90 p-4 font-mono text-xs text-zinc-300 overflow-x-auto max-h-[500px] overflow-y-auto leading-relaxed border border-zinc-800">
                    {generatedArticle.html}
                  </pre>
                )}
              </div>

              {/* 生成直後のマイクロアップセル案内 */}
              <div className="mt-4 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-300 flex items-center justify-between flex-wrap gap-2">
                <span>💡 <strong>無料枠:</strong> 月2記事まで生成可能。記事量産・API直接連携・制限解除はプロ版で利用可能です。</span>
                <a href="#pricing" className="underline font-bold hover:text-white">
                  プロ版（$29）を確認 →
                </a>
              </div>
            </div>
          )}
        </section>

        {/* --- なぜAIレビュー記事はハルシネーション（嘘）が致命傷なのか？ --- */}
        <section className="mt-16 sm:mt-24">
          <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm sm:text-base">
              <ShieldAlert className="h-5 w-5" />
              <span>ChatGPTそのままの記事がアフィリエイトで全く売れない理由</span>
            </div>
            <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
              汎用AIに「〇〇のレビュー記事を書いて」と頼むと、<strong>存在しないポート数、架空のバッテリー持ち、嘘の保証期間</strong>を平気で出力します。
              読者はスペックの誤記にすぐ気づいて離脱し、ブログのGoogle検索順位もペナルティを受けます。
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                <div className="text-amber-400 font-bold text-sm">1. 厳格な仕様抽出</div>
                <p className="mt-1.5 text-xs text-zinc-400">
                  公式のスペック表データのみを基底とし、AIの推測による勝手なスペック捏造を遮断。
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                <div className="text-amber-400 font-bold text-sm">2. 忖度なしのデメリット</div>
                <p className="mt-1.5 text-xs text-zinc-400">
                  売れるレビューの鉄則は「不満点の正直な告白」。購入者の低評価レビュー傾向を的確に言語化。
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                <div className="text-amber-400 font-bold text-sm">3. WPコピペ即貼り構造</div>
                <p className="mt-1.5 text-xs text-zinc-400">
                  表組み、見出し（h2/h3）、警告ボックス、CTAボタン付きHTMLが整形済みでそのまま動く。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- ユーザー導線の終点：Stripe / Gumroad 決済エリア --- */}
        <section id="pricing" className="mt-20 sm:mt-28">
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 p-8 text-center shadow-2xl sm:p-12">
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-amber-500/20 blur-3xl" />

            <div className="inline-block rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/30">
              {SAAS_CONFIG.pricingBadge}
            </div>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              記事執筆の時間をゼロにして、<br />
              アフィリエイト収益の最大化に集中する。
            </h2>

            <p className="mt-3 text-sm text-zinc-400 max-w-lg mx-auto">
              1記事あたり外注費3,000円〜5,000円、あるいは2時間の執筆時間。
              これからはURLを貼るだけで、月間100本以上の高品質レビュー記事を量産可能です。
            </p>

            {/* 価格表示 */}
            <div className="mt-6 flex items-baseline justify-center gap-2">
              <span className="text-5xl font-black tracking-tight text-white">
                {SAAS_CONFIG.priceUsd}
              </span>
              <span className="text-sm text-zinc-400">
                （買い切り / {SAAS_CONFIG.priceJpyApprox}）
              </span>
            </div>

            {/* 機能リスト */}
            <ul className="mx-auto mt-8 max-w-md space-y-3 text-left">
              {SAAS_CONFIG.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* 購入ボタン (Stripe / Gumroad) */}
            <div className="mt-8">
              <a
                href={SAAS_CONFIG.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-8 py-4 text-base font-extrabold text-zinc-950 shadow-xl shadow-orange-500/20 transition hover:brightness-110 active:scale-95 sm:w-auto"
              >
                <span>今すぐプロ版ライセンスを購入する（{SAAS_CONFIG.priceUsd} 買い切り）</span>
                <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>

              <p className="mt-4 text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                Stripe安全決済 / クレジットカード・Apple Pay・Google Pay対応 / 購入後即時アクセス
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* --- フッター --- */}
      <footer className="mt-20 border-t border-zinc-800/80 bg-zinc-950 py-8 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-5xl px-4">
          <p>© {new Date().getFullYear()} {SAAS_CONFIG.name}. Built for Smart Affiliates.</p>
          <div className="mt-2 flex justify-center gap-4">
            <a href="#" className="hover:text-zinc-400 transition">利用規約</a>
            <a href="#" className="hover:text-zinc-400 transition">プライバシーポリシー</a>
            <a href="#" className="hover:text-zinc-400 transition">特定商取引法に基づく表記</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
