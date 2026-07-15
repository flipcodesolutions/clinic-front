import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import "@/css/visitor.css";
import BootstrapClient from "./BootstrapClient";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
import ConditionalNav from "@/components/common/ConditionalNav";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Medi Growth - Premium Healthcare Solutions",
  description: "A comprehensive digital clinic dashboard and customer care portal.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ConditionalNav>{children}</ConditionalNav>
        <BootstrapClient />
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
