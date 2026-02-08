"use client";

import React from "react";
import Guard from "@/components/Guard";

type Props = {
  params: Promise<{
    moduleType: string;
  }>;
};

export default function ModulePage({ params }: Props) {
  const [moduleType, setModuleType] = React.useState<string>("");

  React.useEffect(() => {
    let alive = true;
    (async () => {
      const p = await params;
      if (alive) setModuleType(p.moduleType);
    })();
    return () => {
      alive = false;
    };
  }, [params]);

  if (!moduleType) return <div className="p-6 text-white/70">Loading…</div>;

  return (
    <Guard>
      <ModuleInner moduleType={moduleType} />
    </Guard>
  );
}

function ModuleInner({ moduleType }: { moduleType: string }) {
  const [busy, setBusy] = React.useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold capitalize">Module: {moduleType}</h1>
      <div className="mt-4 text-gray-500">Module shell ready.</div>
    </div>
  );
}