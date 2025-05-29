<template>
  <v-card :loading="loading" flat>
    <v-card-title>
      <v-btn v-if="!createNew" class="submit-btn ma-0" @click="createNew = true">
        <v-icon left>mdi-plus</v-icon>
        ایجاد تاریخچه جدید
      </v-btn>

      <template v-else>
        <v-spacer/>
        <v-btn :loading="loading" color="red" outlined @click="createNew = false">
          <v-icon>mdi-close</v-icon>
          بازگشت
        </v-btn>
      </template>
    </v-card-title>

    <v-slide-x-transition mode="out-in">
      <v-card-text v-if="!createNew" key="table">
        <vue-table :data="data" :headers="headers" :loading="loading" show-expand @change="onPagination">
          <template v-slot:index="{item}">
            {{ (item.index + 1) + ((data.current_page - 1) * data.per_page) }}
          </template>

          <template v-slot:remind_date="{item}">
            {{ datetime(item.remind_date, 'datetime') }}
          </template>

          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              More info about {{ item.name }}
            </td>
          </template>

          <!--          <template v-slot:action="{item}">-->
          <!--            <v-btn class="btn btn-outline-info rounded-pill pa-0" depressed fab small>-->
          <!--              <v-icon>mdi-format-list-bulleted</v-icon>-->
          <!--            </v-btn>-->
          <!--          </template>-->
        </vue-table>
      </v-card-text>

      <v-row v-else key="form" class="pa-2" no-gutters>
        <v-col class="pa-2" cols="12" md="6">
          <v-text-field v-model="createFields.title" :error-messages="errors.title" append-icon="mdi-pencil"
                        class="rounded-lg" clearable dense label="عنوان تاریخچه" outlined/>
        </v-col>

        <v-col class="pa-2" cols="12" md="6">
          <v-text-field v-model="createFields.step" append-icon="mdi-counter" class="rounded-lg" clearable dense
                        hide-spin-buttons label="مرحله" outlined type="number"/>
        </v-col>

        <v-col class="pa-2" cols="12">
          <custom-date-picker v-model="createFields.added_at" :error-messages="errors.added_at" :max="nowDatetime"
                              append-icon="mdi-calendar-range" class="rounded-lg" dense input-class="created-input"
                              label="زمان آخرین تماس" outlined/>
        </v-col>

        <v-col class="pa-2" cols="12">
          <v-textarea v-model="createFields.description" :error-messages="errors.description" class="rounded-lg" dense
                      label="مذاکرات انجام شده" outlined/>
        </v-col>

        <v-col class="pa-2" cols="12">
          <custom-date-picker v-model="createFields.remind_date" :error-messages="errors.remind_date" :min="nowDatetime"
                              append-icon="mdi-calendar-range" class="rounded-lg" dense input-class="remind-date-input"
                              label="زمان یادآوری" nullable outlined/>
        </v-col>

        <v-col class="pa-2" cols="12">
          <v-textarea v-model="createFields.purpose" :error-messages="errors.purpose" class="rounded-lg" clearable
                      dense label="موارد پیگیری در تماس بعدی" outlined/>
        </v-col>

        <v-col cols="12">
          <v-card-actions class="justify-end">
            <v-btn :loading="loading" class="btn-accept" depressed @click="createNewOne">
              <v-icon left>mdi-content-save-plus-outline</v-icon>
              ذخیره تاریخچه
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

export default {
  name: "showCreateHistory",

  components: {CustomDatePicker, vueTable},

  props: {
    item: Object
  },

  data: () => ({
    data: {},
    headers: [
      {value: 'index', text: 'ردیف', sortable: false, align: 'center'},
      {value: 'title', text: 'عنوان', sortable: false, align: 'center'},
      {value: 'step', text: 'مرحله', sortable: false, align: 'center'},
      {value: 'remind_date', text: 'زمان یادآور', sortable: false, align: 'center'},
      {value: 'created_at_p', text: 'زمان آخرین تماس', sortable: false, align: 'center'},
      {value: 'savior', text: 'ثبت کننده', sortable: false, align: 'center'},
      {value: 'action', text: 'مدیریت', sortable: false, align: 'center'},
    ],
    tableProps: {
      length: 10,
      page: 1,
      dir: 'desc'
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
      title: ""
    },
    errors: {}
  }),

  mounted() {
    this.fetch()
  },

  computed: {
    nowDatetime() {
      const moment = require('moment')
      return moment().format('YYYY-MM-DD HH:mm:ss')
    }
  },

  methods: {
    fetch(params = this.tableProps) {
      this.loading = true

      params.customer_id = this.item.id

      this.requestApiGetPayamak('contact/history', params)
        .then(({data}) => this.data = data.data)
        .finally(() => this.loading = false)
    },
    onPagination(e) {
      let props = {
        ...this.tableProps,
        ...e
      }

      this.fetch(props)
    },
    createNewOne() {
      this.loading = true

      let e = {
        ...this.createFields,
        customer_id: this.item.user_id,
        contact_id: this.item.id
      }

      this.requestApiPostState('user/history/customer', e)
        .then(({data}) => {
          this.fetch()
          this.createNew = false
        })
        .catch(({response}) => {
          if (response?.data?.errors) {
            this.errors = response.data.errors

            for (const error in response.data.errors)
              this.$toast.error(response.data.errors[error]?.[0])

          } else
            this.$toast.error('خطا در افزودن تاریخچه مشتری!');
          console.log('failed to submit new history: ', response)
        })
        .finally(() => this.loading = false)
    }
  }
}
</script>

<style scoped>

</style>