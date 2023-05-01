<template>
  <div>
    <ul class="menu-nav has-background">

      <li class="menu-item exact-color">
        <a :href="homeLink()" class="menu-link" aria-haspopup="true" data-menu-toggle="hover">
          <span class="menu-text"><i class="fas fa-home fa-2x home-icon-color"></i></span>
        </a>
      </li>

      <li class="menu-item exact-color">
        <v-btn text @click="$root.$emit('openTuts')" dark class="menu-link px-4" aria-haspopup="true"
               data-menu-toggle="hover" height="40" min-width="40">
          <v-icon>mdi-help</v-icon>
        </v-btn>
      </li>

      <router-link to="/dashboard" v-slot="{ href, navigate, isActive, isExactActive }">
        <li aria-haspopup="true" data-menu-toggle="hover" class="menu-item"
            :class="[isActive && 'menu-item-active', isExactActive && 'menu-item-active']">
          <a :href="href" class="menu-link" @click="navigate">
            <span class="menu-text">داشبورد</span>
          </a>
        </li>
      </router-link>

      <li v-for="(menu, i) in topMenus" :key="i" aria-haspopup="true"
          :data-menu-toggle="!menu.parent_id ? 'hover' : 'click'"
          :class="[ !menu.parent_id ? 'menu-item ' : 'menu-item menu-item menu-item-submenu menu-item-open-dropdown', { 'menu-item-active': hasActiveChildren(menu.slug) } ]">

        <a v-if="!menu.children" :href="itemSlug(menu.slug)" class="menu-link">
          <span class="menu-text"> {{ menu.name }} </span>
        </a>

        <v-menu v-else open-on-hover offset-y close-on-click>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text dark v-bind="attrs" v-on="on" class="menu-link font-weight-normal">
              {{ menu.name }}
            </v-btn>
          </template>

          <v-card flat>
            <h3 class="px-2 pt-3 font-size-h6">
              {{ menu.name }}
            </h3>
            <v-list>
              <v-list-item light v-for="(child, j) in menu.children" :key="j" :to="`/${child.slug}`"
                           style="min-height: 32px" class="menu-link px-4">
                <v-list-item-icon style="margin-left: 16px" class="my-3">
                  <v-icon color="grey">mdi-circle-small</v-icon>
                </v-list-item-icon>
                <v-list-item-title v-text="child.name" class="py-2"/>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </li>
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
    ...mapGetters("ribbon", ["menus"]),
    topMenus() {
      let menu = this.menus.filter((menu) => menu.special === 1);
      return menu = menu.concat(this.DConfigs.static_top_menu)
    }
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

