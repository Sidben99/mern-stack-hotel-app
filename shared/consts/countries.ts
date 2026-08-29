import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json" with { type: "json" };
countries.registerLocale(en);
export const countriesList = countries.getNames("en", {
  select: "official",
});
export const countriesCodes = Object.keys(countriesList);
export const countriesEntries = Object.entries(countriesList);

export type CountriesCode = (typeof countriesCodes)[number];
