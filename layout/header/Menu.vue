<template>
  <div>
    <ul class="menu-nav has-background">
      <li class="menu-item exact-color" @click="closeMenuOnClick()">
        <a :href="homeLink()" aria-haspopup="true" class="menu-link" data-menu-toggle="hover">
          <span class="menu-text"><i class="fas fa-home fa-2x home-icon-color"></i></span>
        </a>
      </li>

      <li class="menu-item exact-color" @click="closeMenuOnClick()">
        <v-btn aria-haspopup="true" class="menu-link px-4" dark data-menu-toggle="hover" height="40"
               min-width="40" text @click="$root.$emit('openTuts')">
          <v-icon>mdi-help</v-icon>
        </v-btn>
      </li>

      <router-link v-slot="{ href, navigate, isActive, isExactActive }" to="/dashboard">
        <li :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']" aria-haspopup="true"
            class="menu-item" data-menu-toggle="hover" @click="closeMenuOnClick()">
          <a :href="href" class="menu-link" @click="navigate">
            <span class="menu-text">داشبورد</span>
          </a>
        </li>
      </router-link>

      <div v-if="DLoading.menus" class="d-flex align-center">
        <v-skeleton-loader class="mx-1" type="button"/>
        <v-skeleton-loader class="mx-1" type="button"/>
        <v-skeleton-loader class="mx-1" type="button"/>
      </div>

      <div v-else-if="(!sectionStatus.menus || !topMenus || !topMenus.length) && !hasMenu" class="d-flex align-center">
        <v-btn class="mx-1" dark text @click="$root.$emit('getMenus')">
          دریافت مجدد منو
          <v-icon right>mdi-reload</v-icon>
        </v-btn>
      </div>

      <template v-else>
        <li v-for="(menu, i) in topMenus" :key="i"
            :class="[ !menu.parent_id ? 'menu-item ' : 'menu-item menu-item menu-item-submenu menu-item-open-dropdown', { 'menu-item-active': hasActiveChildren(menu.slug) } ]"
            :data-menu-toggle="!menu.parent_id ? 'hover' : 'click'" aria-haspopup="true">
          <a v-if="!menu.children" :href="itemSlug(menu.slug)" class="menu-link">
            <span class="menu-text"> {{ menu.name }} </span>
          </a>

          <v-menu v-else close-on-click offset-y open-on-hover>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="menu-link font-weight-normal" dark text v-bind="attrs" v-on="on">
                {{ menu.name }}
              </v-btn>
            </template>

            <v-card flat>
              <h3 class="px-2 pt-3 font-size-h6">
                {{ menu.name }}
              </h3>
              <v-list>
                <v-list-item v-for="(child, j) in menu.children" :key="j" :to="`/${child.slug}`" class="menu-link px-4"
                             exact light style="min-height: 32px" @click="closeMenuOnClick()">
                  <v-list-item-icon class="my-3" style="margin-left: 16px">
                    <v-icon color="grey">mdi-circle-small</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title class="py-2" v-text="child.name"/>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import CustomPopup from "../../plugins/popup/customPopup";
import Tutorials from "../../pages/tutorials";

export default {
  name: "KTMenu",

  components: {Tutorials, CustomPopup},

  computed: {
    ...mapGetters("ribbon", ["menus", 'DLoading', 'sectionStatus']),
    ...mapGetters("menu" ["isShow"]),
    hasMenu() {
      return !!this.menus.length
    },
    topMenus() {
      let menu = this.menus.filter((menu) => menu.special === 1);
      return menu = menu.concat(this.DConfigs.static_top_menu)
    },
  },

  methods: {
    homeLink() {
      return this.front_url;
    },
    hasActiveChildren(match) {
      if (!match || match.length <= 0) return false
      return this.$route["path"].indexOf(match) !== -1;
    },
    itemSlug(slug) {
      if (slug && slug.startsWith('http')) {
        return slug
      }
      return '/#/' + slug
    },
    closeMenuOnClick() {
      !this.isShow && this.toggleNavigation()
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

body[data-scrolltop='on'] .has-background :not(.exact-color i, .menu-submenu *) {
  color: white !important;
}
</style>

