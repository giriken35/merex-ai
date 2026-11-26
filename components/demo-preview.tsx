"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Zap,
  Tag,
  Smartphone,
  Play,
  Pause,
  RotateCcw,
  MousePointer,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface CursorPos {
  x: number;
  y: number;
  clicking: boolean;
  visible: boolean;
}

export function DemoPreview() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [step, setStep] = useState<
    "idle" | "typing" | "to_btn" | "generating" | "result" | "to_copy" | "to_preview"
  >("idle");

  const [typedText, setTypedText] = useState("");
  const [activeTab, setActiveTab] = useState<"text" | "preview">("text");
  const [isCopied, setIsCopied] = useState(false);

  // カーソル座標管理
  const [cursor, setCursor] = useState<CursorPos>({
    x: 100,
    y: 100,
    clicking: false,
    visible: true,
  });

  // 要素参照用 Ref
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const generateBtnRef = useRef<HTMLButtonElement>(null);
  const copyBtnRef = useRef<HTMLButtonElement>(null);
  const previewTabRef = useRef<HTMLButtonElement>(null);

  // デモ用サンプル
  const sampleInput =
    "3 in 1 Fast Wireless Charger Stand Foldable Magnetic Dock Station for iPhone 15 14 13 Pro Max Apple Watch AirPods";

  const demoTitle = "【新品】3in1 ワイヤレス充電器 急速 折りたたみ MagSafe対応 置くだけ";
  const demoDesc = `ご覧いただきありがとうございます！\n即購入大歓迎・深夜無言購入もOKです✨\n【新品未使用・送料無料・安心の匿名配送】\n\n━━━━━━━━━━━━━━━━━━━━\n★おすすめポイント\n━━━━━━━━━━━━━━━━━━━━\n・iPhone/Watch/AirPodsを3台同時に急速充電\n・折りたたみ可能で旅行や出張の持ち運びに最適\n・MagSafe対応でピタッと吸着、デスク周りスッキリ\n\n◆商品仕様\n・カラー: ブラック / 急速充電対応\n・端子: Type-C入力\n・付属品: 充電スタンド本体、Type-Cケーブル、説明書\n\n━━━━━━━━━━━━━━━━━━━━\n★ご購入前の確認事項（安心のお取引のために）\n━━━━━━━━━━━━━━━━━━━━\n※こちらはノーブランドの海外インポート製品です。\n製造段階での小さなスレ等がある場合がございます。検品済みですがあらかじめご了承ください。\n※万が一、初期不良等がございましたら、必ず【受取評価前】にご連絡ください。誠心誠意対応いたします。\n\n#ワイヤレス充電器 #MagSafe #急速充電 #iPhone充電器 #AppleWatch #即購入OK`;

  // 相対座標計算
  const getRelativePos = (element: HTMLElement | null) => {
    if (!element || !containerRef.current) return { x: 100, y: 100 };
    const containerRect = containerRef.current.getBoundingClientRect();
    const elemRect = element.getBoundingClientRect();
    return {
      x: elemRect.left - containerRect.left + elemRect.width / 2,
      y: elemRect.top - containerRect.top + elemRect.height / 2,
    };
  };

  // アニメーションループ
  useEffect(() => {
    if (!isPlaying) return;

    let timeoutId: NodeJS.Timeout;

    const runSimulation = async () => {
      // 1. リセット
      setStep("typing");
      setTypedText("");
      setActiveTab("text");
      setIsCopied(false);

      // カーソルを入力欄へ
      const inputPos = getRelativePos(inputRef.current);
      setCursor({ x: inputPos.x, y: inputPos.y, clicking: false, visible: true });

      // 2. タイピング
      let currentIdx = 0;
      const typeInterval = setInterval(() => {
        if (!isPlaying) {
          clearInterval(typeInterval);
          return;
        }
        currentIdx += 3;
        if (currentIdx <= sampleInput.length) {
          setTypedText(sampleInput.slice(0, currentIdx));
        } else {
          clearInterval(typeInterval);
          setTypedText(sampleInput);

          // 3. 生成ボタンへ移動
          timeoutId = setTimeout(() => {
            const btnPos = getRelativePos(generateBtnRef.current);
            setCursor({ x: btnPos.x, y: btnPos.y, clicking: false, visible: true });

            // クリック
            timeoutId = setTimeout(() => {
              setCursor((prev) => ({ ...prev, clicking: true }));
              setStep("generating");

              timeoutId = setTimeout(() => {
                setCursor((prev) => ({ ...prev, clicking: false }));

                // 4. 結果出力
                timeoutId = setTimeout(() => {
                  setStep("result");

                  // 5. コピーボタンへ移動
                  timeoutId = setTimeout(() => {
                    const copyPos = getRelativePos(copyBtnRef.current);
                    setCursor({ x: copyPos.x, y: copyPos.y, clicking: false, visible: true });

                    timeoutId = setTimeout(() => {
                      setCursor((prev) => ({ ...prev, clicking: true }));
                      setIsCopied(true);
                      toast.success("メルカリ出品文をコピーしました！(デモ)");

                      timeoutId = setTimeout(() => {
                        setCursor((prev) => ({ ...prev, clicking: false }));

                        // 6. プレビュータブへ移動
                        timeoutId = setTimeout(() => {
                          const tabPos = getRelativePos(previewTabRef.current);
                          setCursor({ x: tabPos.x, y: tabPos.y, clicking: false, visible: true });

                          timeoutId = setTimeout(() => {
                            setCursor((prev) => ({ ...prev, clicking: true }));
                            setActiveTab("preview");

                            timeoutId = setTimeout(() => {
                              setCursor((prev) => ({ ...prev, clicking: false }));

                              // 7. 一巡終了、待機してリスタート
                              timeoutId = setTimeout(() => {
                                runSimulation();
                              }, 3500);
                            }, 300);
                          }, 500);
                        }, 1200);
                      }, 400);
                    }, 500);
                  }, 800);
                }, 700);
              }, 400);
            }, 500);
          }, 600);
        }
      }, 40);
    };

    runSimulation();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl border-2 border-slate-200/90 bg-white shadow-2xl transition-all duration-300 overflow-hidden"
    >
      {/* 1. ブラウザ風ヘッダーバー */}
      <div className="flex items-center justify-between border-b-2 border-slate-100 bg-slate-50/90 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-400/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80 inline-block" />
          </div>
          <span className="ml-3 hidden sm:inline-block rounded-md bg-white px-3 py-1 text-xs font-mono text-slate-500 border border-slate-200">
            https://merex-ai.com/simulation-preview
          </span>
        </div>

        {/* コントロール & ステータス */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 border border-rose-200/60">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span>操作シミュレーター自動稼働中</span>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            title={isPlaying ? "一時停止" : "再生"}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 text-slate-600" />
                <span className="hidden sm:inline">一時停止</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-rose-600" />
                <span className="hidden sm:inline">再開</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. デモ内部コンテンツ */}
      <div className="p-4 sm:p-7 bg-slate-50/40">
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          {/* 上部入力エリア */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-800">
                  AliExpress商品タイトル / 英語名 / URL
                </label>
                <span className="text-xs text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60">
                  英語をそのまま丸投げOK
                </span>
              </div>
              <textarea
                ref={inputRef}
                readOnly
                value={typedText}
                placeholder="AliExpressの商品名やURLを貼り付け..."
                rows={2}
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 p-3.5 text-base text-slate-800 focus:outline-none transition-colors font-sans"
              />
            </div>

            {/* 生成ボタン */}
            <div className="flex justify-end">
              <button
                ref={generateBtnRef}
                disabled={step === "generating"}
                className={`inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-200 ${
                  step === "generating"
                    ? "bg-slate-400 cursor-wait"
                    : "bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-400 hover:to-rose-500 hover:shadow-xl active:scale-95"
                }`}
              >
                {step === "generating" ? (
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

          {/* 出力結果エリア（ステップが result または後の場合に表示） */}
          {(step === "result" || step === "to_copy" || step === "to_preview") && (
            <div className="mt-6 border-t-2 border-slate-100 pt-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-900">
                    メルカリ用 最適化出品データ完成（40字制限クリア・クレーム防止文付き）
                  </span>
                </div>

                {/* タブ */}
                <div className="flex rounded-lg bg-slate-100 p-1 text-sm font-semibold">
                  <button
                    onClick={() => setActiveTab("text")}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeTab === "text"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    コピペ用
                  </button>
                  <button
                    ref={previewTabRef}
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                      activeTab === "preview"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Smartphone className="h-4 w-4" />
                    <span>プレビュー</span>
                  </button>
                </div>
              </div>

              {activeTab === "text" ? (
                <div className="space-y-4">
                  {/* タイトル */}
                  <div className="rounded-xl border-2 border-slate-200 bg-slate-950 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">
                          メルカリ推奨タイトル (40文字以内)
                        </span>
                        <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300 font-mono">
                          {demoTitle.length} / 40文字
                        </span>
                      </div>
                      <span className="text-xs text-emerald-400 font-semibold">
                        ✓ キーワード完全網羅
                      </span>
                    </div>
                    <p className="font-bold text-base text-zinc-100 bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 select-all">
                      {demoTitle}
                    </p>
                  </div>

                  {/* 説明文 */}
                  <div className="rounded-xl border-2 border-slate-200 bg-slate-950 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                        メルカリShops / メルカリ最適化 説明文
                      </span>
                      <button
                        ref={copyBtnRef}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-500 shadow-md transition-all"
                      >
                        {isCopied ? (
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
                    <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 leading-relaxed bg-zinc-900/80 p-3.5 rounded-lg border border-zinc-800 max-h-[220px] overflow-y-auto">
                      {demoDesc}
                    </pre>
                  </div>
                </div>
              ) : (
                /* スマホプレビュー */
                <div className="max-w-sm mx-auto rounded-2xl border-2 border-slate-300 bg-slate-950 p-4 text-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2 text-xs text-zinc-400">
                    <span>メルカリ出品プレビュー</span>
                    <span className="text-emerald-400 font-semibold">送料込み・匿名配送</span>
                  </div>
                  <div className="aspect-video w-full rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 text-xs mb-2.5">
                    [商品画像]
                  </div>
                  <h4 className="font-bold text-sm text-zinc-100 mb-1.5 leading-snug">
                    {demoTitle}
                  </h4>
                  <div className="text-base font-black text-rose-500 mb-2">
                    ¥2,480 <span className="text-xs text-zinc-400 font-normal">（送料込み）</span>
                  </div>
                  <p className="text-xs text-zinc-300 bg-zinc-900 p-2 rounded max-h-32 overflow-y-auto whitespace-pre-wrap">
                    {demoDesc}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. 相対座標で滑らかに動く仮想カーソル */}
      {cursor.visible && (
        <div
          className="pointer-events-none absolute z-50 transition-all duration-500 ease-out"
          style={{
            transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`,
          }}
        >
          <MousePointer
            className={`h-6 w-6 text-rose-600 drop-shadow-md transition-transform duration-150 ${
              cursor.clicking ? "scale-90" : "scale-100"
            }`}
            fill="#e11d48"
          />
          {cursor.clicking && (
            <span className="absolute -top-1 -left-1 h-8 w-8 animate-ping rounded-full bg-rose-500/40" />
          )}
        </div>
      )}
    </div>
  );
}
