"use client";
import EnvelopeReveal from "@/comp/Envelope";
import Hero from "@/comp/Header";
import RSVP from "@/comp/RSVP";
import RsvpCallout from "@/comp/RsvpCallout";
import OurHistory from "@/comp/Story";

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
