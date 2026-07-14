import React from "react";
import Hero from "@/components/home/Hero";
import Specialties from "@/components/home/Specialties";
import BookingFlow from "@/components/home/BookingFlow";
import DoctorsDashboard from "@/components/home/DoctorsDashboard";
import WhatsAppSection from "@/components/home/WhatsAppSection";
import PricingSection from "@/components/home/PricingSection";
import FaqSection from "@/components/home/FaqSection";
import FooterCta from "@/components/home/FooterCta";

export const metadata = {
  title: "Specialties - Medi Growth",
  description: "Explore 30+ medical specialties and book verified doctors across India.",
};

export default function SpecialtiesPage() {
  return (
    <div>
      <Hero />
      <Specialties />
      <BookingFlow />
      <DoctorsDashboard />
      <WhatsAppSection />
      <PricingSection />
      <FaqSection />
      <FooterCta />
    </div>
  );
}
