<template>
  <v-row class="fill-height" no-gutters>
    <v-col v-if="dashboardIntro && $vuetify.breakpoint.lgAndUp" class="pa-2" cols="12">
      <user-pack/>
    </v-col>

    <v-col v-else class="pa-2" cols="12" lg="12" md="6">
      <div class="card card-custom card-body fill-height pt-4 px-6">
        <v-row no-gutters>
          <v-col cols="7">
            <h6 class="text-dark font-weight-bolder line-height-lg"
                style="font-size: 11pt">
              {{ i18n.t('ticket.text') }}
            </h6>
            <p class="mt-5">
              <a class="text-dark" href="https://core.terminalads.com/#/tickets/create"
                 target="_blank">
                <span style="font-size: 7pt">{{i18n.t('ticker.help')}}</span>
                <br>
                <span class="btn btn-info py-1 mt-21">{{i18n.t('ticker.register')}}</span>
              </a>
            </p>
          </v-col>
          <v-col cols="5">
            <img alt="" src="../../assets/img/customer-service.png"
                 style="width: 100%;object-fit: contain"/>
          </v-col>
        </v-row>
      </div>
    </v-col>

    <v-col class="pa-2" cols="12" lg="6" md="3" sm="6">
      <a :href="DConfigs.dashboardConfig.announcement.url"
         :style="`background-image: url(${DConfigs.dashboardConfig.announcement.img})`"
         class="card card-custom cursor-pointer">
        <div class="card-body pe-1">
          <div class="text-dark font-weight-bolder font-size-h2 mt-20"
               v-text="price(announcement)"/>
          <p class="black--text">{{ DConfigs.dashboardConfig.announcement.text }}</p>
        </div>
      </a>
    </v-col>

    <v-col class="pa-2" cols="12" lg="6" md="3" sm="6">
      <a :href="DConfigs.dashboardConfig.numbers.url"
         :style="`background-image: url(${DConfigs.dashboardConfig.numbers.img})`"
         class="card ribbon card-custom">
        <div class="card-body pe-1">
          <div class="text-dark font-weight-bolder font-size-h2 mt-20" v-text="price(numbers)"/>
          <p class="black--text" v-text="DConfigs.dashboardConfig.numbers.text"/>
        </div>
      </a>
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters} from "vuex";
import UserPack from "./userPack.vue";
import i18n from "../../plugins/EasyModal/i18n";

export default {
  name: "ticketInfo",
  components: {UserPack},
  data() {
    return {
      strokeColor: "#f86573",
      chartOptions: {},
      panelInfo: [],
      announcement: '-',
      numbers: '-',
      series: [
        {
          name: "Net Profit",
          data: [20, 22, 30, 28, 25, 26, 30, 28, 22, 24, 25, 35]
        }
      ],
      i18n
    }
  },

  computed: {
    ...mapGetters(["layoutConfig"]),
    ...mapGetters('ribbon', ['dashboardIntro']),
  },

  mounted() {
    typeof this.DConfigs.dashboardConfig.counter === "function"
      ? this.DConfigs.dashboardConfig.counter()
        .then(res => {
          this.announcement = res.announcement
          this.numbers = res.numbers
        })
      : this.DConfigs.dashboardConfig.counter
        .then(res => {
          this.announcement = res.announcement
          this.numbers = res.numbers
        });

  }
}
</script>

<style scoped>
.card-custom {
  height: 100%;
  min-height: 165px;
  background-size: 50%;
  background-color: rgb(245, 245, 245);
}
</style>