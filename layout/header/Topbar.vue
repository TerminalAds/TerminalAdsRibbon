<template>
  <div class="topbar has-background">
    <v-menu :close-on-content-click="false" offset-y open-on-click>
      <template v-slot:activator="{on, attrs}">
        <v-badge :content="persianNum(unread)" :value="unread" color="red" left offset-x="30" offset-y="20" overlap>
          <div class="btn btn-icon btn-hover-transparent-white btn-dropdown btn-lg mr-1 pulse pulse-primary"
               v-bind="attrs" v-on="on">
            <span class="svg-icon svg-icon-xl"><i class="flaticon2-notification"></i></span>
            <span class="pulse-ring"></span>
          </div>
        </v-badge>
      </template>

      <v-card flat>
        <KTDropdownNotification v-model="unread"/>
      </v-card>
    </v-menu>

    <walletButton hide-in-mobile/>

    <KTQuickUser/>
  </div>
</template>

<script>
import KTDropdownNotification from "../../layout/extras/dropdown/DropdownNotification.vue";
import KTQuickUser from "../../layout/extras/offcanvas/QuickUser.vue";
import KTQuickPanel from "../../layout/extras/offcanvas/QuickPanel.vue";
import {mapGetters} from "vuex";
import walletButton from '../../pages/transactions/WalletOpenButton'


export default {
  name: "KTTopbar",

  data() {
    return {
      languageFlag: "",
      unread: 0
    };
  },

  components: {
    KTDropdownNotification,
    KTQuickUser,
    KTQuickPanel,
    walletButton
  },

  computed: {
    ...mapGetters(["layoutConfig", "getClasses"]),

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
body[data-header-scroll=on] .topbar.has-background .btn.btn-icon:hover {
  background-color: rgba(255, 255, 255, .10) !important;
}

body[data-header-scroll=on] .topbar.has-background .btn.btn-icon i {
  color: #fff !important;
}
</style>
