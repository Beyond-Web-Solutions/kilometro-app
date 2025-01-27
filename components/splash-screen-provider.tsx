import { ReactNode, useEffect } from "react";
import { useDefaultOrganization } from "@/hooks/use-default-org";
import { useUser } from "@/hooks/use-user";
import * as SplashScreen from "expo-splash-screen";
import { useLocationsPermissions } from "@/hooks/use-locations-permissions";

interface Props {
  children: ReactNode;
}

export function SplashScreenProvider({ children }: Props) {
  const { isFetched: isDefaultOrganizationFetched } = useDefaultOrganization();
  const { isFetched: isUserFetched } = useUser();
  const { isFetched: isPermissionsFetched } = useLocationsPermissions();

  useEffect(() => {
    if (isUserFetched && isDefaultOrganizationFetched && isPermissionsFetched) {
      SplashScreen.hideAsync();
    }
  }, [isUserFetched, isDefaultOrganizationFetched, isPermissionsFetched]);

  return children;
}
