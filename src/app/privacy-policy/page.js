import React from "react";
import PrivacyPolicy from "@/components/legal/PrivacyPolicy";
import FooterCta from "@/components/home/FooterCta";

export const metadata = {
  title: "Privacy Policy - Medi Growth",
  description: "Learn about the privacy policies, data collection, scope, and data processing practices at Medi Growth.",
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <PrivacyPolicy />
      <FooterCta />
    </main>
  );
}
