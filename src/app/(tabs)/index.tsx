import { StyleSheet, useColorScheme, View } from "react-native";
import MapView, { Polyline, Region } from "react-native-maps";
import { useTheme } from "react-native-paper";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToggleTripFab } from "@/src/components/map/toggle-trip-fab";
import { CenterOnUserFab } from "@/src/components/map/actions/center-on-user";
import { useCallback, useRef, useState } from "react";
import { ViewRouteFab } from "@/src/components/map/actions/view-route";
import { SpeedIndicator } from "@/src/components/map/speed-indicator";
import { useKeepAwake } from "expo-keep-awake";
import { useAppSelector } from "@/src/store/hooks";
import "@/src/lib/location-task";

export default function MapPage() {
  useKeepAwake();

  const ref = useRef<MapView>(null);
  const scheme = useColorScheme();

  const route = useAppSelector((state) => state.current_trip.route);

  const { colors } = useTheme();

  const [isFollowingUser, setIsFollowingUser] = useState(true);

  // when the animation of centering is finished we can start following the user
  const handleCenterOnUser = useCallback((region: Region) => {
    ref.current?.animateCamera(
      {
        center: { latitude: region.latitude, longitude: region.longitude },
        altitude: 2500,
        zoom: 15,
      },
      { duration: 300 },
    );

    setIsFollowingUser(true);
  }, []);

  const handleViewRoute = useCallback((region: Region) => {
    setIsFollowingUser(false);

    ref.current?.animateToRegion(region, 1000);
  }, []);

  const handlePanDrag = useCallback(() => {
    setIsFollowingUser(false);
  }, []);

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <MapView
            ref={ref}
            showsCompass
            showsUserLocation
            showsTraffic
            followsUserLocation={isFollowingUser}
            onPanDrag={handlePanDrag}
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
              <ViewRouteFab callback={handleViewRoute} />
              <CenterOnUserFab callback={handleCenterOnUser} />
            </View>
            <ToggleTripFab />
          </View>
          <SpeedIndicator />
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
