<template>
  <section v-if="showVaghtin" class="vaghtin-home">
    <management-shortcuts />
    <div class="vaghtin-home-grid">
      <div
        class="vaghtin-home-main"
        :dir="$i18n.locale.startsWith('en') ? 'ltr' : 'rtl'"
      >
        <pack-invite invite-only class="no-flip-card" />
        <user-profile class="no-flip-card vaghtin-profile" />
      </div>
      <div
        class="vaghtin-service-grid"
        :dir="$i18n.locale.startsWith('en') ? 'ltr' : 'rtl'"
      >
        <user-pack />
        <section class="vaghtin-ticket">
          <div>
            <h2>{{ $t("panel.registerTicket") }}</h2>
            <p>{{ $t("panel.ticketHelp") }}</p>
          </div>
          <img
            src="./assets/img/customer-service.webp"
            alt=""
            width="88"
            height="88"
          />
          <a
            :href="`${$coreApi}/#/tickets/create`"
            target="_blank"
            rel="noopener noreferrer"
            >{{ $t("panel.registerTicket") }}</a
          >
        </section>
      </div>
      <aside
        class="vaghtin-home-side"
        :dir="$i18n.locale.startsWith('en') ? 'ltr' : 'rtl'"
      >
        <user-transactions class="no-flip-card" />
        <follow-terminal-ads class="no-flip-card" />
      </aside>
    </div>
  </section>
  <v-row v-else class="no-gutters">
    <v-col v-if="!showVaghtin" class="pa-4 pb-0 mb-2" cols="12">
      <find-menu-page class="mb-2 no-flip-card" v-if="showFindMenu" />
      <SmartSearchBanner @show-all="handleShowAllFeatures" v-else />
    </v-col>
    <v-col
      v-if="!showVaghtin && dashboardIntro && $vuetify.breakpoint.mdAndDown"
      class="pa-4"
      cols="12"
    >
      <div class="h_iframe-aparat_embed_frame">
        <!--        <span style="display: block;padding-top: 57%"></span>-->
        <iframe
          :src="dashboardIntro.src"
          allowFullScreen="true"
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
        ></iframe>
      </div>
    </v-col>

    <v-col class="px-2 pl-lg-0" cols="12" lg="4" order="3" order-md="0">
      <v-row class="fill-height no-flip-card" no-gutters>
        <v-col class="pa-2" cols="12">
          <user-transactions class="no-flip-card" />
        </v-col>

        <v-col v-if="$vuetify.breakpoint.lgAndUp" class="pa-2" cols="12">
          <follow-terminal-ads class="no-flip-card" />
        </v-col>
      </v-row>
    </v-col>

    <v-col
      v-if="$vuetify.breakpoint.mdAndDown"
      class="py-2 px-4"
      cols="12"
      order="1"
    >
      <follow-terminal-ads class="no-flip-card" />
    </v-col>

    <v-col class="px-2 pr-lg-0" cols="12" lg="8" order="0" order-md="1">
      <pack-invite :invite-only="showVaghtin" class="no-flip-card" />

      <!--    visible when greater than 1264px     -->
      <v-row v-if="$vuetify.breakpoint.lgAndUp" no-gutters>
        <v-col v-if="!showVaghtin" cols="12" lg="6">
          <ticket-info class="no-flip-card" />
        </v-col>

        <v-col class="pa-2" cols="12" :lg="showVaghtin ? 12 : 6">
          <user-profile class="no-flip-card" />
        </v-col>
      </v-row>
    </v-col>

    <!--    visible when less than 1264px     -->
    <v-col
      v-if="$vuetify.breakpoint.mdAndDown"
      class="px-2"
      cols="12"
      order="2"
    >
      <v-row no-gutters>
        <v-col v-if="!showVaghtin" cols="12" lg="6" order="1" order-md="0">
          <ticket-info class="no-flip-card" />
        </v-col>

        <v-col
          class="pa-2"
          cols="12"
          :lg="showVaghtin ? 12 : 6"
          order="0"
          order-md="1"
        >
          <user-profile class="no-flip-card" />
        </v-col>
      </v-row>
    </v-col>

    <v-col v-if="!showVaghtin" cols="12" order="4">
      <dashboard-banners class="no-flip-card" />
    </v-col>

    <v-col
      v-if="!showVaghtin"
      class="px-4 py-2 pl-sm-2"
      cols="12"
      md="6"
      order="5"
    >
      <news class="no-flip-card" />
    </v-col>

    <v-col
      v-if="!showVaghtin"
      class="px-2 py-2 pl-sm-2"
      cols="12"
      md="6"
      order="6"
    >
      <advances v-if="showFindMenu" class="no-flip-card" />
      <QrPricingWidget v-else class="no-flip-card" />
    </v-col>
  </v-row>
</template>

<script>
import UserPack from "./components/list/userPack.vue";
import ManagementShortcuts from "@/features/vaghtin/Dashboard.vue";
import { isVaghtinHost } from "@/features/vaghtin/host.mjs";
import { mapGetters } from "vuex";
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
    UserPack,
    ManagementShortcuts,
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
    QrPricingWidget,
  },

  computed: {
    showVaghtin() {
      return (
        typeof window !== "undefined" && isVaghtinHost(window.location.hostname)
      );
    },
    ...mapGetters("ribbon", ["dashboardIntro"]),
    showFindMenu() {
      if (typeof window === "undefined") return true;

      const hostname = window.location.hostname;
      const excludedDomains = [
        "core-qr.terminalads.com",
        "core-qr.terminalads.ir",
        "localhost",
      ];
      return !excludedDomains.includes(hostname);
    },
  },
  methods: {
    handleShowAllFeatures() {
      // window.location.href = "https://core-qr.terminalads.ir/#/qr/cate/share";

      window.open("https://core-qr.terminalads.ir/#/qr/cate/share", "_blank");
    },
  },
};
</script>

<style scoped>
.vaghtin-home {
  padding: 16px;
  max-width: 1480px;
  margin-inline: auto;
  min-width: 0;
}
.vaghtin-home-grid {
  display: grid;
  direction: ltr;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: 24px;
  align-items: start;
}
.vaghtin-home-main,
.vaghtin-home-side {
  display: grid;
  gap: 20px;
  min-width: 0;
}
.vaghtin-service-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
  min-width: 0;
  align-items: start;
}
.vaghtin-ticket {
  display: grid;
  grid-template-columns: 1fr 88px;
  gap: 12px;
  padding: 20px;
  background: white;
  border: 1px solid #e7ebf2;
  border-radius: 12px;
  align-items: center;
}
.vaghtin-ticket h2 {
  font-size: 17px;
  font-weight: 700;
  margin: 0 0 8px;
}
.vaghtin-ticket p {
  font-size: 12px;
  line-height: 1.9;
  color: #65748a;
  margin: 0;
}
.vaghtin-ticket img {
  object-fit: contain;
  max-width: 100%;
}
.vaghtin-ticket a {
  justify-self: start;
  padding: 9px 20px;
  border-radius: 8px;
  background: #854cff;
  color: white;
  font-weight: 600;
  text-decoration: none;
}
.vaghtin-ticket a:focus-visible {
  outline: 3px solid #246cbd;
  outline-offset: 3px;
}
.vaghtin-home-main ::v-deep .modern-input-compact {
  min-width: 0;
  width: 0;
}
.vaghtin-home-main ::v-deep .v-input,
.vaghtin-home-main ::v-deep .card {
  min-width: 0;
}
.vaghtin-home-main ::v-deep .card-body {
  overflow-wrap: anywhere;
}
.vaghtin-profile ::v-deep .pt-12 {
  padding-top: 20px !important;
  padding-bottom: 4px !important;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px 24px;
}
.vaghtin-profile ::v-deep .pt-12 > div {
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px !important;
  min-width: 0;
}
.vaghtin-profile ::v-deep .symbol-label {
  width: 64px !important;
  height: 64px !important;
}
@media (max-width: 600px) {
  .vaghtin-profile ::v-deep .pt-12 {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 1100px) {
  .vaghtin-home-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .vaghtin-home-side {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }
}
@media (max-width: 600px) {
  .vaghtin-home {
    padding: 12px 8px;
  }
  .vaghtin-home-grid {
    gap: 16px;
    margin-top: 16px;
  }
  .vaghtin-service-grid,
  .vaghtin-home-side {
    grid-template-columns: minmax(0, 1fr);
  }
  .vaghtin-home-main,
  .vaghtin-home-side {
    gap: 16px;
  }
}
</style>

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
