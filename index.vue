<template>
    <v-app class="d-flex flex-column flex-root ebi" style="background: transparent !important;"
           v-if="$store.getters['global/isLoaded']">

        <KTHeaderMobile v-if="$vuetify.breakpoint.mdAndDown"/>

        <Loader v-if="loaderEnabled" v-bind:logo="loaderLogo"/>

        <div class="d-flex flex-row flex-column-fluid page">
            <div id="kt_wrapper" class="d-flex flex-column flex-row-fluid wrapper">

                <KTHeader v-if="$vuetify.breakpoint.lgAndUp"/>
                <rail-navigation v-if="$vuetify.breakpoint.lgAndUp"/>

                <div id="kt_content" class="content">
                    <div :class="{'container-fluid': contentFluid, container: !contentFluid}">
                        <div class="d-block d-md-none">
                            <KTAside v-if="asideEnabled"/>
                        </div>

                        <transition name="fade-in-up">
                            <custom-page v-if="!$route.meta.main_page"/>
                            <router-view v-else/>
                        </transition>
                    </div>
                </div>

                <v-spacer/>
                <KTFooter/>
            </div>
        </div>
        <easy-modal/>
        <navigation/>
        <KTScrollTop/>
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
import CustomPage from "./pages/customPage"
import easyModal from "@/core/plugins/EasyModal/view";


export default {
    name: "index",
    components: {
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
        }
    },
    beforeMount() {
        this.$store.dispatch(ADD_BODY_CLASSNAME, "page-loading");

        HtmlClass.init(this.layoutConfig());
    },
    watch: {
        $route(to, from) {
            this.checkWallet();
        }
    },
    mounted() {
        setTimeout(() => {
            this.$store.dispatch(REMOVE_BODY_CLASSNAME, "page-loading");
        }, 2000);

        this.setTutorials();
    },
    methods: {
        ...mapActions('tutorial', [
            'setTutorials',
        ]),
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
            return this.config.header_logo
            // return process.env.BASE_URL + this.layoutConfig("loader.logo");
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
@media screen and (min-width: 960px) {
    #kt_content {
        margin-top: 0;
    }
}

#kt_content {
    margin-top: 21vh;
}

@media screen and (max-width: 960px) {
    .content {
        margin: 0 16px;
    }
}

.v-navigation-drawer {
    background-image: /*linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)),*/ url('/media/bg/bg-menu.jpg');
    background-size: 256px 100%;
    background-repeat: no-repeat;
}
</style>
