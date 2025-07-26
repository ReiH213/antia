"use client";

import { imperial } from "@/app/fonts";
import { useMemo, useState } from "react";

type Attendee = {
  first: string;
  last: string;
  attending: "yes" | "no";
};

const EMPTY: Attendee = { first: "", last: "", attending: "yes" };
const PETALS_COUNT = 28; // how many petals to render in the background

export default function RSVPPage() {
  // 5 attendees, first required, others optional
  const [people, setPeople] = useState<Attendee[]>(
    Array.from({ length: 5 }, (_, i) => ({ ...EMPTY }))
  );
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<null | "ok" | "err">(null);
  const [errors, setErrors] = useState<(string | null)[]>(Array(5).fill(null));

  // Randomized petals configuration (stable per mount)
  const petals = useMemo(
    () =>
      Array.from({ length: PETALS_COUNT }).map((_, i) => {
        const left = Math.random() * 100; // vw
        const size = 10 + Math.random() * 16; // px
        const duration = 14 + Math.random() * 12; // s
        const delay = Math.random() * 10; // s
        const drift = (Math.random() * 20 - 10).toFixed(1); // px horizontal drift
        const rotate = Math.floor(Math.random() * 360);
        return { i, left, size, duration, delay, drift, rotate };
      }),
    []
  );

  const updatePerson = (idx: number, patch: Partial<Attendee>) => {
    setPeople((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  };

  const validate = () => {
    const newErrors = Array(5).fill(null) as (string | null)[];
    // At least one non-empty row
    const filledIndices = people
      .map((p, i) => ({ i, p }))
      .filter(({ p }) => p.first.trim() || p.last.trim());

    if (filledIndices.length === 0) {
      newErrors[0] = "Të paktën një person duhet të plotësohet.";
    }

    // Each partially filled row must have both names
    filledIndices.forEach(({ i, p }) => {
      if (!p.first.trim() || !p.last.trim()) {
        newErrors[i] = "Plotësoni Emrin dhe Mbiemrin.";
      }
    });

    setErrors(newErrors);
    return newErrors.every((e) => !e);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!validate()) return;

    const attendees = people.filter((p) => p.first.trim() && p.last.trim());

    setSending(true);
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          time: "16:30",
          attendees, // array of {first,last,attending}
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("ok");
      setPeople(Array.from({ length: 5 }, () => ({ ...EMPTY })));
      setErrors(Array(5).fill(null));
    } catch (err) {
      console.error(err);
      setStatus("err");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Falling petals background */}
      <div className="absolute inset-0 -z-10 bg-[#fff6fa]">
        {petals.map((p) => (
          <span
            key={p.i}
            className="petal"
            style={
              {
                left: `${p.left}vw`,
                width: `${p.size}px`,
                height: `${p.size * 1.3}px`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                // CSS vars for keyframes
                "--drift": `${p.drift}px`,
                "--rot": `${p.rotate}deg`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Card */}
      <section
        className={`w-full px-4 py-16 flex items-center justify-center ${imperial.className}`}
      >
        <div className="w-full max-w-2xl rounded-2xl border border-rose-100/60 shadow-sm p-6 md:p-8 bg-white/90 backdrop-blur min-w-fit">
          <h2
            className={`text-3xl md:text-4xl font-medium tracking-wide text-center mb-6 `}
          >
            RSVP
          </h2>

          <div className="flex items-center justify-between rounded-md border px-3 py-2 mb-6 text-sm">
            <span className="text-3xl font-medium">Ora</span>
            <span>—</span>
            <span className="text-3xl font-semibold">16:30</span>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {people.map((p, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl  font-medium">
                    I ftuari {i + 1}{" "}
                    {i === 0 ? "(i detyrueshëm)" : "(opsional)"}
                  </span>
                  {errors[i] && (
                    <span className="text-3xl  text-red-600">{errors[i]}</span>
                  )}
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Emër"
                    value={p.first}
                    onChange={(e) => updatePerson(i, { first: e.target.value })}
                    className={`flex-1 border rounded-md px-3 py-2 text-3xl outline-none focus:ring-2 focus:ring-rose-300/40 placeholder:text-3xl ${
                      errors[i] ? "border-red-400" : ""
                    }`}
                    required={i === 0}
                  />
                  <input
                    type="text"
                    placeholder="Mbiemër"
                    value={p.last}
                    onChange={(e) => updatePerson(i, { last: e.target.value })}
                    className={`flex-1 border rounded-md px-3 py-2 outline-none focus:ring-2 placeholder:text-3xl text-3xl focus:ring-rose-300/40 ${
                      errors[i] ? "border-red-400" : ""
                    }`}
                    required={i === 0}
                  />
                  <select
                    value={p.attending}
                    onChange={(e) =>
                      updatePerson(i, {
                        attending: e.target.value as "yes" | "no",
                      })
                    }
                    className="md:w-48 border rounded-md has-[option:text-3xl]: px-3 py-2 outline-none focus:ring-2 focus:ring-rose-300/40"
                  >
                    <option className="text-3xl" value="yes">
                      Po — Pranoj me Kënaqësi
                    </option>
                    <option className="text-3xl" value="no">
                      Jo — Refuzoj me Keqardhje
                    </option>
                  </select>
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={sending}
              className={`w-full px-4 text-4xl py-2 rounded-md text-white transition ${
                sending
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-rose-700 hover:bg-rose-800"
              }`}
            >
              {sending ? "Duke dërguar…" : "Konfirmo"}
            </button>

            {status === "ok" && (
              <p className="text-green-600 text-4xl text-center">
                Faleminderit! E morëm konfirmimin tuaj 🤍
              </p>
            )}
            {status === "err" && (
              <p className="text-red-600 text-4xl font-bold text-center">
                Diçka shkoi keq. Provo përsëri.
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Styled-JSX for petals */}
      <style jsx global>{`
        /* Soft gradient at very top & bottom so petals fade */
        main::before,
        main::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 12vh;
          z-index: -1;
          pointer-events: none;
        }
        main::before {
          top: 0;
          background: linear-gradient(180deg, #fff6fa, transparent);
        }
        main::after {
          bottom: 0;
          background: linear-gradient(0deg, #fff6fa, transparent);
        }

        .petal {
          position: absolute;
          top: -10vh;
          display: block;
          background: radial-gradient(
              40% 55% at 40% 55%,
              #ffd4e3 0%,
              #ffbcd4 60%,
              #ff97be 100%
            )
            no-repeat;
          border-radius: 60% 60% 40% 40% / 70% 70% 40% 40%;
          box-shadow: 0 3px 6px rgba(255, 153, 188, 0.25);
          transform: rotate(var(--rot));
          opacity: 0.9;
          animation-name: petal-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        @keyframes petal-fall {
          0% {
            transform: translate3d(0, -10vh, 0) rotate(var(--rot));
            opacity: 0;
          }
          8% {
            opacity: 0.9;
          }
          50% {
            transform: translate3d(var(--drift), 50vh, 0)
              rotate(calc(var(--rot) + 180deg));
          }
          100% {
            transform: translate3d(calc(var(--drift) * 2), 110vh, 0)
              rotate(calc(var(--rot) + 360deg));
            opacity: 0.85;
          }
        }
      `}</style>
    </main>
  );
}
