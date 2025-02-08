import { ReactNode, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import { useAppDispatch } from "@/src/store/hooks";
import { setUser } from "@/src/store/features/auth.slice";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      dispatch(setUser(session?.user ?? null));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return children;
}
