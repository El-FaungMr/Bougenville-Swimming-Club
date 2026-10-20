"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  showText?: boolean;
}

export default function Logo({
  variant = "dark",
  size = "md",
  href = "/",
  className = "",
  showText = true,
}: LogoProps) {
  // Ukuran wadah logo asli
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-13 h-13 sm:w-14 sm:h-14",
    lg: "w-16 h-16 sm:w-20 sm:h-20",
  };

  const imagePixelSizes = {
    sm: 44,
    md: 56,
    lg: 80,
  };

  const textClasses = {
    sm: {
      title: "text-sm font-extrabold tracking-tight leading-tight",
      subtitle: "text-[9px] font-bold tracking-wider",
    },
    md: {
      title: "text-lg sm:text-xl font-extrabold tracking-tight leading-tight",
      subtitle: "text-[10px] sm:text-xs font-bold tracking-wider",
    },
    lg: {
      title: "text-2xl font-extrabold tracking-tight leading-tight",
      subtitle: "text-xs sm:text-sm font-bold tracking-wider",
    },
  };

  const isLight = variant === "light";

  const content = (
    <div className={`inline-flex items-center gap-3 group ${className}`}>
      {/* Wadah Logo Asli: mempertahankan rasio 1:1, bentuk perisai, dan warna asli */}
      <div
        className={`${sizeClasses[size]} relative flex-shrink-0 aspect-square rounded-xl overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
          isLight
            ? "bg-white p-1 shadow-sm border border-slate-700/50"
            : "bg-white p-0.5 shadow-sm border border-slate-100"
        }`}
      >
        <Image
          src="/logo.jpeg"
          alt="Logo Bougenville Swimming Club"
          width={imagePixelSizes[size]}
          height={imagePixelSizes[size]}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {/* Tipografi Nama Klub */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`${textClasses[size].title} ${
              isLight ? "text-white" : "text-slate-900"
            }`}
          >
            Bougenville
          </span>
          <span
            className={`${textClasses[size].subtitle} uppercase ${
              isLight ? "text-cyan-300" : "text-brand-600"
            }`}
          >
            Swimming Club
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg"
      >
        {content}
      </Link>
    );
  }

  return content;
}
