import { UserProvider } from "@/components/user/user-context";
import { UserShell } from "@/components/user/user-shell";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const role = user?.unsafeMetadata?.role as string | undefined;

  if (role && role !== "CUSTOMER") {
    const dashboardMap: Record<string, string> = {
      ADMIN: "/admin/overview",
      SELLER: "/seller/overview",
    };
    redirect(dashboardMap[role] || "/sign-in");
  }

  return (
    <UserProvider>
      <UserShell>{children}</UserShell>
    </UserProvider>
  );
}
