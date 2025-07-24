"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

type CardCfg = {
  src: string;
  x: number; // horizontal offset (px)
  rotate: number; // initial rotation (deg)
  rise: number; // how far it should go up on full scroll (negative = up)
  z: number; // z-index
  widthPct?: number; // % of envelope inner width
};

const CARDS: CardCfg[] = [
  { src: "/1.jpeg", x: -70, rotate: -6, rise: -200, z: 4, widthPct: 78 },
  { src: "/2.jpeg", x: 10, rotate: 3, rise: -260, z: 3, widthPct: 86 },
  { src: "/3.jpeg", x: 60, rotate: -2, rise: -180, z: 2, widthPct: 82 },
  { src: "/4.jpeg", x: 120, rotate: 8, rise: -300, z: 5, widthPct: 32 },
];

export default function EnvelopeReveal() {
  const ref = useRef<HTMLDivElement>(null);

  // Animate while the section scrolls through the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 20%", "end 80%"],
  });

  // Desktop (md+) heading animations
  const leftOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
  const rightOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
  const leftX = useTransform(scrollYProgress, [0.05, 0.2], [-40, 0]);
  const rightX = useTransform(scrollYProgress, [0.05, 0.2], [40, 0]);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-[90vh] flex items-center justify-center py-24 overflow-hidden"
    >
      {/* Background to match your page */}
      <div className="absolute inset-0 -z-10 bg-[#7a6d3f]" />

      {/* DESKTOP HEADINGS (fade/slide in) */}
      <motion.h2
        style={{ opacity: leftOpacity, x: leftX }}
        className="hidden md:block absolute left-[6%] top-1/2 -translate-y-1/2 text-white/90 text-6xl lg:text-7xl leading-none"
      >
        Jeni
      </motion.h2>

      <motion.h2
        style={{ opacity: rightOpacity, x: rightX }}
        className="hidden md:block absolute right-[6%] top-1/2 -translate-y-1/2 text-white/90 text-6xl lg:text-7xl leading-none"
      >
        të ftuar
      </motion.h2>

      {/* MOBILE HEADINGS (static, no animation) */}
      <div className="md:hidden absolute top-10 w-full text-center">
        <h2 className="text-white/90 text-5xl leading-none">Jeni</h2>
      </div>
      <div className="md:hidden absolute bottom-10 w-full text-center">
        <h2 className="text-white/90 text-5xl leading-none">të ftuar</h2>
      </div>

      {/* Envelope + Cards */}
      <div className="relative w-[min(520px,92vw)] mx-auto">
        {/* BACK of the envelope (behind cards) */}
        <Image
          src="/back.png"
          alt="Envelope back"
          width={1000}
          height={1000}
          className="w-full h-auto relative z-0 select-none pointer-events-none top-[165px] right-1.5"
          priority
        />

        {/* Cards */}
        <Cards scrollYProgress={scrollYProgress} />

        {/* FRONT of the envelope (on top of cards) */}
        <Image
          src="/front.png"
          alt="Envelope front"
          width={1000}
          height={1000}
          className="w-full h-auto relative z-20 select-none pointer-events-none"
          priority
        />
      </div>
    </section>
  );
}

function Cards({
  scrollYProgress,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  return (
    <div
      className="
        absolute left-1/2 -translate-x-1/2
        bottom-[8%]
        w-[82%]
        pointer-events-none
      "
      style={{ perspective: 1000, zIndex: 10 }}
    >
      {CARDS.map((c, i) => {
        const y = useTransform(scrollYProgress, [0, 1], [0, c.rise]);
        const ySpring = useSpring(y, { stiffness: 120, damping: 20 });
        const rot = useTransform(
          scrollYProgress,
          [0, 1],
          [c.rotate, c.rotate + c.rotate * 0.15]
        );

        return (
          <motion.div
            key={c.src + i}
            style={{ y: ySpring, rotate: rot, zIndex: c.z }}
            className="absolute bottom-0"
          >
            <div
              className="relative"
              style={{
                width: `${c.widthPct ?? 80}%`,
                left: c.x,
              }}
            >
              <Image
                src={c.src}
                alt={`card-${i}`}
                width={800}
                height={1200}
                className="w-full h-auto rounded-sm shadow-md object-cover"
              />
              {/* Optional tint to match page background */}
              <div
                className="absolute inset-0 mix-blend-multiply pointer-events-none"
                style={{ backgroundColor: "#7a6d3f", opacity: 0.18 }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
