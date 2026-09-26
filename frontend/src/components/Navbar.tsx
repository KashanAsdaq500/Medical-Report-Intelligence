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
  useUser,
} from "@clerk/nextjs";
import { checkApiHealth } from "@/lib/api";

export function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
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

  const userName =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress ||
    "User";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-clinical-900"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-clinical-900 text-white">
                <Stethoscope className="h-5 w-5" />
              </div>

              <div>
                <div className="text-sm font-bold">
                  Medical Report Intelligence
                </div>
                <div className="text-[10px] text-slate-500">
                  AI-Assisted Clinical Decision Support
                </div>
              </div>
            </Link>

            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-clinical-50 text-clinical-900 font-semibold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span
                className={`h-2 w-2 rounded-full ${
                  apiOnline === true
                    ? "bg-green-500"
                    : apiOnline === false
                      ? "bg-red-500"
                      : "bg-slate-300"
                }`}
              />
              <span>
                {apiOnline === true
                  ? "ML Online"
                  : apiOnline === false
                    ? "ML Offline"
                    : "Checking..."}
              </span>
            </div>

            <Show when="signed-out">
              <SignInButton>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg bg-clinical-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-clinical-800"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-2">
                <span className="max-w-[180px] truncate text-sm font-medium text-slate-700">
                  {userName}
                </span>
                <UserButton />
              </div>
            </Show>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <div className="flex h-14 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-clinical-900"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-clinical-900 text-white">
                <Stethoscope className="h-4 w-4" />
              </div>

              <div>
                <div className="text-xs font-bold">
                  Medical Report Intelligence
                </div>
                <div className="text-[9px] text-slate-500">
                  AI Clinical Decision Support
                </div>
              </div>
            </Link>

            <Show when="signed-out">
              <SignInButton>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg bg-clinical-900 px-3 py-2 text-xs font-semibold text-white"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-2">
                <span className="max-w-[120px] truncate text-xs font-medium text-slate-700">
                  {userName}
                </span>
                <UserButton />
              </div>
            </Show>
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto border-t border-slate-100 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium ${
                    isActive
                      ? "bg-clinical-50 text-clinical-900 font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}