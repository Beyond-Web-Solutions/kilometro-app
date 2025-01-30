import { ReactNode, useEffect } from "react";
import { useDefaultOrganization } from "@/hooks/org/default";
import { useUser } from "@/hooks/auth/user";
import * as SplashScreen from "expo-splash-screen";

interface Props {
  children: ReactNode;
}

export function SplashScreenProvider({ children }: Props) {
  const { isFetchedAfterMount: isDefaultOrganizationFetched } =
    useDefaultOrganization();

  const { isFetchedAfterMount: isUserFetched } = useUser();

  useEffect(() => {
    if (isUserFetched && isDefaultOrganizationFetched) {
      SplashScreen.hideAsync();
    }
  }, [isUserFetched, isDefaultOrganizationFetched]);

  if (!isUserFetched || !isDefaultOrganizationFetched) {
    return null;
  }

  return children;
}
