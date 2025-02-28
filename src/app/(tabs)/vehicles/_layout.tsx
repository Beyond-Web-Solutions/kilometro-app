import { Stack } from "expo-router";
import { StackHeader } from "@/src/components/nav/stack-header";
import { useTranslation } from "react-i18next";
import { ModalHeader } from "@/src/components/nav/modal-header";

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
          presentation: "fullScreenModal",
          header: (props) => <ModalHeader {...props} />,
        }}
      />
    </Stack>
  );
}
