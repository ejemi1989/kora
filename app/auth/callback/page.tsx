import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

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

  const email = clerkUser.emailAddresses?.[0]?.emailAddress
  if (!email) redirect("/sign-in")

  const dbUser = await prisma.user.findUnique({ where: { email } })

  let actualRole: string | undefined

  if (dbUser) {
    actualRole = dbUser.role
  } else {
    actualRole = (clerkUser.unsafeMetadata?.role as string) || undefined
  }

  if (intendedRole && actualRole && actualRole !== intendedRole) {
    redirect(`/sign-in?error=role_mismatch&expected=${intendedRole}&actual=${actualRole}`)
  }

  if (dbUser) {
    const destination = dashboardMap[dbUser.role] || "/user/overview"
    redirect(destination)
  }

  const metadataRole = clerkUser.unsafeMetadata?.role as string | undefined
  if (metadataRole && dashboardMap[metadataRole]) {
    redirect(dashboardMap[metadataRole])
  }

  redirect("/auth/choose-role")
}
