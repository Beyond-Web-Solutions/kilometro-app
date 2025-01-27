import { StyleSheet, useColorScheme, View } from "react-native";
import MapView from "react-native-maps";
import { useCallback, useState } from "react";
import { StartTripDialog } from "@/components/map/start-trip-dialog";
import { FAB } from "react-native-paper";

export default function MapPage() {
  const scheme = useColorScheme();

  const [followsUser, setFollowsUser] = useState(false);

  const toggleFollowsUser = useCallback(() => {
    setFollowsUser((prevState) => !prevState);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        showsCompass
        showsUserLocation
        followsUserLocation={followsUser}
        userInterfaceStyle={scheme === "dark" ? "dark" : "light"}
        style={styles.map}
      />
      <View style={styles.actions_container}>
        <View style={styles.secondary_actions_container}>
          <FAB size="small" icon="map-marker-distance" variant="secondary" />
          <FAB
            size="small"
            icon="target"
            variant="secondary"
            onPress={toggleFollowsUser}
          />
        </View>
        <StartTripDialog />
      </View>
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
