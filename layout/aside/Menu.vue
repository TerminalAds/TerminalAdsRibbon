<template>
    <v-list dark v-if="rerender">
        <v-list-item @click="toggleMobileMenu()">
            <v-list-item-content>
                <div class="text-center">
                    <img alt="Logo" :src="DConfigs.header_logo" class="logo-default max-h-40px"/>
                </div>
            </v-list-item-content>
            <v-list-item-action>
                <a href="#" class="btn btn-xs btn-icon btn-light btn-hover-danger">
                    <i class="ki ki-close icon-xs text-muted"></i>
                </a>
            </v-list-item-action>
        </v-list-item>

        <v-divider style="background-color: rgba(255, 255, 255, .3)"/>

        <v-list-item link :href="homeLink()">
            <v-list-item-icon>
                <v-icon color="#6cdb72">mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>خانه</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/dashboard">
            <v-list-item-icon>
                <v-icon color="#6cdb72">widgets</v-icon>
            </v-list-item-icon>
            <v-list-item-title>داشبورد</v-list-item-title>
        </v-list-item>

        <div v-for="(item, i) in items" :key="i" class="group-wrapper">
            <v-list-item link :to="`/${item.slug}`" v-if="!item.children">
                <v-list-item-icon>
                    <v-icon>mdi-circle-small</v-icon>
                </v-list-item-icon>
                <v-list-item-title v-text="item.name"/>
            </v-list-item>

            <v-list-group v-else v-model="item.selectedItem" no-action active-class="active-child"
                          :value="getActive(item)" color="white" @click="item.selectedItem = true">
                <template v-slot:activator>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                </template>

                <v-list-item link v-for="(sub, j) in item.children" :key="j" :to="`/${sub.slug}`"
                             style="padding-right: 32px" color="white">
                    <v-list-item-icon>
                        <v-icon>mdi-menu-left</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title v-text="sub.name"/>
                </v-list-item>
            </v-list-group>
        </div>

    </v-list>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {reformatMenuResponse} from "../../assets/js/MenuFunctions";

export default {
    name: "AsideMenu",
    props: {
        visible: Boolean
    },
    data: () => ({
        items: [],
        rerender: true
    }),
    mounted() {
        this.getMenus();
    },
    computed: {
        ...mapGetters(["layoutConfig", "getClasses"]),
    },
    watch: {
        visible(val) {
            if (!val) {
                this.rerender = false
                this.$nextTick(() => {
                    this.rerender = true
                })
            }
        }
    },
    methods: {
        ...mapActions("ribbon", ["setMenus"]),
        getMenus() {
            this.$DashboardAxios.get('/api/core/menus', {
                params: {
                    sid: this.sid
                }
            }).then(({data}) => {
                const menus = reformatMenuResponse(data.data);
                this.setMenus(data.data);
                this.items = menus;
            })
                .catch(() => this.$toast.error('خطایی رخ داده است.'))
        },
        homeLink() {
            return this.front_url || '/';
        },
        getActive(item) {
            let activate = item.children.map((a) => a.slug).includes(this.$route.path.substring(1));
            return item.selectedItem = activate
        }
    }
}
</script>

<style scoped>
.group-wrapper >>> .active-child {
    background-color: rgba(255, 255, 255, .5);
}
</style>