import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import InsightsClient from "./insights-client"

export default async function InsightsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: cycles } = await supabase
    .from("cycles")
    .select("*")
    .eq("user_id", user.id)
    .order("start_date", { ascending: false })

  const { data: symptoms } = await supabase
    .from("symptoms")
    .select("*")
    .eq("user_id", user.id)
    .order("recorded_date", { ascending: false })

  const { data: insights } = await supabase
    .from("ai_insights")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  return <InsightsClient userId={user.id} cycles={cycles || []} symptoms={symptoms || []} lastInsight={insights} />
}
