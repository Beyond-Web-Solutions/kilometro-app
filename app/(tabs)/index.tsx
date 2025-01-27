import { StyleSheet, useColorScheme, View } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { useCallback, useEffect, useState } from "react";
import { StartTripDialog } from "@/components/map/start-trip-dialog";
import { FAB, useTheme } from "react-native-paper";
import { useCurrentTripStore } from "@/store/current-trip";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { TripBottomSheet } from "@/components/map/trip-bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function MapPage() {
  const scheme = useColorScheme();
  const { colors } = useTheme();

  const { route, isTracking } = useCurrentTripStore();

  const [followsUser, setFollowsUser] = useState(false);

  useEffect(() => {
    if (isTracking) {
      setFollowsUser(true);
    }
  }, [isTracking]);

  const toggleFollowsUser = useCallback(() => {
    setFollowsUser((prevState) => !prevState);
  }, []);

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <MapView
            showsCompass
            showsUserLocation
            showsScale
            followsUserLocation={followsUser}
            userInterfaceStyle={scheme === "dark" ? "dark" : "light"}
            style={styles.map}
          >
            {route.length > 0 && (
              <Polyline
                coordinates={route}
                strokeColor={colors.primary}
                strokeWidth={5}
              />
            )}
          </MapView>
          <View style={styles.actions_container}>
            <View style={styles.secondary_actions_container}>
              <FAB
                size="small"
                icon="map-marker-distance"
                variant="secondary"
              />
              <FAB
                size="small"
                icon="target"
                variant="secondary"
                onPress={toggleFollowsUser}
              />
            </View>
            <StartTripDialog />
          </View>
          <TripBottomSheet />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  actions_container: {
    gap: 8,
    position: "absolute",
    bottom: 8,
    right: 8,
  },
  secondary_actions_container: {
    alignItems: "flex-end",
    gap: 8,
  },
});
