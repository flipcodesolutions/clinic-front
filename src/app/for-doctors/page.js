import React from "react";
import ForDoctorsHero from "@/components/fordoctors/ForDoctorsHero";
import ForDoctorsFeatures from "@/components/fordoctors/ForDoctorsFeatures";
import ForDoctorsAppointments from "@/components/fordoctors/ForDoctorsAppointments";
import ForDoctorsPrescriptions from "@/components/fordoctors/ForDoctorsPrescriptions";
import ForDoctorsClinical from "@/components/fordoctors/ForDoctorsClinical";
import ForDoctorsBilling from "@/components/fordoctors/ForDoctorsBilling";
import ForDoctorsExperience from "@/components/fordoctors/ForDoctorsExperience";
import ForDoctorsPlatform from "@/components/fordoctors/ForDoctorsPlatform";
import ForDoctorsPricing from "@/components/fordoctors/ForDoctorsPricing";

export const metadata = {
  title: "For Doctors - Medi Growth",
  description: "Comprehensive clinic software to run your practice all in one place.",
};

export default function ForDoctorsPage() {
  return (
    <div>
      <ForDoctorsHero />
      <ForDoctorsFeatures />
      <ForDoctorsAppointments />
      <ForDoctorsPrescriptions />
      <ForDoctorsClinical />
      <ForDoctorsBilling />
      <ForDoctorsExperience />
      <ForDoctorsPlatform />
      <ForDoctorsPricing />
    </div>
  );
}


