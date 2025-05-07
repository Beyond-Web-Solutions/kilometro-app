import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import nl_common from "./locales/nl/common.json";
import nl_auth from "./locales/nl/auth.json";
import nl_onboarding from "./locales/nl/onboarding.json";

export const defaultNS = "common";
export const resources = {
  nl: {
    common: nl_common,
    auth: nl_auth,
    onboarding: nl_onboarding,
  },
} as const;

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    defaultNS,
    fallbackLng: "nl",
    ns: ["common", "auth", "onboarding"],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });
