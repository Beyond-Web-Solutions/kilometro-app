import { StyleSheet, useColorScheme, View } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { FAB, useTheme } from "react-native-paper";
import { useCurrentTripStore } from "@/store/current-trip";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LocationSubscriber } from "@/components/map/location-subscriber";
import { ToggleTripFab } from "@/components/map/toggle-trip-fab";

export default function MapPage() {
  const scheme = useColorScheme();

  const { colors } = useTheme();
  const { route } = useCurrentTripStore();

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <MapView
            showsCompass
            showsUserLocation
            showsScale
            showsTraffic
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
              <FAB size="small" icon="target" variant="secondary" />
            </View>
            <ToggleTripFab />
          </View>
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
