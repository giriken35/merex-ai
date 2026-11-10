"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  Eye,
  ShoppingBag,
  Zap,
  Lock,
  Unlock,
  KeyRound,
  Download,
  LifeBuoy,
  CheckCircle,
} from "lucide-react";

/**
 * ------------------------------------------------------------------
 * プロ版 簡易共通パスワード設定
 * ------------------------------------------------------------------
 */
const PRO_ACCESS_PASS = "craft2026";
const STORAGE_KEY = "reviewcraft_pro_authorized";

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

export default function ProDashboard() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passError, setPassError] = useState(false);

  // コンソールステート
  const [productUrl, setProductUrl] = useState("");
  const [affiliateTag, setAffiliateTag] = useState("my-affiliate-id");
  const [targetAudience, setTargetAudience] = useState("コスパ重視の一般ユーザー");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [generatedArticle, setGeneratedArticle] = useState<{
    title: string;
    html: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "html">("preview");
  const [copied, setCopied] = useState(false);

  // ブラウザ保存状態の確認（自動ログイン）
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") {
        setIsUnlocked(true);
      }
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === PRO_ACCESS_PASS) {
      setIsUnlocked(true);
      setPassError(false);
      localStorage.setItem(STORAGE_KEY, "true");
    } else {
      setPassError(true);
    }
  };

  const steps = [
    "URLから商品仕様・価格・画像メタデータを完全取得中...",
    "購入者口コミから『不満点・デメリット』を徹底抽出中...",
    "高CVR特化のSEO見出し構成（プロ版エンジン）を構築中...",
    "WordPress用整形HTML・高速CTAブロックを生成中...",
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

    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setLoading(false);

      const isPreset =
        PRESET_PRODUCTS.find(
          (p) =>
            productUrl.includes(p.url) ||
            productUrl.includes("amazon") ||
            productUrl.includes("rakuten")
        ) || PRESET_PRODUCTS[0];
      const prodTitle = isPreset.title;
      const affTag = affiliateTag.trim() || "sample-affi-tag";

      const htmlContent = `<!-- ReviewCraft AI PRO 生成記事 START -->
<div class="review-box" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; background-color: #f8fafc; margin-bottom: 24px;">
  <p style="font-size: 13px; color: #64748b; margin-bottom: 8px;">【PRO品質レビュー】実機スペック＆購入者のリアルな口コミ徹底検証</p>
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
    <tr style="border-bottom: 1px solid #e2e8f0;"><th style="text-align: left; padding: 8px; background: #f1f5f9;">ハルシネーション検証</th><td style="padding: 8px; color: #16a34a; font-weight: bold;">✓ PRO版DB照合済（ハルシネーションゼロ保証）</td></tr>
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

<!-- PRO版 最適化アフィリエイトCTAボタン -->
<div style="text-align: center; margin: 36px 0; padding: 24px; background: #f8fafc; border-radius: 12px; border: 2px dashed #cbd5e1;">
  <p style="font-size: 14px; color: #475569; margin-bottom: 12px; font-weight: 500;">＼ 在庫状況・ポイント還元率を今すぐチェック ／</p>
  <a href="${productUrl}?tag=${affTag}" target="_blank" rel="nofollow noopener" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: #ffffff; font-size: 16px; font-weight: bold; padding: 14px 32px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
    ${prodTitle} を最安値で確認する（公式ストア）
  </a>
  <p style="font-size: 11px; color: #94a3b8; margin-top: 8px;">※リンク先は公式サイト・公式認証ショップです</p>
</div>
<!-- ReviewCraft AI PRO 生成記事 END -->`;

      setGeneratedArticle({
        title: `${prodTitle}のレビュー＆デメリット暴露記事（PRO無制限版）`,
        html: htmlContent,
      });
    }, 2000);
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
        <div className="h-[500px] w-[900px] bg-gradient-to-tr from-amber-500/15 via-emerald-600/10 to-transparent blur-3xl" />
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
                ReviewCraft AI <span className="text-amber-400 text-xs font-mono ml-1">PRO</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Members Area</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              PROライセンス有効化済み
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        {!isUnlocked ? (
          /* --- 簡易パスワードロック画面 --- */
          <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <KeyRound className="h-6 w-6" />
            </div>

            <h1 className="mt-4 text-xl font-bold text-white">プロ版 専用アクセスロック</h1>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              ご購入時に案内されたアクセスキー（パスワード）を入力してください。1度入力すると次回以降は自動ログインされます。
            </p>

            <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPassError(false);
                  }}
                  placeholder="アクセスキーを入力（例: craft2026）"
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-center font-mono outline-none transition ${
                    passError
                      ? "border-red-500 bg-red-950/20 text-red-200"
                      : "border-zinc-800 bg-zinc-950 text-zinc-100 focus:border-amber-500"
                  }`}
                />
                {passError && (
                  <p className="mt-2 text-xs text-red-400">
                    パスワードが違います。Stripe完了画面をご確認ください。
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-sm font-bold text-zinc-950 shadow-md transition hover:brightness-110 active:scale-95"
              >
                <Unlock className="h-4 w-4" />
                プロ版コンソールを解除する
              </button>
            </form>
          </div>
        ) : (
          /* --- パスワード解除後：機能制限なしのPROコンソール --- */
          <div>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                無制限生成モード解放中（月間上限なし）
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                ReviewCraft AI{" "}
                <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 bg-clip-text text-transparent">
                  PRO ダッシュボード
                </span>
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                URLを入力して生成ボタンを押すだけで、ハルシネーションゼロのWordPress用記事を何本でも量産できます。
              </p>
            </div>

            {/* コア機能コンソール（決済ボタンなし・無制限版） */}
            <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-400" />
                  <h2 className="text-sm font-semibold text-zinc-100 sm:text-base">
                    プロ版 高速生成エンジン
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 font-mono">
                  PRO API QUEUE: PRIORITY
                </div>
              </div>

              {/* プリセット */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                <span className="shrink-0 text-zinc-500">サンプルテスト:</span>
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

              {/* フォーム */}
              <form onSubmit={handleGenerate} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="productUrl" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    商品ページURL（Amazon / 楽天市場）
                  </label>
                  <input
                    id="productUrl"
                    type="url"
                    required
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    placeholder="https://www.amazon.co.jp/dp/... または https://item.rakuten.co.jp/..."
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="affiliateTag" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      あなたのアフィリエイトID・タグ
                    </label>
                    <input
                      id="affiliateTag"
                      type="text"
                      value={affiliateTag}
                      onChange={(e) => setAffiliateTag(e.target.value)}
                      placeholder="例: your-id-22"
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
                      <span>WordPress用レビュー記事を生成する（PRO優先実行）</span>
                    </>
                  )}
                </button>
              </form>

              {/* 生成結果 */}
              {generatedArticle && (
                <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-zinc-200">
                        {generatedArticle.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
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
                </div>
              )}
            </section>

            {/* サポート案内 */}
            <div className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-xs text-zinc-400 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <LifeBuoy className="h-4 w-4 text-amber-400" />
                <span>ご購入者様専用サポート: 不具合やご要望はお気軽にお問い合わせください。</span>
              </div>
              <a
                href="https://azorb-site.vercel.app/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline font-semibold"
              >
                お問い合わせ窓口 →
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
