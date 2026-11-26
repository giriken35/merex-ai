"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ShoppingBag,
  Zap,
  Lock,
  Unlock,
  KeyRound,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  LifeBuoy,
  Crown,
  LogOut,
  Tag,
  Search,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { BackToTop } from "@/components/back-to-top";

/**
 * =================================================================
 * 🔑 プロ版 共通パスワード & ストレージキー
 * =================================================================
 */
const PRO_PASSWORD = "merex_vip_94k2r";
const STORAGE_KEY = "merex_pro_authenticated_v2";

// プロ版専用：追加プリセット（人気カテゴリ別）
const PRO_PRESETS = [
  {
    name: "3in1 ワイヤレス充電器 (MagSafe対応急速スタンド)",
    sourceTitle:
      "3 in 1 Fast Wireless Charger Stand Foldable Magnetic Dock Station for iPhone 15 14 13 Pro Max Apple Watch AirPods",
    colorSize: "ブラック / Type-C急速充電ケーブル付き",
    highlights: "急速充電対応、コンパクトに折りたためて旅行・出張に便利、iPhone・Watch・イヤホンを3台同時充電、デスクすっきり",
    tone: "ガジェット・スペック重視",
  },
  {
    name: "北欧風ウェーブ アクリルフラワーベース (韓国インテリア花瓶)",
    sourceTitle:
      "Modern Acrylic Wave Flower Vase Nordic Style Tabletop Decorative Floral Container Aesthetic Room Decor",
    colorSize: "クリアオーロラ / 約20cm × 15cm",
    highlights: "光の角度で虹色に変化、割れにくい耐衝撃アクリル素材、韓国インテリア・カフェ風雑貨としてSNSで話題沸騰、生花ドライフラワー両対応",
    tone: "レディース・大人可愛い",
  },
  {
    name: "本革調 2WAYスマホショルダーストラップ付きポーチ",
    sourceTitle:
      "PU Leather Crossbody Phone Bag for Women Mini Shoulder Purse Card Holder Wallet with Adjustable Strap",
    colorSize: "上品グレージュ / 約18cm × 11cm",
    highlights: "お札・小銭・カード・鍵もスマートに収納、超軽量設計で肩が痛くならない、撥水PUレザーで汚れに強い、ちょっとしたお出かけに最適",
    tone: "レディース・大人可愛い",
  },
  {
    name: "超小型 紛失防止スマートトラッカー (Bluetooth / GPSタグ)",
    sourceTitle:
      "Mini Smart GPS Tracker Wireless Bluetooth Anti-Lost Locator Key Finder for Luggage Wallet Pet Kid",
    colorSize: "ホワイト / 電池内蔵・予備1個付属",
    highlights: "財布や鍵・スーツケースの紛失防止、スマホからワンタッチで音を鳴らせる、薄型軽量でかさばらない、ペアリング簡単",
    tone: "即決促し・スピード重視",
  },
];

export default function ProPage() {
  // 認証ステート
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // コンソールステート
  const [sourceTitle, setSourceTitle] = useState("");
  const [colorSize, setColorSize] = useState("");
  const [highlights, setHighlights] = useState("");
  const [targetVibe, setTargetVibe] = useState("万人受け・清潔感（標準）");
  const [includeBulkDiscount, setIncludeBulkDiscount] = useState(true);
  const [includeFastShipping, setIncludeFastShipping] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "preview">("text");

  const [generated, setGenerated] = useState<{
    title: string;
    description: string;
  } | null>(null);

  // 自動ログインチェック
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // ログイン
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput.trim() === PRO_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(false);
      localStorage.setItem(STORAGE_KEY, "true");
      toast.success("プロ版ライセンスを認証しました！");
    } else {
      setAuthError(true);
      toast.error("パスワードが一致しません");
    }
  };

  // ログアウト
  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
    setPassInput("");
    toast.info("ログアウトしました");
  };

  // プリセット適用
  const applyPreset = (preset: (typeof PRO_PRESETS)[0]) => {
    setSourceTitle(preset.sourceTitle);
    setColorSize(preset.colorSize);
    setHighlights(preset.highlights);
    setTargetVibe(preset.tone);
    toast.info(`プロ版プリセット「${preset.name.split(" ")[0]}」を適用しました`);
  };

  // プロ版 生成ロジック
  const handleGenerate = () => {
    if (!sourceTitle.trim()) {
      toast.error("商品名またはURLを入力してください");
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      const rawText = `${sourceTitle} ${highlights} ${colorSize}`;
      const isPhone = /iPhone|Phone|Watch|充電|AirPods|GPS|Tracker/i.test(rawText);
      const isVase = /Vase|花瓶|インテリア|Nordic|アクリル/i.test(rawText);
      const isBag = /Bag|財布|ポーチ|ショルダー|Leather/i.test(rawText);

      let genTitle = "";
      let specList = "";
      let tagList = "";

      if (isPhone && /Tracker|GPS/i.test(rawText)) {
        genTitle = "【新品・即納】超小型 スマートトラッカー 紛失防止タグ 鍵 財布 Bluetooth";
        specList = `◆商品仕様\n・カラー: ${colorSize || "ホワイト"}\n・対応OS: iOS / Android両対応\n・機能: スマホ呼び出し音、Bluetooth測位、置き忘れアラート\n・付属品: トラッカー本体、専用電池内蔵、日本語簡易操作ガイド`;
        tagList = `#スマートトラッカー #紛失防止 #AirTag代替 #キーホルダー #旅行グッズ #ペット見守り #防犯グッズ #便利アイテム #即購入歓迎`;
      } else if (isPhone) {
        genTitle = "【新品・最速発送】3in1 ワイヤレス充電器 急速 折りたたみ MagSafe 置くだけ";
        specList = `◆商品仕様\n・対応機種: iPhone 12〜16全シリーズ、Apple Watch、AirPods\n・カラー/仕様: ${colorSize || "ブラック / 急速充電対応"}\n・端子: Type-C入力（高耐久編組ケーブル付属）\n・特徴: 角度調整可能・スタンド/パッド2WAY仕様`;
        tagList = `#ワイヤレス充電器 #MagSafe #急速充電 #iPhone充電器 #AppleWatch #デスク周り #ガジェット #便利グッズ #即購入OK`;
      } else if (isVase) {
        genTitle = "【大人気】北欧風 アクリル ウェーブ花瓶 オーロラ 韓国インテリア 映え オブジェ";
        specList = `◆商品仕様\n・サイズ: ${colorSize || "約20cm × 15cm"}\n・カラー: クリアオーロラ（光の当たり方で優美に変化）\n・素材: 耐衝撃高品質アクリル（ガラスのように割れません）\n・用途: 生花、ドライフラワー、ペンスタンド、インテリアオブジェ`;
        tagList = `#花瓶 #フラワーベース #北欧インテリア #韓国インテリア #アクリル花瓶 #カフェ風インテリア #ルームデコ #オーロラ雑貨 #SNS話題`;
      } else if (isBag) {
        genTitle = "【大人気・高見え】スマホショルダー スマホポーチ 2WAY 軽量 斜め掛け ミニバッグ";
        specList = `◆商品仕様\n・カラー: ${colorSize || "上品グレージュ"}\n・素材: 高見え上質PUレザー（撥水・高耐久）\n・サイズ: 約18cm × 11cm\n・仕様: スマホポケット×1、カードスロット×3、ファスナー付きマルチポケット\n・ベルト: 長さ調節可能（肩掛け・斜め掛け・取り外し可）`;
        tagList = `#スマホショルダー #スマホポーチ #ミニショルダー #サコッシュ #お財布ショルダー #レディースバッグ #プチプラ高見え #トレンドバッグ`;
      } else {
        const cleanTitle = sourceTitle.slice(0, 22);
        genTitle = `【新品・送料無料】${cleanTitle} 高品質 人気 おすすめ`;
        specList = `◆商品仕様\n・カラー/サイズ: ${colorSize || "フリーサイズ / 画像参照"}\n・状態: 新品・未使用（検品済み）\n・発送方法: 安心のメルカリ便（匿名配送・追跡あり）`;
        tagList = `#インポート雑貨 #海外セレクト #トレンドアイテム #新品未使用 #即購入OK #送料無料 #早い者勝ち`;
      }

      let extraOffer = "";
      if (includeBulkDiscount) {
        extraOffer += `★おまとめ割実施中★\n2点以上のご購入で【100円〜お値引き】いたします。\n複数購入をご希望の際は、コメント欄よりお気軽にお知らせください✨\n\n`;
      }
      if (includeFastShipping) {
        extraOffer += `★スピード発送★\n原則24時間以内のスピード発送を徹底しております。\n雨濡れ防止のOPP袋＋緩衝材で丁寧に梱包してお届けします📦\n\n`;
      }

      const mainDesc = `ご覧いただきありがとうございます！\n即購入大歓迎・深夜無言購入もOKです✨\n【新品未使用・送料無料・安心の匿名配送】\n\n${extraOffer}━━━━━━━━━━━━━━━━━━━━\n★おすすめポイント\n━━━━━━━━━━━━━━━━━━━━\n${
        highlights
          ? highlights
              .split("、")
              .map((h) => `・${h.trim()}`)
              .join("\n")
          : "・無駄を削ぎ落とした洗練されたモダンデザイン\n・日常使いはもちろん、大切な方へのプチギフトにも好評です\n・軽量かつコンパクトで実用性抜群"
      }\n\n${specList}\n\n━━━━━━━━━━━━━━━━━━━━\n★ご購入前の確認事項（安心・安全なお取引のために）\n━━━━━━━━━━━━━━━━━━━━\n※こちらは海外工場より直接買い付けたノーブランドのインポート製品です。\n日本製品と比べて製造過程における微小なスレや縫製の甘さがある場合がございます。検品済みですが完璧を求める方はご遠慮ください。\n※万が一、初期不良等の明らかな破損・不備がございましたら、必ず【受取評価前】にご連絡をお願いいたします。誠心誠意、迅速に対応いたします。\n※モニター環境や撮影照明により、色味が実物と多少異なって見える可能性がございます。\n\n━━━━━━━━━━━━━━━━━━━━\n${tagList}`;

      if (genTitle.length > 40) {
        genTitle = genTitle.slice(0, 40);
      }

      setGenerated({
        title: genTitle,
        description: mainDesc,
      });

      setIsLoading(false);
      toast.success("プロ版高精度出品文を生成しました！");
    }, 500);
  };

  const handleCopy = (text: string, type: "title" | "desc" | "all") => {
    navigator.clipboard.writeText(text);
    if (type === "title") {
      setCopiedTitle(true);
      toast.success("タイトルをコピーしました！");
      setTimeout(() => setCopiedTitle(false), 2000);
    } else if (type === "desc") {
      setCopiedDesc(true);
      toast.success("説明文をコピーしました！");
      setTimeout(() => setCopiedDesc(false), 2000);
    } else {
      setCopiedAll(true);
      toast.success("タイトルと説明文を一括コピーしました！");
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  if (!isClient) {
    return <div className="ambient-bg min-h-screen" />;
  }

  // =================================================================
  // 🔒 画面1: 未認証時のパスワードロック画面
  // =================================================================
  if (!isAuthenticated) {
    return (
      <div className="ambient-bg min-h-screen text-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border-2 border-slate-200 bg-white p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 shadow-md shadow-rose-500/20">
            <Lock className="h-8 w-8 text-white" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-700 border border-rose-200 mb-4">
            <Crown className="h-4 w-4 text-rose-600" />
            <span>MerEx AI Pro Member Access</span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 mb-2">
            プロ版 専用ダッシュボード
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium">
            ご購入時に発行された「アクセスキー」を入力してください。一度認証すると次回から自動ログインされます。
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-sm font-bold text-slate-800 mb-1.5">
                アクセスキー（パスワード）
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passInput}
                  onChange={(e) => {
                    setPassInput(e.target.value);
                    if (authError) setAuthError(false);
                  }}
                  placeholder="アクセスキーを入力"
                  className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/50 px-4 py-3.5 text-base text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all pr-11"
                  autoFocus
                />
                <KeyRound className="h-5 w-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {authError && (
                <p className="text-sm text-rose-600 mt-2 font-bold flex items-center gap-1">
                  ⚠ キーが一致しません。大文字小文字をご確認ください。
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-600 to-amber-500 px-6 py-4 text-base font-bold text-white shadow-xl shadow-rose-600/25 hover:from-rose-500 hover:to-rose-600 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Unlock className="h-5 w-5" />
              <span>プロ版をアンロックして入室</span>
            </button>
          </form>

          <div className="mt-8 border-t-2 border-slate-100 pt-5 text-xs text-slate-500 font-medium">
            キーがご不明な場合は、Stripe決済完了画面または
            <a
              href="https://azorb-site.vercel.app/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-600 underline font-bold hover:text-rose-700 ml-1"
            >
              サポート窓口
            </a>
            までお問い合わせください。
          </div>
        </div>
      </div>
    );
  }

  // =================================================================
  // 🔓 画面2: 認証済み プロ版ダッシュボードUI
  // =================================================================
  return (
    <div className="ambient-bg min-h-screen text-slate-900 flex flex-col">
      {/* 1. プロ版専用ヘッダー */}
      <header className="sticky top-0 z-50 border-b-2 border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-400 flex items-center justify-center shadow-md shadow-rose-500/20">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-900 flex items-center gap-2.5">
                MerEx AI
                <span className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 text-xs font-black text-white shadow-sm flex items-center gap-1">
                  <Crown className="h-3.5 w-3.5" />
                  PRO MEMBER
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://azorb-site.vercel.app/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-slate-600 hover:text-rose-600 transition-colors flex items-center gap-1.5"
            >
              <LifeBuoy className="h-4 w-4" />
              <span>優先サポート</span>
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
              title="パスワードロック状態に戻す"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">ロックする</span>
            </button>
          </div>
        </div>
      </header>

      {/* メインエリア */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 sm:py-14 flex flex-col items-center">
        {/* プロ版ステータスバー */}
        <div className="w-full max-w-4xl mb-8 rounded-2xl border-2 border-amber-200 bg-amber-50/80 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm shadow-sm">
          <div className="flex items-center gap-2.5 text-amber-900 font-bold">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-600" />
            <span>
              プロ版ライセンス有効化済み（生成回数無制限 / プロ専用全オプション解放中）
            </span>
          </div>
          <span className="text-xs text-amber-800 font-semibold bg-amber-100/80 px-2.5 py-1 rounded-lg">
            次回以降も自動アクセス可能
          </span>
        </div>

        {/* コア機能：プロ版ジェネレータ */}
        <section className="w-full max-w-4xl mb-16">
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xl">
            {/* サンプルプリセット */}
            <div className="mb-6">
              <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mb-2.5">
                <Tag className="h-4 w-4 text-amber-600" />
                プロ版専用プリセット（売れ筋テンプレート）:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRO_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => applyPreset(p)}
                    className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-700 hover:border-amber-400 hover:bg-white hover:text-slate-900 transition-all text-left flex items-start justify-between gap-2 shadow-sm hover:-translate-y-0.5"
                  >
                    <span className="font-bold truncate">⚡ {p.name}</span>
                    <span className="text-xs text-amber-700 font-bold shrink-0 bg-amber-100 px-2 py-0.5 rounded">
                      {p.tone.split("・")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 入力フォーム */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  AliExpress商品タイトル / 英語名 / URL{" "}
                  <span className="text-amber-600">*</span>
                </label>
                <textarea
                  rows={2}
                  value={sourceTitle}
                  onChange={(e) => setSourceTitle(e.target.value)}
                  placeholder="例: 3 in 1 Fast Wireless Charger Stand Foldable Magnetic Dock Station for iPhone / 商品URLを貼り付け"
                  className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-4 text-base text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all"
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
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all"
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
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    文体トーン・ターゲット
                  </label>
                  <select
                    value={targetVibe}
                    onChange={(e) => setTargetVibe(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 px-4 py-3 text-base text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all"
                  >
                    <option value="万人受け・清潔感（標準）">万人受け・清潔感（標準）</option>
                    <option value="レディース・大人可愛い">レディース・大人可愛い</option>
                    <option value="ガジェット・スペック重視">ガジェット・スペック重視</option>
                    <option value="即決促し・スピード重視">即決促し・スピード重視</option>
                  </select>
                </div>
              </div>

              {/* プロ版限定オプション */}
              <div className="flex flex-wrap items-center gap-6 rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-4 text-sm font-bold">
                <span className="text-amber-800 flex items-center gap-1.5">
                  <Crown className="h-4 w-4 text-amber-600" />
                  プロ版専用オプション:
                </span>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={includeBulkDiscount}
                    onChange={(e) => setIncludeBulkDiscount(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-0"
                  />
                  <span>「おまとめ割」訴求を自動挿入</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={includeFastShipping}
                    onChange={(e) => setIncludeFastShipping(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-0"
                  />
                  <span>「24h以内スピード発送」を明記</span>
                </label>
              </div>

              {/* 生成ボタン */}
              <div className="pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !sourceTitle.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 px-6 py-4 text-base font-bold text-white shadow-xl shadow-amber-500/20 hover:from-amber-400 hover:to-rose-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <Zap className="h-5 w-5 animate-bounce" />
                      <span>プロ版SEOアルゴリズムで最適化生成中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>売れるタイトル＆説明文を高速自動生成</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 出力結果エリア */}
            {generated && (
              <div className="mt-8 border-t-2 border-slate-100 pt-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="font-bold text-base text-slate-900">
                      プロ版 最適化出品文が完成しました
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* 一括コピーボタン */}
                    <button
                      onClick={() =>
                        handleCopy(
                          `【商品タイトル】\n${generated.title}\n\n【商品説明文】\n${generated.description}`,
                          "all"
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-white hover:from-amber-400 hover:to-amber-500 shadow-md transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                    >
                      {copiedAll ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>一括コピー完了！</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>タイトル＆本文を一括コピー</span>
                        </>
                      )}
                    </button>

                    {/* タブ切り替え */}
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
                        <span>プレビュー</span>
                      </button>
                    </div>
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
                      <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 leading-relaxed bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 max-h-[420px] overflow-y-auto select-all">
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
                      [商品写真をメルカリにアップロード]
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

        {/* ユーザーサポートカード */}
        <section className="w-full max-w-4xl rounded-3xl border-2 border-slate-200 bg-white p-7 text-center shadow-sm">
          <h4 className="text-base font-bold text-slate-900 mb-1">
            プロ版会員 専用サポート窓口
          </h4>
          <p className="text-sm text-slate-600 mb-5 font-medium">
            「こういうプロンプトも追加してほしい」「ShopsのCSV一括機能がほしい」等のご要望も随時受け付けております。
          </p>
          <a
            href="https://azorb-site.vercel.app/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-white hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm"
          >
            <LifeBuoy className="h-4 w-4" />
            <span>お問い合わせ・機能リクエスト</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-60" />
          </a>
        </section>
      </main>

      {/* フッター */}
      <footer className="border-t-2 border-slate-200 bg-white py-10 text-center text-sm text-slate-500 font-medium">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p>© {new Date().getFullYear()} MerEx AI. All rights reserved.</p>
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

      {/* トップへ戻る */}
      <BackToTop />
    </div>
  );
}
