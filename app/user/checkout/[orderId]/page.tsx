import { CheckoutPageClient } from "./CheckoutPageClient";

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function CheckoutPage({ params }: Props) {
  const { orderId } = await params;
  return <CheckoutPageClient orderId={orderId} />;
}
