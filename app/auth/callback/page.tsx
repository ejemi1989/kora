import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

const dashboardMap: Record<string, string> = {
  ADMIN: "/admin/overview",
  SELLER: "/seller/overview",
  CUSTOMER: "/user/overview",
}

export default async function AuthCallbackPage() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) redirect("/sign-in")

  const clerkUser = await currentUser()
  if (!clerkUser) redirect("/sign-in")

  const email = clerkUser.emailAddresses?.[0]?.emailAddress
  if (!email) redirect("/sign-in")

  const dbUser = await prisma.user.findUnique({ where: { email } })

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
