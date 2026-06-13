<template>
  <custom-popup
    v-model="dialog"
    :cons="{ title: i18n.t('POPUP.TITLE_OR_BUTTON_TEXT') }"
  >
    <template v-slot:activator>
      <v-btn
        :class="
          !!value && !!Object.keys(value).length ? 'btn-edit' : 'btn-refund'
        "
        :loading="loading"
        class="ma-0"
        style="letter-spacing: normal"
      >
        <v-icon class="me-2">mdi-plus</v-icon>
        <span v-if="!!value && !!Object.keys(value).length">{{
          i18n.t("POPUP.BUTTON_EDIT_TEXT")
        }}</span>
        <span v-else>{{ i18n.t("POPUP.TITLE_OR_BUTTON_TEXT") }}</span>
      </v-btn>
    </template>

    <v-card :loading="loading" class="pa-4" flat>
      <v-card-title class="pa-2">
        <v-btn
          :href="$router.resolve({ name: 'text.user.list' }).href"
          class="btn-refund"
        >
          <v-icon class="me-2">mdi-plus</v-icon>
          {{ i18n.t("BUTTON.REGISTER_NEW_PATTERN") }}
        </v-btn>

        <v-btn
          :href="$router.resolve({ name: 'user.campaign' }).href"
          class="btn-send-sms"
        >
          <v-icon class="me-2">mdi-plus</v-icon>
          {{ i18n.t("BUTTON.REGISTER_NEW_CAMPAIGN") }}
        </v-btn>
      </v-card-title>

      <custom-tabs
        v-model="tabs"
        :tab-items="[
          { text: 'انتخاب پترن من', icon: 'mdi-card-account-details-outline' },
          { text: 'انتخاب کمپین من', icon: 'mdi-bullhorn-outline' },
          { text: 'انتخاب پترن عمومی', icon: 'mdi-card-account-details-star-outline' },
          { text: 'انتخاب کمپین عمومی', icon: 'mdi-bullhorn-variant-outline' }
        ]"
        grow
      >
        <template v-slot:staticItems>
          <!-- 0: User Pattern -->
          <v-tab-item class="py-4">
            <data-table
              :columns="columns"
              :data="data"
              :per-page="[10, 25, 50, 100, 400]"
              :translate="translate"
              @row-clicked="selectRow"
              @on-table-props-changed="reloadTable"
            />

            <v-card
              v-if="(!data.data || !data.data.length) && !loading"
              class="text-muted text-center font-size-h3 d-flex align-center justify-center"
              flat
              height="200"
            >
              {{ i18n.t("NO_DATA.NO_PATTERN") }}
            </v-card>
          </v-tab-item>

          <!-- 1: User Campaign -->
          <v-tab-item class="py-4">
            <message-list ref="message-list-user" :camp-id.sync="campId" api-type="user" />
          </v-tab-item>

          <!-- 2: Public Pattern -->
          <v-tab-item class="py-4">
            <data-table
              :columns="columns"
              :data="data"
              :per-page="[10, 25, 50, 100, 400]"
              :translate="translate"
              @row-clicked="selectRow"
              @on-table-props-changed="reloadTable"
            />

            <v-card
              v-if="(!data.data || !data.data.length) && !loading"
              class="text-muted text-center font-size-h3 d-flex align-center justify-center"
              flat
              height="200"
            >
              {{ i18n.t("NO_DATA.NO_PATTERN") }}
            </v-card>
          </v-tab-item>

          <!-- 3: Public Campaign -->
          <v-tab-item class="py-4">
            <message-list ref="message-list-public" :camp-id.sync="campId" api-type="public" />
          </v-tab-item>
        </template>
      </custom-tabs>
    </v-card>
  </custom-popup>
</template>

<script>
import CustomTabs from "../../../plugins/customTabs/index.vue";
import MessageList from "../campaign/messageList.vue";
import { mapActions } from "vuex";
import i18n from "../../../plugins/EasyModal/i18n";
export default {
  name: "patternDialog",

  components: { MessageList, CustomTabs },

  props: {
    value: Object,
    rerender: Boolean,
    text: Array,
  },

  data: () => ({
    i18n,
    data: {},
    dialog: false,
    columns: [
      {
        label: i18n.t("TABLE.ID"),
        name: "id",
        orderable: true,
      },
      {
        label: i18n.t("TABLE.TYPE"),
        name: "type",
        orderable: true,
        transform: ({ data }) => {
          return data.type === "pattern"
            ? i18n.t("TABLE.PATTERN")
            : i18n.t("TABLE.STATIC");
        },
      },
      {
        label: i18n.t("TABLE.TITLE"),
        name: "title",
        orderable: true,
      },
      {
        label: i18n.t("TABLE.TEXT"),
        name: "content",
        transform: ({ data }) => {
          return data.content.substr(0, 70) + "...";
        },
        orderable: true,
      },
      {
        label: i18n.t("TABLE.STATUS"),
        name: "active",
        transform: ({ data }) => {
          return data.active === 0
            ? `<p class="badge badge-danger">${i18n.t("TABLE.REJECTED")}</p>`
            : `<p class="badge badge-success">${i18n.t("TABLE.ACCEPTED")}</p>`;
        },
        orderable: true,
      },
    ],
    translate: {
      nextButton: i18n.t("TABLE.NEXT_BUTTON"),
      previousButton: i18n.t("TABLE.PREVIOUS_BUTTON"),
      rowsPerPageText: i18n.t("TABLE.ROWS_PER_PAGE_TEXT"),
      noDataText: i18n.t("TABLE.NO_DATA_TEXT"),
      placeholderSearch: i18n.t("TABLE.PLACEHOLDER_SEARCH"),
    },
    tableProps: {
      search: "",
      length: 10,
      column: "id",
      dir: "desc",
      active: 1,
    },
    tabs: 0,
    patternLoading: false,
    loading: false,
    mlModel: [],
    campId: null,
  }),

  mounted() {
    this.SetSendTabs(2);
    let queries = this.$route.query;
    window.history.replaceState({}, "pattern", "/#/patternSms");

    if (
      queries &&
      typeof queries === "object" &&
      Object.keys(queries).length > 0
    ) {
      if (!!queries.link && !!queries.pattern) {
        this.getData({ ...this.tableProps, Uid: queries.pattern }).then(() => {
          this.texts[0] = queries.user;
          this.texts[1] = queries.link;
          this.$emit("reload", false);

          setTimeout(() => {
            this.computedValue = this.data?.data?.find(
              (item) => item.id == queries.pattern,
            );
            this.$nextTick(() => {
              this.$emit("reload", true);
              this.$forceUpdate();
            });
          }, 1000);
        });
      }
    }
  },

  computed: {
    computedValue: {
      get() {
        return this.selectedRow;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    texts: {
      get() {
        return this.text;
      },
      set(val) {
        this.$emit("update:text", val);
      },
    },
  },

  watch: {
    dialog(val) {
      if (val) this.getData();
    },
    campId(val) {
      this.selectCamp(val);
    },
    tabs(val) {
      if (val === 0 || val === 2) {
        this.tableProps.search = ""; 
        this.getData();
      }
    }
  },

  methods: {
    ...mapActions("locals", ["SetSendTabs"]),
    async getData(query = this.tableProps) {
      this.search = query.search;
      this.loading = true;

      const apiPath = this.tabs === 2 ? "text/public" : "text/user";

      await this.requestApiGet(apiPath, {
        ...query,
        active: 1,
      })
        .then(({ data }) => {
          this.data = data;
        })
        .finally(() => (this.loading = false));
    },
    selectRow(data) {
      const id = data.id;

      $("tr").css("background", "");

      $(`tr:contains("${id}")`).each(function (index, item) {
        if ($(item).find("td").eq(0).text() === id)
          $(item).css("background", "rgba(99, 0, 244, 0.28)");
      });

      this.computedValue = data;
      this.dialog = false;
    },
    selectCamp(data) {
      const refName = this.tabs === 3 ? "message-list-public" : "message-list-user";
      const obj = this.$refs[refName]?.data?.data?.find(
        (item) => item.id === data,
      );
      
      if(!obj) return;
      delete obj.id;

      this.computedValue = {
        ...obj,
        campId: data,
      };
      this.dialog = false;
    },
    reloadTable(tableProps) {
      this.tableProps = tableProps;
      this.getData(tableProps);
    },
  },
};
</script>
