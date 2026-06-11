import { AdminProvider } from "@/components/admin/admin-context";
import { AdminShell } from "@/components/admin/admin-shell";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const role = user?.unsafeMetadata?.role as string | undefined;

  if (role && role !== "ADMIN") {
    const dashboardMap: Record<string, string> = {
      SELLER: "/seller/overview",
      CUSTOMER: "/user/overview",
    };
    redirect(dashboardMap[role] || "/sign-in");
  }

  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
