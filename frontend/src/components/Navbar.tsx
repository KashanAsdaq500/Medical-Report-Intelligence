"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Database, FileText, Info, ShieldCheck } from "lucide-react";
import { checkApiHealth } from "@/lib/api";

export function Navbar() {
  const pathname = usePathname();
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkApiHealth().then((res) => setApiOnline(res.online));
  }, []);

  const navItems = [
    { label: "Assessment Dashboard", href: "/", icon: Activity },
    { label: "Audit History", href: "/history", icon: Database },
    { label: "Guidelines & Architecture", href: "/about", icon: Info },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-clinical-600 text-white p-2 rounded-lg shadow-md group-hover:bg-clinical-700 transition">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight block">
                Medical Report Intelligence
              </span>
              <span className="text-xs text-slate-500 font-medium -mt-1 block">
                DecisionTreeClassifier + RAG Clinical Guidelines
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-clinical-50 text-clinical-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* System Status Indicator */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700">
              <span
                className={`w-2 h-2 rounded-full ${
                  apiOnline === true
                    ? "bg-emerald-500 animate-pulse"
                    : apiOnline === false
                    ? "bg-rose-500"
                    : "bg-amber-400 animate-ping"
                }`}
              />
              <span className="hidden sm:inline">
                {apiOnline === true
                  ? "FastAPI ML Backend: Connected"
                  : apiOnline === false
                  ? "Backend Offline"
                  : "Connecting API..."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
