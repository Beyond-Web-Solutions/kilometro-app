import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { OnboardAndAuthLayout } from "@/components/_common/layout/onboard";
import { useDefaultOrganization } from "@/hooks/org/default";
import { useEffect } from "react";
import { CreateOrganizationDialog } from "@/components/settings/organization/create/dialog";

export default function CreateOrJoinOrganizationScreen() {
  const { t } = useTranslation("onboard", { keyPrefix: "create-or-join" });

  const { isFetched, data } = useDefaultOrganization();

  useEffect(() => {
    if (isFetched && data) {
      return router.replace("/(tabs)");
    }
  }, [isFetched, data]);

  return (
    <OnboardAndAuthLayout
      title={t("title")}
      description={t("description")}
      showDivider={false}
    >
      <CreateOrganizationDialog />
    </OnboardAndAuthLayout>
  );
}
