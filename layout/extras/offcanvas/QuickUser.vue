<template>
  <div class="topbar-item">
    <div v-if="DLoading.user" class="mx-1">
      <v-skeleton-loader type="button"/>
    </div>

    <v-btn v-else id="kt_quick_user_toggle" v-b-tooltip="i18n.t('TOOLTIP.SEE_PROFILE')" :href="quickUserLink()" :large="large"
           :min-width="large ? '' : '36'" class="px-2 mx-md-1" dark depressed text>
      <span class="text-white opacity-70 font-weight-bold font-size-base d-none d-md-inline">{{i18n.t('hi')}}</span>
      <span class="text-white opacity-90 font-weight-bolder font-size-base d-none d-md-inline mx-2">
        {{ userName }}
      </span>
      <span class="symbol symbol-35"><img :src="userImage" alt="user-default"></span>
    </v-btn>
  </div>
</template>

<script>
import {LOGOUT} from "@/core/services/store/auth.module";
import KTLayoutQuickUser from "@/assets/js/layout/extended/quick-user.js";
import {mapGetters} from 'vuex'
import i18n from "../../../plugins/EasyModal/i18n";

export default {
  name: "KTQuickUser",
  data(){
    return{i18n}
  },
  props: {
    large: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    KTLayoutQuickUser.init(this.$refs["kt_quick_user"]);
  },
  computed: {
    ...mapGetters('ribbon', ['user', 'DLoading']),
    userImage() {
      return this.user?.image
          ? 'http://api.terminalads.com/storage/' + this.user.image
          : require('../../../assets/img/user_avatar.jpeg')
    },
    userName() {
      return this.user?.name || i18n.t('user')
    }
  },

  methods: {
    onLogout() {
      this.$store
          .dispatch(LOGOUT)
          .then(() => window.location.replace(`${this.$sarveLandFront}`));
    },
    quickUserLink() {
      return `${this.front_url}/#/profile/my-profile`
    }
  }
};
</script>

<style lang="scss" scoped>
#kt_quick_user {
  overflow: hidden;
}
</style>

<style scoped>
@media screen and (max-width: 960px) {
  .symbol.symbol-35 >>> img {
    height: 28px !important;
  }
}

.symbol-35 {
  box-shadow: -3px -3px 10px 5px rgba(255, 255, 255, .3), 0 0 5px 2px rgba(255, 255, 255, .5);
}
</style>
