"use client";

import React from "react";
import Guard from "@/components/Guard";

export default function ModulePageClient({ moduleType }: { moduleType: string }) {
  return (
    <Guard>
      <div className="p-6">
        <h1 className="text-2xl font-semibold capitalize">Module: {moduleType}</h1>
        <div className="mt-4 text-gray-500">Module shell ready.</div>
      </div>
    </Guard>
  );
}
