import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import nl_common from "../locales/nl/common.json";
import nl_map from "../locales/nl/map.json";
import nl_trips from "../locales/nl/trips.json";
import nl_auth from "../locales/nl/auth.json";
import nl_onboard from "../locales/nl/onboard.json";
import nl_validation from "../locales/nl/validation.json";

export const defaultNS = "common";
export const resources = {
  nl: {
    common: nl_common,
    map: nl_map,
    auth: nl_auth,
    onboard: nl_onboard,
    validation: nl_validation,
    trips: nl_trips,
  },
} as const;

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    defaultNS,
    fallbackLng: "nl",
    ns: ["common", "auth", "onboard", "validation", "map", "trips"],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
