<template>
  <v-menu offset-y top @input="closeMenu" nudge-top="10">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <slot name="default"/>
      </div>
    </template>

    <v-list width="200">
      <v-list-item :href="quLink">
        <v-list-item-avatar>
          <KTQuickUser :large="false" ref="quickUser" @hook:mounted="childMounted"/>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            {{ i18n.t('hi') }} {{ username }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="clickOnExit">
        <v-list-item-icon class="me-4 ms-1">
          <KTExitButton ref="exitBtn"/>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            {{i18n.t('exit')}}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import KTQuickUser from "../extras/offcanvas/QuickUser";
import {mapGetters} from 'vuex'
import KTExitButton from "../header/ExitButton";
import i18n from "../../plugins/EasyModal/i18n";

export default {
  name: "MoreButton",
  components: {KTExitButton, KTQuickUser},
  props: {
    icon: String
  },
  computed: {
    ...mapGetters('ribbon', ['user']),
    username() {
      return this.user?.name || 'کاربر عزیز'
    }
  },
  data: () => ({
    quLink: null,
    i18n
  }),
  methods: {
    closeMenu(e) {

    },
    childMounted() {
      this.quLink = this.$refs.quickUser.quickUserLink()
    },
    clickOnExit() {
      let btn = document.createElement('button')
      btn.addEventListener('click', this.$refs.exitBtn.onLogout);
      btn.click()
      btn.removeEventListener('click', this.$refs.exitBtn.onLogout)
      btn.remove()
    }
  }
}
</script>

<style scoped>

</style>
