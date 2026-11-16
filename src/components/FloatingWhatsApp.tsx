"use client";

import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const whatsappUrl =
    "https://wa.me/6285135630305?text=Halo%20Admin%20Bougenville%20Swimming%20Club%2C%20saya%20ingin%20bertanya%20mengenai%20program%20dan%20jadwal%20les%20renang.";

  return (
    <aside
      aria-label="Kontak Cepat WhatsApp"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 print:hidden"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Konsultasi Program Renang via WhatsApp"
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-full shadow-xl shadow-emerald-950/20 hover:shadow-2xl hover:shadow-emerald-900/30 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        {/* Glow indicator pulse */}
        <span className="relative flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white text-[#25D366]" />
        </span>

        {/* WhatsApp Icon */}
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-[#25D366] flex-shrink-0" />

        {/* Label Text - Visible on sm screens, subtle hover on mobile */}
        <div className="flex flex-col text-left pr-1">
          <span className="text-[10px] sm:text-xs font-semibold leading-tight opacity-90">
            Chat Admin BSC
          </span>
          <span className="text-xs sm:text-sm font-extrabold leading-tight">
            Tanya Jadwal & Info
          </span>
        </div>
      </a>
    </aside>
  );
}
