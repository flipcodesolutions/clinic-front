'use client';

import React from "react";
import { useParams } from "next/navigation";
import DoctorBookingDetails from "@/components/finddoctor/DoctorBookingDetails";
import FooterCta from "@/components/home/FooterCta";

export default function DoctorDetailPage() {
  const params = useParams();
  const doctorId = params?.id;

  return (
    <div>
      <DoctorBookingDetails doctorId={doctorId} />
      <FooterCta />
    </div>
  );
}
