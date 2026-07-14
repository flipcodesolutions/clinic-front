import React from 'react';
import SecurityHero from '@/components/security/SecurityHero';
import SecurityCompliance from '@/components/security/SecurityCompliance';
import SecurityPillars from '@/components/security/SecurityPillars';
import SecurityInternalPractices from '@/components/security/SecurityInternalPractices';
import SecurityDocuments from '@/components/security/SecurityDocuments';
import SecurityFAQ from '@/components/security/SecurityFAQ';
import FooterCta from '@/components/home/FooterCta';

export const metadata = {
  title: 'Trust & Security - eClinicPro',
  description: 'Learn about patient data encryption, compliance, SLAs, and security standards at eClinicPro.',
};

export default function SecurityPage() {
  return (
    <main>
      <SecurityHero />
      <SecurityCompliance />
      <SecurityPillars />
      <SecurityInternalPractices />
      <SecurityDocuments />
      <SecurityFAQ />
      <FooterCta />
    </main>
  );
}
