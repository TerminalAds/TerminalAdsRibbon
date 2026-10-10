<template>
  <v-row class="no-gutters">
    <v-col class="pa-4 pb-0 mb-2" cols="12">
      <find-menu-page class="mb-2 no-flip-card"  v-if="showFindMenu"/>
      <SmartSearchBanner @show-all="handleShowAllFeatures" v-else />
    </v-col>
    <v-col v-if="dashboardIntro && $vuetify.breakpoint.mdAndDown" class="pa-4" cols="12">
      <div class="h_iframe-aparat_embed_frame">
        <!--        <span style="display: block;padding-top: 57%"></span>-->
        <iframe :src="dashboardIntro.src" allowFullScreen="true"
                mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
      </div>
    </v-col>

    <v-col class="px-2 pl-lg-0" cols="12" lg="4" order="3" order-md="0">
      <v-row class="fill-height no-flip-card" no-gutters>
        <v-col class="pa-2" cols="12">
          <user-transactions class="no-flip-card"/>
        </v-col>

        <v-col v-if="$vuetify.breakpoint.lgAndUp" class="pa-2" cols="12">
          <follow-terminal-ads class="no-flip-card"/>
        </v-col>
      </v-row>
    </v-col>

    <v-col v-if="$vuetify.breakpoint.mdAndDown" class="py-2 px-4" cols="12" order="1">
      <follow-terminal-ads class="no-flip-card"/>
    </v-col>

    <v-col class="px-2 pr-lg-0" cols="12" lg="8" order="0" order-md="1">
      <pack-invite class="no-flip-card"/>

      <!--    visible when greater than 1264px     -->
      <v-row v-if="$vuetify.breakpoint.lgAndUp" no-gutters>
        <v-col cols="12" lg="6">
          <ticket-info class="no-flip-card"/>
        </v-col>

        <v-col class="pa-2" cols="12" lg="6">
          <user-profile class="no-flip-card"/>
        </v-col>
      </v-row>
    </v-col>

    <!--    visible when less than 1264px     -->
    <v-col v-if="$vuetify.breakpoint.mdAndDown" class="px-2" cols="12" order="2">
      <v-row no-gutters>
        <v-col cols="12" lg="6" order="1" order-md="0">
          <ticket-info class="no-flip-card"/>
        </v-col>

        <v-col class="pa-2" cols="12" lg="6" order="0" order-md="1">
          <user-profile class="no-flip-card"/>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" order="4">
      
      <dashboard-banners class="no-flip-card"/>
    </v-col>

    <v-col class="px-4 py-2 pl-sm-2" cols="12" md="6" order="5">
      <news class="no-flip-card"/>
    </v-col>

    <v-col class="px-2 py-2 pl-sm-2" cols="12" md="6" order="6">
      <advances v-if="showFindMenu" class="no-flip-card"/>
      <QrPricingWidget v-else class="no-flip-card"/>
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters} from "vuex"
import UserTransactions from "./components/mixed/userTransactions";
import DashboardBanners from "./components/ads/dashboardBanners";
import News from "./components/list/news";
import Advances from "./components/advance-table/advances";
import PackInvite from "./components/list/packInvite";
import TicketInfo from "./components/list/ticketInfo";
import UserProfile from "./components/list/userProfile";
import FollowTerminalAds from "./components/mixed/followTerminalAds";
import FindMenuPage from "./components/list/findMenuPage.vue";
import SmartSearchBanner from "./components/list/SmartSearchBanner.vue";
import QrPricingWidget from "./components/list/QrPricingWidget.vue";

export default {
  name: "Dashboard",

  components: {
    FindMenuPage,
    FollowTerminalAds,
    UserProfile,
    TicketInfo,
    PackInvite,
    Advances,
    News,
    DashboardBanners,
    UserTransactions,
    SmartSearchBanner,
    QrPricingWidget
  },

  computed: {
    ...mapGetters('ribbon', ['dashboardIntro']),
    showFindMenu() {
    if (typeof window === 'undefined') return true;

    const hostname = window.location.hostname;
    const excludedDomains = [
      'core-qr.terminalads.com',
      'core-qr.terminalads.ir',
      'localhost'
    ];
    return !excludedDomains.includes(hostname);
  },
  },
  methods:{
        handleShowAllFeatures() {
      // window.location.href = "https://core-qr.terminalads.ir/#/qr/cate/share";
      
      window.open("https://core-qr.terminalads.ir/#/qr/cate/share", "_blank");
    },

  }
};
</script>

<style>
.h_iframe-aparat_embed_frame {
  aspect-ratio: 16/9;
  position: relative;
  max-width: 640px;
  margin-inline: auto;
}

.h_iframe-aparat_embed_frame .ratio {
  display: block;
  width: 100%;
  height: auto;
}

.h_iframe-aparat_embed_frame iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.no-flip-card:hover,
.card-custom.no-flip-card:hover {
  transform: none !important;
  -webkit-transform: none !important;
  box-shadow: 0 0 30px 0 rgba(82, 63, 105, 0.05) !important;
}
</style>
