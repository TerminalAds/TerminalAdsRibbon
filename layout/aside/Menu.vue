<template>
  <v-list v-if="rerender" dark>
    <v-list-item @click="toggleMobileMenu()">
      <v-list-item-content>
        <div class="text-center">
          <img :src="DConfigs.header_logo" alt="Logo" class="logo-default max-h-40px"/>
        </div>
      </v-list-item-content>
      <v-list-item-action>
        <a class="btn btn-xs btn-icon btn-light btn-hover-danger" href="#">
          <i class="ki ki-close icon-xs text-muted"></i>
        </a>
      </v-list-item-action>
    </v-list-item>

    <v-divider style="background-color: rgba(255, 255, 255, .3)"/>

    <v-list-item :href="homeLink()" link @click="toggleMobileMenu()">
      <v-list-item-icon>
        <v-icon color="#6cdb72">mdi-home</v-icon>
      </v-list-item-icon>
      <v-list-item-title>خانه</v-list-item-title>
    </v-list-item>

    <v-list-item link to="/dashboard" @click="toggleMobileMenu()">
      <v-list-item-icon>
        <v-icon color="#6cdb72">widgets</v-icon>
      </v-list-item-icon>
      <v-list-item-title>داشبورد</v-list-item-title>
    </v-list-item>

    <div v-if="DLoading.menus" class="group-wrapper">
      <v-list-item v-for="x in 3" :key="x" @click="toggleMobileMenu()">
        <v-list-item-icon>
          <v-icon>mdi-circle-small</v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          <v-skeleton-loader class="mb-n1" type="text"/>
        </v-list-item-title>
      </v-list-item>
    </div>

    <div v-else-if="!sectionStatus.menus">
      <v-list-item>
        <v-list-item-action>
          <v-btn class="mx-1" dark text @click="$root.$emit('getMenus')">
            دریافت مجدد منو
            <v-icon right>mdi-reload</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </div>

    <template v-else>
      <template v-for="(item, i) in items">
        <div v-if="!!item" :key="`item-${i}`" class="group-wrapper">
          <v-list-item v-if="!item.children" :to="`/${item.slug}`" link @click="toggleMobileMenu()">
            <v-list-item-icon>
              <v-icon>mdi-circle-small</v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="item.name"/>
          </v-list-item>

          <v-list-group v-else v-model="item.selectedItem" :value="getActive(item)" active-class="active-child"
                        color="white" no-action @click="item.selectedItem = true">
            <template v-slot:activator>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </template>

            <v-list-item v-for="(sub, j) in item.children" :key="j" :to="`/${sub.slug}`" color="white" link
                         style="padding-right: 32px" @click="toggleMobileMenu()">
              <v-list-item-icon>
                <v-icon>mdi-menu-left</v-icon>
              </v-list-item-icon>
              <v-list-item-title v-text="sub.name"/>
            </v-list-item>
          </v-list-group>
        </div>
      </template>
    </template>

    <v-list-item :disabled="downloading" link @click="downloadDorsandesk">
      <v-list-item-icon>
        <v-icon color="#6cdb72">mdi-cloud-download-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-title>دانلود دورسان‌دسک</v-list-item-title>
    </v-list-item>
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
    rerender: true,
    downloading: false
  }),

  mounted() {
    this.$root.$on('getMenus', this.getMenus)
    this.getMenus();
  },

  computed: {
    ...mapGetters(["layoutConfig", "getClasses"]),
    ...mapGetters('ribbon', ['DLoading', 'sectionStatus'])
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
    ...mapActions("ribbon", ["setMenus", "toggleLoading", "setSectionStatus"]),
    getMenus() {
      this.toggleLoading({field: 'menus', status: true})

      try {
        this.$DashboardAxios.get('/api/core/menus', {
          params: {
            sid: this.sid
          }
        })
          .then(({data}) => {
            const menus = reformatMenuResponse(data.data);
            this.setMenus(data.data);
            this.setSectionStatus({field: 'menus', status: true})
            this.items = menus;
          })
          .catch(({response}) => {
            this.setSectionStatus({field: 'menus', status: false})
            if (response.status !== 401) {
              this.$toast.error('خطایی رخ داده است.');
            }
          })
          .finally(() => this.toggleLoading({field: 'menus', status: false}))
      } catch (e) {
        this.setSectionStatus({field: 'menus', status: false})
        console.log('catch error: ', e)
      }
    },
    homeLink() {
      return this.front_url || '/';
    },
    getActive(item) {
      let activate = item.children?.map((a) => a.slug).includes(this.$route.path.substring(1));
      return item.selectedItem = activate
    },
    downloadDorsandesk() {
      this.downloading = true

      const el = document.createElement('a')
      el.href = `https://core.terminalads.com/assets/application/DorsanDesk.msi`
      el.setAttribute('download', 'DorsanDesk.msi')
      el.setAttribute('target', '_blank')
      el.click()

      setTimeout(() => {
        this.downloading = false
      }, 2000)
    }
  }
}
</script>

<style scoped>
.group-wrapper >>> .active-child {
  background-color: rgba(255, 255, 255, .5);
}
</style>