import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function useUser() {
  const [isPending, setIsPending] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => setUser(data.user))
      .finally(() => setIsPending(false));
  }, []);

  return { isPending, user };
}
