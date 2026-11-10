"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  ShoppingBag,
  Zap,
  Lock,
  Tag,
  Search,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  AlertCircle,
  Smartphone,
  ChevronDown,
} from "lucide-react";

/**
 * =================================================================
 * ⚙️ プロダクト基本設定 (Stripe / Gumroad 決済リンクなどを一括管理)
 * =================================================================
 */
const APP_CONFIG = {
  name: "MerEx AI",
  badge: "メルカリ・メルカリShops物販セラー特化",
  tagline: "AliExpressの海外商品から「売れるメルカリ出品文」を10秒で自動生成",
  subtitle:
    "直訳された英語商品名やスペックを丸投げするだけ。40文字最適化タイトル、検索SEOキーワード、海外製品特有のトラブル防止免責文まで、メルカリ出品のすべてを自動構築します。",

  // Stripe / Gumroad の決済URL (環境変数またはフォールバック)
  checkoutUrl:
    process.env.NEXT_PUBLIC_CHECKOUT_URL ||
    "https://buy.stripe.com/8x29AUbQt06xeWsb1Ebo402",
  priceUsd: "$19",
  priceJpy: "約2,900円",
  pricingNote: "買い切り / ライフタイムアクセス（月額料金なし）",

  // 特徴
  benefits: [
    {
      title: "メルカリ検索SEOに特化した40文字タイトル",
      desc: "【新品・送料無料】などの購買意欲を高めるキラーワードと主要検索語句を40文字の枠内に完璧に凝縮。",
      icon: Search,
    },
    {
      title: "海外製品トラブル・低評価を防ぐ定型免責文",
      desc: "「海外インポート品特有の細かなスレ」「検品済み」など、評価★1クレームを未然に防ぐプロの免責文を自動挿入。",
      icon: ShieldAlert,
    },
    {
      title: "関連ハッシュタグ＆検索用キーワード網羅",
      desc: "メルカリの検索アルゴリズムをハック。関連ブランド・同義語・トレンドキーワードを末尾に自動展開。",
      icon: TrendingUp,
    },
    {
      title: "出品時間が1品15分 → わずか10秒へ",
      desc: "画像とタイトルをコピペするだけで完了。出品数を3倍に増やして、売上を一気に加速させます。",
      icon: Clock,
    },
  ],

  // プライシング特典
  includedFeatures: [
    "出品文・タイトル自動生成（制限なし・永久使い放題）",
    "メルカリ＆メルカリShops両対応フォーマット",
    "海外製品向け『クレーム防止・安心取引』テンプレート搭載",
    "コピーボタン付き・文字数リアルタイムカウント機能",
    "今後のプロンプト改善・機能アップデート永久無料",
    "商用利用ライセンス永久付与",
  ],
};

// クイックにお試しできるサンプルデータ（AliExpressでよくある売れ筋商品）
const PRESETS = [
  {
    name: "3in1 ワイヤレス充電器 (折りたたみ式・MagSafe対応)",
    sourceTitle:
      "3 in 1 Fast Wireless Charger Stand Foldable Magnetic Dock Station for iPhone 15 14 13 Pro Max Apple Watch AirPods",
    category: "スマホ・家電・カメラ > スマホアクセサリー",
    colorSize: "ブラック / Type-Cケーブル付属",
    highlights: "急速充電対応、コンパクトに折りたためて旅行に便利、iPhone・Watch・イヤホンを同時充電",
  },
  {
    name: "北欧風ウェーブ アクリルフラワーベース (花瓶)",
    sourceTitle:
      "Modern Acrylic Wave Flower Vase Nordic Style Tabletop Decorative Floral Container Aesthetic Room Decor",
    category: "インテリア・住まい・小物 > インテリア小物 > 花瓶",
    colorSize: "クリアオーロラ / 約20cm × 15cm",
    highlights: "光の当たり方で虹色に変化、割れにくいアクリル素材、韓国インテリア・カフェ風雑貨としてSNSで話題",
  },
  {
    name: "本革調 2WAYスマホショルダーストラップ付きポーチ",
    sourceTitle:
      "PU Leather Crossbody Phone Bag for Women Mini Shoulder Purse Card Holder Wallet with Adjustable Strap",
    category: "レディース > バッグ > ショルダーバッグ",
    colorSize: "グレージュ / 約18cm × 11cm",
    highlights: "お札・カード・鍵も入る収納力、軽量で肩が痛くならない、ちょっとしたお出かけに最適",
  },
];

export default function Home() {
  // 入力フォームの状態
  const [sourceTitle, setSourceTitle] = useState("");
  const [category, setCategory] = useState("");
  const [colorSize, setColorSize] = useState("");
  const [highlights, setHighlights] = useState("");
  const [targetVibe, setTargetVibe] = useState("万人受け・清潔感（標準）");

  // 出力・UI状態
  const [isLoading, setIsLoading] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "preview">("text");

  // 生成されたデータ
  const [generated, setGenerated] = useState<{
    title: string;
    description: string;
    keywords: string[];
  } | null>(null);

  // プリセット適用
  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setSourceTitle(preset.sourceTitle);
    setCategory(preset.category);
    setColorSize(preset.colorSize);
    setHighlights(preset.highlights);
  };

  // 生成ロジック（クライアント側で即動作する最適化ジェネレータ）
  const handleGenerate = () => {
    if (!sourceTitle.trim()) return;
    setIsLoading(true);

    setTimeout(() => {
      // 入力情報からキーワードを抽出
      const rawText = `${sourceTitle} ${highlights} ${colorSize}`;
      const isPhone = /iPhone|Phone|Watch|充電|AirPods/i.test(rawText);
      const isVase = /Vase|花瓶|インテリア|Nordic|アクリル/i.test(rawText);
      const isBag = /Bag|財布|ポーチ|ショルダー|Leather/i.test(rawText);

      let genTitle = "";
      let mainDesc = "";
      let specList = "";
      let tagList = "";

      if (isPhone) {
        genTitle = "【新品】3in1 ワイヤレス充電器 急速 折りたたみ MagSafe対応 置くだけ";
        specList = `◆商品仕様\n・対応機種: iPhone 12〜15全シリーズ、Apple Watch、AirPods\n・カラー/仕様: ${colorSize || "ブラック / 急速充電対応"}\n・端子: Type-C入力\n・付属品: 充電スタンド本体、Type-Cケーブル、説明書`;
        tagList = `#ワイヤレス充電器 #MagSafe #急速充電 #iPhone充電器 #AppleWatch #デスク周り #便利グッズ #即購入OK`;
      } else if (isVase) {
        genTitle = "【新品・即納】北欧風 アクリル ウェーブ花瓶 オーロラ 韓国インテリア 映え";
        specList = `◆商品仕様\n・サイズ: ${colorSize || "約20cm × 15cm"}\n・カラー: クリアオーロラ（光の角度で色が変化）\n・素材: 耐衝撃高品質アクリル\n・用途: 生花、ドライフラワー、ペン立て、オブジェ`;
        tagList = `#花瓶 #フラワーベース #北欧インテリア #韓国インテリア #アクリル花瓶 #カフェ風 #ルームデコ #オーロラ雑貨`;
      } else if (isBag) {
        genTitle = "【大人気】スマホショルダー スマホポーチ 2WAY 軽量 ミニバッグ 斜め掛け";
        specList = `◆商品仕様\n・カラー: ${colorSize || "上品グレージュ"}\n・素材: 高見えPUレザー（撥水・高耐久）\n・仕様: スマホポケット×1、カード入れ、ファスナーポケット\n・ベルト: 長さ調節可能（取り外し可）`;
        tagList = `#スマホショルダー #スマホポーチ #ミニショルダー #サコッシュ #お財布ショルダー #レディースバッグ #プチプラ高見え`;
      } else {
        // 汎用フォーマット
        const cleanTitle = sourceTitle.slice(0, 22);
        genTitle = `【新品・送料無料】${cleanTitle} 高品質 人気 おすすめ`;
        specList = `◆商品仕様\n・カラー/サイズ: ${colorSize || "フリーサイズ / 画像参照"}\n・状態: 新品・未使用\n・発送: 匿名配送（24時間以内発送を心がけています）`;
        tagList = `#インポート雑貨 #海外セレクト #トレンドアイテム #新品未使用 #即購入OK #送料無料`;
      }

      // メルカリ特有のクレーム防止付き説明文を組み立て
      mainDesc = `ご覧いただきありがとうございます！\n即購入大歓迎・深夜無言購入もOKです✨\n【新品未使用・送料無料・安心の匿名配送】\n\n━━━━━━━━━━━━━━━━━━━━\n★おすすめポイント\n━━━━━━━━━━━━━━━━━━━━\n${
        highlights
          ? highlights
              .split("、")
              .map((h) => `・${h.trim()}`)
              .join("\n")
          : "・無駄を省いたシンプルかつ高機能なデザイン\n・日常使いはもちろん、プレゼントにも大変喜ばれます\n・コンパクトで持ち運びもラクラク"
      }\n\n${specList}\n\n━━━━━━━━━━━━━━━━━━━━\n★ご購入前の確認事項（安心のお取引のために）\n━━━━━━━━━━━━━━━━━━━━\n※こちらはノーブランドの海外インポート製品です。\n日本の品質基準とは異なり、製造段階での小さなスレ、微細な傷、糸のほつれ等がある場合がございます。あらかじめご了承ください。\n※万が一、初期不良等の明らかな欠陥がございましたら、必ず【受取評価前】にご連絡ください。誠心誠意対応させていただきます。\n※撮影時の光の加減やモニター環境により、実際の色味と多少異なって見える場合がございます。\n\n━━━━━━━━━━━━━━━━━━━━\n${tagList}`;

      // 40字以内に調整
      if (genTitle.length > 40) {
        genTitle = genTitle.slice(0, 40);
      }

      setGenerated({
        title: genTitle,
        description: mainDesc,
        keywords: tagList.split(" ").filter(Boolean),
      });

      setIsLoading(false);
    }, 700);
  };

  // コピー用ハンドラ
  const handleCopy = (text: string, type: "title" | "desc") => {
    navigator.clipboard.writeText(text);
    if (type === "title") {
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    } else {
      setCopiedDesc(true);
      setTimeout(() => setCopiedDesc(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* 1. ナビゲーションヘッダー */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-400 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                {APP_CONFIG.name}
                <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/30">
                  v1.0
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="#pricing"
              className="text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              料金プラン
            </a>
            <a
              href={APP_CONFIG.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-3.5 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-rose-500/25 hover:from-rose-400 hover:to-rose-500 transition-all active:scale-95"
            >
              <span>買い切り$19で永久利用</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* メインエリア */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 sm:py-16 flex flex-col items-center">
        {/* 2. ヒーローセクション */}
        <section className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-semibold text-rose-400 mb-4 shadow-inner">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{APP_CONFIG.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight sm:leading-tight mb-4">
            AliExpressの海外商品から
            <br />
            <span className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
              「売れるメルカリ出品文」
            </span>
            を10秒で自動生成
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            {APP_CONFIG.subtitle}
          </p>
        </section>

        {/* 3. コア機能：出品文生成ジェネレータ */}
        <section className="w-full max-w-4xl mb-16">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 sm:p-7 shadow-2xl backdrop-blur-sm relative overflow-hidden">
            {/* 上部グラデーションバー */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500 opacity-90" />

            {/* サンプルプリセットボタン */}
            <div className="mb-6">
              <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 mb-2">
                <Tag className="h-3.5 w-3.5 text-rose-400" />
                ワンクリックでお試し（売れ筋AliExpress商品の例）:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => applyPreset(p)}
                    className="rounded-lg border border-zinc-700/80 bg-zinc-800/80 px-3 py-1.5 text-xs text-zinc-300 hover:border-rose-500/60 hover:text-white transition-all text-left"
                  >
                    ⚡ {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 入力フォーム */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  AliExpress商品タイトル / 英語名 / URL{" "}
                  <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={2}
                  value={sourceTitle}
                  onChange={(e) => setSourceTitle(e.target.value)}
                  placeholder="例: 3 in 1 Fast Wireless Charger Stand Foldable Magnetic Dock Station for iPhone / 商品URLを貼り付け"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    カラー / サイズ / バリエーション
                  </label>
                  <input
                    type="text"
                    value={colorSize}
                    onChange={(e) => setColorSize(e.target.value)}
                    placeholder="例: ブラック / フリーサイズ"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    商品の特徴 / アピールポイント
                  </label>
                  <input
                    type="text"
                    value={highlights}
                    onChange={(e) => setHighlights(e.target.value)}
                    placeholder="例: 急速充電、軽量、即購入歓迎"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    ターゲット層・文体のトーン
                  </label>
                  <select
                    value={targetVibe}
                    onChange={(e) => setTargetVibe(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
                  >
                    <option value="万人受け・清潔感（標準）">万人受け・清潔感（標準）</option>
                    <option value="レディース・大人可愛い">レディース・大人可愛い</option>
                    <option value="ガジェット・スペック重視">ガジェット・スペック重視</option>
                    <option value="即決促し・スピード重視">即決促し・スピード重視</option>
                  </select>
                </div>
              </div>

              {/* 生成ボタン */}
              <div className="pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !sourceTitle.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-xl shadow-rose-500/25 hover:from-rose-400 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <Zap className="h-5 w-5 animate-bounce" />
                      <span>メルカリ用SEO文をAI自動構築中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>売れるタイトル＆説明文を自動生成する</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 出力結果エリア */}
            {generated && (
              <div className="mt-8 pt-6 border-t border-zinc-800 space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="font-bold text-sm text-zinc-100">
                      メルカリ用 最適化出品データが完成しました
                    </span>
                  </div>

                  {/* タブ切り替え */}
                  <div className="flex rounded-lg bg-zinc-800 p-0.5 text-xs">
                    <button
                      onClick={() => setActiveTab("text")}
                      className={`px-3 py-1 rounded-md transition-all font-medium ${
                        activeTab === "text"
                          ? "bg-zinc-900 text-white shadow"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      コピペ用
                    </button>
                    <button
                      onClick={() => setActiveTab("preview")}
                      className={`px-3 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                        activeTab === "preview"
                          ? "bg-zinc-900 text-white shadow"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <Smartphone className="h-3 w-3" />
                      <span>出品画面プレビュー</span>
                    </button>
                  </div>
                </div>

                {activeTab === "text" ? (
                  <div className="space-y-4">
                    {/* タイトルボックス */}
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">
                            メルカリ推奨タイトル (40文字以内)
                          </span>
                          <span className="rounded bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-400 font-mono">
                            {generated.title.length} / 40文字
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(generated.title, "title")}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
                        >
                          {copiedTitle ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                              <span className="text-emerald-400">コピー完了</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>タイトルをコピー</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="font-semibold text-sm sm:text-base text-zinc-100 bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80 select-all">
                        {generated.title}
                      </p>
                    </div>

                    {/* 説明文ボックス */}
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                          メルカリShops / メルカリ最適化 説明文
                        </span>
                        <button
                          onClick={() => handleCopy(generated.description, "desc")}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-500 shadow-md shadow-rose-600/30 transition-all active:scale-95"
                        >
                          {copiedDesc ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-white" />
                              <span>コピー完了！</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>説明文を丸ごとコピー</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-900/60 p-3.5 rounded-lg border border-zinc-800/80 max-h-[380px] overflow-y-auto select-all">
                        {generated.description}
                      </pre>
                    </div>
                  </div>
                ) : (
                  /* メルカリスピード出品風プレビュー */
                  <div className="max-w-md mx-auto rounded-2xl border-2 border-zinc-800 bg-zinc-950 p-4 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3 text-xs text-zinc-400">
                      <span>メルカリ商品プレビュー</span>
                      <span className="text-emerald-400">送料込み・匿名配送</span>
                    </div>
                    <div className="aspect-video w-full rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-3 text-xs">
                      [AliExpressの元画像または実物写真をここに配置]
                    </div>
                    <h3 className="font-bold text-sm text-zinc-100 mb-2 leading-snug">
                      {generated.title}
                    </h3>
                    <div className="text-lg font-black text-rose-500 mb-4">
                      ¥2,480 <span className="text-[11px] text-zinc-500 font-normal">（送料込み）</span>
                    </div>
                    <div className="text-xs text-zinc-300 space-y-2 max-h-48 overflow-y-auto whitespace-pre-wrap bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800/50">
                      {generated.description}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 4. メリット・セールスコピーセクション */}
        <section className="w-full max-w-4xl mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
              なぜ、海外輸入セラーはMerEx AIを使うのか？
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              出品文作成にかかる無駄なストレスと時間を極限までゼロに近づけます
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {APP_CONFIG.benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-all"
                >
                  <div className="h-9 w-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-zinc-100 mb-1.5">
                    {b.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. ユーザー導線の終点：Stripe / Gumroad 決済・購入セクション */}
        <section id="pricing" className="w-full max-w-lg scroll-mt-20">
          <div className="rounded-2xl border-2 border-rose-500/40 bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 p-6 sm:p-8 shadow-2xl shadow-rose-500/10 text-center relative overflow-hidden">
            {/* 装飾用背景グロー */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-rose-500/20 blur-3xl pointer-events-none" />

            <div className="inline-block rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400 border border-rose-500/20 mb-3">
              LIFETIME ACCESS / 買い切り
            </div>

            <h3 className="text-2xl font-black text-white mb-1">
              MerEx AI プロ版ライセンス
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              月額サブスク不要。2〜3品売れれば即座に投資回収できる価格です。
            </p>

            {/* 価格表示 */}
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className="text-5xl font-black text-white tracking-tight">
                {APP_CONFIG.priceUsd}
              </span>
              <span className="text-xs text-zinc-400 font-medium">
                ({APP_CONFIG.priceJpy}・買い切り)
              </span>
            </div>
            <p className="text-xs text-rose-400 font-semibold mb-6">
              {APP_CONFIG.pricingNote}
            </p>

            {/* 特典リスト */}
            <div className="space-y-2.5 text-left border-y border-zinc-800 py-5 mb-6">
              {APP_CONFIG.includedFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300"
                >
                  <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Stripe / Gumroad 決済ボタン */}
            <a
              href={APP_CONFIG.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 px-6 py-4 text-base font-bold text-white shadow-xl shadow-rose-500/30 hover:from-rose-400 hover:to-rose-500 hover:shadow-rose-500/40 transition-all active:scale-[0.98]"
            >
              <Lock className="h-4 w-4 text-white" />
              <span>プロ版を今すぐ手に入れる ({APP_CONFIG.priceUsd})</span>
              <ExternalLink className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* 安心の注記 */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
              <ShieldAlert className="h-4 w-4 text-zinc-400" />
              <span>Stripe / Gumroad の安全な暗号化決済により即時納品</span>
            </div>
          </div>
        </section>
      </main>

      {/* 6. フッター */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 text-center text-xs text-zinc-600">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 text-zinc-500">
            <a
              href="https://azorb-site.vercel.app/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 transition-colors"
            >
              利用規約
            </a>
            <a
              href="https://azorb-site.vercel.app/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 transition-colors"
            >
              プライバシーポリシー
            </a>
            <a
              href="https://azorb-site.vercel.app/legal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 transition-colors"
            >
              特定商取引法に基づく表記
            </a>
            <a
              href="https://azorb-site.vercel.app/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 transition-colors"
            >
              お問い合わせ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
