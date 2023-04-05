<template>
  <v-navigation-drawer floating permanent mini-variant class="railNav mx-3">
    <v-list nav dense class="d-flex flex-column justify-center rounded-xl" color="rgba(3,3,3,0.50)">

      <v-list-item v-for="(item, i) in links" :key="i" link active-class="rail-blue-active"
                   class="active d-flex align-center justify-center"
                   :href="item.type !== 'btn' ? item.href : ''"
                   @click="handleClick(item)" target="_blank"
                   v-if="item.limit ? ribbon_can(item.limit) : true">
        <v-tooltip nudge-right="8" right>
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-if="item.type === 'icon' || item.type === 'btn'" v-on="on" v-bind="attrs" color="#FED402">
              mdi-{{ item.icon }}
            </v-icon>

            <v-img v-else :src="item.icon" v-on="on" v-bind="attrs" contain class="nav-img"/>
          </template>
          <span class="text-no-wrap" v-text="item.title"/>
        </v-tooltip>
      </v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "RailNavigation",

  data: () => ({
    links: []
  }),

  mounted() {
    this.links = [
      {
        title: 'راهنما',
        href: this.handleHelp,
        icon: 'help',
        type: 'btn',
        limit: false
      }, {
        title: 'تماس باما',
        href: 'https://terminalads.com/contact',
        icon: 'headset',
        type: 'icon',
        limit: false
      }, {
        title: 'ارسال پیامک',
        href: 'https://core-sms.terminalads.com',
        icon: require('../../assets/img/logo/sms.png'),
        type: 'svg',
        limit: false
      }, {
        title: 'آگهی تبلیغاتی',
        href: 'https://core-robot.terminalads.com',
        icon: require('../../assets/img/logo/robot.png'),
        type: 'svg',
        limit: false
      }, {
        title: 'بانک اطلاعاتی',
        href: 'https://core-info.terminalads.com',
        icon: require('../../assets/img/logo/info.png'),
        type: 'svg',
        limit: false
      }, {
        title: 'پشتیبانی سایت',
        href: 'https://core-digi.terminalads.com',
        icon: require('../../assets/img/logo/site.png'),
        type: 'svg',
        limit: false
      }
      // {
      //   title: 'تیکت',
      //   href: 'https://core.terminalads.com/#/tickets/create',
      //   icon: 'comments',
      //   type: 'icon',
      //   limit: false
      // }, {
      //   title: 'فرصت های همکاری',
      //   href: 'https://terminalads.com/%d8%b9%d8%a7%d9%85%d9%84%db%8c%d8%aa-%d9%81%d8%b1%d9%88%d8%b4/',
      //   icon: 'handshake',
      //   type: 'icon',
      //   limit: false
      // }, {
      //   title: 'درباره ما',
      //   href: 'https://terminalads.com/about',
      //   icon: 'info-circle',
      //   type: 'icon',
      //   limit: false
      // }
    ]
  },

  methods: {
    handleClick(item) {
      console.log('event: ', item)
      if (item.type === 'btn') {
        let btn = document.createElement('button');
        btn.addEventListener('click', item.href)
        btn.click()
        btn.removeEventListener('click', item.href);
        btn.remove()
      } else
        return null
    },

    handleHelp() {
      this.$root.$emit('openTuts')
    }
  }
}
</script>

<style scoped>
.railNav {
  position: fixed;
  z-index: 1;
  left: 0;
  background: transparent !important;
}

.railNav >>> .v-navigation-drawer__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  transform: translateY(25%);
  transition: all .8s ease-out;
}

body[data-scrolltop="on"] .railNav >>> .v-navigation-drawer__content {
  transform: translateY(-10%);
}
</style>