<template>
  <v-app
    v-show="$store.getters['global/isLoaded']"
    class="d-flex flex-column flex-root"
    style="background: transparent !important"
  >
    <KTHeader v-if="$vuetify.breakpoint.mdAndUp" />
    <KTHeaderMobile v-else :dialog.sync="showTuts" />

    <Loader v-if="loaderEnabled" v-bind:logo="loaderLogo" />

    <div class="d-flex flex-row flex-column-fluid page">
      <div id="kt_wrapper" class="d-flex flex-column flex-row-fluid wrapper">
        <rail-navigation
          v-if="$vuetify.breakpoint.mdAndUp && i18n.locale === 'fa'"
        />

        <div
          id="kt_content"
          :class="{ 'content-dense': $route.name === 'dashboard' }"
          class="content"
        >
          <div
            :class="{
              'container-fluid': contentFluid,
              container: !contentFluid,
            }"
          >
            <div class="d-block d-md-none">
              <KTAside v-if="asideEnabled" />
            </div>

            <v-main>
              <transition name="fade-in-up">
                <custom-page v-if="!$route.meta.main_page" />
                <router-view v-else />
              </transition>
            </v-main>
          </div>
        </div>

        <v-spacer />
        <KTFooter />
      </div>
    </div>

    <easy-modal />
    <navigation />
    <KTScrollTop />
    <refresh-page v-if="showReloadPage" />

    <bottom-menu-container v-if="$vuetify.breakpoint.smAndDown" />

    <custom-popup
      v-model="showTuts"
      :cons="cons"
      :loading.sync="loading"
      hide-confirm
      max-width="1240"
    >
      <tutorials v-if="showTuts" :loading.sync="loading" />
    </custom-popup>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import KTAside from "./layout/aside/Aside.vue";
import KTHeader from "./layout/header/Header.vue";
import KTHeaderMobile from "./layout/header/HeaderMobile.vue";
import KTFooter from "./layout/footer/Footer";
import HtmlClass from "@/core/services/htmlclass.service";
import KTStickyToolbar from "./layout/extras/StickyToolbar.vue";
import KTScrollTop from "./layout/extras/ScrollTop";
import Loader from "./layout/content/Loader.vue";
import RailNavigation from "./layout/content/RailNavigation";
import navigation from "./layout/aside/Navigation";
import {
  ADD_BODY_CLASSNAME,
  REMOVE_BODY_CLASSNAME,
} from "@/core/services/store/htmlclass.module.js";
import modal from "./components/modals/modal";
import CustomPage from "./pages/customPage";
import easyModal from "./plugins/EasyModal/view";
import CustomPopup from "./plugins/popup/customPopup";
import Tutorials from "./pages/tutorials";
import BottomMenuContainer from "./layout/bottomMenu/container";
import RefreshPage from "./layout/header/refreshPage";
import { destroyToken } from "./assets/js/jwt.service";
import i18n from "./plugins/EasyModal/i18n";

export default {
  name: "index",

  components: {
    RefreshPage,
    BottomMenuContainer,
    Tutorials,
    CustomPopup,
    CustomPage,
    KTAside,
    KTHeader,
    KTHeaderMobile,
    KTFooter,
    KTStickyToolbar,
    KTScrollTop,
    Loader,
    modal,
    RailNavigation,
    navigation,
    easyModal,
  },

  data() {
    return {
      i18n,
      qrUrl: "",
      coreBack: "https://www.sarvland.ir",
      pLandUrl: "http://localhost:8080/",
      showTuts: false,
      loading: false,
      showReloadPage: false,
      cons: {
        title: i18n.t("POPUP_TITLES.SYSTEM_GUIDE"),
      },
    };
  },

  beforeMount() {
    this.initLocalStorageValues();
    this.$instanceAxios.interceptors.response.use(
      (response) => Promise.resolve(response),
      (error) => {
        this.handleResponse(error);
        return Promise.reject(error);
      }
    );
    this.$DashboardAxios.interceptors.response.use(
      (response) => Promise.resolve(response),
      (error) => {
        this.handleResponse(error);
        return Promise.reject(error);
      }
    );

    this.$store.dispatch(ADD_BODY_CLASSNAME, "page-loading");

    HtmlClass.init(this.layoutConfig());

    let token = null;
    token = localStorage.getItem("id_token");

    if (!token || token.length <= 0) {
      this.showReloadPage = true;
    }
    this.$DashboardAxios.defaults.headers.common["Authorization"] =
      "Bearer " + token;
    this.$instanceAxios.defaults.headers.common["Authorization"] =
      "Bearer " + token;
    this.DHeaders.Authorization = "Bearer " + token;
  },

  watch: {
    "i18n.locale"(newLang) {
      if (newLang === "fa") {
        this.loadGoftino();
      } else {
        this.removeGoftino();
      }
    },
    deep: true,
    immediate: true,
  },

  mounted() {
    this.$root.$on("closeModal", () => (this.showReloadPage = false));
    this.$root.$on("openTuts", () => (this.showTuts = true));
    this.$root.$on("reFetch", this.fetch);
    this.$root.$on("getWallet", this.getNewWallet);
    this.$on("offline", () => {
      this.$modal.showConnectionLost({});
    });
    this.$on("online", () => {
      this.$modal.hideConnectionLost();
    });
    this.fetchVpn();

    setTimeout(() => {
      this.$store.dispatch(REMOVE_BODY_CLASSNAME, "page-loading");
    }, 2000);

    this.fetch();
    this.setTutorials();
    this.updateService({ sid: this.sid });

    this.$vuetify.icons.values.clear = "mdi-close-circle-outline";
    this.$vuetify.icons.values.saveNew = "mdi-content-save-plus-outline";
    this.$vuetify.icons.values.saveConfig = "mdi-content-save-cog-outline";

    // Load Goftino initially if locale is 'fa'
    if (this.i18n.locale === "fa") {
      this.loadGoftino();
    }
  },

  computed: {
    ...mapGetters([
      "isAuthenticated",
      "breadcrumbs",
      "pageTitle",
      "layoutConfig",
    ]),
    ...mapGetters("tutorial", ["popups", "popupSlugs"]),
    loaderEnabled() {
      return !/false/.test(this.layoutConfig("loader.type"));
    },
    contentFluid() {
      return this.layoutConfig("content.width") === "fluid";
    },
    loaderLogo() {
      return this.DConfigs.header_logo;
    },
    asideEnabled() {
      return !!this.layoutConfig("aside.self.display");
    },
    toolbarDisplay() {
      return true;
    },
    subheaderDisplay() {
      return !!this.layoutConfig("subheader.display");
    },
  },

  methods: {
    loadGoftino() {
      // Prevent loading if already loaded
      if (document.getElementById("goftino-script")) {
        return;
      }

      const goftinoId = "7WvGxT";
      const script = document.createElement("script");
      script.id = "goftino-script";
      script.async = true;
      const goftinoUrl = `https://www.goftino.com/widget/${goftinoId}`;
      const localStorageKey = `goftino_${goftinoId}`;
      const localStorageValue = localStorage.getItem(localStorageKey);
      script.src = localStorageValue
        ? `${goftinoUrl}?o=${localStorageValue}`
        : goftinoUrl;
      document.getElementsByTagName("head")[0].appendChild(script);
    },

    removeGoftino() {
      // Remove Goftino script if it exists
      const script = document.getElementById("goftino-script");
      if (script) {
        script.remove();
      }
      // Optionally, clean up any Goftino-related DOM elements or iframes
      const goftinoElements = document.querySelectorAll(
        "[id^='goftino_'], [class^='goftino_']"
      );
      goftinoElements.forEach((el) => el.remove());
    },

    initLocalStorageValues() {
      if (localStorage.getItem("firstLogin")) {
        localStorage.removeItem("firstLogin");
        window.location.reload();
      }

      if (localStorage.getItem("inviteCode")) {
        localStorage.removeItem("inviteCode");
      }

      if (localStorage.getItem("redirect")) {
        let redirect = localStorage.getItem("redirect");
        let arrayUrl = redirect.split(".com");
        let second =
          arrayUrl[0] + "/?token=" + localStorage.getItem("id_token");
        arrayUrl.shift();
        let finalUrl = "";
        arrayUrl.forEach(function (item) {
          finalUrl += item;
        });
        window.location = second + finalUrl;
        localStorage.removeItem("redirect");
      }
    },

    handleResponse(error) {
      if (error.response.status === 403) {
        this.$modal.error(
          i18n.t("ERRORS.NoAccess"),
          i18n.t("ERRORS.PleaseBuyAPlane"),
          undefined,
          {
            text: i18n.t("BUTTONS.BuyAPlane"),
            class: "success w-100",
            onClick: this.gotoPanel,
          },
          [
            {
              text: i18n.t("BUTTONS.OK"),
            },
          ]
        );
      } else if (error.response.status === 402) {
        this.$modal.wallet(
          i18n.t("ERRORS.NoAccountCharge"),
          i18n.t("ERRORS.PleaseChargeYourAccount"),
          undefined,
          {
            text: i18n.t("BUTTONS.AccountCharge"),
            class: "success w-100",
            onClick: this.toggleWalletDialog(true),
          },
          [
            {
              text: i18n.t("BUTTONS.Close"),
            },
          ]
        );
      } else if (error.response.status === 401) {
        const { origin, hash } = window.location;
        destroyToken(origin, hash.substring(1));
      }
    },

    gotoPanel() {
      window.location.href = "https://core.terminalads.com/#/panel";
    },

    ...mapActions("tutorial", ["setTutorials"]),
    ...mapActions("ribbon", [
      "setCore",
      "toggleWalletDialog",
      "setNewWallet",
      "toggleLoading",
      "setSectionStatus",
      "updateService",
    ]),

    fetch() {
      this.toggleLoading({ field: "user", status: true });

      this.$DashboardAxios
        .get("/api/core")
        .then(({ data }) => {
          this.setCore(data.data);
          this.setWalletData(data.data.wallet);
          this.setSectionStatus({ field: "user", status: true });
        })
        .catch(({ response }) => {
          if (response.status !== 401) {
            this.setSectionStatus({ field: "user", status: false });
            this.$toast.error(
              i18n.t("ERROR.Title") + " " + i18n.t("ERROR.DefaultActionText"),
              { timeout: 5000 }
            );
            this.$DashboardAxios
              .delete("/api/core/logout")
              .then(({ data }) => console.log("logout: ", data))
              .catch(({ response }) =>
                console.log("error in logout: ", response)
              )
              .finally(() => {
                destroyToken();
              });
          }
        })
        .finally(() => {
          this.toggleLoading({ field: "user", status: false });
          this.getNewWallet();
        });
    },

    getNewWallet() {
      this.loading = true;
      this.toggleLoading({ field: "wallet", status: true });

      this.$DashboardAxios
        .post(
          "https://wallet.terminalads.com/api/wallet",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("id_token")}`,
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        )
        .then(({ data }) => {
          this.setNewWallet(Number(data.data.balance.$numberDecimal));
          this.setSectionStatus({ field: "wallet", status: true });
        })
        .catch(({ response }) => {
          if (response.status !== 401) {
            this.setSectionStatus({ field: "wallet", status: false });
          }
        })
        .finally(() => {
          this.loading = false;
          this.toggleLoading({ field: "wallet", status: false });
        });
    },

    fetchVpn() {
      let vpn = localStorage.getItem("vpn");
      try {
        if (vpn) vpn = JSON.parse(vpn);
        if (typeof vpn !== "boolean") vpn = false;
      } catch (e) {
        vpn = false;
        console.log("can't parse the vpn:", e);
      }
      if (this.$vuetify.breakpoint.mdAndUp) vpn = false;

      if (!vpn) {
        setTimeout(() => {
          this.$DashboardAxios
            .get("/api/checkVpn")
            .then(({ data }) => {
              if (data.data?.iso_code_2 && data.data.iso_code_2 !== "IR") {
                let obj = {
                  closable: true,
                  type: "VPN",
                  title: i18n.t("ERRORS.VpnDetectedTitle"),
                  subtitle: i18n.t("ERRORS.VpnDetectedSubtitle"),
                };
                this.$modal.showConnectionLost(obj);
                localStorage.setItem("vpn", "true");
              }
            })
            .catch(({ response }) => {
              if (response?.data?.message) {
                console.log("error in get vpn status: ", response.data.message);
              }
            });
        }, 1500);
      }
    },
  },
};
</script>

<style>
#kt_content {
  padding-top: 12em;
}

#kt_content.content-dense {
  padding-top: 4em;
}

@media screen and (max-width: 960px) {
  #kt_content {
    padding-top: 15em;
  }

  #kt_content.content-dense {
    padding-top: 2em;
  }
}

.v-navigation-drawer {
  background-image: url("/media/bg/bg-menu.jpg");
  background-size: 256px 100%;
  background-repeat: no-repeat;
}
</style>
