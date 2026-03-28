"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  User,
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

const benefits = [
  "Create groups for trips, roommates, and side projects",
  "Track every shared payment without spreadsheet cleanup",
  "Settle faster with transparent balances from day one",
];

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success("Account created successfully!");

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
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
        <div className="absolute right-[-6rem] top-24 h-96 w-96 rounded-full bg-sky-200/20 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,24,40,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,24,40,0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,white,transparent_88%)]" />
      </div>

      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:px-8">
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
                Start with a cleaner, more confident first-run experience
              </div>
              <h1
                className="mt-6 text-6xl font-semibold leading-[0.95] tracking-[-0.05em] text-slate-950"
                style={{ fontFamily: "var(--font-auth-display)" }}
              >
                Create your account,
                <span className="block bg-[linear-gradient(135deg,#1a9c66,#0f172a)] bg-clip-text text-transparent">
                  then let the app handle the math.
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
                Bring friends, roommates, or collaborators into one clear place
                for shared expenses, balances, and settlements.
              </p>
            </div>

            {/* <div className="mt-10 space-y-4">
              {benefits.map((item) => (
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

            <div className="mt-10 rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,#0f172a,#1f2937)] p-6 text-white shadow-[0_35px_100px_-55px_rgba(15,23,42,0.8)]">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
                Setup in minutes
              </p>
              <div className="mt-5 space-y-4">
                {[
                  "Create your account",
                  "Invite your first group",
                  "Add the first shared expense",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/15 text-sm font-semibold text-emerald-300">
                        {index + 1}
                      </div>
                      <p>{step}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-xl">
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
                  Start free
                </div>
                <CardTitle
                  className="mt-4 text-3xl tracking-[-0.03em] text-slate-950"
                  style={{ fontFamily: "var(--font-auth-display)" }}
                >
                  Create your account
                </CardTitle>
                <CardDescription className="text-base leading-7 text-slate-600">
                  Set up your workspace and begin splitting group expenses in a
                  cleaner, faster way.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5 px-7 py-7">
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-2xl border-slate-200 bg-white text-base shadow-sm cursor-pointer hover:bg-slate-50"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isLoading}
                >
                  {isGoogleLoading ? (
                    <Spinner className="mr-2 h-4 w-4" />
                  ) : (
                    <Chrome className="mr-2 h-4 w-4" />
                  )}
                  Continue with Google
                </Button>

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
                      htmlFor="name"
                      className="text-sm font-medium text-slate-700"
                    >
                      Full name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Aadarsh Kumar"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 text-base shadow-none focus-visible:bg-white"
                        required
                        disabled={isLoading}
                        minLength={2}
                        maxLength={50}
                      />
                    </div>
                  </div>

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

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="password"
                        className="text-sm font-medium text-slate-700"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="At least 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 text-base shadow-none focus-visible:bg-white"
                          required
                          disabled={isLoading}
                          minLength={6}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium text-slate-700"
                      >
                        Confirm password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Repeat password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 text-base shadow-none focus-visible:bg-white"
                          required
                          disabled={isLoading}
                          minLength={6}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800">
                    Your account starts free and is ready for groups, trips, and
                    everyday shared bills.
                  </div>

                  <Button
                    type="submit"
                    className="h-12 w-full rounded-2xl bg-slate-950 text-base text-white shadow-[0_20px_40px_-20px_rgba(15,23,42,0.8)] hover:bg-slate-900 cursor-pointer"
                    disabled={isLoading || isGoogleLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="border-t border-slate-200/80 px-7 py-5">
                <p className="text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
                  >
                    Sign in
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
