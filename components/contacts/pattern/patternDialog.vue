<template>
  <custom-popup v-model="dialog" :cons="{ title: 'انتخاب پترن/کمپین' }">
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
        <span v-if="!!value && !!Object.keys(value).length"
          >تغییر پترن/کمپین</span
        >
        <span v-else>انتخاب پترن/کمپین</span>
      </v-btn>
    </template>

    <v-card :loading="loading" class="pa-4" flat>
      <v-card-title class="pa-2">
        <v-btn
          :href="$router.resolve({ name: 'text.user.list' }).href"
          class="btn-refund"
        >
          <v-icon class="me-2">mdi-plus</v-icon>
          ثبت پترن جدید
        </v-btn>

        <v-btn
          :href="$router.resolve({ name: 'user.campaign' }).href"
          class="btn-send-sms"
        >
          <v-icon class="me-2">mdi-plus</v-icon>
          ثبت کمپین جدید
        </v-btn>
      </v-card-title>

      <custom-tabs
        v-model="tabs"
        :tab-items="[{ text: 'انتخاب پترن' }, { text: 'انتخاب کمپین' }]"
        grow
      >
        <template v-slot:staticItems>
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
              الگویی پیدا نشد، ابتدا یک الگو ثبت فرمایید.
            </v-card>
          </v-tab-item>

          <v-tab-item class="py-4">
            <message-list ref="message-list" :camp-id.sync="campId" />
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

export default {
  name: "patternDialog",

  components: { MessageList, CustomTabs },

  props: {
    value: Object,
    rerender: Boolean,
    text: Array,
  },

  data: () => ({
    data: {},
    dialog: false,
    columns: [
      {
        label: "شناسه",
        name: "id",
        orderable: true,
      },
      {
        label: "نوع",
        name: "type",
        orderable: true,
        transform: ({ data }) => {
          return data.type === "pattern" ? "پترن" : "ثابت";
        },
      },
      {
        label: "عنوان",
        name: "title",
        orderable: true,
      },
      {
        label: "متن",
        name: "content",
        transform: ({ data }) => {
          return data.content.substr(0, 70) + "...";
        },
        orderable: true,
      },
      {
        label: "وضعیت",
        name: "active",
        transform: ({ data }) => {
          return data.active === 0
            ? `<p class="badge badge-danger">رد شده</p>`
            : `<p class="badge badge-success">تایید شده</p>`;
        },
        orderable: true,
      },
    ],
    translate: {
      nextButton: "بعدی",
      previousButton: "قبلی",
      rowsPerPageText: "تعداد در صفحه",
      noDataText: "داده ای برای نمایش وجود ندارد",
      placeholderSearch: "جستجو",
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
              (item) => item.id == queries.pattern
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
  },

  methods: {
    ...mapActions("locals", ["SetSendTabs"]),
    async getData(query = this.tableProps) {
      this.search = query.search;
      this.loading = true;

      await this.requestApiGet("text", {
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
      console.log(data, "message-list");
      const obj = this.$refs["message-list"]?.data?.data.find(
        (item) => item.id === data
      );
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

<style scoped></style>
