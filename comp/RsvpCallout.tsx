"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { homemade } from "@/app/fonts";

// If you already export these from somewhere, import them instead:

type Props = {
  date: string;
  place: string;
  bgSrc?: string; // defaults to /toscana.png
  rsvpTargetId?: string; // defaults to "rsvp"
};

export default function RsvpCallout({
  date,
  place,
  bgSrc = "/toscana.jpeg",
  rsvpTargetId = "rsvp",
}: Props) {
  const onClick = () => {
    const el = document.getElementById(rsvpTargetId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full min-h-[100vh] md:min-h-[110vh] overflow-hidden">
      {/* BG image */}
      <Image
        src={"/toscana.jpeg"}
        alt="Venue watercolor"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Top white gradient so text reads cleanly, fades to transparent over the painting */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-start md:justify-center pt-24 md:pt-32 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`${homemade.className} text-[38px] leading-tight md:text-[64px] text-[#9b6f49]`}
        >
          {date}
          <br />
          {place}
        </motion.h2>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          onClick={onClick}
          className="mt-8 inline-flex items-center justify-center rounded-full border border-[#9b6f49] px-8 py-3 text-[#9b6f49] hover:bg-[#9b6f49] hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#9b6f49]"
          aria-label="RSVP"
        >
          <span className={` tracking-wide font-sans`}>RSVP</span>
        </motion.button>
      </div>
    </section>
  );
}
