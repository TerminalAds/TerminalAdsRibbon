<template>
  <v-app class="d-flex flex-column flex-root" style="background: transparent !important;"
         v-show="$store.getters['global/isLoaded']">

    <KTHeader v-if="$vuetify.breakpoint.mdAndUp"/>
    <KTHeaderMobile :dialog.sync="showTuts" v-else/>

    <Loader v-if="loaderEnabled" v-bind:logo="loaderLogo"/>

    <div class="d-flex flex-row flex-column-fluid page">
      <div id="kt_wrapper" class="d-flex flex-column flex-row-fluid wrapper">

        <rail-navigation v-if="$vuetify.breakpoint.mdAndUp"/>

        <div id="kt_content" class="content">
          <div :class="{'container-fluid': contentFluid, container: !contentFluid}">
            <div class="d-block d-md-none">
              <KTAside v-if="asideEnabled"/>
            </div>

            <v-main>
              <transition name="fade-in-up">
                <custom-page v-if="!$route.meta.main_page"/>
                <router-view v-else/>
              </transition>
            </v-main>
          </div>
        </div>

        <!--                <v-spacer/>-->
        <!--                <KTFooter/>-->
      </div>
    </div>
    <easy-modal/>
    <navigation/>
    <KTScrollTop/>
    <refresh-page v-if="showReloadPage"/>

    <bottom-menu-container v-if="$vuetify.breakpoint.smAndDown"/>

    <custom-popup v-model="showTuts" :cons="cons" :loading.sync="loading" max-width="1240" hide-confirm>
      <tutorials v-if="showTuts" :loading.sync="loading"/>
    </custom-popup>
  </v-app>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import KTAside from "./layout/aside/Aside.vue";
import KTHeader from "./layout/header/Header.vue";
import KTHeaderMobile from "./layout/header/HeaderMobile.vue";
import KTFooter from "./layout/footer/Footer"
import HtmlClass from "@/core/services/htmlclass.service";
import KTStickyToolbar from "./layout/extras/StickyToolbar.vue";
import KTScrollTop from "./layout/extras/ScrollTop";
import Loader from "./layout/content/Loader.vue";
// import toast from "@/view/content/toast/toast";
import RailNavigation from "./layout/content/RailNavigation";
import navigation from "./layout/aside/Navigation";
import {ADD_BODY_CLASSNAME, REMOVE_BODY_CLASSNAME} from "@/core/services/store/htmlclass.module.js";

import modal from "./components/modals/modal";
import CustomPage from "./pages/customPage";
import easyModal from "./plugins/EasyModal/view";
import CustomPopup from "./plugins/popup/customPopup";
import Tutorials from "./pages/tutorials";
import BottomMenuContainer from "./layout/bottomMenu/container";
import RefreshPage from "./layout/header/refreshPage";


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
      qrUrl: '',
      coreBack: 'https://www.sarvland.ir',
      pLandUrl: 'http://localhost:8080/',
      showTuts: false,
      loading: false,
      showReloadPage: false,
      cons: {
        title: 'راهنمای سامانه ترمینال تبلیغات'
      }
    }
  },

  beforeMount() {
    this.$instanceAxios.interceptors.response.use(
        response => Promise.resolve(response),
        error => {
          this.handleResponse(error);
          return Promise.reject(error)
        }
    )
    this.$DashboardAxios.interceptors.response.use(
        response => Promise.resolve(response),
        error => {
          this.handleResponse(error);
          return Promise.reject(error)
        }
    )

    this.$store.dispatch(ADD_BODY_CLASSNAME, "page-loading");

    HtmlClass.init(this.layoutConfig());

    let token = null
    token = localStorage.getItem('id_token');

    if (!token || token.length <= 0) {
      this.showReloadPage = true
    }
    this.$DashboardAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    this.DHeaders.Authorization = 'Bearer ' + token
  },

  mounted() {
    this.$root.$on('closeModal', () => this.showReloadPage = false)
    this.$root.$on('openTuts', () => this.showTuts = true)
    this.$on('offline', () => {
      this.$modal.showConnectionLost({})
      // this.$toast.error("شما به اینترنت متصل نیستید", {timeout: 5000})
    })
    this.$on('online', () => {
      this.$modal.hideConnectionLost()
    })
    this.fetchVpn()

    setTimeout(() => {
      this.$store.dispatch(REMOVE_BODY_CLASSNAME, "page-loading");
    }, 2000);

    this.fetch();
    this.setTutorials();
  },

  methods: {
    handleResponse(error) {
      // if (error.response.status === 404) {
      //     this.$modal.error('خطا', error.response.data.message ?? 'درخواست مورد نظر یافت نشد', undefined, {
      //         text: this.$t("BUTTONS.BuyAPlane"),
      //         class: 'success w-100',
      //         onClick: this.gotoPanel
      //     }, [{
      //         text: this.$t("BUTTONS.OK")
      //     }])
      // } else
      if (error.response.status === 403) {
        this.$modal.error(this.$t("ERRORS.NoAccess"), this.$t("ERRORS.PleasebyeAPlane"), undefined, {
          text: this.$t("BUTTONS.BuyAPlane"),
          class: 'success w-100',
          onClick: this.gotoPanel
        }, [{
          text: this.$t("BUTTONS.OK")
        }])
      } else if (error.response.status === 402) {
        this.$modal.wallet(this.$t("ERRORS.NoAccountCharge"), this.$t("ERRORS.PleaseChargeYourAccount"), undefined, {
          text: this.$t("BUTTONS.AccountCharge"),
          class: 'success w-100',
          onClick: this.toggleWalletDialog
        }, [
          {
            text: this.$t("BUTTONS.Close")
          }
        ])
      }
    },
    gotoPanel() {
      window.location.href = 'https://core.terminalads.com/#/panel'
    },
    ...mapActions('tutorial', ['setTutorials']),
    ...mapActions('ribbon', ['setCore', 'toggleWalletDialog']),
    fetch() {
      console.log('core: ', this.$DashboardAxios.defaults.headers)
      this.$DashboardAxios.get('/api/core')
          .then(({data}) => {
            this.setCore(data.data)
            this.setWalletData(data.data.wallet)

            this.fetchTuts()
          })
          .catch(({response}) => {
            if (response.status !== 401)
              this.$toast.error('خطا در دریافت اطلاعات!', {timeout: 5000})
          })
    },
    fetchTuts() {
      let tuts = localStorage.getItem('tuts')
      try {
        if (tuts) tuts = JSON.parse(tuts)
        if (typeof tuts !== 'boolean') tuts = false
      } catch (e) {
        tuts = false
        console.log("can't parse the tuts:", e)
      }

      if (!tuts) {
        setTimeout(() => {
          this.showTuts = true
          localStorage.setItem('tuts', 'true')
        }, 1500)
      }
    },
    fetchVpn() {
      let vpn = localStorage.getItem('vpn')
      try {
        if (vpn) vpn = JSON.parse(vpn)
        if (typeof vpn !== 'boolean') vpn = false
      } catch (e) {
        vpn = false
        console.log("can't parse the tuts:", e)
      }
      if (this.$vuetify.breakpoint.mdAndUp) vpn = false

      if (!vpn) {
        setTimeout(() => {
          this.$DashboardAxios.get('/api/checkVpn')
              .then(({data}) => {
                if (data.data?.iso_code_2 && data.data.iso_code_2 !== 'IR') {
                  let obj = {
                    closable: true,
                    type: 'VPN',
                    title: 'فیلترشکن شما فعال است',
                    subtitle: 'برای بهتر شدن سرعت سامانه، فیلترشکن (vpn) خود را خاموش نمایید',
                  }
                  this.$modal.showConnectionLost(obj)
                  localStorage.setItem('vpn', 'true')
                }
              })
              .catch(({response}) => {
                if (response?.data?.message) {
                  console.log('error in get vpn status: ', response.data.message)
                }
              })
        }, 1500)
      }
    }
  },
  computed: {
    ...mapGetters([
      "isAuthenticated",
      "breadcrumbs",
      "pageTitle",
      "layoutConfig"
    ]),
    ...mapGetters('tutorial', [
      'popups',
      'popupSlugs',
    ]),
    /**
     * Check if the page loader is enabled
     * @returns {boolean}
     */
    loaderEnabled() {
      return !/false/.test(this.layoutConfig("loader.type"));
    },

    /**
     * Check if container width is fluid
     * @returns {boolean}
     */
    contentFluid() {
      return this.layoutConfig("content.width") === "fluid";
    },

    /**
     * Page loader logo image using require() function
     * @returns {string}
     */
    loaderLogo() {
      return this.DConfigs.header_logo
    },

    /**
     * Check if the left aside menu is enabled
     * @returns {boolean}
     */
    asideEnabled() {
      return !!this.layoutConfig("aside.self.display");
    },

    /**
     * Set the right toolbar display
     * @returns {boolean}
     */
    toolbarDisplay() {
      // return !!this.layoutConfig("toolbar.display");
      return true;
    },

    /**
     * Set the subheader display
     * @returns {boolean}
     */
    subheaderDisplay() {
      return !!this.layoutConfig("subheader.display");
    }
  }
};
</script>

<style>
#kt_content {
  padding-top: 12em;
}

@media screen and (max-width: 960px) {
  #kt_content {
    padding-top: 15em;
  }
}

/*@media screen and (min-width: 960px) {*/
/*    #kt_content {*/
/*        margin-top: 0;*/
/*    }*/
/*}*/

/*#kt_content {*/
/*    margin-top: 21vh;*/
/*}*/

/*@media screen and (max-width: 960px) {*/
/*    #kt_content {*/
/*        padding-top: 15vh;*/
/*    }*/

/*    .content {*/
/*        margin: 0 16px;*/
/*    }*/
/*}*/

.v-navigation-drawer {
  background-image: /*linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)),*/ url('/media/bg/bg-menu.jpg');
  background-size: 256px 100%;
  background-repeat: no-repeat;
}
</style>
