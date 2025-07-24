"use client";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type Milestone = {
  src: string;
  delay: number;
  title: string;
  date?: string;
};

type Props = {
  milestones: Milestone[];
};

export default function PhotoTimeline({ milestones }: Props) {
  const lineRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);
  const controls = useAnimationControls();
  const imgRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (lineRef.current) setLineHeight(lineRef.current.scrollHeight);
  }, []);

  useEffect(() => {
    milestones.forEach((m, i) => {
      const pct = (i + 1) / milestones.length;
      setTimeout(() => {
        controls.start({
          scaleY: pct,
          transition: { duration: 0.5, ease: "easeInOut" },
        });
        imgRefs.current[i]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, m.delay * 1000);
    });
  }, [milestones, controls]);

  return (
    <section className="relative max-w-5xl mx-auto mt-32" ref={lineRef}>
      {/* vertical line */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-[2px] bg-stone-300 origin-top"
        style={{ height: lineHeight }}
        initial={{ scaleY: 0 }}
        animate={controls}
      />

      {milestones.map((m, idx) => {
        const leftSide = idx % 2 === 0;
        return (
          <div
            key={idx}
            ref={(el) => {
              if (el) imgRefs.current[idx] = el;
            }}
            className="relative flex min-h-[520px] md:min-h-[580px] items-center"
          >
            {/* IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut", delay: m.delay }}
              className={`w-1/2 hidden md:flex ${
                leftSide ? "justify-end pr-10" : "justify-start pl-10"
              }`}
            >
              <div className="relative w-[360px] h-[480px] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src={m.src}
                  alt={m.title}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* mobile image (full width) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut", delay: m.delay }}
              className="md:hidden w-full px-6"
            >
              <div className="relative w-full h-[420px] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src={m.src}
                  alt={m.title}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* DOT */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: m.delay, duration: 0.4, ease: "easeOut" }}
              className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-stone-500 rounded-full z-10"
            />

            {/* TEXT */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: m.delay + 0.1,
                duration: 0.6,
                ease: "easeOut",
              }}
              className={`w-1/2 hidden md:flex ${
                leftSide ? "pl-10 text-left" : "pr-10 text-right"
              } flex-col gap-1`}
            >
              {m.date && (
                <span className="text-sm tracking-wide text-stone-400">
                  {m.date}
                </span>
              )}
              <span className="text-lg leading-snug">{m.title}</span>
            </motion.div>

            {/* mobile text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: m.delay + 0.1,
                duration: 0.6,
                ease: "easeOut",
              }}
              className="md:hidden w-full px-6 mt-3 text-center"
            >
              {m.date && (
                <span className="block text-xs tracking-wide text-stone-400">
                  {m.date}
                </span>
              )}
              <span className="block text-base leading-snug">{m.title}</span>
            </motion.div>
          </div>
        );
      })}
    </section>
  );
}
