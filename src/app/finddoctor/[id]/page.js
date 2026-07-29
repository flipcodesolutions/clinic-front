import DoctorBookingDetails from '@/components/finddoctor/DoctorBookingDetails';

export const metadata = {
  title: 'Doctor Details & Slot Booking - Medi Growth',
  description: 'Book your appointment online with top verified doctors.',
};

export default async function DoctorDetailPage({ params }) {
  const { id } = await params;
  return <DoctorBookingDetails doctorId={id} />;
}
