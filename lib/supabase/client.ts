import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Debug log - remove in production
if (typeof window !== "undefined") {
  console.log("Supabase URL loaded:", supabaseUrl ? "Yes" : "No");
  console.log("Supabase Key loaded:", supabaseAnonKey ? "Yes" : "No");
}

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      `Missing Supabase environment variables. URL: ${supabaseUrl ? "set" : "missing"}, Key: ${supabaseAnonKey ? "set" : "missing"}. ` +
      `Make sure .env.local exists in project root with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.`
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
