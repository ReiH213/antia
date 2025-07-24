"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const sets = [
  ["/1.jpeg", "/2.jpeg", "/3.jpeg", "/4.jpeg"],
  ["/5.jpeg", "/6.jpeg", "/7.jpeg", "/8.jpeg"],
];

export default function SwitchingGrid() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % sets.length), 500);
    return () => clearInterval(id);
  }, []);
  const images = sets[idx];

  return (
    <section className="max-w-4xl mx-auto mt-32 grid grid-cols-2 gap-2 md:gap-4">
      {images.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="relative w-full pb-[100%] overflow-hidden rounded-lg shadow"
        >
          <Image src={src} alt="grid" fill className="object-cover" />
        </div>
      ))}
    </section>
  );
}
