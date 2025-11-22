<template>
  <v-card :loading="loading" flat>
    <v-card-title>
      <v-btn
        v-if="!createNew"
        class="submit-btn ma-0"
        @click="createNew = true"
      >
        <v-icon left>mdi-plus</v-icon>
        {{ i18n.t("BUTTON.CREATE_NEW_HISTORY") }}
      </v-btn>

      <template v-else>
        <v-spacer />
        <v-btn
          :loading="loading"
          color="red"
          outlined
          @click="createNew = false"
        >
          <v-icon>mdi-close</v-icon>
          {{ i18n.t("BUTTON.BACK") }}
        </v-btn>
      </template>
    </v-card-title>

    <v-slide-x-transition mode="out-in">
      <v-card-text v-if="!createNew" key="table">
        <vue-table
          :data="data"
          :headers="headers"
          :loading="loading"
          show-expand
          @change="onPagination"
        >
          <template v-slot:index="{ item }">
            {{ item.index + 1 + (data.current_page - 1) * data.per_page }}
          </template>

          <template v-slot:remind_date="{ item }">
            {{ datetime(item.remind_date, "datetime") }}
          </template>

          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              {{ i18n.t("TABLE.MORE_INFO_ABOUT_ITEM", { name: item.name }) }}
            </td>
          </template>
        </vue-table>
      </v-card-text>

      <v-row v-else key="form" class="pa-2" no-gutters>
        <v-col class="pa-2" cols="12" md="6">
          <v-text-field
            v-model="createFields.title"
            :error-messages="errors.title"
            append-icon="mdi-pencil"
            class="rounded-lg"
            clearable
            dense
            :label="i18n.t('FORM_LABELS.HISTORY_TITLE')"
            outlined
          />
        </v-col>

        <v-col class="pa-2" cols="12" md="6">
          <v-text-field
            v-model="createFields.step"
            append-icon="mdi-counter"
            class="rounded-lg"
            clearable
            dense
            hide-spin-buttons
            :label="i18n.t('FORM_LABELS.STEP')"
            outlined
            type="number"
          />
        </v-col>

        <v-col class="pa-2" cols="12">
          <custom-date-picker
            v-model="createFields.added_at"
            :error-messages="errors.added_at"
            :max="nowDatetime"
            append-icon="mdi-calendar-range"
            class="rounded-lg"
            dense
            input-class="created-input"
            :label="i18n.t('FORM_LABELS.LAST_CALL_TIME')"
            outlined
          />
        </v-col>

        <v-col class="pa-2" cols="12">
          <v-textarea
            v-model="createFields.description"
            :error-messages="errors.description"
            class="rounded-lg"
            dense
            :label="i18n.t('FORM_LABELS.NEGOTIATIONS')"
            outlined
          />
        </v-col>

        <v-col class="pa-2" cols="12">
          <custom-date-picker
            v-model="createFields.remind_date"
            :error-messages="errors.remind_date"
            :min="nowDatetime"
            append-icon="mdi-calendar-range"
            class="rounded-lg"
            dense
            input-class="remind-date-input"
            :label="i18n.t('FORM_LABELS.REMINDER_TIME')"
            nullable
            outlined
          />
        </v-col>

        <v-col class="pa-2" cols="12">
          <v-textarea
            v-model="createFields.purpose"
            :error-messages="errors.purpose"
            class="rounded-lg"
            clearable
            dense
            :label="i18n.t('FORM_LABELS.FOLLOW_UP_ITEMS')"
            outlined
          />
        </v-col>

        <v-col cols="12">
          <v-card-actions class="justify-end">
            <v-btn
              :loading="loading"
              class="btn-accept"
              depressed
              @click="createNewOne"
            >
              <v-icon left>mdi-content-save-plus-outline</v-icon>
              {{ i18n.t("BUTTON.SAVE_HISTORY") }}
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-slide-x-transition>
  </v-card>
</template>

<script>
import vueTable from "../../../plugins/vueTable/index.vue";
import CustomDatePicker from "../../../pages/pickers/custom-date-picker.vue";
import i18n from "../../../plugins/EasyModal/i18n";
export default {
  name: "showCreateHistory",

  components: { CustomDatePicker, vueTable },

  props: {
    item: Object,
  },

  data: () => ({
    i18n,
    data: {},
    headers: [
      {
        value: "index",
        text: i18n.t("TABLE_HEADERS.ROW"),
        sortable: false,
        align: "center",
      },
      {
        value: "title",
        text: i18n.t("TABLE_HEADERS.TITLE"),
        sortable: false,
        align: "center",
      },
      {
        value: "step",
        text: i18n.t("TABLE_HEADERS.STEP"),
        sortable: false,
        align: "center",
      },
      {
        value: "remind_date",
        text: i18n.t("TABLE_HEADERS.REMINDER_TIME"),
        sortable: false,
        align: "center",
      },
      {
        value: "created_at_p",
        text: i18n.t("TABLE_HEADERS.LAST_CALL_TIME"),
        sortable: false,
        align: "center",
      },
      {
        value: "savior",
        text: i18n.t("TABLE_HEADERS.RECORDER"),
        sortable: false,
        align: "center",
      },
      {
        value: "action",
        text: i18n.t("TABLE_HEADERS.MANAGEMENT"),
        sortable: false,
        align: "center",
      },
    ],
    tableProps: {
      length: 10,
      page: 1,
      dir: "desc",
    },
    loading: false,
    createNew: false,
    createFields: {
      added_at: "",
      customer_id: null,
      description: "",
      purpose: "",
      remind_date: "",
      step: "",
      title: "",
    },
    errors: {},
  }),

  mounted() {
    this.fetch();
  },

  computed: {
    nowDatetime() {
      const moment = require("moment");
      return moment().format("YYYY-MM-DD HH:mm:ss");
    },
  },

  methods: {
    fetch(params = this.tableProps) {
      this.loading = true;

      params.customer_id = this.item.id;

      this.$instanceAxios
        .get(`${this.$fileApi2}contact/history`, { params })
        .then(({ data }) => (this.data = data.data))
        .finally(() => (this.loading = false));
    },
    onPagination(e) {
      let props = {
        ...this.tableProps,
        ...e,
      };

      this.fetch(props);
    },
    createNewOne() {
      this.loading = true;

      let e = {
        ...this.createFields,
        customer_id: this.item.user_id,
        contact_id: this.item.id,
      };

      this.$instanceAxios
        .post(`${this.$fileApi2}user/history/customer`, e)
        .then(({ data }) => {
          this.fetch();
          this.createNew = false;
        })
        .catch(({ response }) => {
          if (response?.data?.errors) {
            this.errors = response.data.errors;

            for (const error in response.data.errors)
              this.$toast.error(response.data.errors[error]?.[0]);
          } else this.$toast.error(this.i18n.t("TOAST.ADD_HISTORY_ERROR"));
          console.log("failed to submit new history: ", response);
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style scoped></style>
