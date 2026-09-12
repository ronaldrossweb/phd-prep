import { createClient } from "@supabase/supabase-js";

/**
 * The anon/publishable key is public by design: it only grants what
 * row-level security allows, which for every table is "your own rows".
 */
export const SUPABASE_URL = "https://ygzdeyatsxfniubayxli.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnemRleWF0c3hmbml1YmF5eGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMzQ0ODAsImV4cCI6MjEwNDgxMDQ4MH0.V2y082f97gtDqYQfz1oRgAl19MFkKBwIUTUBG6yVLaE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
