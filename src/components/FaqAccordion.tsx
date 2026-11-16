"use client";

import { useState } from "react";
import { FAQS, CLUB_INFO } from "@/lib/constants";
import { HelpCircle, ChevronDown, MessageCircle } from "lucide-react";

export default function FaqAccordion() {
  // Buka pertanyaan pertama secara default agar pengunjung langsung melihat isi
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-20 bg-white border-b border-slate-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
            <span>Pusat Tanya Jawab</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Temukan jawaban cepat atas pertanyaan seputar batas usia, lokasi latihan di Karawang, sistem kelas, hingga kebijakan kolam renang.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-slate-50/80 border-brand-400 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-2xl"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isOpen
                        ? "bg-brand-600 text-white rotate-180"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100/80 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bantuan Lebih Lanjut */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-brand-50 via-cyan-50 to-slate-50 border border-brand-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Masih punya pertanyaan lain seputar latihan anak?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Admin kami dengan senang hati membantu konsultasi program dan jadwal.
            </p>
          </div>
          <a
            href={CLUB_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 flex-shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Tanya Admin via WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
