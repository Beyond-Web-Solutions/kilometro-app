import { ReactNode, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { Container } from "./_common/layout/container";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";
import { ActivityIndicator, Icon, Text, useTheme } from "react-native-paper";
import { initVehicles } from "@/src/store/features/vehicle.slice";
import { initTrips } from "@/src/store/features/trips.slice";
import { initAuth } from "@/src/store/features/auth.slice";

interface Props {
  children: ReactNode;
}

export function LoadingScreen({ children }: Props) {
  const { t } = useTranslation("common", { keyPrefix: "loading-screen" });
  const { colors } = useTheme();

  const dispatch = useAppDispatch();

  const vehiclesPending = useAppSelector((state) => state.vehicles.isPending);
  const tripsPending = useAppSelector((state) => state.trips.isPending);
  const authPending = useAppSelector((state) => state.auth.isPending);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(initTrips());
    dispatch(initVehicles());
    dispatch(initAuth());
  }, []);

  useEffect(() => {
    setIsLoading(vehiclesPending || tripsPending || authPending);
  }, [vehiclesPending, tripsPending || authPending]);

  if (isLoading) {
    return (
      <Container>
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require("../../assets/images/splash-icon.png")}
            contentFit="cover"
          />
          <Text variant="headlineMedium">{t("title")}</Text>
          <View style={styles.loading_container}>
            <View style={styles.loading_item}>
              {authPending ? (
                <ActivityIndicator size={12} />
              ) : (
                <Icon size={12} color={colors.primary} source="check" />
              )}
              <Text>{t("items.loading-auth")}</Text>
            </View>
            <View style={styles.loading_item}>
              {vehiclesPending ? (
                <ActivityIndicator size={12} />
              ) : (
                <Icon size={12} color={colors.primary} source="check" />
              )}
              <Text>{t("items.loading-vehicles")}</Text>
            </View>
            <View style={styles.loading_item}>
              {tripsPending ? (
                <ActivityIndicator size={12} />
              ) : (
                <Icon size={12} color={colors.primary} source="check" />
              )}
              <Text>{t("items.loading-trips")}</Text>
            </View>
          </View>
        </View>
      </Container>
    );
  }

  return children;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
  },
  loading_container: {
    gap: 4,
    marginTop: 16,
  },
  loading_item: {
    flexDirection: "row",
    alignItems: "center",

    width: "100%",
    gap: 8,
  },
});
