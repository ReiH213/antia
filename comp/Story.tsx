"use client";

import { homemade } from "@/app/fonts";
import { motion, type MotionProps } from "framer-motion";
import Image from "next/image";

type Props = {
  title?: string;
  p1: string;
  p2: string;
  img1: string;
  img2: string;
  id?: string;
  bgColor?: string; // tailwind class or custom hex via style prop
  textColor?: string; // tailwind class or custom hex via style prop
};

export default function OurHistory({
  title = "Nuestra Historia",
  p1,
  p2,
  img1,
  img2,
  id = "our-story",
  bgColor = "#B8683C", // terracotta-ish
  textColor = "#FFEBD7", // warm cream
}: Props) {
  // simple fade-in helper
  const EASE = [0.16, 1, 0.3, 1] as const;

  const fade: MotionProps = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, ease: EASE },
  };
  return (
    <section className="w-full bg-[#BF7147] text-white py-24 md:py-36">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        {/* MOBILE FLOW (title first) */}
        <div className="md:hidden">
          <motion.h2
            {...fade}
            className={`${homemade.className} text-5xl leading-none text-center mb-10`}
          >
            Historia jonë
          </motion.h2>

          <motion.p
            {...fade}
            className={`${homemade.className} text-[18px] leading-7 tracking-wide mb-10`}
          >
            La historia de Tam y Diana comenzó en Shanghái en 2019, cuando se
            conocieron mientras estudiaban en el extranjero. Su amistad floreció
            rápidamente entre risas, aventuras y largas conversaciones, mientras
            exploraban los vibrantes rincones de China.
          </motion.p>

          <motion.div {...fade} className="flex flex-col gap-6 mb-10">
            <RotatedPhoto src="/1.jpeg" alt="us 1" rotate="-3" />
            <RotatedPhoto src="/2.jpeg" alt="us 2" rotate="2" />
          </motion.div>

          <motion.p
            {...fade}
            className={`${homemade.className} text-[18px] leading-7 tracking-wide`}
          >
            Cuando la pandemia llegó en 2020, tuvieron que regresar a sus países
            de origen, separados por océanos y diferentes horarios. Sin embargo,
            la distancia nunca rompió el lazo que los unía. Su conexión se hizo
            más fuerte, alimentada por el apoyo mutuo y la certeza de que algo
            especial los esperaba.
          </motion.p>
        </div>

        {/* DESKTOP / TABLET */}
        <div className="hidden md:block">
          {/* Row 1: paragraph left, image right */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 mb-24">
            <motion.p
              {...fade}
              className={`${homemade.className} text-[22px] leading-9 tracking-wide max-w-[36ch] md:justify-self-end`}
            >
              La historia de Tam y Diana comenzó en Shanghái en 2019, cuando se
              conocieron mientras estudiaban en el extranjero. Su amistad
              floreció rápidamente entre risas, aventuras y largas
              conversaciones, mientras exploraban los vibrantes rincones de
              China.
            </motion.p>

            <motion.div {...fade} className="md:justify-self-start">
              <RotatedPhoto src="/1.jpeg" alt="us 1" rotate="-4" />
            </motion.div>
          </div>

          {/* Title centered */}
          <motion.h2
            {...fade}
            className={`${homemade.className} text-7xl leading-none text-center mb-24`}
          >
            Historia jonë
          </motion.h2>

          {/* Row 2: image left, paragraph right */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16">
            <motion.div {...fade} className="md:justify-self-end">
              <RotatedPhoto src="/2.jpeg" alt="us 2" rotate="4" />
            </motion.div>

            <motion.p
              {...fade}
              className={`${homemade.className} text-[22px] leading-9 tracking-wide max-w-[36ch] md:justify-self-start`}
            >
              Cuando la pandemia llegó en 2020, tuvieron que regresar a sus
              países de origen, separados por océanos y diferentes horarios. Sin
              embargo, la distancia nunca rompió el lazo que los unía. Su
              conexión se hizo más fuerte, alimentada por el apoyo mutuo y la
              certeza de que algo especial los esperaba.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Small helper to render a tilted “polaroid” photo card.
 */
type RotatedPhotoProps = {
  src: string;
  alt: string;
  rotate?:
    | "-6"
    | "-5"
    | "-4"
    | "-3"
    | "-2"
    | "-1"
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6";
};

function RotatedPhoto({ src, alt, rotate = "0" }: RotatedPhotoProps) {
  // Tailwind can't interpolate arbitrary strings in classNames safely without safelisting,
  // so we map to known utility classes:
  const rotateClass =
    rotate === "-6"
      ? "-rotate-6"
      : rotate === "-5"
      ? "-rotate-5"
      : rotate === "-4"
      ? "-rotate-3" // Tailwind doesn't have every step by default, pick closest
      : rotate === "-3"
      ? "-rotate-3"
      : rotate === "-2"
      ? "-rotate-2"
      : rotate === "-1"
      ? "-rotate-1"
      : rotate === "1"
      ? "rotate-1"
      : rotate === "2"
      ? "rotate-2"
      : rotate === "3"
      ? "rotate-3"
      : rotate === "4"
      ? "rotate-3"
      : rotate === "5"
      ? "rotate-6"
      : rotate === "6"
      ? "rotate-6"
      : "rotate-0";

  return (
    <div
      className={`
        relative w-[320px] h-[400px] md:w-[380px] md:h-[480px]
        border-4 border-white overflow-hidden shadow-xl mx-auto
        transform-gpu ${rotateClass}
      `}
    >
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}
