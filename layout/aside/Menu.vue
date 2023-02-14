<template>
    <v-list dark>
        <v-list-item-group v-model="active">
            <v-list-item @click="toggleMobileMenu()">
                <v-list-item-content>
                    <div class="text-center">
                        <img alt="Logo" :src="config.header_logo" class="logo-default max-h-40px"/>
                    </div>
                </v-list-item-content>
                <v-list-item-action>
                    <a href="#" class="btn btn-xs btn-icon btn-light btn-hover-danger">
                        <i class="ki ki-close icon-xs text-muted"></i>
                    </a>
                </v-list-item-action>
            </v-list-item>

            <v-divider style="background-color: rgba(255, 255, 255, .3)"/>

            <router-link to="/home" v-slot="{ href, navigate, isActive, isExactActive }">
                <a :href="homeLink()">
                    <v-list-item link color="primary">
                        <v-list-item-icon class="mr-2">
                            <v-icon color="#6cdb72">mdi-home</v-icon>
                        </v-list-item-icon>

                        <v-list-item-title class="mr-2 text-white"> خانه</v-list-item-title>
                    </v-list-item>
                </a>
            </router-link>

            <router-link to="/dashboard">
                <v-list-item link color="primary">
                    <v-list-item-icon class="mr-2">
                        <v-icon color="#6cdb72">widgets</v-icon>
                    </v-list-item-icon>

                    <v-list-item-title class="mr-2 text-white">داشبورد</v-list-item-title>
                </v-list-item>
            </router-link>

            <router-link v-for="(item, i) in items" :to="`/${item.slug}`" :key="i"
                         v-slot="{ href, navigate, isActive, isExactActive }">
                <div v-if="!item.children" class="w-100">
                    <a :href="href === '#/' ? '' : href" class="w-100">
                        <v-list-item link dark>
                            <v-list-item-icon class="mr-2">
                                <v-icon v-if="item.icon" color="#fff">{{ item.icon }}</v-icon>
                                <v-icon v-else color="#fff">mdi-circle-small</v-icon>
                            </v-list-item-icon>

                            <v-list-item-title class="mr-2 text-white">{{ item.name }}</v-list-item-title>
                        </v-list-item>
                    </a>
                </div>

                <v-list-group v-else>
                    <template v-slot:activator>
                        <v-list-item dark class="pr-0">
                            <v-list-item-icon class="mr-2">
                                <v-icon v-if="item.icon" color="#fff">{{ item.icon }}</v-icon>
                                <v-icon v-else color="#fff">mdi-circle-small</v-icon>
                            </v-list-item-icon>

                            <v-list-item-title class="mr-2 text-white">{{ item.name }}</v-list-item-title>
                        </v-list-item>
                    </template>


                    <v-list-item dark v-for="(ch1, j) in item.children" :key="j" no-action sub-group>
                        <router-link :to="`/${ch1.slug}`" v-slot="{ href, navigate, isActive, isExactActive }">

                            <div v-if="!ch1.children" class="w-100">
                                <a :href="href === '#/' ? '' : href" class="w-100">
                                    <v-list-item link dark>
                                        <v-list-item-icon class="mr-2">
                                            <v-icon v-if="item.icon" color="#fff">{{ ch1.icon }}</v-icon>
                                            <v-icon v-else color="#fff" x-small>mdi-minus</v-icon>
                                        </v-list-item-icon>

                                        <v-list-item-title class="mr-2 text-white">{{ ch1.name }}</v-list-item-title>
                                    </v-list-item>
                                </a>
                            </div>

                            <v-list-group v-else>
                                <template v-slot:activator>
                                    <v-list-item dark>
                                        <v-list-item-icon class="mr-2">
                                            <v-icon v-if="ch1.icon" color="#fff">{{ ch1.icon }}</v-icon>
                                            <v-icon v-else color="#fff">mdi-circle-small</v-icon>
                                        </v-list-item-icon>

                                        <v-list-item-title class="mr-2 text-white">{{ ch1.name }}</v-list-item-title>
                                    </v-list-item>
                                </template>


                                <v-list-group no-action sub-group>
                                    <router-link v-for="(ch2, x) in ch1.children" :key="x"
                                                 :to="`/${ch2.slug?ch2.slug:'#'}`"
                                                 v-slot="{ href, navigate, isActive, isExactActive }">

                                        <div v-if="!ch2.children" class="w-100">
                                            <a :href="href === '#/' ? '' : href" class="w-100">
                                                <v-list-item link dark>
                                                    <v-list-item-icon class="mr-2">
                                                        <v-icon v-if="ch2.icon">{{ item.icon }}</v-icon>
                                                        <v-icon v-else>mdi-circle-small</v-icon>
                                                    </v-list-item-icon>

                                                    <v-list-item-title class="mr-2}">{{ ch2.name }}</v-list-item-title>
                                                </v-list-item>
                                            </a>
                                        </div>

                                    </router-link>
                                </v-list-group>

                            </v-list-group>
                        </router-link>

                    </v-list-item>
                </v-list-group>

            </router-link>
        </v-list-item-group>

    </v-list>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {reformatMenuResponse} from "../../assets/js/MenuFunctions";

export default {
    name: "AsideMenu",
    data() {
        return {
            active: 0,
            items: [],
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
        ...mapGetters(["layoutConfig", "getClasses"]),
        ...mapGetters("ribbon", ["menus"]),
    },
    mounted() {
        this.getMenus();
    },
    methods: {
        ...mapActions("ribbon", ["setMenus"]),
        getMenus() {
            this.$DashboardAxios.get('/api/core/menus')
                .then(({data}) => {
                    // this.items = data.data;
                    this.items = reformatMenuResponse(data.data);
                    this.setMenus(reformatMenuResponse(data.data));
                })
                .catch(() => this.$toast.error('خطایی رخ داده است.'))
        },
        homeLink() {
            return process.env.VUE_APP_HOME_URL || '/';
        }
    }
};
</script>
