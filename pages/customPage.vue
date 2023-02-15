<template>
  <v-card flat>
    <div class="title-wrapper pb-2">
      <terminal_title_ribbon/>

      <v-card-title class="justify-end py-2">
        <v-btn depressed color="rgba(105, 147, 255, .35)" v-if="tutorialExists" @click="getTutorial"
               v-b-tooltip.hover="'راهنما'" class="px-0" min-width="36">
          <i class="fa fa-question text-primary jump"></i>
        </v-btn>

        <v-btn depressed style="margin-right: 8px" color="rgba(123, 31, 162, .3)"
               @click="reloadPage" min-width="36" class="px-0" v-b-tooltip.hover="'به روزرسانی'">
          <v-icon color="#7b1fa2">mdi-reload</v-icon>
          <!--                    رفرش-->
        </v-btn>

        <v-btn depressed color="rgba(246, 78, 96, .35)" v-b-tooltip.hover="'بازگشت به صفحه قبلی'"
               @click="$router.back()" style="margin-right: 8px" min-width="36" class="px-0">
          <!--                    <div class="d-flex flex-column justify-center align-center">-->
          <i class="fa fa-times text-danger"></i>
          <!--                        بستن-->
          <!--                    </div>-->
        </v-btn>
      </v-card-title>
    </div>

    <router-view v-if="rerender"/>

    <div v-if="dialog && tutorialExists">
      <v-dialog v-model="dialog" scrollable max-width="800px">
        <v-card elevation="2" outlined>
          <v-card-title>
            <v-tabs v-model="tab" align-with-title grow>
              <v-tabs-slider/>
              <v-tab v-if="tutorial && haveFeature">
                <v-icon color="pink" class="m-2">mdi-subtitles</v-icon>
                معرفی نامه
              </v-tab>

              <v-tab>
                <v-icon color="green" class="m-2">mdi-account</v-icon>
                راهنما
              </v-tab>

              <v-tab v-if="hasQuestions">
                <v-icon color="indigo" class="m-2">mdi-help-circle-outline</v-icon>
                سوالات متداول
              </v-tab>

              <v-tab v-if="ribbon_can('admin_access')">
                <v-icon color="blue" class="m-2">mdi-shield-account-outline</v-icon>
                راهنمای ادمین
              </v-tab>
            </v-tabs>
          </v-card-title>

          <v-card-text>
            <v-tabs-items v-model="tab">

              <v-tab-item v-if="tutorial && haveFeature">
                <v-card>
                  <v-card-text v-html="tutorial.features"></v-card-text>
                </v-card>
              </v-tab-item>

              <v-tab-item>
                <v-card v-if="Object.keys(tutorial).length > 0">
                  <v-card-title class="justify-content-center">
                    {{ tutorial.title }}
                  </v-card-title>

                  <v-card-text v-html="tutorial.description"></v-card-text>
                </v-card>
              </v-tab-item>

              <v-tab-item v-if="hasQuestions && tutorial !== null">
                <v-card>
                  <v-card-title class="justify-content-center">سوالات متداول</v-card-title>

                  <v-expansion-panels>
                    <v-expansion-panel v-for="(item, i) in tutorial.extras" :key="i">
                      <v-expansion-panel-header>
                        {{ item.question }}
                      </v-expansion-panel-header>

                      <v-expansion-panel-content>
                        {{ item.answer }}
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card>
              </v-tab-item>

              <v-tab-item>
                <v-card v-if="adminTutorial">
                  <v-card-title class="justify-content-center">
                    {{ adminTutorial.title }}
                  </v-card-title>

                  <v-card-text v-html="adminTutorial.description"></v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>

          <v-card-actions class="justify-end" style="background: white; z-index: 999">
            <hr>
            <v-spacer></v-spacer>

            <v-btn outlined class="mr-auto btn-cancel" text @click="dialog = false">
              <v-icon>mdi-close-circle</v-icon>
              <b>بستن</b>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <div v-if="totalPopup">
      <b-modal id="modal-scrollable" ok-only ok-title="تایید" scrollable @ok="nextPopup"
               :title="totalPopup[0] ? totalPopup[0].title : ''">

        <p class="my-4" v-html="totalPopup[0] ? totalPopup[0].description : ''"></p>
      </b-modal>
    </div>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";
import Terminal_title_ribbon from "../Ribbon";
import Axios from "axios";

export default {
  name: "customPage",
  components: {Terminal_title_ribbon},
  data: () => ({
    project_title: null,
    tab: null,
    dialog: false,
    tutorialExists: false,
    hasQuestions: false,
    tutorial: [],
    adminTutorial: null,
    totalPopup: null,
    tutorials: [],
    popupSlugs: [],
    popups: [],
    rerender: true,
  }),
  methods: {
    reloadPage() {
      this.rerender = false
      this.$nextTick(() => {
        this.rerender = true
      })
    },
    allTutorials() {
      Axios.get(`${this.core_url}/api/allTutorials`, {
        headers: this.headers,
        params: {
          sid: this.sid,
        }
      }).then(response => {
        this.tutorials = response.data.slugTutorials;
        this.popupSlugs = response.data.slugPopups;
        this.popups = response.data.popups;

        this.$watch("$route", this.watchRoute, {
          deep: true,
          immediate: true
        });
      });
    },
    watchRoute(to, from) {
      let popupExists = this.popupSlugs.indexOf(to.path.substring(1)) > -1

      if (popupExists) {
        let seen = JSON.parse(localStorage.getItem('popup'))
        let popup = this.popups

        this.totalPopup = popup[to.path.substring(1)].filter(item => seen.indexOf(item.id) < 0);

        if (this.totalPopup.length > 0)
          this.$bvModal.show('modal-scrollable');
      }

      this.tab = 0;
      this.tutorial = null;
      this.adminTutorial = null;
      this.hasQuestions = false;
      this.tutorialExists = this.tutorials.indexOf(to.path.substring(1)) > -1;

      document.title = this.project_title + (this.title !== "" ? ` - ${this.title} ${this.subTitle ?? ''}` : '');
    },
    goToCore() {
      this.$router.go(-1);
    },
    nextPopup(event) {
      const lastItem = this.totalPopup.splice(0, 1);
      let seen = JSON.parse(localStorage.getItem('popup')) ?? [];

      seen.push(lastItem[0].id);

      localStorage.setItem('popup', JSON.stringify(seen));


      if (this.totalPopup.length > 0)
        event.preventDefault();
    },
    getTutorial() {
      this.$modal.showLoading();
      Axios.post(`${this.core_url}/api/contentTutorial`, {
        slug: this.$route.path.substring(1),
        sid: this.sid,
      }, {
        headers: this.headers
      }).then(({data}) => {
        for (let a of data) {
          if (a.privilege_type === 'admin') {
            this.adminTutorial = a;
            a.extras !== null ? this.hasQuestions = true : false;
          } else {
            a.extras !== null ? this.hasQuestions = true : false;
            this.tutorial = a;
            this.tutorial.extras = JSON.parse(a.extras);
          }
        }
      }).finally(() => {
        this.$modal.hideLoading();
        this.dialog = true;
      });
    }
  },
  computed: {
    haveFeature() {
      return this.tutorial?.features;
    },
    ...mapGetters("ribbon", ["sub_title"]),
    title() {
      return this.$route.meta.title ?? "";
    },
  },
  beforeCreate() {
    if (!localStorage.getItem('popup'))
      localStorage.setItem('popup', "[]");
  },
  mounted() {
    this.project_title = document.title.split(" -")[0];

    this.allTutorials();
  }
}
</script>

<style scoped>
@keyframes jump {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.5)
  }

  100% {
    transform: scale(1)
  }
}

.jump {
  animation: jump 2s linear infinite;
}

.title-wrapper {
  display: flex;
  flex-wrap: wrap-reverse;
}

.title-wrapper >>> .v-card__title {
  flex: 1 0 0;
}

@media screen and (max-width: 960px) {
  .title-wrapper >>> .v-card__title {
    flex: 0 0 100%;
  }
}
</style>