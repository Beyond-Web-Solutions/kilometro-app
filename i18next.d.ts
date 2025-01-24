import "i18next";
import common from "./locales/nl/common.json";
import auth from "./locales/nl/auth.json";
import onboard from "./locales/nl/onboard.json";
import validation from "./locales/nl/validation.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "common";
    // custom resources type
    resources: {
      common: typeof common;
      auth: typeof auth;
      onboard: typeof onboard;
      validation: typeof validation;
    };
    // other
  }
}
