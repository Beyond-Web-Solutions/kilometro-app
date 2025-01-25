import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase.ts";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublicKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLIC_KEY;

if (!supabaseUrl || !supabasePublicKey) {
  throw new Error("Missing Supabase URL or public key");
}

export const supabase = createClient<Database>(supabaseUrl, supabasePublicKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
