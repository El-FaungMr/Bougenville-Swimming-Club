import { TESTIMONIALS } from "@/lib/constants";
import { Star, MessageSquareQuote, ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Pengalaman Nyata Orang Tua</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Apa Kata Orang Tua Atlet?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Kepercayaan orang tua adalah kebanggaan terbesar kami. Simak bagaimana anak-anak bertumbuh dari rasa takut air hingga menguasai teknik renang dengan percaya diri dan bahagia.
          </p>
        </div>

        {/* Testimonials Cards Grid (2x2 Balanced Responsive Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className={`rounded-3xl p-7 sm:p-8 border transition-all duration-300 flex flex-col justify-between relative group hover:-translate-y-1 ${
                item.isFeatured
                  ? "bg-gradient-to-br from-cyan-50/60 via-white to-white border-cyan-300 shadow-md ring-2 ring-cyan-500/10 hover:shadow-xl"
                  : "bg-white border-slate-200/80 shadow-sm hover:shadow-xl"
              }`}
            >
              <div className="space-y-4">
                {/* Header Card: Rating, Featured Badge & Quote Icon */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    {item.isFeatured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-cyan-800 bg-cyan-100/80 px-2 py-0.5 rounded-full border border-cyan-200">
                        <Sparkles className="w-3 h-3 text-cyan-600" />
                        <span>Ulasan Klien Nyata</span>
                      </span>
                    )}
                  </div>
                  <MessageSquareQuote className="w-8 h-8 text-brand-200 group-hover:text-brand-500 transition-colors flex-shrink-0" />
                </div>

                {/* Progress & Category Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/70">
                    {item.progressBadge}
                  </span>
                  <span className="inline-block text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-100">
                    {item.programTaken}
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    {item.parentName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {item.childInfo}
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0"
                  title="Testimoni Terverifikasi"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote Trust Signal */}
        <div className="mt-12 text-center">
          <p className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Testimoni Nyata dari Orang Tua Murid Bougenville Swimming Club</span>
          </p>
        </div>
      </div>
    </section>
  );
}
