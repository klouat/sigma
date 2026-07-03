import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";

type UserProfile = {
  email: string;
  full_name: string;
  role: string;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("email, full_name, role")
    .eq("id", user.id)
    .maybeSingle<UserProfile>();

  return (
    <main className="min-h-screen bg-[#f7f7f3] px-8 py-16 lg:px-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-[28px] border border-[#dce4df] bg-white p-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f7a51]">
            Dashboard
          </p>
          <h1 className="font-[var(--font-display)] text-4xl tracking-[-0.04em] text-[#082c3c]">
            Session active
          </h1>
          <p className="text-base text-[#35525d]">
            Signed in as {profile?.full_name || user.email}.
          </p>
        </div>

        <div className="grid gap-4 rounded-2xl bg-[#f7f7f3] p-6 text-sm text-[#082c3c]">
          <p>Email: {profile?.email || user.email}</p>
          <p>Role: {profile?.role || "student"}</p>
          <p>User ID: {user.id}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-[#082c3c] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0d3c52]"
          >
            Back to landing page
          </Link>
          <form action="/auth/signout" method="post">
            <Button
              type="submit"
              variant="outline"
              className="border-[#cfd9d3] text-[#082c3c] hover:bg-[#eef4f1]"
            >
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
