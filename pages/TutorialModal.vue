<template>
  <custom-popup
    v-model="computedPopup"
    :cons="popupConfig"
    hide-confirm
    max-width="1000"
    :loading="showLoading"
    transition="help-pop-transition" 
      >
    <template #default>
      <custom-tabs
        v-model="tab"
        :tab-items="activeTabs"
        class="pa-2 pa-md-4"
      >
        <template #staticItems>
          
          <v-tab-item v-if="tutorial && haveFeature">
            <v-card flat>
              <v-card-text class="pa-2 pa-md-4" v-html="tutorial.features" />
            </v-card>
          </v-tab-item>

          <v-tab-item v-if="tutorial !== null">
            <v-card v-if="Object.keys(tutorial).length > 0" flat>
              <v-card-title class="justify-center">
                {{ tutorial.title }}
              </v-card-title>
              <v-card-text class="pa-2 pa-md-4" v-html="tutorial.description" />
            </v-card>
          </v-tab-item>

          <v-tab-item v-if="hasQuestions && tutorial !== null" class="pa-2">
            <v-expansion-panels flat>
              <v-expansion-panel
                v-for="(item, i) in tutorial.extras"
                :key="i"
                class="grey lighten-2 mb-2"
              >
                <v-expansion-panel-header class="font-size-h4 font-weight-bold text-break">
                  {{ item.question }}
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pt-2 font-size-h6 text-break">
                  <div v-html="item.answer" />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-tab-item>

          <v-tab-item v-if="adminTutorial">
            <v-card flat>
              <v-card-title class="justify-center">
                {{ adminTutorial.title }}
              </v-card-title>
              <v-card-text v-html="adminTutorial.description" />
            </v-card>
          </v-tab-item>

        </template>
      </custom-tabs>
    </template>
  </custom-popup>
</template>

<script>
import { mapGetters } from "vuex";
import Axios from "axios";
import customPopup from "../plugins/popup/customPopup.vue";
import CustomTabs from "../plugins/customTabs/index.vue";


export default {
  name: "TutorialModal",

  components: {
    customPopup,
    CustomTabs,
  },

  props: {
    value: Boolean, 
    noCall: Boolean,
    calledTuts: [Object, Array],
  },

  data: () => ({
    showLoading: false,
    tab: 0,
    hasQuestions: false,
    tutorial: null,
    adminTutorial: null,
    popupConfig: {
      title: "راهنما", 
      icon: "help-circle-outline" 
    }
  }),

  computed: {
    computedPopup: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    haveFeature() {
      return this.tutorial?.features;
    },
    ...mapGetters("ribbon", ["sub_title"]),

    activeTabs() {
      const tabs = [];
      
      if (this.tutorial !== null && this.haveFeature) {
        tabs.push({ text: "معرفی نامه", icon: "subtitles" });
      }
      if (this.tutorial !== null) {
        tabs.push({ text: "راهنما", icon: "account" });
      }
      if (this.hasQuestions && this.tutorial !== null) {
        tabs.push({ text: "سوالات متداول", icon: "help-circle-outline" });
      }
      if (this.ribbon_can && this.ribbon_can("admin_access") && this.adminTutorial) {
        tabs.push({ text: "راهنمای ادمین", icon: "shield-account-outline" });
      }

      return tabs;
    },
  },

  watch: {
    calledTuts(val) {
      this.setTutorials(val);
    },
    computedPopup(val) {
      if (val && !this.noCall && !this.tutorial) {
        this.getTutorial();
      }
    }
  },

  mounted() {
    if (this.computedPopup && !this.noCall) {
      this.getTutorial();
    } else if (this.calledTuts) {
      this.setTutorials(this.calledTuts);
    }
  },

  methods: {
    getTutorial() {
      let slug = "";

      if (Object.keys(this.$route.params).length) {
        let route = this.$route.path.split("/");
        let splicedStr = route.slice(0, route.length - 1).join("/");
        slug = splicedStr.substring(1);
      } else {
        slug = this.$route.path.substring(1);
      }

      this.showLoading = true;
      Axios.post(
        `${this.$coreApi3}/api/contentTutorial`,
        {
          slug: slug,
          sid: this.sid,
        },
        {
          headers: this.DHeaders,
        }
      )
        .then(({ data }) => {
          this.setTutorials(data);
        })
        .finally(() => {
          this.showLoading = false;
        });
    },
    
    setTutorials(data) {
      this.showLoading = true;
      this.tab = 0;
      this.tutorial = null;
      this.adminTutorial = null;
      this.hasQuestions = false;

      if (data && data.length > 0) {
        data.forEach((a) => {
          if (a.privilege_type === "user") {
            a.extras !== null ? (this.hasQuestions = true) : false;

            if (!!a.extras) {
              try {
                let ext = JSON.parse(a.extras);
                if (typeof ext === "string") ext = JSON.parse(ext);

                this.tutorial = {
                  ...a,
                  extras: ext,
                };
              } catch (e) {
                console.log(e);
              }
            }
          } else {
            this.adminTutorial = a;
            a.extras !== null ? (this.hasQuestions = true) : false;
          }
        });
      }

      this.$nextTick(() => {
        this.showLoading = false;
      });
    },
  },
};
</script>

<style scoped>
.v-expansion-panel--active ::v-deep .v-expansion-panel-header {
  background-color: var(--v-warning-base);
  min-height: 49px;
}

.v-expansion-panels ::v-deep .v-expansion-panel-header,
.v-expansion-panels ::v-deep .v-expansion-panel-content__wrap {
  line-height: 1.3em;
}

::v-deep .v-window iframe,
::v-deep .v-window img {
  max-width: 100% !important;
}

::v-deep .v-window ol,
::v-deep .v-window ul {
  padding: 0 24px 0 16px !important;
}
</style>
<style>
.help-pop-transition-enter-active,
.help-pop-transition-leave-active {
  transition: transform 0.7s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.7s ease !important;
}

.help-pop-transition-enter,
.help-pop-transition-leave-to {
  opacity: 0 !important;
  transform: translate(var(--deltaX, 0px), var(--deltaY, 0px)) scale(0) !important;
}

.help-pop-transition-enter-to,
.help-pop-transition-leave {
  opacity: 1 !important;
  transform: translate(0px, 0px) scale(1) !important;
}
</style>
