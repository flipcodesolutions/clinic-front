'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

// Visitor navbar/footer will be hidden on these paths
const HIDDEN_PATHS = ['/clinic-panel', '/doctor-panel', '/login'];

export default function ConditionalNav({ children }) {
  const pathname = usePathname();
  const hideNav = HIDDEN_PATHS.some(path => pathname.startsWith(path));

  if (hideNav) {
    return <>{children}</>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
}
