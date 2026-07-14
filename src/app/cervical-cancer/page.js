import React from 'react';
import CervicalCancerHero from '@/components/cervicalcancer/CervicalCancerHero';
import CervicalCancerBasics from '@/components/cervicalcancer/CervicalCancerBasics';
import CervicalCancerTimeline from '@/components/cervicalcancer/CervicalCancerTimeline';
import CervicalCancerRisk from '@/components/cervicalcancer/CervicalCancerRisk';
import CervicalCancerTreatment from '@/components/cervicalcancer/CervicalCancerTreatment';
import CervicalCancerFacts from '@/components/cervicalcancer/CervicalCancerFacts';
import CervicalCancerPrevention from '@/components/cervicalcancer/CervicalCancerPrevention';
import CervicalCancerScreening from '@/components/cervicalcancer/CervicalCancerScreening';
import CervicalCancerSchedule from '@/components/cervicalcancer/CervicalCancerSchedule';
import CervicalCancerGovCampaign from '@/components/cervicalcancer/CervicalCancerGovCampaign';
import CervicalCancerFAQ from '@/components/cervicalcancer/CervicalCancerFAQ';
import CervicalCancerNextSteps from '@/components/cervicalcancer/CervicalCancerNextSteps';
import CervicalCancerReferences from '@/components/cervicalcancer/CervicalCancerReferences';

export const metadata = {
  title: 'Cervical Cancer - eClinicPro',
  description: 'Cervical Cancer Awareness and Vaccination Campaign',
};

const CervicalCancerPage = () => {
  return (
    <main>
      <CervicalCancerHero />
      <CervicalCancerBasics />
      <CervicalCancerTimeline />
      <CervicalCancerRisk />
      <CervicalCancerTreatment />
      <CervicalCancerFacts />
      <CervicalCancerPrevention />
      <CervicalCancerScreening />
      <CervicalCancerSchedule />
      <CervicalCancerGovCampaign />
      <CervicalCancerFAQ />
      <CervicalCancerNextSteps />
      <CervicalCancerReferences />
    </main>
  );
};

export default CervicalCancerPage;
