<template>
    <div :test="isShowNav" :test2="isShowMobile">
        <v-navigation-drawer v-model="navShow" absolute fixed temporary
                             right style="position: fixed;top : 0;left: 0;z-index: 999">
            <Menu :visible="navShow"/>
        </v-navigation-drawer>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import Menu from './Menu'

export default {
    name: "Navigation",
    components: {Menu},
    data() {
        return {
            navShow: false,
            mobileShow: false,
        }
    },
    computed: {
        ...mapGetters(['menu/isShow', 'menu/isMobileShow']),
        isShowNav() {
            let showing = this['menu/isShow'];
            this.navShow = showing;
            return showing;
        },
        isShowMobile() {
            let showing = this['menu/isMobileShow'];
            this.mobileShow = showing;
            return showing;
        }
    },
    watch: {
        navShow() {
            this.$store.dispatch('menu/isShow', this.navShow)
        },
        mobileShow() {
            this.$store.dispatch('menu/isMobileShow', this.mobileShow)
        }
    }
}
</script>

<style>
.v-overlay__scrim {
    position: fixed;
    top: 0;
    left: 0;

}
</style>