import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
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

  return (
    <ProfileClient user={user} profile={profile} />
  );
}
