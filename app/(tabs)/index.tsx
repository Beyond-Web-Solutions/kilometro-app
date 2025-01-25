import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import { useCallback, useState } from "react";
import { StartTripFab } from "@/components/map/start-trip-fab";
import { FAB } from "react-native-paper";

export default function MapPage() {
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
        style={styles.map}
      />
      <View style={styles.actions_container}>
        <View style={styles.secondary_actions_container}>
          <FAB
            size="small"
            icon="target"
            variant="secondary"
            onPress={toggleFollowsUser}
          />
        </View>
        <StartTripFab />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
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
