"use client";

import { use, useEffect } from "react";
import { useSeller } from "@/components/seller/seller-context";
import { OverviewPage } from "@/components/seller/pages/overview";
import { ProductsPage } from "@/components/seller/pages/products";
import { OrdersPage } from "@/components/seller/pages/orders";
import { InventoryPage } from "@/components/seller/pages/inventory";
import { AnalyticsPage } from "@/components/seller/pages/analytics";
import { PayoutsPage } from "@/components/seller/pages/payouts";
import { CustomersPage } from "@/components/seller/pages/customers";
import { ReviewsPage } from "@/components/seller/pages/reviews";
import { PromotionsPage } from "@/components/seller/pages/promotions";
import { SettingsPage } from "@/components/seller/pages/settings";

const pages: Record<string, React.FC> = {
  overview: OverviewPage,
  products: ProductsPage,
  orders: OrdersPage,
  inventory: InventoryPage,
  analytics: AnalyticsPage,
  payouts: PayoutsPage,
  customers: CustomersPage,
  reviews: ReviewsPage,
  promotions: PromotionsPage,
  settings: SettingsPage,
};

export default function SellerPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = use(params);
  const { setPage } = useSeller();
  useEffect(() => { setPage(page as any); }, [page, setPage]);
  const Page = pages[page] || OverviewPage;
  return <Page />;
}
