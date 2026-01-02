import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: cycles } = await supabase
    .from("cycles")
    .select("*")
    .eq("user_id", user.id)
    .order("start_date", { ascending: false });

  // Additional logic can be added here if needed

  return (
    <DashboardClient
      user={user}
      profile={profile}
      cycles={cycles || []}
    />
  );
}
