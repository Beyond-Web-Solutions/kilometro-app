import { createClient as createSupabaseClient } from "npm:@supabase/supabase-js@2";
import { Database } from "./types.ts";

export function createClient(req: Request) {
  return createSupabaseClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    },
  );
}
