import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { DarkSection } from "@/components/landing/DarkSection";
import { SocialProof } from "@/components/landing/SocialProof";
import { Community } from "@/components/landing/Community";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <DarkSection />
      <SocialProof />
      <Community />
      <Footer />
    </>
  );
}
