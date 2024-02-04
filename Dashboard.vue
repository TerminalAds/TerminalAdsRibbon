<template>
  <v-row class="no-gutters">
    <v-col class="px-2 pl-lg-0" cols="12" lg="4" order="3" order-md="0">
      <v-row class="fill-height" no-gutters>
        <v-col class="pa-2" cols="12">
          <user-transactions/>
        </v-col>

        <v-col v-if="$vuetify.breakpoint.lgAndUp" class="pa-2" cols="12">
          <follow-terminal-ads/>
        </v-col>
      </v-row>
    </v-col>

    <v-col v-if="$vuetify.breakpoint.mdAndDown" class="py-2 px-4" cols="12" order="1">
      <follow-terminal-ads/>
    </v-col>

    <v-col class="px-2 pr-lg-0" cols="12" lg="8" order="0" order-md="1">
      <pack-invite/>

      <!--    visible when greater than 1264px     -->
      <v-row v-if="$vuetify.breakpoint.lgAndUp" no-gutters>
        <v-col cols="12" lg="6">
          <ticket-info/>
        </v-col>

        <v-col class="pa-2" cols="12" lg="6">
          <user-profile/>
        </v-col>
      </v-row>
    </v-col>

    <!--    visible when less than 1264px     -->
    <v-col v-if="$vuetify.breakpoint.mdAndDown" class="px-2" cols="12" order="2">
      <v-row no-gutters>
        <v-col cols="12" lg="6" order="1" order-md="0">
          <ticket-info/>
        </v-col>

        <v-col class="pa-2" cols="12" lg="6" order="0" order-md="1">
          <user-profile/>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" order="4">
      <dashboard-banners/>
    </v-col>

    <v-col class="px-4 py-2 pl-sm-2" cols="12" md="6" order="5">
      <news/>
    </v-col>

    <v-col class="px-2 pr-sm-0" cols="12" md="6" order="6">
      <advances/>
    </v-col>
  </v-row>
</template>

<script>
import UserTransactions from "./components/mixed/userTransactions";
import DashboardBanners from "./components/ads/dashboardBanners";
import News from "./components/list/news";
import Advances from "./components/advance-table/advances";
import PackInvite from "./components/list/packInvite";
import TicketInfo from "./components/list/ticketInfo";
import UserProfile from "./components/list/userProfile";
import FollowTerminalAds from "./components/mixed/followTerminalAds";

export default {
  name: "Dashboard",
  components: {
    FollowTerminalAds,
    UserProfile,
    TicketInfo,
    PackInvite,
    Advances,
    News,
    DashboardBanners,
    UserTransactions,
  },
};
</script>
