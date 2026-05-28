import { UserProvider } from "@/components/user/user-context";
import { UserShell } from "@/components/user/user-shell";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <UserShell>{children}</UserShell>
    </UserProvider>
  );
}
