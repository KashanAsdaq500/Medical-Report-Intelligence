"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Database,
  BookOpenCheck,
  Stethoscope,
  Shield,
  LogIn,
} from "lucide-react";
import {
  Show,

  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { checkApiHealth } from "@/lib/api";

export function Navbar() {
  const pathname = usePathname();
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkApiHealth().then((res) => setApiOnline(res.online));
  }, []);

  const navItems = [
    { label: "Assessment Evaluation", href: "/", icon: Activity },
    { label: "Audit History", href: "/history", icon: Database },
    {
      label: "Clinical Guidelines & Architecture",
      href: "/about",
      icon: BookOpenCheck,
    },
  ];

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50 shadow-medical">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center space-x-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-lg bg-clinical-900 flex items-center justify-center text-teal-400 shadow-sm group-hover:bg-clinical-800 transition duration-150">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-bold text-navy-900 tracking-tight leading-tight">
                  Medical Report Intelligence
                </span>

                <span className="hidden sm:inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200/60">
                  CDSS v1.0
                </span>
              </div>

              <span className="text-xs text-slate-500 font-medium block leading-tight">
                AI-Assisted Clinical Decision-Support System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all duration-150 ${
                    isActive
                      ? "bg-clinical-50 text-clinical-900 border border-clinical-200/70 shadow-medical"
                      : "text-slate-600 hover:text-navy-900 hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-clinical-700" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {/* ML Engine Status */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200/70 px-3 py-1.5 rounded-full text-xs text-slate-600">
              <span
                className={`w-2 h-2 rounded-full ${
                  apiOnline === true
                    ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                    : apiOnline === false
                    ? "bg-rose-500"
                    : "bg-amber-400 animate-pulse"
                }`}
              />

              <span className="text-[11px] font-medium hidden sm:inline">
                {apiOnline === true
                  ? "ML Engine: Online"
                  : apiOnline === false
                  ? "ML Engine: Offline"
                  : "Checking Engine..."}
              </span>
            </div>

            {/* Authentication */}
            <Show when="signed-out">
              <SignInButton>
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-clinical-900 text-white text-xs font-semibold hover:bg-clinical-800 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center space-x-1 py-2 border-t border-slate-100 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? "bg-clinical-50 text-clinical-900 font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Show when="signed-out">
            <SignInButton>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-clinical-900 text-white text-xs font-semibold whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
