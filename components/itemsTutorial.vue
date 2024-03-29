<template>
  <!--    <v-card v-if="showLoading" flat min-height="200" class="d-flex align-center justify-center">-->
  <!--        <v-progress-circular indeterminate color="primary"/>-->
  <!--    </v-card>-->

  <v-card flat min-height="250">
    <v-tabs-items v-if="tutorial" v-model="tab" class="pa-0 pa-md-4">
      <v-tab-item v-if="tutorial && haveFeature">
        <v-card flat>
          <v-card-text class="pa-2 pa-md-4" v-html="tutorial.features"></v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab-item v-if="tutorial !== null">
        <v-card v-if="Object.keys(tutorial).length > 0" flat>
          <v-card-title class="justify-content-center">
            {{ tutorial.title }}
          </v-card-title>

          <v-card-text class="pa-2 pa-md-4" v-html="tutorial.description"/>
        </v-card>
      </v-tab-item>

      <v-tab-item v-if="hasQuestions && tutorial !== null" class="pa-2">
        <v-expansion-panels flat>
          <v-expansion-panel v-for="(item, i) in tutorial.extras" :key="i"
                             class="grey lighten-2 mb-2">
            <v-expansion-panel-header class="font-size-h4 font-weight-bold text-break">
              {{ item.question }}
            </v-expansion-panel-header>

            <v-expansion-panel-content class="pt-2 font-size-h6 text-break">
              <div v-html="item.answer"/>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-tab-item>

      <v-tab-item v-if="adminTutorial">
        <v-card flat>
          <v-card-title class="justify-content-center">
            {{ adminTutorial.title }}
          </v-card-title>

          <v-card-text v-html="adminTutorial.description"></v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";
import Axios from "axios";


export default {
  name: "itemsTutorial",

  props: {
    value: Number,
    noCall: Boolean,
    calledTuts: [Object, Array],
    loading: Boolean
  },

  data: () => ({
    showLoading: false,
    tab: 0,
    hasQuestions: false,
    tutorial: null,
    tabItems: null,
    adminTutorial: null,
  }),

  beforeCreate() {
    if (!localStorage.getItem('popup'))
      localStorage.setItem('popup', "[]");
  },

  mounted() {
    if (!this.noCall)
      this.getTutorial();
    else
      this.setTutorials(this.calledTuts)

    this.tabItems = this.fillItems
  },

  computed: {
    haveFeature() {
      return this.tutorial?.features;
    },
    ...mapGetters("ribbon", ["sub_title"]),
    fillItems() {
      return [
        {
          title: 'معرفی نامه',
          icon: 'subtitles',
          color: 'pink',
          condition: () => this.tutorial !== null && this.haveFeature
        },
        {
          title: 'راهنما',
          icon: 'account',
          color: 'green',
          condition: () => this.tutorial !== null
        },
        {
          title: 'سوالات متداول',
          icon: 'help-circle-outline',
          color: 'indigo',
          condition: () => this.hasQuestions && this.tutorial !== null
        },
        {
          title: 'راهنمای ادمین',
          icon: 'shield-account-outline',
          color: 'blue',
          condition: () => this.ribbon_can('admin_access') && this.adminTutorial
        },
      ]
    },
  },

  watch: {
    value(val) {
      this.tab = val
    },
    tab(val) {
      this.$emit('input', val)
    },
    tabItems(val) {
      this.$emit('update:items', val)
    },
    calledTuts(val) {
      this.setTutorials(val)
      this.tabItems = this.fillItems
    },
    showLoading(val) {
      this.$emit('update:loading', val)
    }
  },

  methods: {
    getTutorial() {
      let slug = '';

      if (Object.keys(this.$route.params).length) {
        let route = this.$route.path.split("/")
        let splicedStr = route.slice(0, route.length - 1).join("/");
        slug = splicedStr.substring(1);
      } else {
        slug = this.$route.path.substring(1);

      }

      this.showLoading = true;
      Axios.post(`${this.core_url}/api/contentTutorial`, {
        slug: slug,
        sid: this.sid,
      }, {
        headers: this.DHeaders
      }).then(({data}) => {
        this.setTutorials(data)
      }).finally(() => {
        this.showLoading = false
      });
    },
    setTutorials(data) {
      this.showLoading = true
      this.tab = 0;
      this.tutorial = null;
      this.adminTutorial = null;
      this.hasQuestions = false;

      if (data && data.length > 0)
        data.forEach((a) => {

          if (a.privilege_type === 'user') {
            a.extras !== null ? this.hasQuestions = true : false;

            if (!!a.extras)
              try {
                let ext = JSON.parse(a.extras);

                if (typeof ext === "string")
                  ext = JSON.parse(ext);

                // if (this.tutorial.id > 253) {
                this.tutorial = {
                  ...a,
                  extras: ext
                };
                // this.tutorial.extras = ext
                // } else {
                //   this.tutorial.extras = JSON.parse(JSON.parse(a.extras))
                // }
              } catch (e) {
                console.log(e)
              }
          } else {
            this.adminTutorial = a;
            a.extras !== null ? this.hasQuestions = true : false;
          }
        })

      this.tabItems = []
      this.$nextTick(() => {
        this.tabItems = this.fillItems
        this.showLoading = false
      })
    }
  },
}
</script>

<style scoped>
.v-expansion-panel--active >>> .v-expansion-panel-header {
  background-color: var(--v-warning-base);
  min-height: 49px;
}

.v-expansion-panels :deep(.v-expansion-panel-header),
.v-expansion-panels :deep(.v-expansion-panel-content__wrap) {
  line-height: 1.3em;
}

.v-window >>> iframe,
.v-window >>> img {
  max-width: 100% !important;
}

.v-window >>> ol,
.v-window >>> ul {
  padding: 0 24px 0 16px !important;
}
</style>