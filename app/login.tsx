import { authClient } from "@/lib/auth/client";

export default function LoginScreen() {
  const { data: session } = authClient.useSession();
  console.log(session);
  return null;
}
