"use client";

import { useSession, signOut } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  Mail,
  Shield,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden rounded-[2rem] border-white/80 bg-[linear-gradient(135deg,#0f172a,#1e293b)] p-0 text-white shadow-[0_35px_120px_-55px_rgba(15,23,42,0.8)]">
          <CardContent className="relative px-7 py-7 md:px-8 md:py-8">
            <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-emerald-300/10 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                Account space
              </div>
              <h1
                className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl"
                style={{ fontFamily: "var(--font-dashboard-display)" }}
              >
                Manage your profile with the same calm clarity.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                Review account details, identity info, and session-level actions
                in one cleaner settings space.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur">
          <CardContent className="flex h-full flex-col justify-center p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-white shadow-[0_18px_50px_-30px_rgba(15,23,42,0.45)]">
                <AvatarImage src={session?.user?.image || undefined} />
                <AvatarFallback className="bg-emerald-500 text-2xl text-white">
                  {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p
                  className="truncate text-3xl font-semibold tracking-tight text-slate-950"
                  style={{ fontFamily: "var(--font-dashboard-display)" }}
                >
                  {session?.user?.name}
                </p>
                <p className="truncate text-slate-500">{session?.user?.email}</p>
                <Badge className="mt-3 rounded-full border-0 bg-emerald-100 px-3 py-1 text-emerald-700 hover:bg-emerald-100">
                  Active account
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur">
          <CardHeader>
            <CardTitle
              className="flex items-center gap-2 text-2xl tracking-[-0.03em] text-slate-950"
              style={{ fontFamily: "var(--font-dashboard-display)" }}
            >
              <User className="h-5 w-5 text-emerald-700" />
              Profile details
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-600">
              Core account information currently tied to your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                <User className="h-5 w-5 text-slate-700" />
              </div>
              <p className="text-sm text-slate-500">Name</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">
                {session?.user?.name || "Unknown user"}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Mail className="h-5 w-5 text-slate-700" />
              </div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="mt-1 break-all text-lg font-semibold text-slate-950">
                {session?.user?.email || "No email available"}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Shield className="h-5 w-5 text-slate-700" />
              </div>
              <p className="text-sm text-slate-500">Account status</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">Active</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Wallet className="h-5 w-5 text-slate-700" />
              </div>
              <p className="text-sm text-slate-500">Workspace access</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">
                Full dashboard access
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-rose-200 bg-rose-50/80 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.22)] backdrop-blur">
          <CardHeader>
            <CardTitle
              className="text-2xl tracking-[-0.03em] text-rose-700"
              style={{ fontFamily: "var(--font-dashboard-display)" }}
            >
              Session actions
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-rose-700/70">
              Use this area for account actions that affect your current device
              session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-[1.5rem] border border-rose-200 bg-white/80 p-5">
              <p className="text-lg font-semibold text-slate-950">Sign out</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                End your current session on this device and return to the public
                homepage.
              </p>
              <Button
                variant="destructive"
                className="mt-5 rounded-full cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
