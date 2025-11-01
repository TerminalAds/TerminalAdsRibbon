import Vue from "vue";
import VueI18n from "vue-i18n";

// Localisation language list
import { locale as ar } from "./langs/ar";
import { locale as fa } from "./langs/fa";
import { locale as ar_ae } from "./langs/ar_ae";
import { locale as ar_iq } from "./langs/ar_iq";
import { locale as de } from "./langs/de";
import { locale as en_GB } from "./langs/en_GB";
import { locale as en_US } from "./langs/en_US";
import { locale as fr } from "./langs/fr";
import { locale as hy } from "./langs/hy";
import { locale as ru } from "./langs/ru";
import { locale as tr } from "./langs/tr";
import { locale as zh_CN } from "./langs/zh_CN";
import { locale as zh_TW } from "./langs/zh_TW";

import { getLanguageCookie } from "../../utils/languageCookie";

Vue.use(VueI18n);

let messages = {};
messages = {
  ...messages,
  fa,
  ar,
  ar_ae,
  ar_iq,
  de,
  en_GB,
  en_US,
  fr,
  hy,
  ru,
  tr,
  zh_CN,
  zh_TW,
};
// get current selected language
const lang = getLanguageCookie() || "fa";

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: lang,
  fallbackLng: "fa",
  messages,
});

export default i18n;
