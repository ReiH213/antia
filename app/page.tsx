"use client";
import EnvelopeReveal from "@/comp/Envelope";
import Hero from "@/comp/Header";
import RSVP from "@/comp/RSVP";
import RsvpCallout from "@/comp/RsvpCallout";
import OurHistory from "@/comp/Story";
import { Milestone } from "@/comp/TImeline";

const milestones: Milestone[] = [
  { src: "/1.jpeg", delay: 0.5, title: "We met & fell in love", date: "2017" },
  {
    src: "/2.jpeg",
    delay: 1.5,
    title: "Adventure time (lots of fishing!)",
    date: "2018",
  },
  {
    src: "/3.jpeg",
    delay: 2.3,
    title: "We proclaimed our love for the Lord",
    date: "2019",
  },
  {
    src: "/4.jpeg",
    delay: 3.2,
    title: "We moved to AZ & adopted Goosey",
    date: "2020",
  },
  { src: "/5.jpeg", delay: 4.4, title: "We got engaged!", date: "2023" },
  { src: "/6.jpeg", delay: 5.1, title: "More memories..." },
  { src: "/7.jpeg", delay: 5.9, title: "And more love" },
  { src: "/8.jpeg", delay: 6.6, title: "…which brought us here" },
];

export default function Page() {
  return (
    <main className="flex flex-col  bg-[#7a6d3f]">
      <Hero />
      {/* Envelope intro */}
      <EnvelopeReveal />
      <RsvpCallout
        date="20 Shtator 2025"
        place="Vila Toscana"
        bgSrc="/toscana.png" // your image
        rsvpTargetId="rsvp" // the section to scroll to
      />
      <OurHistory
        title="Historia jonë"
        p1={`LA HISTORIA DE TAM Y DIANA COMENZÓ EN SHANGHÁI EN 2019, CUANDO...
CUANDO LA PANDEMIA LLEGÓ EN 2020...`}
        p2={`SIN EMBARGO, LA DISTANCIA NUNCA ROMPIÓ EL LAZO QUE LOS UNÍA...
SU CONEXIÓN SE HIZO MÁS FUERTE...`}
        img1="/1.jpeg"
        img2="/2.jpeg"
      />
      <RSVP />
      <footer className="mt-32 pb-16 text-center text-xs text-stone-400">
        Made with ❤️ in Next.js 15
      </footer>
    </main>
  );
}
