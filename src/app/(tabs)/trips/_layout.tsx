import { Stack } from "expo-router";
import { StackHeader } from "@/src/components/nav/stack-header";
import { useTranslation } from "react-i18next";
import { TripsOptionsMenu } from "@/src/components/trips/details/options";

export default function TripsLayout() {
  const { t } = useTranslation("trips");

  return (
    <Stack screenOptions={{ header: (props) => <StackHeader {...props} /> }}>
      <Stack.Screen
        key="index"
        name="index"
        options={{ headerTitle: t("overview.title") }}
      />
      <Stack.Screen
        key="[id]"
        name="[id]"
        options={{
          title: t("details.title"),
          header: (props) => <StackHeader {...props} />,
        }}
      />
    </Stack>
  );
}

type TripDetailsParams = { id?: string };
