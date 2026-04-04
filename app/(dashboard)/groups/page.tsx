"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Empty } from "@/components/ui/empty";
import { CreateGroupDialog } from "@/components/groups/create-group-dialog";
import {
  ArrowRight,
  Layers3,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";

interface GroupMember {
  user: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  role: "admin" | "member";
  joinedAt: string;
}

interface Group {
  _id: string;
  name: string;
  description?: string;
  members: GroupMember[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GroupsPage() {
  const { data: groups, error, isLoading, mutate } = useSWR<Group[]>(
    "/api/groups",
    fetcher
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-destructive">Failed to load groups</p>
      </div>
    );
  }

  const totalMembers =
    groups?.reduce((sum, group) => sum + group?.members?.length, 0) || 0;
  const averageSize = groups?.length
    ? (totalMembers / groups.length).toFixed(1)
    : "0";

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden rounded-[2rem] border-white/80 bg-[linear-gradient(135deg,#0f172a,#1e293b)] p-0 text-white shadow-[0_35px_120px_-55px_rgba(15,23,42,0.8)]">
          <CardContent className="relative px-7 py-7 md:px-8 md:py-8">
            <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                Group hub
              </div>
              <h1
                className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl"
                style={{ fontFamily: "var(--font-dashboard-display)" }}
              >
                Build circles that make shared money easier.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                Organize roommates, trips, and recurring spend into clear groups
                so every expense has the right people around it.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  className="rounded-full bg-white text-slate-950 hover:bg-slate-100 cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create group
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-white/15 bg-white/5 text-white "
                >
                  <Link href="/dashboard">
                    Back to overview
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                  <Layers3 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total groups</p>
                  <p
                    className="text-3xl font-semibold tracking-tight text-slate-950"
                    style={{ fontFamily: "var(--font-dashboard-display)" }}
                  >
                    {groups?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Average size</p>
                  <p
                    className="text-3xl font-semibold tracking-tight text-slate-950"
                    style={{ fontFamily: "var(--font-dashboard-display)" }}
                  >
                    {averageSize}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {!groups || groups.length === 0 ? (
        <Empty
          className="rounded-[2rem] border border-dashed border-slate-200 bg-white/70 p-12 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.22)] backdrop-blur"
          icon={Users}
          title="No groups yet"
          description="Create your first group to start splitting expenses with friends."
          action={
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="cursor-pointer rounded-full bg-slate-950 hover:bg-slate-900"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create group
            </Button>
          }
        />
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <Link key={group._id} href={`/groups/${group._id}`}>
              <Card className="group h-full  rounded-4xl border-white/80 bg-white/80 p-4 shadow-[0_22px_70px_-45px_rgba(15,23,42,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-white backdrop-blur">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle
                        className="line-clamp-1 text-2xl tracking-[-0.03em] text-slate-950"
                        style={{ fontFamily: "var(--font-dashboard-display)" }}
                      >
                        {group.name}
                      </CardTitle>
                      <CardDescription className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                        {group.description || "Shared expenses organized in one clean place."}
                      </CardDescription>
                    </div>
                    <div className="rounded-2xl bg-slate-100 p-3 text-slate-400 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-700">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="rounded-[1.5rem] bg-slate-50/80 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                      Members
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-4">
                      <div className="flex -space-x-2">
                        {group.members.slice(0, 4).map((member) => (
                          <Avatar
                            key={member.user._id}
                            className="h-10 w-10 border-2 border-white"
                          >
                            <AvatarImage src={member.user.image} />
                            <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                              {member.user.name?.charAt(0).toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {group?.members?.length > 4 && (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-xs font-medium text-slate-600">
                            +{group?.members?.length - 4}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-slate-500">
                        {group?.members?.length} member
                        {group?.members?.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-[1.5rem] border border-slate-200/80 bg-white p-4">
                    <div>
                      <p className="text-sm text-slate-500">Created by</p>
                      <p className="font-medium text-slate-900">
                        {group.createdBy.name}
                      </p>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      Open group
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      )}

      <CreateGroupDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => mutate()}
      />
    </div>
  );
}
