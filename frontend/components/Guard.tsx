"use client";
import React from "react";
import { me } from "../lib/auth";

export function Guard({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = React.useState(false);

  React.useEffect(() => {
    me().then(() => setOk(true)).catch(() => (window.location.href = "/login"));
  }, []);

  if (!ok) return <div className="p-6 text-white/70">Loading…</div>;
  return <>{children}</>;
}
