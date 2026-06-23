"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Manrope, Space_Grotesk } from "next/font/google";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowRight,
  Check,
  Chrome,
  Lock,
  Mail,
  Sparkles,
  Wallet,
} from "lucide-react";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-auth-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-auth-display",
});

const highlights = [
  "Instant balance updates across every group",
  "Shared expenses stay transparent for everyone",
  "Clean settlements without awkward follow-up math",
];

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center" />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" || process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (!error) return;

    toast.error(
      error === "CredentialsSignin"
        ? "Invalid email or password"
        : "An error occurred"
    );
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Welcome back!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!googleEnabled) {
      toast.error("Google OAuth is not configured yet. Set GOOGLE_CLIENT_ID/SECRET and enable NEXT_PUBLIC_GOOGLE_ENABLED=true.");
      return;
    }

    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch {
      toast.error("An error occurred with Google sign in");
      setIsGoogleLoading(false);
    }
  };

  return (
    <main
      className={`${manrope.variable} ${spaceGrotesk.variable} min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fcf6_0%,#eef8f2_45%,#ffffff_100%)]`}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-4rem] h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-24 h-96 w-96 rounded-full bg-amber-200/25 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,24,40,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,24,40,0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,white,transparent_88%)]" />
      </div>

      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1a9c66,#79d78b)] text-white shadow-[0_16px_40px_-18px_rgba(26,156,102,0.9)]">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <p
                  className="text-xl font-semibold tracking-tight text-slate-950"
                  style={{ fontFamily: "var(--font-auth-display)" }}
                >
                  SplitEase
                </p>
                <p className="text-sm text-slate-500">
                  Shared money, finally calm
                </p>
              </div>
            </Link>

            <div className="mt-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/80 px-4 py-2 text-sm text-emerald-900 shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                Sign back in and pick up where your group left off
              </div>
              <h1
                className="mt-6 text-6xl font-semibold leading-[0.95] tracking-[-0.05em] text-slate-950"
                style={{ fontFamily: "var(--font-auth-display)" }}
              >
                Shared expenses,
                <span className="block bg-[linear-gradient(135deg,#1a9c66,#f59e0b)] bg-clip-text text-transparent">
                  without the stress spiral.
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
                Return to your groups, balances, and settlements with a cleaner,
                calmer sign-in flow that matches the new product experience.
              </p>
            </div>

            {/* <div className="mt-10 space-y-4">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-4 shadow-[0_14px_50px_-32px_rgba(15,23,42,0.35)] backdrop-blur"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-slate-700">{item}</p>
                </div>
              ))}
            </div> */}

            <div className="mt-10 rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-[0_35px_100px_-55px_rgba(15,23,42,0.8)]">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
                Returning users
              </p>
              <div className="mt-5 grid grid-cols-3 gap-4">
                {[
                  { value: "12", label: "active expenses" },
                  { value: "4", label: "groups synced" },
                  { value: "$48", label: "next settlement" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/5 p-4">
                    <p
                      className="text-3xl font-semibold tracking-tight"
                      style={{ fontFamily: "var(--font-auth-display)" }}
                    >
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm text-slate-300">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-lg">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1a9c66,#79d78b)] text-white shadow-[0_16px_40px_-18px_rgba(26,156,102,0.9)]">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <p
                    className="text-lg font-semibold tracking-tight text-slate-950"
                    style={{ fontFamily: "var(--font-auth-display)" }}
                  >
                    SplitEase
                  </p>
                  <p className="text-xs text-slate-500">
                    Shared money, finally calm
                  </p>
                </div>
              </Link>
            </div>

            <Card className="overflow-hidden rounded-[2rem] border-white/80 bg-white/85 p-0 shadow-[0_35px_120px_-55px_rgba(15,23,42,0.35)] backdrop-blur-xl">
              <CardHeader className="border-b border-slate-200/80 px-7 py-7">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">
                  Welcome back
                </div>
                <CardTitle
                  className="mt-4 text-3xl tracking-[-0.03em] text-slate-950"
                  style={{ fontFamily: "var(--font-auth-display)" }}
                >
                  Sign in to continue
                </CardTitle>
                <CardDescription className="text-base leading-7 text-slate-600">
                  Access your groups, balances, and shared expenses from one
                  polished workspace.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5 px-7 py-7">
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-2xl border-slate-200 bg-white text-base shadow-sm hover:bg-slate-50 cursor-pointer"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isLoading || !googleEnabled}
                >
                  {isGoogleLoading ? (
                    <Spinner className="mr-2 h-4 w-4" />
                  ) : (
                    <Chrome className="mr-2 h-4 w-4" />
                  )}
                  {googleEnabled ? "Continue with Google" : "Google OAuth pending setup"}
                </Button>
                {!googleEnabled && (
                  <p className="text-center text-sm text-slate-500">
                    Add Google credentials and restart the app to enable this option.
                  </p>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full bg-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-[11px] uppercase tracking-[0.24em]">
                    <span className="bg-white px-3 text-slate-400">
                      Or use email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 text-base shadow-none focus-visible:bg-white"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-sm font-medium text-slate-700"
                      >
                        Password
                      </label>
                      <span className="text-xs text-slate-400">
                        Minimum 6 characters
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 text-base shadow-none focus-visible:bg-white"
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="h-12 w-full rounded-2xl bg-slate-950 text-base text-white shadow-[0_20px_40px_-20px_rgba(15,23,42,0.8)] hover:bg-slate-900 cursor-pointer"
                    disabled={isLoading || isGoogleLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="border-t border-slate-200/80 px-7 py-5">
                <p className="text-sm text-slate-500">
                  {"Don't have an account? "}
                  <Link
                    href="/register"
                    className="font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
                  >
                    Create one
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
