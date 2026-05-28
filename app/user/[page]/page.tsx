"use client";

import { OverviewPage } from "@/components/user/pages/overview";
import { ShopPage } from "@/components/user/pages/shop";
import { OrdersPage } from "@/components/user/pages/orders";
import { TrackingPage } from "@/components/user/pages/tracking";
import { CartPage } from "@/components/user/pages/cart";
import { WishlistPage } from "@/components/user/pages/wishlist";
import { AddressesPage } from "@/components/user/pages/addresses";
import { PaymentsPage } from "@/components/user/pages/payments";
import { NotificationsPage } from "@/components/user/pages/notifications";
import { SettingsPage } from "@/components/user/pages/settings";
import { use, useEffect } from "react";
import { useUser } from "@/components/user/user-context";

const pages: Record<string, React.FC> = {
  overview: OverviewPage,
  shop: ShopPage,
  orders: OrdersPage,
  tracking: TrackingPage,
  cart: CartPage,
  wishlist: WishlistPage,
  addresses: AddressesPage,
  payments: PaymentsPage,
  notifications: NotificationsPage,
  settings: SettingsPage,
};

export default function UserPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = use(params);
  const { setPage } = useUser();
  useEffect(() => { setPage(page as any); }, [page, setPage]);
  const Page = pages[page] || OverviewPage;
  return <Page />;
}
