import Vue from "vue";
import VueI18n from "vue-i18n";

// Localisation language list
import { locale as en } from "./langs/en";
import { locale as fa } from "./langs/fa";
import { locale as ar } from "./langs/ar";

Vue.use(VueI18n);

let messages = {};
messages = { ...messages, en, fa,ar };

// get current selected language
const lang = localStorage.getItem("language") || "fa";

// Create VueI18n instance with options
const i18n = new VueI18n({
    locale: lang,
    fallbackLng: "fa",
    messages
});

export default i18n;
