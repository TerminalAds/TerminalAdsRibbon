<template>
  <v-app-bar
    app
    color="transparent"
    dense
    elevate-on-scroll
    fixed
    flat
    src="media/bg/bg-10.jpg"
  >
    <walletButton style="flex-basis: 100%" />

    <template v-slot:extension>
      <div>
        <v-btn
          class="white--text rounded-lg"
          color="rgba(255, 255, 255, .2)"
          depressed
          href="/#/dashboard"
          large
        >
          {{ i18n.t("dashboard_origin") }}
        </v-btn>

        <v-btn
          :href="front_url + '/#/contact/list'"
          class="ms-2 white--text rounded-lg"
          color="rgba(255, 255, 255, .2)"
          depressed
          large
          target="_blank"
        >
          {{ $t("contact/list") }}
        </v-btn>
      </div>
    </template>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";
import KTLayoutHeaderTopbar from "../../assets/js/layout/header-topbar.js";
import walletButton from "../../pages/transactions/WalletOpenButton";
import { LOGOUT } from "@/core/services/store/auth.module";
import i18n from "../../plugins/EasyModal/i18n";

export default {
  name: "KTHeaderMobile",

  components: {
    walletButton,
  },

  data: () => ({
    unread: 0,
    i18n,
  }),

  mounted() {
    // Init Header Topbar For Mobile Mode
    KTLayoutHeaderTopbar.init(this.$refs["kt_header_mobile_topbar_toggle"]);
  },

  methods: {
    onLogout() {
      this.$store.dispatch(LOGOUT).then(() => window.location.reload());
    },
  },

  computed: {
    ...mapGetters(["layoutConfig", "getClasses"]),

    /**
     * Get header logo
     * @returns {string}
     */
    headerLogo() {
      return process.env.BASE_URL + this.layoutConfig("self.logo.sticky");
    },

    /**
     * Get classes for mobile header
     * @returns {null|*}
     */
    headerClasses() {
      const classes = this.getClasses("header_mobile");
      if (typeof classes !== "undefined") {
        return classes.join(" ");
      }
      return null;
    },

    /**
     * Check if the left aside menu is enabled
     * @returns {boolean}
     */
    asideEnabled() {
      return !!this.layoutConfig("aside.self.display");
    },
  },
};
</script>

<style scoped>
.mobileCutomPaddingNotif .b-dropdown-text {
  padding: 0 !important;
}

.v-app-bar.v-app-bar--is-scrolled :deep(.v-toolbar__image) {
  opacity: 1;
}

.v-app-bar :deep(.v-toolbar__image) {
  transition: opacity 0.15s ease-in;
  opacity: 0;
}

.app-bar-img >>> .v-responsive__content {
  display: flex;
  align-items: center;
}
</style>
