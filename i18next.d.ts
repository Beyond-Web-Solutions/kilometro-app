import "i18next";
import common from "@/src/locales/nl/common.json";
import map from "@/src/locales/nl/map.json";
import auth from "@/src/locales/nl/auth.json";
import onboard from "@/src/locales/nl/onboard.json";
import validation from "@/src/locales/nl/validation.json";
import trips from "@/src/locales/nl/trips.json";
import vehicles from "@/src/locales/nl/vehicles.json";
import settings from "@/src/locales/nl/settings.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "common";
    // custom resources type
    resources: {
      common: typeof common;
      map: typeof map;
      auth: typeof auth;
      onboard: typeof onboard;
      validation: typeof validation;
      trips: typeof trips;
      vehicles: typeof vehicles;
      settings: typeof settings;
    };
    // other
  }
}
