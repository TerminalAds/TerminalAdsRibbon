<template>
    <div class="topbar-item">
        <v-btn :href="`${front_url}/#/profile/my-profile`" id="kt_quick_user_toggle" large depressed text dark
               class="px-2 mx-md-1">
            <span class="text-white opacity-70 font-weight-bold font-size-base d-none d-md-inline">سلام</span>
            <span class="text-white opacity-90 font-weight-bolder font-size-base d-none d-md-inline mx-2">
            {{ user.name }}
            </span>
            <span class="symbol symbol-35">
<!--        <span v-if="user.name" class="symbol-label text-white font-size-h5 font-weight-bold bg-white-o-30"-->
                <!--              v-text="user.name.charAt(0).toUpperCase()"/>-->
                <img src="http://api.terminalads.com/avatar/blank.jpg" alt="user-default">
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

export default {
    name: "KTQuickUser",
    data() {
        return {
            balance: null,
            list: [
                {
                    title: "Another purpose persuade",
                    desc: "Due in 2 Days",
                    alt: "+28%",
                    svg: "media/svg/icons/Home/Library.svg",
                    type: "warning"
                },
                {
                    title: "Would be to people",
                    desc: "Due in 2 Days",
                    alt: "+50%",
                    svg: "media/svg/icons/Communication/Write.svg",
                    type: "success"
                },
                {
                    title: "Purpose would be to persuade",
                    desc: "Due in 2 Days",
                    alt: "-27%",
                    svg: "media/svg/icons/Communication/Group-chat.svg",
                    type: "danger"
                },
                {
                    title: "The best product",
                    desc: "Due in 2 Days",
                    alt: "+8%",
                    svg: "media/svg/icons/General/Attachment2.svg",
                    type: "info"
                }
            ]
        };
    },

    mounted() {
        // Init Quick User Panel
        KTLayoutQuickUser.init(this.$refs["kt_quick_user"]);
        // this.checkWallet();
        // this.user = this.getUser()
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
        // ...mapGetters({
        //   getUser: "user",
        // }),
        picture() {
            return process.env.BASE_URL + "media/users/300_21.jpg";
        }
    },

};
</script>
