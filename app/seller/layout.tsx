import { SellerProvider } from "@/components/seller/seller-context";
import { SellerShell } from "@/components/seller/seller-shell";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const role = user?.unsafeMetadata?.role as string | undefined;

  if (role && role !== "SELLER") {
    const dashboardMap: Record<string, string> = {
      ADMIN: "/admin/overview",
      CUSTOMER: "/user/overview",
    };
    redirect(dashboardMap[role] || "/sign-in");
  }

  return (
    <SellerProvider>
      <SellerShell>{children}</SellerShell>
    </SellerProvider>
  );
}
