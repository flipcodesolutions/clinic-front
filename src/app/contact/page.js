import React from "react";
import Contact from "@/components/contact/Contact";
import FooterCta from "@/components/home/FooterCta";

export const metadata = {
  title: "Contact Us - Medi Growth",
  description: "Get in touch with the Medi Growth support, billing, or sales team, or raise grievances with our officer.",
};

export default function ContactPage() {
  return (
    <main>
      <Contact />
      <FooterCta />
    </main>
  );
}
