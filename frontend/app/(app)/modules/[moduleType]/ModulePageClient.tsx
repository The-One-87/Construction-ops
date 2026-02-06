"use client";
import React from "react";
import { Guard } from "../../../../components/Guard";
import { api } from "../../../../lib/api";
import { me } from "../../../../lib/auth";

type Field = { key: string; label: string; type: string; required?: boolean; options?: string[] };
type ModuleDef = { label: string; fields: Field[] };

export default function ModulePage({ params }: { params: { moduleType: string } }) {
  return (
    <Guard>
      <ModuleInner moduleType={moduleType} />
    </Guard>
  );
}

function ModuleInner({ moduleType }: { moduleType: string }) {
  const [clientId, setClientId] = React.useState<string>("");
  const [def, setDef] = React.useState<ModuleDef | null>(null);
  const [items, setItems] = React.useState<any[]>([]);
  const [draft, setDraft] = React.useState<Record<string, any>>({});
  const [err, setErr] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const m = await me();
      const cid = m.user.clientId;
      if (!cid) throw new Error("client_required");
      setClientId(cid);
      const cfg = await api(`/api/clients/${cid}/config`);
      const mod = cfg?.modules?.[moduleType];
      setDef(mod || { label: moduleType, fields: [{ key: "note", label: "Note", type: "text" }] });
      const list = await api(`/api/clients/${cid}/modules/${moduleType}`);
      setItems(list || []);
    })().catch((e: any) => setErr(e.message || "Failed to load module"));
  }, [moduleType]);

  const refresh = async () => {
    const list = await api(`/api/clients/${clientId}/modules/${moduleType}`);
    setItems(list || []);
  };

  const create = async () => {
    setErr(null); setBusy(true);
    try {
      await api(`/api/clients/${clientId}/modules/${moduleType}`, { method: "POST", body: JSON.stringify(draft) });
      setDraft({});
      await refresh();
    } catch (e: any) {
      setErr(e.message || "Create failed");
    } finally {
      setBusy(false);
    }
  };

  const del = async (id: string) => {
    setErr(null); setBusy(true);
    try {
      await api(`/api/clients/${clientId}/modules/${moduleType}/${id}`, { method: "DELETE" });
      await refresh();
    } catch (e: any) {
      setErr(e.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <a className="text-white/70 text-sm" href="/dashboard">← Back</a>

        <div className="glass rim-lit p-5 mt-4">
          <div className="text-xs text-white/70">Module</div>
          <div className="text-xl font-semibold mt-1">{def?.label || moduleType}</div>
          {err ? <div className="text-sm text-red-300 mt-2">{err}</div> : null}
        </div>

        <div className="glass rim-lit p-5 mt-4">
          <div className="text-sm text-white/80">New entry</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {(def?.fields || []).map((f) => (
              <div key={f.key} className="flex flex-col gap-1">
                <label className="text-xs text-white/60">{f.label}</label>
                <input
                  className="glass-weak px-3 py-2 outline-none"
                  value={draft[f.key] ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                  placeholder={f.label}
                />
              </div>
            ))}
          </div>
          <button disabled={busy} onClick={create} className="mt-4 bg-sapphire/80 hover:bg-sapphire/90 transition px-4 py-2 rounded-2xl text-sm">
            {busy ? "Working…" : "Create"}
          </button>
        </div>

        <div className="glass rim-lit p-5 mt-4">
          <div className="text-sm text-white/80">Entries</div>
          <div className="mt-3 space-y-3">
            {items.map((it) => (
              <div key={it.id} className="glass-weak rim-lit p-4 flex items-start justify-between gap-3">
                <pre className="text-xs text-white/80 overflow-auto">{JSON.stringify(it.data, null, 2)}</pre>
                <button disabled={busy} onClick={() => del(it.id)} className="text-xs text-red-300 hover:text-red-200">
                  Delete
                </button>
              </div>
            ))}
            {!items.length ? <div className="text-xs text-white/60">No entries yet.</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
