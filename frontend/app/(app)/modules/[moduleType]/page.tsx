import ModulePageClient from "./ModulePageClient";

export default async function Page({
  params,
}: {
  params: Promise<{ moduleType: string }>;
}) {
  const { moduleType } = await params;
  return <ModulePageClient moduleType={moduleType} />;
}
