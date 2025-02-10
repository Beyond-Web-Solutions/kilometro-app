import { useTranslation } from "react-i18next";
import { OnboardAndAuthLayout } from "@/src/components/_common/layout/onboard";
import { Button } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { StyleSheet, View } from "react-native";
import { fetchIsAccepted } from "@/src/store/features/auth.slice";
import { Redirect } from "expo-router";

export default function AwaitAccessPage() {
  const { t } = useTranslation("onboard", { keyPrefix: "await-access" });

  const dispatch = useAppDispatch();
  const isAccepted = useAppSelector((state) => state.auth.isAccepted);

  if (isAccepted) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <OnboardAndAuthLayout title={t("title")} description={t("description")}>
      <View style={styles.content}>
        <Button
          icon="reload"
          mode="contained"
          onPress={() => dispatch(fetchIsAccepted())}
        >
          {t("refetch")}
        </Button>
      </View>
    </OnboardAndAuthLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    marginVertical: 16,
  },
});
