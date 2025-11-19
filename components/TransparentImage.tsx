"use client";

import Image from "next/image";
import { useState } from "react";

interface TransparentImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function TransparentImage({
  src,
  alt,
  width,
  height,
  className = "",
}: TransparentImageProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} mix-blend-multiply`}
        style={{
          filter: "drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))",
        }}
        onError={() => setImageError(true)}
      />
      {/* Fallback si la imagen no carga */}
      {imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-oro/20 to-magenta/20 rounded-lg flex items-center justify-center">
          <span className="text-blanco/60">Sin imagen</span>
        </div>
      )}
    </div>
  );
}