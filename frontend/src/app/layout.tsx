import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Medical Report Intelligence 🩺 | AI Clinical Decision Support",
  description: "Enterprise portfolio demonstrating Next.js, FastAPI ML inference, SQLAlchemy, and RAG medical guidelines retrieval.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-clinical-500 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              &copy; {new Date().getFullYear()} <strong>Medical Report Intelligence</strong>. Developed for Portfolio & Research Demonstration.
            </p>
            <p className="text-slate-400">
              AI-assisted Decision Support Demo • Not for Definitive Clinical Diagnosis
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
