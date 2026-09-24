import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Shield, FileCheck2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Medical Report Intelligence | Clinical Decision Support System",
  description:
    "AI-assisted clinical decision-support system integrating calibrated machine learning risk classification with authoritative medical guideline retrieval (ADA, WHO, AHA, CDC).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-surface-50 text-navy-900 antialiased selection:bg-clinical-600 selection:text-white">
        <ClerkProvider>
          <Navbar />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8">
            {children}
          </main>

          <footer className="bg-white border-t border-slate-200/80 py-6 text-xs text-slate-500 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2 text-slate-600">
                  <Shield className="w-4 h-4 text-clinical-600 flex-shrink-0" />
                  <span>
                    <strong>Medical Report Intelligence</strong> • Clinical Decision Support Architecture
                  </span>
                </div>

                <div className="flex items-center space-x-6 text-slate-500">
                  <span className="flex items-center space-x-1">
                    <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>ADA 2024 / WHO / AHA Guidelines</span>
                  </span>
                  <span>•</span>
                  <span>Anonymized Clinical Audit Logging</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
                <p>
                  &copy; {new Date().getFullYear()} Medical Report Intelligence.
                  Non-diagnostic portfolio &amp; research demonstration.
                </p>
                <p>
                  Designed for clinical practitioner reference only. Not for
                  autonomous patient diagnosis.
                </p>
              </div>
            </div>
          </footer>
        </ClerkProvider>
      </body>
    </html>
  );
}
