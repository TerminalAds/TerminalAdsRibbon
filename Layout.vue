<template>
    <div class="d-flex flex-column flex-root" v-if="$store.getters['global/isLoaded']">
        <login-roll-back></login-roll-back>
        <!-- begin:: Header Mobile -->
        <KTHeaderMobile></KTHeaderMobile>
        <!-- end:: Header Mobile -->

        <!-- begin:: rail navigation -->
        <rail-navigation></rail-navigation>
        <!-- end:: rail navigation -->

        <Loader v-if="loaderEnabled" v-bind:logo="loaderLogo"></Loader>

        <!-- begin::Body -->
        <div class="d-flex flex-row flex-column-fluid page">
            <div id="kt_wrapper" class="d-flex flex-column flex-row-fluid wrapper">
                <!-- begin:: Header -->
                <KTHeader></KTHeader>
                <!-- end:: Header -->

                <!-- begin:: Content -->
                <div
                        id="kt_content"
                        class="content d-flex flex-column flex-column-fluid"
                >

                    <KTSubheader
                            v-bind:flowTitles="textMain"
                            v-bind:breadcrumbs="breadcrumbs"
                            v-bind:title="pageTitle"
                    />


                    <!-- end:: Content Head -->
                    <!-- begin:: Content Body -->
                    <div class="d-flex flex-column-fluid">
                        <div :class="{'container-fluid': contentFluid,container: !contentFluid}">
                            <div class="d-lg-flex flex-row-fluid">
                                <!-- begin:: Aside Left -->
                                <div class="d-block d-md-none">
                                    <KTAside v-if="asideEnabled"></KTAside>
                                </div>
                                <!-- end:: Aside Left -->

                                <div class="content-wrapper flex-row-fluid">
                                    <transition name="fade-in-up">
                                        <div>

                                            <title-ribbon></title-ribbon>
                                            <b-modal id="modal-scrollable"
                                                     ok-only
                                                     ok-title="تایید"
                                                     scrollable
                                                     @ok="nextPopup"
                                                     :title="totalPopup[0] ? totalPopup[0].title:'' ">

                                                <p class="my-4"
                                                   v-html="totalPopup[0] ? totalPopup[0].description : ''"></p>
                                            </b-modal>
                                            <router-view/>
                                        </div>
                                    </transition>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <KTFooter></KTFooter>
            </div>
        </div>

        <easy-modal></easy-modal>
        <navigation></navigation>
        <wallet :show-button="false"></wallet>

        <KTScrollTop></KTScrollTop>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import KTAside from "@/view/layout/aside/Aside.vue";
import KTHeader from "@/view/layout/header/Header.vue";
import KTHeaderMobile from "@/view/layout/header/HeaderMobile.vue";
import KTFooter from "@/view/layout/footer/Footer.vue";
import HtmlClass from "@/core/services/htmlclass.service";
import KTSubheader from "@/view/layout/subheader/Subheader.vue";
import KTStickyToolbar from "@/view/layout/extras/StickyToolbar.vue";
import KTScrollTop from "@/view/layout/extras/ScrollTop";
import Loader from "@/view/content/Loader.vue";
import {ADD_BODY_CLASSNAME, REMOVE_BODY_CLASSNAME} from "@/core/services/store/htmlclass.module.js";

import LoginRollBack from "@/view/content/LoginRollBack";
import toast from "@/view/content/toast/toast";
import modal from "@/view/content/modals/modal";
import easyModal from "@/core/plugins/EasyModal/view";
import Navigation from '@/view/layout/aside/Navigation'
import TitleRibbon from "@/view/layout/titleRibbon";
import wallet from "@/view/pages/transactions/wallet";
import RailNavigation from "@/view/content/RailNavigation";

export default {
    name: "Layout",
    components: {
        TitleRibbon,
        KTAside,
        KTHeader,
        KTHeaderMobile,
        KTFooter,
        KTSubheader,
        KTStickyToolbar,
        KTScrollTop,
        Loader,
        LoginRollBack,
        toast,
        modal,
        easyModal,
        Navigation,
        wallet,
        RailNavigation
    },

    data() {
        return {
            text: [],
            totalPopup: [],
        }
    },

    beforeMount() {
        // show page loading
        this.$store.dispatch(ADD_BODY_CLASSNAME, "page-loading");
        if (localStorage.getItem('firstLogin')) {
            localStorage.removeItem('firstLogin')
            window.location.reload()
        }

        if (localStorage.getItem('inviteCode')) {
            localStorage.removeItem('inviteCode')
        }

        if (!localStorage.getItem('popup')) {
            localStorage.setItem('popup', "[]")
        }


        // initialize html element classes
        HtmlClass.init(this.layoutConfig());
    },
    watch: {
        $route(to, from) {
            let popupExists = this.popupSlugs.indexOf(to.path.substring(1)) > -1

            if (popupExists) {
                let seen = JSON.parse(localStorage.getItem('popup'))
                let popup = this.popups

                this.totalPopup = popup[to.path.substring(1)].filter(item => seen.indexOf(item.id) < 0);

                if (this.totalPopup.length > 0)
                    this.$bvModal.show('modal-scrollable');
            }

            let footer = window.document.querySelector("#kt_footer")
            if (to.path == '/home') {
                footer.classList.add("manamanam")
            } else {
                footer.classList.remove("manamanam")
            }
        },
    },
    created() {
        this.authority()
        this.getWallet();
        this.checkWallet();
        this.allTutorials();

    },
    mounted() {
        this.$vuetify.theme.dark = false

        // check if current user is authenticated
        if (!this.isAuthenticated) {
            return this.$router.push({name: "login"});
        }
        let url = window.location.href;
        const start = url.indexOf("?");
        const end = url.indexOf("#");

        url = url.substring(start, end);
        let fullUrl = document.URL;

        window.history.pushState('dashboard', 'Title', fullUrl.substr(end));
        let token = localStorage.getItem('id_token');
        setTimeout(() => {
            this.$store.dispatch(REMOVE_BODY_CLASSNAME, "page-loading");
        }, 2000);


    },
    computed: {
        ...mapGetters([
            "isAuthenticated",
            "breadcrumbs",
            "pageTitle",
            "layoutConfig",
        ]),
        ...mapGetters('tutorial', [
            'popups',
            'popupSlugs',
        ]),
        // ...mapActions('tutorial', [
        //     'setTutorials',
        // ]),
        cssVars() {
            return `url(${this.layoutConfig('self.body.background-image')})`;

        },

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
            return this.layoutConfig("loader.logo");
        },

        textMain() {
            return this.layoutConfig("mainText")

            // let t = this.layoutConfig("mainText") ?? [];
            //
            // let texts = t.map((i)=>{
            //   return i.value;
            // })
            // return texts;

            //
            // let t = JSON.parse(this.layoutConfig("mainText") ?? "[]") ?? [];
            //
            // ;
            //
            // let texts = []
            // for (const item of t) {
            //   if (item.value){
            //     texts.push(item.value);
            //   }
            // }


            // let t = JSON.parse(this.layoutConfig("mainText") ?? "[]") ?? [];
            //
            // let texts = []
            // for (const item of t) {
            //   if (item.value){
            //     texts.push(item.value);
            //   }
            // }
            // return texts;
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
    },
    methods: {
      allTutorials(){
        this.requestApiGet('allTutorials')
            .then(response => {
              this.$store.commit('tutorial/setTutorial', response.data.slugTutorials)
              this.$store.commit('tutorial/setpopupSlugs', response.data.slugPopups)
              this.$store.commit('tutorial/setpopups', response.data.popups)
            })
            .catch(error => {
              // TODO error handling
            })
            .finally(() => {
            })
      },
        nextPopup(event) {
            const lastItem = this.totalPopup.splice(0, 1);
            let seen = JSON.parse(localStorage.getItem('popup'));

            seen.push(lastItem[0].id);

            localStorage.setItem('popup', JSON.stringify(seen));

            if (this.totalPopup.length > 0)
                event.preventDefault();
        }
    }
};
</script>

<style>
.v-navigation-drawer {
    background-image: /*linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)),*/ url('/media/bg/bg-menu.jpg');
    background-size: 256px 100%;

    background-repeat: no-repeat;
}

body[data-scrolltop='on'] #kt_header {
    background-image: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), v-bind(cssVars) !important;
    background-size: 100%;
    color: white !important;
}
</style>
