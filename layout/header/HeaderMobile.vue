<template>
    <v-app-bar app fixed color="transparent" flat dense>
        <v-img src="media/bg/bg-10.jpg" class="app-bar-img px-2" height="100%">
            <template v-slot:default>
                <v-toolbar-items>
                    <v-btn small class="px-2" dark text @click="toggleMobileMenu()">
                        <v-icon class="ml-1">mdi-menu</v-icon>
                        منو
                    </v-btn>
                </v-toolbar-items>

                <router-link to="/">
                    <img alt="Logo" class="px-2" :src="DConfigs.header_logo" style="width: 42px"/>
                </router-link>

                <v-btn :href="front_url" text min-width="36" class="px-2" color="#6cdb72">
                    <v-icon size="30">mdi-home</v-icon>
                </v-btn>

                <v-spacer/>

                <KTQuickUser :large="false"/>

                <v-menu offset-y :close-on-content-click="false" eager>
                    <template v-slot:activator="{ on, attrs }">
                        <v-badge :value="unread" :content="persianNum(unread)" left overlap color="red"
                                 offset-x="20" offset-y="20">
                            <v-btn text dark min-width="36" class="px-2" v-bind="attrs" v-on="on">
                                <v-icon>mdi-bell</v-icon>
                            </v-btn>
                        </v-badge>
                    </template>

                    <v-card flat>
                        <KTDropdownNotification v-model="unread"/>
                    </v-card>
                </v-menu>

                <v-btn text dark min-width="36" class="px-2">
                    <v-icon>mdi-power</v-icon>
                </v-btn>
            </template>
        </v-img>

        <template v-slot:extension>
            <v-spacer/>
            <walletButton style="flex-basis: 100%"/>
        </template>
    </v-app-bar>
</template>

<script>
import {mapGetters} from "vuex";
import KTLayoutHeaderTopbar from "../../assets/js/layout/header-topbar.js";
import walletButton from '../../pages/transactions/WalletOpenButton';
import KTExitButton from "../../layout/header/ExitButton.vue";
import {LOGOUT} from "@/core/services/store/auth.module";
import KTDropdownNotification from "../../layout/extras/dropdown/DropdownNotification.vue";
import KTQuickUser from "../extras/offcanvas/QuickUser";

export default {
    name: "KTHeaderMobile",
    components: {KTQuickUser, walletButton, KTExitButton, KTDropdownNotification},
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

.v-app-bar >>> .v-toolbar__extension,
.app-bar-img {
    transition: opacity .3s ease-in;
}

.v-app-bar >>> .v-toolbar__content {
    padding: 0;
}

.app-bar-img >>> .v-image__image {
    opacity: 0;
}

.app-bar-img >>> .v-responsive__content {
    display: flex;
    align-items: center;
}

.v-app-bar--is-scrolled >>> .app-bar-img .v-image__image {
    opacity: 1;
}

.v-app-bar--is-scrolled >>> .v-toolbar__extension {
    opacity: 0;
}
</style>
