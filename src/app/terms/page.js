import React from "react";
import TermsOfService from "@/components/legal/TermsOfService";
import FooterCta from "@/components/home/FooterCta";

export const metadata = {
  title: "Terms of Service - Medi Growth",
  description: "Read the Terms of Service governing the use of the Medi Growth clinic operating system, directory, and online services.",
};

export default function TermsOfServicePage() {
  return (
    <main>
      <TermsOfService />
      <FooterCta />
    </main>
  );
}
