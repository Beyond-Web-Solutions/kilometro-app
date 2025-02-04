import { Stack } from "expo-router";
import { StackHeader } from "@/src/components/nav/stack-header";
import { useTranslation } from "react-i18next";
import { VehicleMenu } from "@/src/components/vehicles/menu";

export default function VehiclesLayout() {
  const { t } = useTranslation("vehicles");

  return (
    <Stack screenOptions={{ header: (props) => <StackHeader {...props} /> }}>
      <Stack.Screen
        key="index"
        name="index"
        options={{ headerTitle: t("list.title") }}
      />
      <Stack.Screen
        key="[id]"
        name="[id]"
        options={{
          title: t("edit.header-title"),
          header: (props) => (
            <StackHeader
              {...props}
              right={
                <VehicleMenu
                  params={props.route.params as VehicleRouteParams}
                />
              }
            />
          ),
        }}
      />
    </Stack>
  );
}

type VehicleRouteParams = { id?: string };
