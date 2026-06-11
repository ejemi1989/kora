import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const dashboardMap: Record<string, string> = {
  ADMIN: "/admin/overview",
  SELLER: "/seller/overview",
  CUSTOMER: "/user/overview",
}

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) redirect("/sign-in")

  const intendedRole = (await searchParams).intended_role as string | undefined

  const clerkUser = await currentUser()
  if (!clerkUser) redirect("/sign-in")

  const actualRole = (clerkUser.unsafeMetadata?.role as string) || undefined

  if (intendedRole && actualRole && actualRole !== intendedRole) {
    redirect(`/sign-in?error=role_mismatch&expected=${intendedRole}&actual=${actualRole}`)
  }

  if (actualRole && dashboardMap[actualRole]) {
    redirect(dashboardMap[actualRole])
  }

  redirect("/auth/choose-role")
}
