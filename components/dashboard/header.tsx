"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, Search, Settings, Sparkles, User } from "lucide-react";
import Link from "next/link";

interface UserProps {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function DashboardHeader({ user }: { user: UserProps }) {
  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between rounded-[1.75rem] border border-white/80 bg-white/75 px-4 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:px-5">
        <div className="min-w-0">
          <div className="lg:hidden">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1a9c66,#79d78b)] text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p
                  className="text-base font-semibold tracking-tight text-slate-950"
                  style={{ fontFamily: "var(--font-dashboard-display)" }}
                >
                  SplitEase
                </p>
                <p className="text-xs text-slate-500">Dashboard</p>
              </div>
            </Link>
          </div>

          <div className="hidden lg:block">
            <p className="text-sm font-medium text-slate-500">Workspace</p>
            <p
              className="text-xl font-semibold tracking-tight text-slate-950"
              style={{ fontFamily: "var(--font-dashboard-display)" }}
            >
              Shared expenses, without the clutter
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500 md:flex">
            <Search className="h-4 w-4" />
            Quick overview
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          >
            <Bell className="h-4 w-4" />
          </Button> */}

          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">Account active</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full border border-slate-200 bg-white p-0 hover:bg-slate-50 cursor-pointer"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user.image || undefined}
                    alt={user.name || ""}
                  />
                  <AvatarFallback className="bg-emerald-500 text-white">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60 rounded-2xl border-white/80 bg-white/95 p-2 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)]"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="rounded-xl px-3 py-2 font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-950">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-slate-500">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                asChild
                className="rounded-xl px-3 py-2 text-slate-700"
              >
                <Link href="/settings" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-xl px-3 py-2 text-slate-700"
              >
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer rounded-xl px-3 py-2 text-destructive focus:text-destructive"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
