"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { homemade } from "@/app/fonts";

const CYCLE_MS = 1200;
const MIN_DELAY_MS = 80;
const MAX_DELAY_MS = 700;
const MASK_COLOR = "#7a6d3f";

const sets: string[][] = [
  ["/1.jpeg", "/2.jpeg", "/3.jpeg", "/4.jpeg"],
  ["/5.jpeg", "/6.jpeg", "/7.jpeg", "/8.jpeg"],
];

export default function Hero() {
  const [currentImages, setCurrentImages] = useState<string[]>(sets[0]);
  const idxRef = useRef(0);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const nextIdx = (idxRef.current + 1) % sets.length;
      const target = sets[nextIdx];

      const allTiles = [0, 1, 2, 3];
      const shuffled = [...allTiles].sort(() => Math.random() - 0.5);
      const subsetSize = Math.floor(Math.random() * 4) + 1; // 1..4
      const toUpdate = shuffled.slice(0, subsetSize);
      const rest = allTiles.filter((t) => !toUpdate.includes(t));
      const updateRestToo = Math.random() > 0.4;
      const order = updateRestToo ? [...toUpdate, ...rest] : toUpdate;

      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];

      order.forEach((pos) => {
        const delay =
          MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
        const t = window.setTimeout(() => {
          setCurrentImages((prev) => {
            const next = [...prev];
            next[pos] = target[pos];
            return next;
          });
        }, delay);
        timeoutsRef.current.push(t);
      });

      idxRef.current = nextIdx;
    }, CYCLE_MS);

    return () => {
      clearInterval(interval);
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden py-24">
      {/* Background tint */}
      <div className="absolute inset-0 -z-10 bg-[#7a6d3f]" />

      {/* MOBILE */}
      <div className="md:hidden w-full px-6 flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.7 }}
          className={`${homemade.className} text-5xl leading-tight text-white/90`}
        >
          Meti
          <br />
          dhe Antia
        </motion.h1>

        <SwitchingGrid
          className="w-full md:max-w-[440px] lg:max-w-[880px]"
          images={currentImages}
        />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.7 }}
          className={`${homemade.className} mt-6 text-5xl leading-tight text-white/90`}
        >
          po martohen
        </motion.h2>
      </div>

      {/* DESKTOP / LARGE */}
      <div
        className={`
          hidden md:grid items-center gap-12 px-12 mx-auto w-full
          md:max-w-6xl lg:max-w-[1200px]
          md:[grid-template-columns:1fr_minmax(260px,440px)_1fr]
          lg:[grid-template-columns:1fr_minmax(520px,880px)_1fr]
        `}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20, rotate: 20, x: 120 }}
          whileInView={{ opacity: 1, y: -230 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={`
            ${homemade.className}
            text-white/90 text-right whitespace-pre-line leading-none
            md:text-[72px] lg:text-[56px] flex flex-col gap-5 z-20
          `}
        >
          <span>Antia </span>
          <span>dhe</span>
          <span> Meti</span>
        </motion.h1>

        <SwitchingGrid
          images={currentImages}
          className="w-full md:max-w-[440px] lg:max-w-[880px]"
        />

        <motion.h2
          initial={{ opacity: 0, y: 20, rotate: 20, x: -120 }}
          whileInView={{ opacity: 1, y: 230 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className={`
            ${homemade.className}
            text-white/90 whitespace-pre-line leading-none
            md:text-[72px] lg:text-[56px]
          `}
        >
          {`po martohen`}
        </motion.h2>
      </div>
      <motion.h1
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 2.15 }}
        className={`
            ${homemade.className}
            text-white/90 whitespace-pre-line leading-none
            md:text-[72px] lg:text-[56px] mt-20
          `}
      >
        dheee...{" "}
      </motion.h1>
    </section>
  );
}

function SwitchingGrid({
  images,
  className = "",
}: {
  images: string[];
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.15 }}
      className={`relative bg-black p-2 md:p-3 lg:p-4 rounded-md shadow-lg ${className}`}
    >
      <div className="grid grid-cols-2 gap-2 md:gap-3 lg:gap-4">
        {images.map((src, i) => (
          <Tile key={`${i}-${src}`} src={src} idx={i} />
        ))}
      </div>
    </motion.div>
  );
}

function Tile({ src, idx }: { src: string; idx: number }) {
  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-sm">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full overflow-hidden rounded-sm grain">
            <Image
              src={src}
              alt={`grid-${idx}`}
              fill
              className="object-cover"
            />
          </div>
          {/* sepia / color mask to blend with background */}
          <div
            className="absolute inset-0 mix-blend-multiply pointer-events-none"
            style={{ backgroundColor: MASK_COLOR, opacity: 0.22 }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
