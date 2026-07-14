import React from "react";
import About from "@/components/about/About";
import FooterCta from "@/components/home/FooterCta";

export const metadata = {
  title: "About Us - Medi Growth",
  description: "Learn more about Medi Growth, a brand operated by Silver Webbuzz Pvt Ltd, and our mission to empower clinics across India.",
};

export default function AboutPage() {
  return (
    <main>
      <About />
      <FooterCta />
    </main>
  );
}
