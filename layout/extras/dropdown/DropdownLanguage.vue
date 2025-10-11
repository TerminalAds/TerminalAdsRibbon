<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          outlined
          v-bind="attrs"
          v-on="on"
          style="
          background-color: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.2);
          color: white;
          border: white solid 1px;
          margin-right: 8px;
          margin-left: 8px;
        "
      >
        <img :src="current.flag" alt="" width="20" class="mr-2"/>
        {{ current.name }}
      </v-btn>
    </template>

    <v-list dense>
      <v-list-item
          v-for="lang in languages"
          :key="lang.lang"
          @click="select(lang)"
      >
        <img :src="lang.flag" alt="" width="20" class="mr-2"/>
        <v-list-item-title>{{ lang.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import i18nService from "@/core/services/i18n.service.js";
import i18n from "../../../plugins/EasyModal/i18n";
import {getLanguageCookie} from "../../../utils/languageCookie";

export default {
  data: () => ({
    languages: i18nService.languages,
    activeLanguage: getLanguageCookie() || i18n.locale,
  }),
  computed: {
    current() {
      return this.languages.find((l) => l.lang === this.activeLanguage);
    },
  },
  methods: {
    select(lang) {
      this.changeLanguage(lang.lang);
      this.activeLanguage = lang.lang;
      this.$emit("language-changed", lang);
    },
  },
};
</script>
<style scoped>
@media (max-width: 768px) {
  :deep(.v-btn) {
    background-color: rgba(255, 255, 255, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
    color: white !important;
    border: white solid 1px !important;
    margin-right: 8px !important;
    margin-left: 8px !important;
  }
}
</style>
