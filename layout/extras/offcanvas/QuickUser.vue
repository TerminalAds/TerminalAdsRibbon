<template>
    <div class="topbar-item">
        <v-btn :href="`${front_url}/#/profile/my-profile`" id="kt_quick_user_toggle" large depressed text dark
               class="px-2 mx-md-1">
            <span class="text-white opacity-70 font-weight-bold font-size-base d-none d-md-inline">سلام</span>
            <span class="text-white opacity-90 font-weight-bolder font-size-base d-none d-md-inline mx-2">
                {{ userName }}
            </span>
            <span class="symbol symbol-35">
                <img :src="'http://api.terminalads.com/' + userImage" alt="user-default">
            </span>
        </v-btn>
    </div>
</template>

<style lang="scss" scoped>
#kt_quick_user {
  overflow: hidden;
}
</style>

<script>
import {LOGOUT} from "@/core/services/store/auth.module";
import KTLayoutQuickUser from "@/assets/js/layout/extended/quick-user.js";
import KTOffcanvas from "@/assets/js/components/offcanvas.js";
import {mapGetters} from 'vuex'

export default {
    name: "KTQuickUser",
    mounted() {
        KTLayoutQuickUser.init(this.$refs["kt_quick_user"]);
    },
    methods: {
        onLogout() {
            this.$store
                .dispatch(LOGOUT)
                .then(() => window.location.replace(`${this.$sarveLandFront}`));
        },
        closeOffcanvas() {
            new KTOffcanvas(KTLayoutQuickUser.getElement()).hide();
        }
    },
    computed: {
        ...mapGetters('ribbon', ['user']),
        userImage() {
            return this.user?.image && this.user.image !== 'avatar/blank.jpg'
                ? 'storage/' + this.user.image
                : 'avatar/blank.jpg'
        },
        userName() {
            return this.user?.name || 'کاربر عزیز'
        }
    },

};
</script>

<style scoped>
.symbol-35 {
    box-shadow: -3px -3px 10px 5px rgba(255, 255, 255, .3), 0 0 5px 2px rgba(255, 255, 255, .5);
}
</style>
