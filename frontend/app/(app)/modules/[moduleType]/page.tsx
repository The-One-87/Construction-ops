import ModulePageClient from "./ModulePageClient";

type PageProps = {
  params: Promise<{ moduleType: string }>;
};

export default async function Page({ params }: PageProps) {
  const { moduleType } = await params;
  return <ModulePageClient moduleType={moduleType} />;
}
