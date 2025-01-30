import "i18next";
import common from "./locales/nl/common.json";
import map from "./locales/nl/map.json";
import auth from "./locales/nl/auth.json";
import onboard from "./locales/nl/onboard.json";
import validation from "./locales/nl/validation.json";
import trips from "./locales/nl/trips.json";
import vehicles from "./locales/nl/vehicles.json";

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
    };
    // other
  }
}
