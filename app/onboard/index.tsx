import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { OnboardAndAuthLayout } from "@/components/_common/layout/onboard";

export default function CreateOrJoinOrganizationScreen() {
  const { t } = useTranslation("onboard", { keyPrefix: "create-or-join" });

  return (
    <OnboardAndAuthLayout
      title={t("title")}
      description={t("description")}
      showDivider={false}
      links={[
        {
          label: t("links.join"),
          onPress: () => router.navigate("/onboard/join-org"),
          mode: "contained",
          icon: "arrow-right",
          contentStyle: { flexDirection: "row-reverse" },
          style: { marginTop: 8 },
        },
        {
          label: t("links.create"),
          onPress: () => router.navigate("/onboard/create-org"),
          mode: "contained",
          icon: "plus-circle-outline",
          contentStyle: { flexDirection: "row-reverse" },
        },
      ]}
    />
  );
}
