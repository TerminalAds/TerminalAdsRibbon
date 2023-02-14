<template>
    <div :test="isShowNav" :test2="isShowMobile">

        <v-navigation-drawer v-model="navShow" absolute fixed temporary
                             right style="position: fixed;top : 0;left: 0;z-index: 999">
            <Menu/>
        </v-navigation-drawer>

        <v-dialog v-model="mobileShow" fullscreen hide-overlay transition="dialog-bottom-transition"
                  style="position: fixed">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="mobileShow = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Settings</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-list three-line subheader>
                    <v-subheader>User Controls</v-subheader>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>Content filtering</v-list-item-title>
                            <v-list-item-subtitle>Set the content filtering level to restrict apps that can be
                                downloaded
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>Password</v-list-item-title>
                            <v-list-item-subtitle>Require password for purchase or use password to restrict purchase
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list three-line subheader>
                    <v-subheader>General</v-subheader>
                    <v-list-item>

                        <v-list-item-content>
                            <v-list-item-title>Notifications</v-list-item-title>
                            <v-list-item-subtitle>Notify me about updates to apps or games that I downloaded
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>

                        <v-list-item-content>
                            <v-list-item-title>Sound</v-list-item-title>
                            <v-list-item-subtitle>Auto-update apps at any time. Data charges may apply
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>

                        <v-list-item-content>
                            <v-list-item-title>Auto-add widgets</v-list-item-title>
                            <v-list-item-subtitle>Automatically add home screen widgets</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-dialog>

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
            admins: [
                ['Management', 'mdi-account-multiple-outline'],
                ['Settings', 'mdi-cog-outline'],
            ],
            cruds: [
                ['Create', 'mdi-plus-outline'],
                ['Read', 'mdi-file-outline'],
                ['Update', 'mdi-update'],
                ['Delete', 'mdi-delete'],
            ],
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