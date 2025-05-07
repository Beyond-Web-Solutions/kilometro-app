import { Redirect, Stack, usePathname } from "expo-router";
import { authClient } from "@/lib/auth/client";

export default function ProtectedLayout() {
  const pathname = usePathname();

  const { isPending: isUserPending, data: user } = authClient.useSession();

  const { isPending: isOrganizationPending } =
    authClient.useActiveOrganization();

  if (isUserPending || isOrganizationPending) {
    return null;
  }

  if (!user) {
    return <Redirect href={`/(auth)/send-otp?next=${pathname}`} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
