import { auth, currentUser, clerkClient } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { sendEmail, isEmailConfigured } from "@/lib/email"
import { welcomeEmail } from "@/lib/email-templates"

const dashboardMap: Record<string, string> = {
  ADMIN: "/admin/overview",
  SELLER: "/seller/overview",
  CUSTOMER: "/user/overview",
}

const emailRoleMap: Record<string, string> = {
  "admin@denimarketplace.com": "ADMIN",
  "seller@denimarketplace.com": "SELLER",
  "buyer@denimarketplace.com": "CUSTOMER",
}

async function syncUserToDB(clerkUserId: string, email: string, name: string | null, role: string) {
  await prisma.user.upsert({
    where: { id: clerkUserId },
    update: { email, name: name || email.split("@")[0], role },
    create: {
      id: clerkUserId,
      email,
      name: name || email.split("@")[0],
      role,
    },
  });
}

function sendWelcomeEmail(customerName: string, email: string) {
  if (!isEmailConfigured()) return;
  const { from, subject, html } = welcomeEmail({
    customerName,
    shopUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://denimarketplace.com"}/user/shop`,
  });
  sendEmail({ from, to: [email], subject, html }).catch(() => {});
}

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const intendedRole = (await searchParams).intended_role as string | undefined

  const clerkUser = await currentUser()
  if (!clerkUser) redirect("/sign-in")

  const userEmail = clerkUser.emailAddresses[0]?.emailAddress
  const enforcedRole = userEmail ? emailRoleMap[userEmail] : undefined

  const actualRole = (clerkUser.unsafeMetadata?.role as string) || undefined

  if (enforcedRole) {
    if (!actualRole || actualRole !== enforcedRole) {
      const client = await clerkClient()
      await client.users.updateUser(clerkUser.id, {
        unsafeMetadata: { role: enforcedRole },
      })
    }
    await syncUserToDB(clerkUser.id, userEmail || "", `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(), enforcedRole)
    if (userEmail) sendWelcomeEmail(clerkUser.fullName || clerkUser.username || "Friend", userEmail)
    redirect(dashboardMap[enforcedRole])
  }

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
    await syncUserToDB(clerkUser.id, clerkUser.emailAddresses[0]?.emailAddress || "", `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(), roleToUse)
    if (userEmail) sendWelcomeEmail(clerkUser.fullName || clerkUser.username || "Friend", userEmail)
    redirect(dashboardMap[roleToUse])
  }

  redirect("/auth/choose-role")
}
