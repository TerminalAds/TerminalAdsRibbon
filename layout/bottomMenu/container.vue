<template>
  <div class="bottom-btn-group-row">
    <v-btn-toggle v-model="toggle_exclusive" class="button-btn-group" group mandatory>
      <div v-for="(item, i) in btnGroup" :key="i" class="btn-toggle-holder">
        <v-btn v-if="item.index === 2" :aria-label="i18n.t(item.title)" :href="item.link" absolute class="rounded-pill"
               color="white" depressed fab height="48" min-width="48" style="top: 50%; transform: translateY(-50%)"
               width="48" @click="handleCLick(item, i)">
          <v-icon color="green">mdi-{{ item.icon }}</v-icon>
        </v-btn>

        <v-btn v-else-if="item.link" :aria-label="i18n.t(item.title)" :href="typeof item.link === 'string' ? item.link : ''"
               class="rounded-pill" color="white" depressed height="32" min-width="32" text width="32"
               @click="handleCLick(item, i)">
          <v-icon>mdi-{{ item.icon }}</v-icon>
        </v-btn>

        <component :is="item.component" v-else :icon="item.icon">
          <v-btn :aria-label="i18n.t(item.title)" class="rounded-pill" color="white" depressed height="32" min-width="32" text
                 width="32" @click="index = i">
            <v-icon>mdi-{{ item.icon }}</v-icon>
          </v-btn>
        </component>

        <span :class="item.index === index ? 'd-none' : ''" class="pt-1 white--text menu-subtitle">
          {{ i18n.t(item.title) }}
        </span>
      </div>
    </v-btn-toggle>
  </div>
</template>

<script>
import MoreButton from "./moreButton";
import NotifyMenu from "./notifyMenu";

export default {
  name: "BottomMenuContainer",

  components: {MoreButton, NotifyMenu},

  data: () => ({
    toggle_exclusive: 2,
    btnGroup: [],
    width: 0,
    index: 2,
    i18n
  }),

  mounted() {
    this.btnGroup = [
      {link: this.handleMenu, icon: 'menu-open', title: 'MENU_ITEMS.TEXT_INPUT', index: 0},
      {link: this.handleHelp, icon: 'help', title: 'BUTTON.GUIDE', index: 1},
      {link: 'https://core.terminalads.com', icon: 'home', title: 'HOME', index: 2},
      {link: null, icon: 'bell', title: 'notification.text', component: 'NotifyMenu', index: 3},
      {link: null, icon: 'dots-vertical', title: 'BUTTONS.FROM_FILE', component: 'MoreButton', index: 4},
    ]
  },

  methods: {
    handleCLick(item, i) {
      this.index = i
      if (typeof item.link === 'function') {
        let btn = document.createElement('button')
        btn.addEventListener('click', item.link)
        btn.click()
        btn.removeEventListener('click', item.link)
        btn.remove()
      } else
        return null
    },

    handleHelp() {
      this.$root.$emit('openTuts')
    },

    handleMenu() {
      this.toggleMobileMenu()
    }
  },
}
</script>

<style scoped>
.bottom-btn-group-row {
  background: linear-gradient(to right, #0051CE, #0BB7AF);
  overflow-x: hidden;
  height: 62px;
  position: fixed;
  bottom: 0;
  z-index: 100;
  left: 0;
  right: 0;
  width: 100%;
  border-radius: 12px 12px 0 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-shadow: 0 -5px 15px 5px rgba(0, 0, 0, .25), 0 -5px 10px 0 rgba(0, 0, 0, .05);
  max-width: 100vw;
}

.button-btn-group {
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: space-around;
  padding-bottom: 3px;
  align-self: center;
  align-items: center;
}

.btn-toggle-holder {
  position: relative;
  flex: 0 1 auto;
  display: inline-flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

/*.btn-toggle-holder button:before {*/
/*    display: none;*/
/*}*/

.btn-toggle-holder :deep(.v-item--active) {
  transition: all .2s ease-in;
  transform: translateY(8px);
  color: var(--v-primary-base) !important;
  caret-color: var(--v-primary-base) !important;
}

.btn-toggle-holder span {
  font-size: .7em;
  line-height: .9rem;
  color: #9e9e9e;
}
</style>
