import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import CycleTrackingClient from "./cycles-client";

export default async function CyclesPage() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const { data: cycles } = await supabase
    .from("cycles")
    .select("*")
    .eq("user_id", user.id)
    .order("start_date", { ascending: false });

  return <CycleTrackingClient userId={user.id} initialCycles={cycles || []} />;
}
