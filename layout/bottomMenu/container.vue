<template>
  <v-row no-gutters class="bottom-btn-group-row">

    <v-btn-toggle group v-model="toggle_exclusive" class="button-btn-group">

      <div v-for="(item, i) in btnGroup" :key="i" class="btn-toggle-holder">
        <v-btn v-if="item.link" :href="typeof item.link === 'string' ? item.link : ''" @click="handleCLick(item)"
               class="rounded-pill" depressed height="32" min-width="32" width="32" text :aria-label="item.title"
               :color="toggle_exclusive === i ? 'primary' : 'grey darken-2'">
          <v-icon>mdi-{{ item.icon }}</v-icon>
        </v-btn>

        <component v-else :is="item.component" :icon="item.icon">
          <v-btn class="rounded-pill" depressed height="32" min-width="32" width="32" text :aria-label="item.title"
                 :color="toggle_exclusive === i ? 'primary' : 'grey darken-2'">
            <v-icon>mdi-{{ item.icon }}</v-icon>
          </v-btn>
        </component>

        <span class="pt-1" :class="toggle_exclusive === i ? 'primary--text' : ''">{{ item.title }}</span>
      </div>
    </v-btn-toggle>

  </v-row>
</template>


<script>
// import SvgWrapper from "@/components/fragments/svgWrapper";
import MoreButton from "./moreButton";
import NotifyMenu from "./notifyMenu";
// import CustomerLinks from "@/components/assets/customerLinks";

export default {
  name: "BottomMenuContainer",

  components: {MoreButton, NotifyMenu},

  data: () => ({
    toggle_exclusive: undefined,
    btnGroup: [],
    width: 0
  }),

  mounted() {
    setTimeout(() => {
      this.setToggle(this.$route.path);
    }, 500)

    this.btnGroup = [
      {link: 'https://core.terminalads.com', icon: 'home', title: 'خانه'},
      {link: this.handleMenu, icon: 'menu', title: 'منو'},
      {link: null, icon: 'bell', title: 'اعلانات', component: 'NotifyMenu'},
      {link: this.handleHelp, icon: 'help', title: 'راهنما'},
      {link: null, icon: 'dots-vertical', title: 'بیشتر', component: 'MoreButton'},
    ]
  },

  watch: {
    '$route.path': function (val) {
      this.setToggle(val);
    },
    toggle_exclusive: function (val) {
      // this.itemClick(val)
    },
  },

  methods: {
    setToggle(route) {
      if (route === '/') {
        this.toggle_exclusive = 3;
      } else if (route.includes('/core')) {
        this.toggle_exclusive = 2;
      } else if (route.includes('/profile')) {
        this.toggle_exclusive = 1;
      } else {
        this.toggle_exclusive = 0;
      }
    },

    handleCLick(item) {
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
  background-color: white;
  overflow: hidden;
  height: 55px;
  position: fixed;
  bottom: 6px;
  z-index: 500;
  left: 50%;
  width: calc(100% - 12px);
  border-radius: 12px;
  transform: translateX(-50%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-shadow: 0 -5px 15px 5px rgba(0, 0, 0, .25),
  0 -5px 10px 0 rgba(0, 0, 0, .05);
}

.button-btn-group {
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: space-around;
  padding-bottom: 3px;
}

.btn-toggle-holder {
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

.btn-toggle-holder.v-item--active button {
  /*transition: all .2s ease-in;*/
  /*transform: translateY(8px);*/
  color: var(--v-primary-base);
}

.btn-toggle-holder span {
  font-size: .7em;
  line-height: .9rem;
  color: #9e9e9e;
}
</style>
