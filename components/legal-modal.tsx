"use client";

import React, { useState, useEffect } from "react";
import { X, ShieldCheck, FileText, Lock, ExternalLink, Scale } from "lucide-react";

export type LegalTab = "legal" | "terms" | "privacy";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
  toolName: string;
  priceText: string;
  customDisclaimer?: string;
}

export function LegalModal({
  isOpen,
  onClose,
  initialTab = "legal",
  toolName,
  priceText,
  customDisclaimer,
}: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[88vh] bg-white rounded-3xl border-2 border-slate-300 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* モーダルヘッダー */}
        <div className="px-6 pt-5 pb-3 border-b-2 border-slate-100 bg-slate-50/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Scale className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  法的表記・利用規約
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  {toolName}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="閉じる"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 3タブ切替 */}
          <div className="flex gap-1 sm:gap-1.5 p-1 bg-slate-200/60 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("terms")}
              className={`flex-1 py-1.5 px-1.5 sm:px-2 text-xs sm:text-sm font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === "terms"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="hidden sm:block w-3.5 h-3.5 shrink-0" />
              <span>利用規約</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("privacy")}
              className={`flex-[1.35] sm:flex-1 py-1.5 px-1.5 sm:px-2 text-xs sm:text-sm font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === "privacy"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Lock className="hidden sm:block w-3.5 h-3.5 shrink-0" />
              <span>プライバシーポリシー</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("legal")}
              className={`flex-1 py-1.5 px-1.5 sm:px-2 text-xs sm:text-sm font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === "legal"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="hidden sm:block w-3.5 h-3.5 shrink-0" />
              <span>特定商取引法</span>
            </button>
          </div>
        </div>

        {/* モーダル本文 */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
          {/* 1. 特定商取引法に基づく表記 */}
          {activeTab === "legal" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 gap-1 sm:gap-4 bg-white">
                  <dt className="font-bold text-slate-900">販売事業者</dt>
                  <dd className="sm:col-span-2 text-slate-700">片桐 健弥（兼 運営統括責任者）</dd>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 gap-1 sm:gap-4">
                  <dt className="font-bold text-slate-900">所在地</dt>
                  <dd className="sm:col-span-2 text-slate-700">
                    〒150-0043 東京都渋谷区道玄坂1丁目10番8号 渋谷道玄坂東急ビル2F−C
                  </dd>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 gap-1 sm:gap-4 bg-white">
                  <dt className="font-bold text-slate-900">電話番号</dt>
                  <dd className="sm:col-span-2 text-slate-700">
                    お客様からのご請求に基づき、遅滞なく電子メールにて開示いたします。開示をご希望される場合は、下記メールアドレスよりお申し出ください。
                  </dd>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 gap-1 sm:gap-4">
                  <dt className="font-bold text-slate-900">メールアドレス</dt>
                  <dd className="sm:col-span-2 text-slate-700 font-mono">info@azorb.co</dd>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 gap-1 sm:gap-4 bg-white">
                  <dt className="font-bold text-slate-900">販売価格</dt>
                  <dd className="sm:col-span-2 text-slate-700 font-semibold text-indigo-600">
                    {priceText}
                  </dd>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 gap-1 sm:gap-4">
                  <dt className="font-bold text-slate-900">商品代金以外の必要料金</dt>
                  <dd className="sm:col-span-2 text-slate-700">
                    当サイトの閲覧、Webアプリケーションの利用に必要となるインターネット接続料金・通信回線料金はお客様のご負担となります。
                  </dd>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 gap-1 sm:gap-4 bg-white">
                  <dt className="font-bold text-slate-900">支払方法・支払時期</dt>
                  <dd className="sm:col-span-2 text-slate-700">
                    クレジットカード決済（Stripeによる暗号化決済）。支払時期はご利用のカード会社ごとに異なります。
                  </dd>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 gap-1 sm:gap-4">
                  <dt className="font-bold text-slate-900">商品の引渡時期</dt>
                  <dd className="sm:col-span-2 text-slate-700">
                    クレジットカード決済完了後、直ちにご利用いただけます（プロ版アクセスキー即時発行）。
                  </dd>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 gap-1 sm:gap-4 bg-white">
                  <dt className="font-bold text-slate-900">返品・キャンセル特約</dt>
                  <dd className="sm:col-span-2 text-slate-700">
                    デジタルコンテンツおよびWebアプリケーションの性質上、購入完了後の返品・返金はお受けできません。
                  </dd>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Azorb プラットフォーム規程準拠</span>
                <a
                  href="https://azorb-site.vercel.app/legal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-medium"
                >
                  <span>外部原本ページ</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* 2. 利用規約 */}
          {activeTab === "terms" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  第1条（総則および本サービスの利用）
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  本利用規約は、当事業者が提供するWebアプリケーション「{toolName}」（以下「本サービス」）の利用条件を定めるものです。ユーザーは、本サービスの利用開始をもって本規約の全条項に同意したものとみなされます。
                </p>

                <h3 className="font-bold text-slate-900 text-sm pt-2">
                  第2条（知的財産権および利用許諾）
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  本サービスを構成するプログラム、デザイン、文章、データベース等の著作権は当事業者に帰属します。購入ユーザーに対し、自己の業務目的における非独占的な利用を許諾するものとし、アクセスキーの第三者への転売・共有は禁止します。
                </p>

                <h3 className="font-bold text-slate-900 text-sm pt-2">
                  第3条（免責事項・個別規定）
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {customDisclaimer ||
                    "当事業者は、本サービスの利用により得られる結果の完全性、正確性、特定目的への適合性について明示または黙示を問わずいかなる保証も行いません。本サービスの利用に起因して生じた損害について、当事業者の故意または重過失による場合を除き、一切の責任を負いません。"}
                </p>

                <h3 className="font-bold text-slate-900 text-sm pt-2">
                  第4条（規約の変更および準拠法）
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  本規約は日本法に準拠し、本規約に起因する紛争については東京地方裁判所を第一審の専属的合意管轄裁判所とします。
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Azorb プラットフォーム規程準拠</span>
                <a
                  href="https://azorb-site.vercel.app/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-medium"
                >
                  <span>外部原本ページ</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* 3. プライバシーポリシー */}
          {activeTab === "privacy" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  1. 取得する情報および利用目的
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  当事業者は、本サービスの提供にあたり、決済事業者（Stripe）を通じて決済情報およびメールアドレスを取得します。これらの情報は、購入完了通知、アクセスキーの管理、およびカスタマーサポート対応の目的のみに利用します。
                </p>

                <h3 className="font-bold text-slate-900 text-sm pt-2">
                  2. 入力データの保護
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ユーザーが本サービスの入力欄に投入したデータや業務メモ等は、原則としてブラウザ内（ローカル環境）で処理され、当事業者のサーバーに恒久的に蓄積・第三者へ共有されることはありません。
                </p>

                <h3 className="font-bold text-slate-900 text-sm pt-2">
                  3. 第三者提供の制限および安全管理
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  法令に基づく場合を除き、取得した個人情報をユーザーの同意なく第三者に提供することはありません。通信経路はTLS暗号化により保護されています。
                </p>

                <h3 className="font-bold text-slate-900 text-sm pt-2">
                  4. お問い合わせ窓口
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  プライバシーに関するお問い合わせは、担当窓口（info@azorb.co）まで電子メールにてご連絡ください。
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Azorb プラットフォーム規程準拠</span>
                <a
                  href="https://azorb-site.vercel.app/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-medium"
                >
                  <span>外部原本ページ</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* モーダルフッター */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
