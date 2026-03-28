"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Wallet,
  LayoutDashboard,
  Users,
  Receipt,
  ArrowLeftRight,
  Settings,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Groups", href: "/groups", icon: Users },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Settlements", href: "/settlements", icon: ArrowLeftRight },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function DashboardSidebar({ user }: { user: User }) {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="m-4 flex grow flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,23,42,0.94))] px-5 pb-5 pt-4 shadow-[0_35px_120px_-55px_rgba(15,23,42,0.85)]">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1a9c66,#79d78b)] text-white shadow-[0_16px_40px_-18px_rgba(26,156,102,0.9)]">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p
                  className="text-lg font-semibold tracking-tight text-white"
                  style={{ fontFamily: "var(--font-dashboard-display)" }}
                >
                  SplitEase
                </p>
                <p className="text-xs text-slate-400">Money, made calmer</p>
              </div>
            </Link>
          </div>

          <div className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              Workspace
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Track balances, review activity, and settle faster from one clean
              dashboard.
            </p>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-x-3 rounded-2xl px-4 py-3 text-sm font-medium leading-6 transition-all duration-200",
                        isActive
                          ? "bg-white text-slate-950 shadow-[0_16px_32px_-18px_rgba(255,255,255,0.45)]"
                          : "text-slate-300 hover:bg-white/8 hover:text-white"
                      )}
                    >
                      <item.icon
                        className={cn("h-5 w-5 shrink-0 transition-colors", {
                          "text-emerald-600": isActive,
                          "text-slate-400 group-hover:text-white": !isActive,
                        })}
                      />
                      <span className="flex-1">{item.name}</span>
                      {isActive && <ArrowRight className="h-4 w-4 text-slate-400" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="bg-emerald-500 text-white text-sm">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {user.name}
                </p>
                <p className="truncate text-xs text-slate-400">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <nav className="fixed bottom-3 left-3 right-3 z-50 rounded-[1.75rem] border border-white/80 bg-white/85 p-2 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl lg:hidden">
        <div className="flex justify-around gap-1">
          {navigation.slice(0, 4).map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-all",
                  isActive
                    ? "bg-slate-950 text-white shadow-[0_14px_28px_-18px_rgba(15,23,42,0.65)]"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
