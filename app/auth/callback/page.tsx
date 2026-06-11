import { auth, currentUser, clerkClient } from "@clerk/nextjs/server"
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

  const roleToUse = actualRole || intendedRole

  if (roleToUse && dashboardMap[roleToUse]) {
    if (!actualRole && intendedRole) {
      const client = await clerkClient()
      await client.users.updateUser(clerkUser.id, {
        unsafeMetadata: { role: intendedRole },
      })
    }
    redirect(dashboardMap[roleToUse])
  }

  redirect("/auth/choose-role")
}
