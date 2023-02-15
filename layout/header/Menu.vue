<template>
    <div>
        <ul class="menu-nav has-background">

            <li class="menu-item">
                <a :href="homeLink()" class="menu-link" aria-haspopup="true" data-menu-toggle="hover">
                    <span class="menu-text"><i class="fas fa-home fa-2x home-icon-color"></i></span>
                </a>
            </li>

            <router-link to="/dashboard" v-slot="{ href, navigate, isActive, isExactActive }">
                <li aria-haspopup="true" data-menu-toggle="hover" class="menu-item"
                    :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']">
                    <a :href="href" class="menu-link" @click="navigate">
                        <span class="menu-text">داشبورد</span>
                    </a>
                </li>
            </router-link>

            <li v-for="(menu, i) in topMenus" :key="i" v-if="!menu.parent_id"
                aria-haspopup="true" :data-menu-toggle="!menu.parent_id ? 'hover' : 'click'"
                :class="[ !menu.parent_id ? 'menu-item ' : 'menu-item menu-item-submenu menu-item-open-dropdown', { 'menu-item-active': hasActiveChildren(menu.slug) }]">

                <router-link v-if="!menu.children" :to="`/${menu.slug}`"
                             v-slot="{ href, navigate, isActive, isExactActive }">
                    <a :href="menu.slug.startsWith('http') ? menu.slug : `/#${menu.slug}`" class="menu-link">
                        <span class="menu-text"> {{ menu.name }} </span>
                    </a>
                </router-link>

                <span v-else class="menu-link menu-toggle noBackground">
                    <span class="menu-text">{{ menu.name }}</span>
                </span>

                <div v-if="menu.children && menu.children.length !== 0" class="menu-submenu menu-submenu-fixed">
                    <div class="menu-subnav megamenu" style="max-width: 1000px;">
                        <ul class="menu-content">
                            <li class="menu-item">
                                <h3 class="menu-heading menu-toggle">
                                    <i class="menu-bullet menu-bullet-dot"><span></span></i>
                                    <span class="menu-text"> {{ menu.name }}</span>
                                    <i class="menu-arrow"></i>
                                </h3>

                                <!--                                        child or a slug is required to do so the following jobs -->
                                <ul class="menu-inner">
                                    <router-link v-for="(child, j) in menu.children" :key="j" :to="`/${child.slug}`"
                                                 v-slot="{ href, navigate, isActive, isExactActive }">
                                        <li aria-haspopup="true" class="menu-item"
                                            :class="[ isActive && 'menu-item-active', isExactActive && 'menu-item-active' ]">
                                            <a :href="href" class="menu-link" @click="navigate">
                                                <i class="menu-bullet menu-bullet-dot"><span></span></i>
                                                <span class="menu-text"> {{ child.name }} </span>
                                            </a>
                                        </li>
                                    </router-link>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    name: "KTMenu",
    computed: {
        ...mapGetters("ribbon", ["menus"]),
        topMenus() {
            let menu = this.menus.filter((menu) => menu.special === 1);
            return menu = menu.concat(this.config.static_top_menu)
        }
    },
    methods: {
        homeLink() {
            return process.env.VUE_APP_HOME_URL;
        },
        hasActiveChildren(match) {
            return this.$route["path"].indexOf(match) !== -1;
        }
    }
};
</script>

<style scoped>
.noBackground {
    background: none !important;
}
</style>

<style>
.fa-home {
    color: #6cdb72;
}

body[data-scrolltop='on'] .home-icon-color {
    color: #6cdb72;
}

body[data-scrolltop='on'] .has-background .menu-item:hover .menu-link,
body[data-scrolltop='on'] .has-background .menu-item.menu-item-hover .menu-link,
body[data-scrolltop='on'] .has-background .menu-item-active .menu-link {
    background-color: hsla(0, 0%, 100%, 0.1) !important;
}

body[data-scrolltop='on'] .has-background .menu-text {
    color: white !important;
}
</style>

