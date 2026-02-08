import ModulePageClient from "./ModulePageClient";

export default function Page({ params }: { params: { moduleType: string } }) {
  return <ModulePageClient moduleType={params.moduleType} />;
}
