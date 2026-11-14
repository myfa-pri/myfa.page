import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "MyfaPost Creator OS (myfa.page) — Wildcard Subdomain Publishing Platform",
  description:
    "Claim your sovereign *.myfa.page subdomain and publish standalone HTML5 pages or articles in seconds using GitHub, Vercel Edge Middleware, and Firebase Spark."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="obsidian-radial-bg text-slate-100 antialiased selection:bg-indigo-500 selection:text-white flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
