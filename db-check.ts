import { clerkClient } from "@clerk/nextjs/server";

async function main() {
  const client = await clerkClient();
  const users = await client.users.getUserList();
  console.log("Clerk users:", users.data.map(u => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    emails: u.emailAddresses.map(e => e.emailAddress),
    unsafeMetadata: u.unsafeMetadata
  })));
}

main().catch(console.error);
