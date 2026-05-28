import { SellerProvider } from "@/components/seller/seller-context";
import { SellerShell } from "@/components/seller/seller-shell";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <SellerProvider>
      <SellerShell>{children}</SellerShell>
    </SellerProvider>
  );
}
