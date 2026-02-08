"use client";
import React from "react";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const [username, setUsername] = React.useState("client@demo.com");
  const [password, setPassword] = React.useState("client123");
  const [err, setErr] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await login(username, password);
      window.location.href = "/dashboard";
    } catch (e: any) {
      setErr(e.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/75" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        <div className="absolute inset-0 vignette" />
      </div>

      <div className="max-w-md mx-auto p-6 pt-10">
        <div className="glass rim-lit p-6">
          <div className="text-xs text-white/70">Construction Ops</div>
          <h1 className="text-xl font-semibold mt-1">Sign in</h1>

          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <input className="w-full glass-weak px-4 py-3 outline-none" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Email" />
            <input className="w-full glass-weak px-4 py-3 outline-none" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
            {err ? <div className="text-sm text-red-300">{err}</div> : null}
            <button disabled={busy} className="w-full bg-sapphire/80 hover:bg-sapphire/90 transition px-4 py-3 rounded-2xl font-medium">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-4 text-xs text-white/60">
            Demo users exist only when backend SEED_DEMO=true.
          </div>
        </div>
      </div>
    </div>
  );
}
