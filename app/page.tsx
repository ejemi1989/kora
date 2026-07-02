import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { DarkSection } from "@/components/landing/DarkSection";
import { SocialProof } from "@/components/landing/SocialProof";
import { BlogSection } from "@/components/landing/BlogSection";
import { Community } from "@/components/landing/Community";
import { Footer } from "@/components/landing/Footer";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/auth/callback");
  }

  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <DarkSection />
      <SocialProof />
      <BlogSection />
      <Community />
      <Footer />
    </>
  );
}
