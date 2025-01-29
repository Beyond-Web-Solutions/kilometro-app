import { createClient } from "../supabase/client.ts";

export async function getUser(req: Request) {
  const supabase = createClient(req);

  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  return user;
}
