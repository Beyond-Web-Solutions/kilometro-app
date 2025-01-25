import { ReactNode, useEffect } from "react";
import { useDefaultOrganization } from "@/hooks/use-default-org";
import { useUser } from "@/hooks/use-user";
import * as SplashScreen from "expo-splash-screen";

interface Props {
  children: ReactNode;
}

export function SplashScreenProvider({ children }: Props) {
  const { isFetched: isDefaultOrganizationFetched } = useDefaultOrganization();
  const { isFetched: isUserFetched } = useUser();

  useEffect(() => {
    if (isUserFetched && isDefaultOrganizationFetched) {
      SplashScreen.hideAsync();
    }
  }, [isUserFetched, isDefaultOrganizationFetched]);

  return children;
}
