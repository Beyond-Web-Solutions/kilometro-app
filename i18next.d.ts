import "i18next";

import common from "@/lib/i18n/locales/nl/common.json";
import auth from "@/lib/i18n/locales/nl/auth.json";
import onboarding from "@/lib/i18n/locales/nl/onboarding.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "common";
    // custom resources type
    resources: {
      common: typeof common;
      auth: typeof auth;
      onboarding: typeof onboarding;
    };
    // other
  }
}
