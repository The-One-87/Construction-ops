"use client";

import React from "react";
import Guard from "@/components/Guard";

type Props = {
  params: {
    moduleType: string;
  };
};

export default function ModulePage({ params }: Props) {
  return (
    <Guard>
      <ModuleInner moduleType={params.moduleType} />
    </Guard>
  );
}

function ModuleInner({ moduleType }: { moduleType: string }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold capitalize">Module: {moduleType}</h1>
      <div className="mt-4 text-gray-500">Module shell ready.</div>
    </div>
  );
}