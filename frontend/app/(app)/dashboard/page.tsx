"use client";

import React from "react";
import { Guard } from "../../../components/Guard";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { me, logout } from "../../../lib/auth";
import { Briefcase, ClipboardList, Users, UserRound, Truck, Calculator, FileText, CalendarDays, Mail, Banknote, Settings, Video, MapPin } from "lucide-react";

type Tile = {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  span?: "wide";
  tall?: boolean;
  tone?: "normal" | "elevated" | "utility";
};

export default function DashboardPage() {
  return (
    <Guard>
      <DashboardInner />
    </Guard>
  );
}

function DashboardInner() {
  const [companyName, setCompanyName] = React.useState(process.env.NEXT_PUBLIC_COMPANY_NAME || "Construction Ops");
  const [companyLogo, setCompanyLogo] = React.useState(process.env.NEXT_PUBLIC_COMPANY_LOGO || "");
  const [clientId, setClientId] = React.useState<string | null>(null);

  React.useEffect(() => {
    me().then(({ client }) => {
      if (client?.brand) setCompanyName(client.brand);
      if (client?.logo) setCompanyLogo(client.logo);
      if (client?.id) setClientId(client.id);
    }).catch(()=>{});
  }, []);

  const navigate = (href: string) => (window.location.href = href);

  const tiles: Tile[] = [
    { key: "inventory", label: "Inventory", href: "/modules/inventory", icon: <ClipboardList className="h-6 w-6 text-white/90" />, tone: "normal" },
    { key: "jobs", label: "Jobs", href: "/modules/jobs", icon: <Briefcase className="h-6 w-6 text-white/90" />, tone: "normal" },
    { key: "clients", label: "Clients", href: "/modules/clients", icon: <UserRound className="h-6 w-6 text-white/90" />, tone: "normal" },
    { key: "employees", label: "Employees", href: "/modules/team", icon: <Users className="h-6 w-6 text-white/90" />, tone: "normal" },
    { key: "suppliers", label: "Suppliers", href: "/modules/suppliers", icon: <Truck className="h-6 w-6 text-white/90" />, tone: "normal" },

    { key: "ops", label: "Video / GPS", href: "/modules/ops", icon: <div className="flex gap-3"><Video className="h-6 w-6 text-white/90" /><MapPin className="h-6 w-6 text-white/90" /></div>, span: "wide", tall: true, tone: "elevated" },

    { key: "email", label: "Email", href: "/modules/email", icon: <Mail className="h-6 w-6 text-white/90" />, tone: "normal" },
    { key: "schedule", label: "Scheduling", href: "/modules/schedule", icon: <CalendarDays className="h-6 w-6 text-white/90" />, tone: "normal" },

    { key: "finance", label: "Finance Data", href: "/modules/finance", icon: <Banknote className="h-6 w-6 text-sapphire" />, tone: "elevated" },
    { key: "calc", label: "Service Calculator", href: "/modules/calculator", icon: <Calculator className="h-6 w-6 text-sapphire" />, span: "wide", tone: "elevated" },
    { key: "pdf", label: "Service Quote PDF", href: "/modules/pdf", icon: <FileText className="h-6 w-6 text-sapphire" />, span: "wide", tone: "elevated" },

    { key: "settings", label: "Settings", href: "/settings", icon: <Settings className="h-6 w-6 text-white/70" />, tone: "utility" },
  ];

  const tileShell = ({ span, tall, tone }: { span?: "wide"; tall?: boolean; tone?: Tile["tone"] }) => {
    const bg = tone === "elevated" ? "bg-white/10" : tone === "utility" ? "bg-white/5 opacity-80" : "bg-white/5";
    return [
      "group relative overflow-hidden rounded-2xl rim-lit",
      "border border-white/10 backdrop-blur-2xl shadow-acrylic",
      "transition-transform duration-200 active:scale-[0.98]",
      "min-h-[112px]",
      tall ? "min-h-[155px]" : "",
      span === "wide" ? "col-span-2" : "",
      bg,
    ].filter(Boolean).join(" ");
  };

  return (
    <div className="min-h-screen text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        <div className="absolute inset-0 pointer-events-none vignette" />
        <div className="absolute inset-0 pointer-events-none [background:radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.14),transparent_55%)]" />
      </div>

      <div className="max-w-md mx-auto p-5">
        <div className="glass rim-lit p-4 mb-5 flex items-center justify-between gap-3">
          <div className="flex-1">
            <div className="text-xs text-white/70">Company</div>
            <div className="mt-1 flex items-center gap-3">
              {companyLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={companyLogo} alt={`${companyName} logo`} className="h-7 w-7 rounded-lg object-contain bg-white/10 border border-white/10 p-1" />
              ) : null}
              <div className="text-sm font-semibold leading-tight">{companyName}</div>
            </div>
            <div className="mt-2 text-[11px] text-white/60">Tenant: {clientId || "—"}</div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <ThemeToggle />
            <button onClick={() => { logout(); window.location.href = "/login"; }} className="glass-weak rim-lit px-3 py-2 text-xs text-white/80 hover:bg-white/10">Sign out</button>
            <div className="text-[10px] leading-none text-white/70 pr-1 select-none">Notifications</div>
            <button onClick={() => navigate("/modules/email")} className="glass-weak rim-lit px-4 py-3" aria-label="Open inbox">
              <Mail className="h-5 w-5 text-white/90" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {tiles.map((t) => (
            <button key={t.key} onClick={() => navigate(t.href)} className={tileShell({ span: t.span, tall: t.tall, tone: t.tone })}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
              <div className="relative h-full p-4 flex flex-col items-center justify-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3 border border-white/10">{t.icon}</div>
                <div className={["text-sm font-medium tracking-wide text-center", t.tone === "utility" ? "text-white/70" : "text-white/90"].join(" ")}>
                  {t.label}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
