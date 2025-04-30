import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "@/components/auth/provider";

export default function OnboardingLayout() {
  const { organizationId } = useContext(AuthContext);

  if (organizationId) {
    return <Redirect href="/" />;
  }

  return <Stack />;
}
