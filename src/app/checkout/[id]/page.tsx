import { notFound } from "next/navigation";
import { getOrder } from "@/lib/orders";
import { CheckoutClient } from "@/components/CheckoutClient";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();
  return <CheckoutClient orderId={id} order={JSON.parse(JSON.stringify(order))} />;
}
