<template>
  <v-navigation-drawer class="railNav mx-3" floating mini-variant permanent>
    <v-list class="d-flex flex-column justify-center rounded-xl" color="rgba(3,3,3,0.50)" dense nav>

      <v-list-item v-for="(item, i) in links" v-if="item.limit ? ribbon_can(item.limit) : true" :key="i"
                   :href="item.type !== 'btn' ? item.href : ''" active-class="rail-blue-active"
                   class="active d-flex align-center justify-center" link target="_blank"
                   @click="handleClick(item)">
        <v-tooltip nudge-right="8" right>
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-if="item.type === 'icon' || item.type === 'btn'" v-bind="attrs" v-on="on" color="#FED402">
              mdi-{{ item.icon }}
            </v-icon>

            <v-img v-else v-bind="attrs" v-on="on" :src="item.icon" class="nav-img" contain/>
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
    let token = localStorage.getItem('id_token')

    this.links = [
      {
        title: 'تماس باما',
        href: 'https://terminalads.com/contact',
        icon: 'headset',
        type: 'icon',
        limit: false
      }, {
        title: 'کیوآر لند',
        href: `https://core-qr.terminalads.com/?token=${token}`,
        icon: require('../../assets/img/logo/qrland.png'),
        type: 'svg',
        limit: false
      }, {
        title: 'پیامک لند',
        href: `https://core-sms.terminalads.com/?token=${token}`,
        icon: require('../../assets/img/logo/sms.png'),
        type: 'svg',
        limit: false
      }, {
        title: 'ربات لند',
        href: `https://core-robot.terminalads.com/?token=${token}`,
        icon: require('../../assets/img/logo/robot.png'),
        type: 'svg',
        limit: false
      }, {
        title: 'اینفو لند',
        href: `https://core-info.terminalads.com/?token=${token}`,
        icon: require('../../assets/img/logo/info.png'),
        type: 'svg',
        limit: false
      }, {
        title: 'بست وب لند',
        href: `https://core-digi.terminalads.com/?token=${token}`,
        icon: require('../../assets/img/logo/site.png'),
        type: 'svg',
        limit: false
      }
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