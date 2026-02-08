"use client";
import React from "react";
import Guard from "@/components/Guard";
import { api } from "../../../lib/api";

export default function SettingsPage() {
  return (
    <Guard>
      <SettingsInner />
    </Guard>
  );
}

function SettingsInner() {
  const [msg, setMsg] = React.useState<string | null>(null);

  const startBilling = async () => {
    setMsg(null);
    try {
      const r = await api("/api/billing/checkout", { method: "POST" });
      if (r?.url) window.location.href = r.url;
      else setMsg("Stripe not configured");
    } catch (e: any) {
      setMsg(e.message || "Billing failed");
    }
  };

  return (
    <div className="min-h-screen text-white p-6">
      <a className="text-white/70 text-sm" href="/dashboard">← Back</a>

      <div className="glass rim-lit p-6 mt-4 max-w-xl">
        <div className="text-xs text-white/70">Settings</div>
        <div className="text-xl font-semibold mt-1">Billing</div>

        <button onClick={startBilling} className="mt-4 bg-sapphire/80 hover:bg-sapphire/90 transition px-4 py-2 rounded-2xl text-sm">
          Start subscription checkout
        </button>

        {msg ? <div className="text-sm text-white/70 mt-3">{msg}</div> : null}

        <div className="mt-4 text-xs text-white/60">
          To activate billing: set STRIPE_SECRET_KEY, STRIPE_PRICE_ID, STRIPE_WEBHOOK_SECRET in backend/.env.
        </div>
      </div>
    </div>
  );
}
