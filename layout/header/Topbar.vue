<template>
    <!-- begin:: Header Topbar -->
    <div class="topbar has-background">

        <b-dropdown size="sm" variant="link" toggle-class="topbar-item text-decoration-none" no-caret right no-flip>
            <template v-slot:button-content>
                <div class="btn btn-icon btn-hover-transparent-white btn-dropdown btn-lg mr-1 pulse pulse-primary">
                    <span class="svg-icon svg-icon-xl"><i class="flaticon2-notification"></i></span>
                    <span class="pulse-ring"></span>
                </div>
            </template>

            <b-dropdown-text tag="div" class="min-w-md-350px">
                <form>
                    <KTDropdownNotification></KTDropdownNotification>
                </form>
            </b-dropdown-text>
        </b-dropdown>

        <walletButton hide-in-mobile/>

        <KTQuickUser/>
        <!--end: User Bar -->
    </div>
    <!-- end:: Header Topbar -->
</template>

<script>
// import KTSearchDefault from "@/view/layout/extras/dropdown/SearchDefault.vue";
import KTDropdownNotification from "../../layout/extras/dropdown/DropdownNotification.vue";
// import KTDropdownQuickAction from "@/view/layout/extras/dropdown/DropdownQuickAction.vue";
// import KTDropdownMyCart from "@/view/layout/extras/dropdown/DropdownMyCart.vue";
// import KTDropdownLanguage from "@/view/layout/extras/dropdown/DropdownLanguage.vue";
import KTQuickUser from "../../layout/extras/offcanvas/QuickUser.vue";
import KTQuickPanel from "../../layout/extras/offcanvas/QuickPanel.vue";
// import i18nService from "@/core/services/i18n.service.js";
import {mapGetters} from "vuex";
import walletButton from '../../pages/transactions/WalletOpenButton'


export default {
    name: "KTTopbar",
    data() {
        return {
            languageFlag: "",
            // languages: i18nService.languages
        };
    },
    components: {
        // KTSearchDefault,
        KTDropdownNotification,
        // KTDropdownQuickAction,
        // KTDropdownMyCart,
        // KTDropdownLanguage,
        KTQuickUser,
        KTQuickPanel,
        walletButton
    },

    // methods: {
    //     onLanguageChanged() {
    //         this.languageFlag = this.languages.find(val => {
    //             return val.lang === i18nService.getActiveLanguage();
    //         }).flag;
    //     }
    // },

    computed: {
        ...mapGetters(["layoutConfig", "getClasses"]),

        // getLanguageFlag() {
        //     return this.onLanguageChanged();
        // },

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

<style lang="scss">
.topbar {
  align-items: center;
  height: fit-content;

  .dropdown-toggle {
    padding: 0;

    &:hover {
      text-decoration: none;
    }

    &.dropdown-toggle-no-caret {
      &:after {
        content: none;
      }
    }
  }

  .dropdown-menu {
    margin: 0;
    padding: 0;
    outline: none;

    .b-dropdown-text {
      padding: 0;
    }
  }
}
</style>

<style>
body[data-header-scroll=on] .topbar.has-background .btn.btn-icon i {
    color: #fff !important;
}
</style>
