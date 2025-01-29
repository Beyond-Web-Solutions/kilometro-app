import { BottomSheetView } from "@gorhom/bottom-sheet";
import { ActivityIndicator } from "react-native-paper";
import { StyleSheet } from "react-native";

export function LoadingTripDetails() {
  return (
    <BottomSheetView style={styles.container}>
      <ActivityIndicator animating />
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 64,
    justifyContent: "center",
    alignItems: "center",
  },
});
