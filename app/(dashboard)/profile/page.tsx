"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, UserCircle2 } from "lucide-react";

interface ProfileUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/users/profile");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to load profile");
        }
        setUser(data.user);
        setName(data.user.name || "");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }
      setUser(data.user);
      setName(data.user.name || "");
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.28)] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <UserCircle2 className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">Account</p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Your profile</h1>
            <p className="text-sm text-slate-500">Manage the details tied to your SplitEase account.</p>
          </div>
        </div>
      </div>

      <Card className="rounded-[2rem] border-white/70 bg-white/85 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.28)] backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl">Profile details</CardTitle>
          <CardDescription>Update your display name and change your password if you signed in with email.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Name</label>
                <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input value={user?.email || ""} disabled />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Current password</label>
              <Input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Current password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">New password</label>
              <Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="New password" />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Sign-in method: {user?.provider || "credentials"}</p>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
