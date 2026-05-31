"use client";

import { use, useEffect } from "react";
import { useAdmin } from "@/components/admin/admin-context";
import type { AdminPageId } from "@/lib/types/admin";
import { OverviewPage } from "@/components/admin/pages/overview";
import { UsersPage } from "@/components/admin/pages/users";
import { SellersPage } from "@/components/admin/pages/sellers";
import { ProductsPage } from "@/components/admin/pages/products";
import { OrdersPage } from "@/components/admin/pages/orders";
import { PaymentsPage } from "@/components/admin/pages/payments";
import { DisputesPage } from "@/components/admin/pages/disputes";
import { AnalyticsPage } from "@/components/admin/pages/analytics";
import { ContentPage } from "@/components/admin/pages/content";
import { CurrenciesPage } from "@/components/admin/pages/currencies";
import { SettingsPage } from "@/components/admin/pages/settings";
import { NotificationsPage } from "@/components/admin/pages/notifications";

const pages: Record<string, React.FC> = {
  overview: OverviewPage,
  users: UsersPage,
  sellers: SellersPage,
  products: ProductsPage,
  orders: OrdersPage,
  payments: PaymentsPage,
  disputes: DisputesPage,
  analytics: AnalyticsPage,
  content: ContentPage,
  currencies: CurrenciesPage,
  settings: SettingsPage,
  notifications: NotificationsPage,
};

export default function AdminPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = use(params);
  const { setPage } = useAdmin();
  useEffect(() => { setPage(page as AdminPageId); }, [page, setPage]);
  const Page = pages[page] || OverviewPage;
  return <Page />;
}
