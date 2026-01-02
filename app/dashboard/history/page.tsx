import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import HistoryClient from "./history-client";

export default async function HistoryPage() {
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

  const { data: symptoms } = await supabase
    .from("symptoms")
    .select("*")
    .eq("user_id", user.id)
    .order("recorded_date", { ascending: false });

  return (
    <HistoryClient
      cycles={cycles || []}
      symptoms={symptoms || []}
    />
  );
}
