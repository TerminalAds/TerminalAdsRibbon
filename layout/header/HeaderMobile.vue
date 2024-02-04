<template>
  <v-app-bar src="media/bg/bg-10.jpg" elevate-on-scroll app fixed color="transparent" flat dense>
    <walletButton style="flex-basis: 100%"/>
  </v-app-bar>
</template>

<script>
import {mapGetters} from "vuex";
import KTLayoutHeaderTopbar from "../../assets/js/layout/header-topbar.js";
import walletButton from '../../pages/transactions/WalletOpenButton';
import {LOGOUT} from "@/core/services/store/auth.module";

export default {
  name: "KTHeaderMobile",
  components: {
    walletButton,
  },
  mounted() {
    // Init Header Topbar For Mobile Mode
    KTLayoutHeaderTopbar.init(this.$refs["kt_header_mobile_topbar_toggle"]);
  },
  data: () => ({
    unread: 0
  }),

  methods: {
    onLogout() {
      this.$store
          .dispatch(LOGOUT)
          .then(() => window.location.reload());
    }
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
    }
  }
}
</script>

<style scoped>
.mobileCutomPaddingNotif .b-dropdown-text {
  padding: 0 !important;
}

.v-app-bar.v-app-bar--is-scrolled :deep(.v-toolbar__image) {
  opacity: 1;
}

.v-app-bar :deep(.v-toolbar__image) {
  transition: opacity .15s ease-in;
  opacity: 0;
}

.app-bar-img >>> .v-responsive__content {
  display: flex;
  align-items: center;
}
</style>
