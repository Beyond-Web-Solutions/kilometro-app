import { StyleSheet, useColorScheme, View } from "react-native";
import MapView, { Polyline, Region } from "react-native-maps";
import { useTheme } from "react-native-paper";
import { useCurrentTripStore } from "@/store/current-trip";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LocationSubscriber } from "@/components/map/location-subscriber";
import { ToggleTripFab } from "@/components/map/toggle-trip-fab";
import { CenterOnUserFab } from "@/components/map/actions/center-on-user";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useCurrentPosition } from "@/hooks/geo/current-position";
import { ViewRouteFab } from "@/components/map/actions/view-route";
import { SpeedIndicator } from "@/components/map/speed-indicator";

export default function MapPage() {
  const ref = useRef<MapView>(null);
  const scheme = useColorScheme();

  const { colors } = useTheme();
  const { route } = useCurrentTripStore();
  const { data } = useCurrentPosition();

  const [isFollowingUser, setIsFollowingUser] = useState(true);

  // center on user
  useLayoutEffect(() => {
    if (!data?.coords) return;

    ref.current?.animateToRegion({
      latitude: data?.coords.latitude,
      longitude: data?.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  }, [data]);

  // when the animation of centering is finished we can start following the user
  const handleCenterOnUser = useCallback((region: Region) => {
    ref.current?.animateToRegion(region, 1000);

    setTimeout(() => {
      setIsFollowingUser(true);
    }, 1000);
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
      <LocationSubscriber />
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
