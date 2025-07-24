"use client";

import { useState } from "react";

type RsvpPayload = {
  first: string;
  last: string;
  attending: "yes" | "no";
};

export default function RSVP() {
  const [form, setForm] = useState<RsvpPayload>({
    first: "",
    last: "",
    attending: "yes",
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<null | "ok" | "err">(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("ok");
      setForm({ first: "", last: "", attending: "yes" });
    } catch (e) {
      console.error(e);
      setStatus("err");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="rsvp"
      className="w-full py-20 px-4 flex items-center justify-center bg-white"
    >
      <div className="w-full max-w-lg rounded-xl border border-neutral-200/60 shadow-sm p-6 md:p-8 bg-white">
        <h2 className="text-2xl md:text-3xl font-medium tracking-wide text-center mb-6">
          RSVP
        </h2>

        <div className="flex items-center justify-between rounded-md border px-3 py-2 mb-6 text-sm">
          <span className="font-medium">Ora</span>
          <span>—</span>
          <span className="font-semibold">19:00</span>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Emër"
              value={form.first}
              onChange={(e) =>
                setForm((f) => ({ ...f, first: e.target.value }))
              }
              required
              className="flex-1 border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
            />
            <input
              type="text"
              placeholder="Mbiemër"
              value={form.last}
              onChange={(e) => setForm((f) => ({ ...f, last: e.target.value }))}
              required
              className="flex-1 border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <label className="text-nowrap rounded-md p-1.5 text-sm">
              Do të merrni pjesë?
            </label>
            <select
              value={form.attending}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  attending: e.target.value as "yes" | "no",
                }))
              }
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
            >
              <option value="yes">Po — Pranoj me Kënaqësi</option>
              <option value="no">Jo — Refuzoj me Keqardhje</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={sending}
            className={`w-full px-4 py-2 rounded-md text-white transition ${
              sending
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:opacity-90"
            }`}
          >
            {sending ? "Duke dërguar…" : "Konfirmo"}
          </button>

          {status === "ok" && (
            <p className="text-green-600 text-sm text-center">
              Faleminderit! E morëm konfirmimin tuaj 🤍
            </p>
          )}
          {status === "err" && (
            <p className="text-red-600 text-sm text-center">
              Diçka shkoi keq. Provo përsëri.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
