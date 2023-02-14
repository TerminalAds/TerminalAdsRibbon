<template>
    <v-row class="no-gutters">
        <v-col cols="12" lg="4" class="px-2 pl-lg-0">
            <user-transactions/>
        </v-col>

        <v-col cols="12" lg="8" class="px-2 pr-lg-0">
            <pack-invite/>

            <!--    visible when greater than 1264px     -->
            <v-row no-gutters v-if="$vuetify.breakpoint.lgAndUp">
                <v-col cols="12" lg="6">
                    <ticket-info/>
                </v-col>

                <v-col cols="12" lg="6" class="pa-2">
                    <user-profile/>
                </v-col>
            </v-row>
        </v-col>

        <!--    visible when less than 1264px     -->
        <v-col cols="12" class="px-2" v-if="$vuetify.breakpoint.mdAndDown">
            <v-row no-gutters>
                <v-col cols="12" lg="6">
                    <ticket-info/>
                </v-col>

                <v-col cols="12" lg="6" class="pa-2">
                    <user-profile/>
                </v-col>
            </v-row>
        </v-col>

        <v-col cols="12">
            <dashboard-banners/>
        </v-col>

        <v-col cols="12" md="6" class="px-4 py-2 pl-sm-2">
            <news/>
        </v-col>

        <v-col cols="12" md="6" class="px-2 pr-sm-0">
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

export default {
    name: "Dashboard",
    components: {
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
