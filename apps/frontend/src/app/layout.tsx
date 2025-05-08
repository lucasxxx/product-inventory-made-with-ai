import { Inter, Roboto_Mono } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import { AuthProvider } from '@/lib/auth/AuthContext';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Product Inventory",
  description: "A modern product inventory app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`bg-black text-white min-h-screen ${inter.variable} ${robotoMono.variable}`}>
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
