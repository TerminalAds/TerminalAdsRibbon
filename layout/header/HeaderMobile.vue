<template>
    <div id="kt_header_mobile" class="header-mobile d-block align-items-center" v-bind:class="headerClasses">

        <div class="d-flex align-items-center w-100 justify-content-between">
            <v-btn small class="px-1" dark text @click="toggleMobileMenu()">
                <v-icon class="ml-1">mdi-menu</v-icon>
                منو
            </v-btn>

            <walletButton></walletButton>

            <div class="d-flex flex-nowrap">
                <b-dropdown class="downpDownMobile" size="sm" variant="link"
                            toggle-class="topbar-item text-decoration-none p-0" no-caret right no-flip>
                    <template v-slot:button-content class="pt-0">
                        <div class="btn btn-icon btn-hover-transparent-white btn-dropdown btn-lg mr-1 pulse pulse-primary">
                            <span class="svg-icon svg-icon-xl"><i class="flaticon2-notification"></i></span>
                            <span class="pulse-ring"></span>
                        </div>
                    </template>
                    <b-dropdown-text tag="div" style="width: 100vw !important; padding: 0"
                                     class="transition-linear-out-slow-in mobileCutomPaddingNotif">
                        <form class="p-0">
                            <KTDropdownNotification></KTDropdownNotification>
                        </form>
                    </b-dropdown-text>
                </b-dropdown>

                <button class="btn btn-icon btn-hover-transparent-white p-0 ml-0 mt-1" @click="onLogout()">
                    <span class="svg-icon svg-icon-xl">
                        <v-icon size="25" class="hover-logout">mdi-power</v-icon>
                    </span>
                </button>

            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import KTLayoutHeaderTopbar from "../../assets/js/layout/header-topbar.js";
import walletButton from '../../pages/transactions/WalletOpenButton';
import KTExitButton from "../../layout/header/ExitButton.vue";
import {LOGOUT} from "@/core/services/store/auth.module";
import KTDropdownNotification from "../../layout/extras/dropdown/DropdownNotification.vue";

export default {
    name: "KTHeaderMobile",
    components: {walletButton, KTExitButton, KTDropdownNotification},
    mounted() {
        // Init Header Topbar For Mobile Mode
        KTLayoutHeaderTopbar.init(this.$refs["kt_header_mobile_topbar_toggle"]);
    },
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
};
</script>

<style>
.downpDownMobile .dropdown-menu {
    width: 100vw !important;
    left: -5px !important;
    padding-top: 0 !important;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    height: 100vh !important;
}
</style>

<style scoped>
.mobileCutomPaddingNotif .b-dropdown-text {
    padding: 0 !important;
}
</style>
