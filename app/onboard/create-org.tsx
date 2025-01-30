import { CreatOrganizationForm } from "@/components/onboard/create-org/form";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { OnboardAndAuthLayout } from "@/components/_common/layout/onboard";
import { useDefaultOrganization } from "@/hooks/org/default";
import { useEffect } from "react";

export default function CreateOrgPage() {
  const { t } = useTranslation("onboard", { keyPrefix: "create" });

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
      links={[{ label: t("links.back"), onPress: () => router.back() }]}
    >
      <CreatOrganizationForm />
    </OnboardAndAuthLayout>
  );
}
