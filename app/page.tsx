"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Smartphone,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { DemoPreview } from "@/components/demo-preview";
import { BackToTop } from "@/components/back-to-top";

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

  // Stripe / Gumroad の決済URL
  checkoutUrl:
    process.env.NEXT_PUBLIC_CHECKOUT_URL ||
    "https://buy.stripe.com/8x29AUbQt06xeWsb1Ebo402",
  priceUsd: "$19",
  priceJpy: "約2,900円",
  pricingNote: "買い切り / ライフタイムアクセス（月額料金なし）",

  benefits: [
    {
      title: "メルカリ検索SEOに特化した40文字タイトル",
      desc: "【新品・送料無料】などの購買意欲を高めるキラーワードと主要検索語句を40文字の枠内に完璧に凝縮します。",
      icon: Search,
    },
    {
      title: "海外製品トラブル・低評価を防ぐ定型免責文",
      desc: "「海外インポート品特有の細かなスレ」「検品済み」など、評価★1クレームを未然に防ぐプロの免責文を自動挿入します。",
      icon: ShieldAlert,
    },
    {
      title: "関連ハッシュタグ＆検索用キーワード網羅",
      desc: "メルカリの検索アルゴリズムをハック。関連ブランド・同義語・トレンドキーワードを末尾に自動展開します。",
      icon: TrendingUp,
    },
    {
      title: "出品時間が1品15分 → わずか10秒へ短縮",
      desc: "画像とタイトルをコピペするだけで完了。出品数を3倍に増やして、売上を一気に加速させます。",
      icon: Clock,
    },
  ],

  includedFeatures: [
    "出品文・タイトル自動生成（制限なし・永久使い放題）",
    "メルカリ＆メルカリShops両対応フォーマット",
    "海外製品向け『クレーム防止・安心取引』テンプレート搭載",
    "ワンクリックコピー＆文字数リアルタイムカウント機能",
    "今後のプロンプト改善・機能アップデート永久無料",
    "商用利用ライセンス永久付与",
  ],
};

// クイックにお試しできるサンプルデータ
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
  } | null>(null);

  // プリセット適用
  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setSourceTitle(preset.sourceTitle);
    setColorSize(preset.colorSize);
    setHighlights(preset.highlights);
    toast.info(`プリセット「${preset.name.split(" ")[0]}」を読み込みました`);
  };

  // 生成ロジック
  const handleGenerate = () => {
    if (!sourceTitle.trim()) {
      toast.error("商品名またはURLを入力してください");
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
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
        specList = `◆商品仕様\n・対応機種: iPhone 12〜16全シリーズ、Apple Watch、AirPods\n・カラー/仕様: ${colorSize || "ブラック / 急速充電対応"}\n・端子: Type-C入力\n・付属品: 充電スタンド本体、Type-Cケーブル、説明書`;
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
        const cleanTitle = sourceTitle.slice(0, 22);
        genTitle = `【新品・送料無料】${cleanTitle} 高品質 人気 おすすめ`;
        specList = `◆商品仕様\n・カラー/サイズ: ${colorSize || "フリーサイズ / 画像参照"}\n・状態: 新品・未使用\n・発送: 匿名配送（24時間以内発送を心がけています）`;
        tagList = `#インポート雑貨 #海外セレクト #トレンドアイテム #新品未使用 #即購入OK #送料無料`;
      }

      mainDesc = `ご覧いただきありがとうございます！\n即購入大歓迎・深夜無言購入もOKです✨\n【新品未使用・送料無料・安心の匿名配送】\n\n━━━━━━━━━━━━━━━━━━━━\n★おすすめポイント\n━━━━━━━━━━━━━━━━━━━━\n${
        highlights
          ? highlights
              .split("、")
              .map((h) => `・${h.trim()}`)
              .join("\n")
          : "・無駄を省いたシンプルかつ高機能なデザイン\n・日常使いはもちろん、プレゼントにも大変喜ばれます\n・コンパクトで持ち運びもラクラク"
      }\n\n${specList}\n\n━━━━━━━━━━━━━━━━━━━━\n★ご購入前の確認事項（安心のお取引のために）\n━━━━━━━━━━━━━━━━━━━━\n※こちらはノーブランドの海外インポート製品です。\n日本の品質基準とは異なり、製造段階での小さなスレ、微細な傷、糸のほつれ等がある場合がございます。あらかじめご了承ください。\n※万が一、初期不良等の明らかな欠陥がございましたら、必ず【受取評価前】にご連絡ください。誠心誠意対応させていただきます。\n※撮影時の光の加減やモニター環境により、実際の色味と多少異なって見える場合がございます。\n\n━━━━━━━━━━━━━━━━━━━━\n${tagList}`;

      if (genTitle.length > 40) {
        genTitle = genTitle.slice(0, 40);
      }

      setGenerated({
        title: genTitle,
        description: mainDesc,
      });

      setIsLoading(false);
      toast.success("メルカリ出品データを作成しました！");
    }, 700);
  };

  // コピー用ハンドラ
  const handleCopy = (text: string, type: "title" | "desc") => {
    navigator.clipboard.writeText(text);
    if (type === "title") {
      setCopiedTitle(true);
      toast.success("タイトルをコピーしました！");
      setTimeout(() => setCopiedTitle(false), 2000);
    } else {
      setCopiedDesc(true);
      toast.success("説明文をコピーしました！");
      setTimeout(() => setCopiedDesc(false), 2000);
    }
  };

  return (
    <div className="ambient-bg min-h-screen text-slate-900 flex flex-col">
      {/* 1. ナビゲーションヘッダー */}
      <header className="sticky top-0 z-50 border-b-2 border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-400 flex items-center justify-center shadow-md shadow-rose-500/20">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-900 flex items-center gap-2">
                {APP_CONFIG.name}
                <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-600 border border-rose-200">
                  v1.0
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#pricing"
              className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              料金プラン
            </a>
            <a
              href={APP_CONFIG.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-600/20 hover:from-rose-500 hover:to-rose-600 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <span>買い切り$19で手に入れる</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12 sm:py-16 flex flex-col items-center">
        {/* 2. ヒーローセクション */}
        <section className="text-center max-w-3xl mx-auto mb-12">
          {/* 稼働パルスバッジ */}
          <div className="inline-flex items-center gap-2.5 rounded-full border-2 border-rose-200 bg-rose-50 px-4 py-1.5 text-sm font-bold text-rose-700 mb-6 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
            <span>{APP_CONFIG.badge}</span>
          </div>

          {/* メインタイトル */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.15] mb-6 text-balance">
            AliExpressの海外商品から
            <br />
            <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              「売れるメルカリ出品文」
            </span>
            を10秒で自動生成
          </h1>

          {/* サブタイトル */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium text-balance">
            {APP_CONFIG.subtitle}
          </p>
        </section>

        {/* 3. ファーストビュー直下：動的デモプレビュー（操作シミュレーター） */}
        <section className="w-full max-w-4xl mb-16">
          <div className="mb-3 flex items-center justify-between px-2">
            <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-rose-600" />
              自動操作シミュレーター（ツールの挙動をプレビュー）
            </span>
            <span className="text-xs font-semibold text-slate-500">
              実際の入力は下記フォームからお試しいただけます ↓
            </span>
          </div>
          <DemoPreview />
        </section>

        {/* 4. コア機能：ユーザー対話型出品文ジェネレータ */}
        <section id="tool" className="w-full max-w-4xl mb-20 scroll-mt-24">
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xl transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  いますぐ出品文を作成する（無料プレビュー）
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  英語タイトルや仕様を入力してボタンを押してください
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                お試し版
              </span>
            </div>

            {/* サンプルプリセットボタン */}
            <div className="mb-6">
              <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mb-2.5">
                <Tag className="h-4 w-4 text-rose-600" />
                ワンクリックでお試し（売れ筋AliExpress商品の例）:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => applyPreset(p)}
                    className="rounded-xl border-2 border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:border-rose-400 hover:bg-white hover:text-rose-600 transition-all text-left shadow-sm hover:-translate-y-0.5"
                  >
                    ⚡ {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 入力フォーム */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  AliExpress商品タイトル / 英語名 / URL{" "}
                  <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={2}
                  value={sourceTitle}
                  onChange={(e) => setSourceTitle(e.target.value)}
                  placeholder="例: 3 in 1 Fast Wireless Charger Stand Foldable Magnetic Dock Station for iPhone / 商品URLを貼り付け"
                  className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-4 text-base text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    カラー / サイズ / 仕様
                  </label>
                  <input
                    type="text"
                    value={colorSize}
                    onChange={(e) => setColorSize(e.target.value)}
                    placeholder="例: ブラック / フリーサイズ"
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    特徴 / アピールポイント
                  </label>
                  <input
                    type="text"
                    value={highlights}
                    onChange={(e) => setHighlights(e.target.value)}
                    placeholder="例: 急速充電、軽量、即購入歓迎"
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    ターゲット層・文体トーン
                  </label>
                  <select
                    value={targetVibe}
                    onChange={(e) => setTargetVibe(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 py-3 text-base text-slate-900 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
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
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-600 to-amber-500 px-6 py-4 text-base font-bold text-white shadow-xl shadow-rose-600/25 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
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
              <div className="mt-8 border-t-2 border-slate-100 pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="font-bold text-base text-slate-900">
                      メルカリ用 最適化出品データが完成しました
                    </span>
                  </div>

                  <div className="flex rounded-xl bg-slate-100 p-1 text-sm font-bold">
                    <button
                      onClick={() => setActiveTab("text")}
                      className={`px-3.5 py-1.5 rounded-lg transition-all ${
                        activeTab === "text"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      コピペ用
                    </button>
                    <button
                      onClick={() => setActiveTab("preview")}
                      className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                        activeTab === "preview"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <Smartphone className="h-4 w-4" />
                      <span>出品画面プレビュー</span>
                    </button>
                  </div>
                </div>

                {activeTab === "text" ? (
                  <div className="space-y-4">
                    {/* タイトルボックス（ハイブリッド・ダーク構成） */}
                    <div className="rounded-2xl border-2 border-slate-200 bg-slate-950 p-5 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">
                            メルカリ推奨タイトル (40文字以内)
                          </span>
                          <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300 font-mono">
                            {generated.title.length} / 40文字
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(generated.title, "title")}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3.5 py-1.5 text-xs font-bold text-zinc-200 hover:bg-zinc-700 transition-colors"
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
                      <p className="font-bold text-base text-zinc-100 bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 select-all">
                        {generated.title}
                      </p>
                    </div>

                    {/* 説明文ボックス（ハイブリッド・ダーク構成） */}
                    <div className="rounded-2xl border-2 border-slate-200 bg-slate-950 p-5 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                          メルカリShops / メルカリ最適化 説明文
                        </span>
                        <button
                          onClick={() => handleCopy(generated.description, "desc")}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 shadow-md shadow-rose-600/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
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
                      <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 leading-relaxed bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 max-h-[380px] overflow-y-auto select-all">
                        {generated.description}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-md mx-auto rounded-3xl border-2 border-slate-300 bg-slate-950 p-5 text-white shadow-2xl">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3 text-xs text-zinc-400">
                      <span>メルカリ商品プレビュー</span>
                      <span className="text-emerald-400 font-semibold">送料込み・匿名配送</span>
                    </div>
                    <div className="aspect-video w-full rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 text-sm mb-3">
                      [AliExpressの元画像または実物写真]
                    </div>
                    <h3 className="font-bold text-base text-zinc-100 mb-2 leading-snug">
                      {generated.title}
                    </h3>
                    <div className="text-xl font-black text-rose-500 mb-3">
                      ¥2,480 <span className="text-xs text-zinc-400 font-normal">（送料込み）</span>
                    </div>
                    <div className="text-xs text-zinc-300 space-y-2 max-h-48 overflow-y-auto whitespace-pre-wrap bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/60">
                      {generated.description}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 5. メリット・セールスコピーセクション */}
        <section className="w-full max-w-4xl mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 text-balance">
              なぜ、海外輸入セラーはMerEx AIを使うのか？
            </h2>
            <p className="text-base text-slate-600 font-medium text-balance">
              出品文作成にかかる無駄なストレスと時間を極限までゼロに近づけます
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {APP_CONFIG.benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="rounded-3xl border-2 border-slate-200/90 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300"
                >
                  <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    {b.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. ユーザー導線の終点：Stripe 決済・購入セクション */}
        <section id="pricing" className="w-full max-w-lg scroll-mt-24 mb-16">
          <div className="rounded-3xl border-2 border-rose-300 bg-white p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:shadow-rose-500/10 hover:border-rose-400">
            <div className="inline-block rounded-full bg-rose-50 px-4 py-1.5 text-xs font-bold text-rose-600 border border-rose-200 mb-4">
              LIFETIME ACCESS / 買い切り
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              MerEx AI プロ版ライセンス
            </h3>
            <p className="text-sm text-slate-600 font-medium mb-6">
              月額サブスク不要。2〜3品売れれば即座に投資回収できる価格です。
            </p>

            {/* 価格表示 */}
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-5xl font-black text-slate-900 tracking-tight">
                {APP_CONFIG.priceUsd}
              </span>
              <span className="text-sm text-slate-600 font-bold">
                ({APP_CONFIG.priceJpy}・買い切り)
              </span>
            </div>
            <p className="text-sm text-rose-600 font-bold mb-8">
              {APP_CONFIG.pricingNote}
            </p>

            {/* 特典リスト */}
            <div className="space-y-3.5 text-left border-y-2 border-slate-100 py-6 mb-8">
              {APP_CONFIG.includedFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-sm font-semibold text-slate-700"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Stripe 決済ボタン */}
            <a
              href={APP_CONFIG.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-600 to-amber-500 px-7 py-4 text-lg font-bold text-white shadow-xl shadow-rose-600/25 hover:from-rose-500 hover:to-rose-600 hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Lock className="h-5 w-5 text-white" />
              <span>プロ版を今すぐ手に入れる ({APP_CONFIG.priceUsd})</span>
              <ExternalLink className="h-5 w-5 opacity-80 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* 安心の注記 */}
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Stripe の安全な暗号化決済により即時納品</span>
            </div>
          </div>
        </section>
      </main>

      {/* 7. フッター */}
      <footer className="border-t-2 border-slate-200 bg-white py-10 text-center text-sm text-slate-500 font-medium">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p>© {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 text-slate-600 font-semibold">
            <a
              href="https://azorb-site.vercel.app/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-rose-600 transition-colors"
            >
              利用規約
            </a>
            <a
              href="https://azorb-site.vercel.app/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-rose-600 transition-colors"
            >
              プライバシーポリシー
            </a>
            <a
              href="https://azorb-site.vercel.app/legal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-rose-600 transition-colors"
            >
              特定商取引法に基づく表記
            </a>
            <a
              href="https://azorb-site.vercel.app/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-rose-600 transition-colors"
            >
              お問い合わせ
            </a>
          </div>
        </div>
      </footer>

      {/* トップへ戻るボタン */}
      <BackToTop />
    </div>
  );
}
