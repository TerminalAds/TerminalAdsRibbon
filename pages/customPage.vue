<template>
  <v-card flat>
    <div class="title-wrapper pb-2">
      <terminal_title_ribbon>
        <v-card-title class="justify-end pa-0 flex-nowrap">
          <!--                    <v-btn depressed color="rgba(105, 147, 255, .35)" v-if="tutorialExists" @click="getTutorial"-->
          <v-btn v-if="tutorialExists" v-b-tooltip.hover="'راهنما'" :loading="loading" class="px-0"
                 color="rgb(202,217,255)" depressed min-width="36" @click="tDialog = true">
            <v-icon class="jump" color="#6993ff" small>mdi-help</v-icon>
          </v-btn>

          <v-expand-x-transition>
            <div v-if="showExtraTimer" class="text-nowrap">
              <v-btn v-if="!hasTimer" v-b-tooltip.hover="`شروع: زمان ${timer} دقیقه`" class="px-0"
                     color="rgb(158, 255, 250)"
                     depressed min-width="36" style="margin-right: 8px" @click="startTimer">
                <v-icon color="success">mdi-timer-play-outline</v-icon>
                <!--                    رفرش-->
              </v-btn>

              <v-btn v-b-tooltip.hover="'ویرایش'" class="px-0" color="orange lighten-3"
                     depressed min-width="36" style="margin-right: 8px" @click="autoReloadDialog = true">
                <v-icon color="orange">mdi-pencil</v-icon>
                <!--                    رفرش-->
              </v-btn>

              <v-btn v-if="hasTimer" v-b-tooltip.hover="'لغو'" class="px-0"
                     color="deep-orange lighten-3" depressed min-width="36" style="margin-right: 8px"
                     @click="deleteTimer">
                <v-icon color="deep-orange">mdi-timer-remove-outline</v-icon>
                <!--                    رفرش-->
              </v-btn>
            </div>
          </v-expand-x-transition>

          <v-badge :offset-x="6" :offset-y="6" :value="hasTimer" color="warning" dot left style="margin-right: 8px">
            <v-btn v-b-tooltip.hover="'به‌روزرسانی خودکار'" class="px-0" color="rgb(215,187,227)"
                   depressed min-width="36"
                   @click="() => timerHasTime ? showExtraTimer = !showExtraTimer : autoReloadDialog = true">
              <v-icon color="#7b1fa2">mdi-{{ showExtraTimer ? 'close' : 'timer-refresh-outline' }}</v-icon>
              <!--                    رفرش-->
            </v-btn>
          </v-badge>

          <!--                    <v-btn depressed style="margin-right: 8px" color="rgba(123, 31, 162, .3)"-->
          <v-btn v-b-tooltip.hover="'به‌روزرسانی'" :loading="reloadLoading" class="px-0" color="rgb(215,187,227)"
                 depressed min-width="36" style="margin-right: 8px" @click="reloadPage">
            <v-icon color="#7b1fa2">mdi-reload</v-icon>
            <!--                    رفرش-->
          </v-btn>

          <!--                    <v-btn depressed color="rgba(246, 78, 96, .35)" v-b-tooltip.hover="'بازگشت به صفحه قبلی'"-->
          <v-btn v-b-tooltip.hover="'بازگشت به صفحه قبلی'" class="px-0" color="rgb(252,193,199)"
                 depressed min-width="36" style="margin-right: 8px" @click="$router.back()">
            <v-icon class="text-danger">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
      </terminal_title_ribbon>
    </div>

    <router-view v-if="rerender" v-show="!reloadLoading"/>

    <v-card v-if="reloadLoading" class="d-flex align-center justify-center" flat height="300">
      <atom-spinner :animation-duration="1500" :size="100" class="mx-auto" color="var(--v-primary-base)"/>
    </v-card>

    <custom-popup v-model="tDialog" :cons="cons" :loading.sync="loadingTuts" hide-confirm max-width="800"
                  scrollable>
      <!--            <custom-popup v-model="tDialog" scrollable max-width="800" :cons="cons" v-if="tutorialExists" hide-confirm>-->
      <template v-slot:extension>
        <tabs-tutorial v-if="routeChanged && tDialog" v-model="tab" :tab-items="tabItems" class="popup-tuts"/>
      </template>

      <items-tutorial v-if="routeChanged && tDialog" v-model="tab" :items.sync="tabItems"
                      :loading.sync="loadingTuts"/>
    </custom-popup>

    <custom-popup v-model="autoReloadDialog" :cons="autoReloadCons" max-width="450">
      <v-card flat>
        <v-card-title>زمان مورد نظر خود را وارد نمایید:</v-card-title>
        <v-card-subtitle>پس از تعیین زمان، این صفحه در زمان انتخاب شده همیشه رفرش میشود.</v-card-subtitle>

        <v-card-text>
          <v-text-field v-model="timer" :rules="[rules.timer]" :suffix="isMinute ? 'دقیقه' : 'ثانیه'"
                        append-outer-icon="mdi-timer-cog-outline" dense hide-spin-buttons label="زمان"
                        outlined type="number" @click:append-outer="isMinute = !isMinute"/>
        </v-card-text>
      </v-card>
    </custom-popup>

    <div v-if="totalPopup">
      <b-modal id="modal-scrollable" :title="totalPopup[0] ? totalPopup[0].title : ''" ok-only ok-title="تایید"
               scrollable
               @ok="nextPopup">

        <p class="my-4" v-html="totalPopup[0] ? totalPopup[0].description : ''"></p>
      </b-modal>
    </div>
  </v-card>
</template>

<script>
import Terminal_title_ribbon from "../Ribbon";
import Axios from "axios";
import CustomPopup from "../plugins/popup/customPopup";
import TabsTutorial from "../components/tabsTutorial";
import ItemsTutorial from "../components/itemsTutorial";
import {AtomSpinner} from 'epic-spinners'
import {mapActions, mapState, mapGetters} from 'vuex'

export default {
  name: "customPage",

  components: {ItemsTutorial, TabsTutorial, CustomPopup, Terminal_title_ribbon, AtomSpinner},

  data() {
    return {
      cons: {title: 'آموزش'},
      loading: false,
      reloadLoading: false,
      tab: null,
      tDialog: false,
      rerender: true,
      routeChanged: true,
      tabItems: [],
      tutorialExists: false,
      project_title: null,
      totalPopup: null,
      tutorials: [],
      popupSlugs: [],
      popups: [],
      loadingTuts: false,
      autoReloadDialog: false,
      showExtraTimer: false,
      timer: 2,
      timerFun: null,
      rules: {
        timer: v => (!!v && !isNaN(v) && v < 100) || 'زمان صحیح وارد نمایید'
      },
      autoReloadCons: {
        title: 'تنظیم به‌روزرسانی خودکار',
        buttons: [
          {type: 'submit', handler: this.startTimer, disabled: () => !this.canSetTimer}
        ]
      },
      isMinute: true
    }
  },

  mounted() {
    this.project_title = document.title.split(" -")[0];
    this.allTutorials()

    const storedTimer = localStorage.getItem('reloadTimer')
    !!storedTimer && setDefaultTimer(this)

    function setDefaultTimer(_this) {
      _this.timer = JSON.parse(storedTimer)
      let obj = {
        time: JSON.parse(storedTimer),
        timer: false,
        route: null
      }

      _this.setTimer(obj)
    }
  },

  computed: {
    ...mapState('ribbon', ['autoReload']),
    ...mapGetters('ribbon', ['hasTimer', 'timerHasTime']),
    title() {
      return this.$route.meta.title ?? "";
    },
    canSetTimer() {
      return typeof this.rules.timer(this.timer) === 'boolean'
    }
  },

  methods: {
    ...mapActions('ribbon', ['setTimer', 'stopTimer']),
    reloadPage() {
      this.rerender = false
      this.reloadLoading = true
      this.$nextTick(() => {
        this.rerender = true
        setTimeout(() => {
          this.reloadLoading = false
        }, 500)
      });
    },
    allTutorials() {
      this.loading = true;
      Axios.get(`${this.core_url}/api/allTutorials`, {
        headers: this.DHeaders,
        params: {
          sid: this.sid,
        }
      }).then(({data}) => {
        this.tutorials = data.slugTutorials;
        this.popupSlugs = data.slugPopups;
        this.popups = data.popups;

        this.$watch("$route", this.watchRoute, {
          deep: true,
          immediate: true
        });
      }).finally(() => {
        this.loading = false
      })
    },
    watchRoute(to, from) {
      this.routeChanged = false
      let popupExists = this.popupSlugs.indexOf(to.path.substring(1)) > -1

      if (popupExists) {
        let seen = JSON.parse(localStorage.getItem('popup'))
        let popup = this.popups

        this.totalPopup = popup[to.path.substring(1)].filter(item => seen.indexOf(item.id) < 0);

        if (this.totalPopup?.length > 0)
          this.$bvModal.show('modal-scrollable');
      }

      this.tab = 0;
      this.tabItems = null

      if (Object.keys(to.params).length) {
        let route = to.path.split("/")
        let splicedStr = route.slice(0, route.length - 1).join("/");
        this.tutorialExists = this.tutorials.indexOf(splicedStr.substring(1)) > -1;
      } else {
        this.tutorialExists = this.tutorials.indexOf(to.path.substring(1)) > -1;

      }


      this.$nextTick(() => {
        this.routeChanged = true
      })

      document.title = this.project_title + (this.title !== "" ? ` - ${this.title} ${this.subTitle ?? ''}` : '');
    },
    nextPopup(event) {
      const lastItem = this.totalPopup.splice(0, 1);
      let seen = JSON.parse(localStorage.getItem('popup')) ?? [];

      seen.push(lastItem[0].id);

      localStorage.setItem('popup', JSON.stringify(seen));

      if (this.totalPopup?.length > 0)
        event.preventDefault();
    },
    startTimer() {
      this.showExtraTimer = false

      if (!!this.timerFun) {
        this.deleteTimer()
      }

      let obj = {
        time: this.timer,
        timer: true,
        route: this.$route.path
      }
      this.setTimer(obj)
      localStorage.setItem('reloadTimer', JSON.stringify(this.timer))

      let timer = this.isMinute ? this.timer * 60 : this.timer
      timer = timer * 1000

      this.$toast.info('به‌روزرسانی خودکار شروع شد.')

      this.timerFun = setInterval(() => {
        if (this.autoReload.route !== this.$route.path)
          this.deleteTimer()
        else if (!this.reloadLoading) {
          this.reloadPage()
        }
      }, timer)
    },
    deleteTimer() {
      this.showExtraTimer = false
      clearInterval(this.timerFun)
      this.timerFun = null
      this.stopTimer()
    }
  },
}
</script>

<style scoped>
@keyframes jump {
  0% {
    transform: scale(1.1);
  }
  10% {
    transform: scale(1.8) rotateY(0);
  }
  20% {
    transform: scale(1.1)
  }
  30% {
    transform: scale(1.8) rotateY(-180deg);
  }
  40% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1.8) rotateY(0);
  }
  60% {
    transform: scale(1.1);
  }
  70% {
    transform: scale(1.8) rotateY(-180deg);
  }
  80% {
    transform: scale(1.1);
  }
  90% {
    transform: scale(1.8) rotateY(0);
  }
  100% {
    transform: scale(1.1)
  }
}

.jump {
  animation: jump 7s linear infinite;
}

.title-wrapper {
  display: flex;
  flex-wrap: wrap-reverse;
  /*overflow-x: hidden !important;*/
}

.popup-tuts {
  max-width: calc(100% - 44px);
}
</style>