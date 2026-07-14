import React from "react";
import RefundPolicy from "@/components/legal/RefundPolicy";
import FooterCta from "@/components/home/FooterCta";

export const metadata = {
  title: "Refund & Cancellation Policy - Medi Growth",
  description: "Read the details of our billing cycles, cancellation terms, and refund guidelines for Medi Growth.",
};

export default function RefundPolicyPage() {
  return (
    <main>
      <RefundPolicy />
      <FooterCta />
    </main>
  );
}
