import { notFound } from "next/navigation";
import { getTemplate } from "@/lib/templates";
import { EditorClient } from "@/components/EditorClient";

export default async function EditorPage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params;
  const template = getTemplate(templateId);
  if (!template) notFound();
  return <EditorClient template={template} />;
}
