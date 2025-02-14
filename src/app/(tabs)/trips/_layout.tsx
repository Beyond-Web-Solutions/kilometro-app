import { Stack } from "expo-router";
import { StackHeader } from "@/src/components/nav/stack-header";
import { useTranslation } from "react-i18next";
import { TripsOptionsMenu } from "@/src/components/trips/details/options";
import { ModalHeader } from "@/src/components/nav/modal-header";

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
        key="export"
        name="export"
        options={{
          headerTitle: t("export.header-title"),
          presentation: "fullScreenModal",

          header: (props) => <ModalHeader {...props} />,
        }}
      />

      <Stack.Screen
        key="[id]"
        name="[id]"
        options={{
          title: t("details.title"),
          header: (props) => (
            <StackHeader
              {...props}
              right={
                <TripsOptionsMenu
                  params={props.route.params as TripDetailsParams}
                />
              }
            />
          ),
        }}
      />
    </Stack>
  );
}

type TripDetailsParams = { id?: string };
