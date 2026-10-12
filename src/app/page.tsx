import { getResources, getCategories } from "@/lib/data";
import { ResourceExplorer } from "@/components/ResourceExplorer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [resources, categories] = await Promise.all([
    getResources(),
    getCategories(),
  ]);

  return <ResourceExplorer initialResources={resources} categories={categories} />;
}
