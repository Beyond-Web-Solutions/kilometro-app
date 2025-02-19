import {
  useBackgroundPermissions,
  useForegroundPermissions,
} from "expo-location";
import { useCallback, useState } from "react";

export function useLocationPermissions() {
  const [showDialog, setShowDialog] = useState(false);

  const [foregroundPermissionStatus, requestForegroundPermissions] =
    useForegroundPermissions();
  const [backgroundPermissionStatus, requestBackgroundPermissions] =
    useBackgroundPermissions();

  const requestPermissions = useCallback(async () => {
    if (foregroundPermissionStatus?.canAskAgain) {
      await requestForegroundPermissions();

      if (backgroundPermissionStatus?.canAskAgain) {
        await requestBackgroundPermissions();
      } else {
        setShowDialog(true);
      }
    } else {
      setShowDialog(true);
    }
  }, [foregroundPermissionStatus, backgroundPermissionStatus]);

  return {
    request: requestPermissions,
    showDialog,
    hideDialog: () => setShowDialog(false),
    granted:
      foregroundPermissionStatus?.granted &&
      backgroundPermissionStatus?.granted,
  };
}
