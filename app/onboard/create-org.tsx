import { CreatOrganizationForm } from "@/components/onboard/create-org/form";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { OnboardAndAuthLayout } from "@/components/_common/layout/onboard";

export default function CreateOrgPage() {
  const { t } = useTranslation("onboard", { keyPrefix: "create" });

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
