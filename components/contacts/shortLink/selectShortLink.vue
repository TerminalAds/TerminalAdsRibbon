<template>
  <v-card :loading="loading" flat>
    <v-card-title>
      <template v-if="!addLink">
        <span class="font-size-sm grey--text">
          لینک‌های خود را "رایگان" کوتاه کنید.
          <br>
          برای انتخاب، روی لینک مورد نظر کلیک کنید.
        </span>
        <v-spacer/>

        <v-btn color="success" depressed @click="addLink = true">
          <v-icon left>mdi-plus</v-icon>
          ساخت لینک کوتاه
        </v-btn>
      </template>

      <template v-else>
        <v-spacer/>
        <v-btn :disabled="loading" class="mx-2" color="red" outlined @click="() => {addLink = false;reloadTable()}">
          <v-icon left>mdi-close</v-icon>
          بازگشت
        </v-btn>

        <v-btn :disabled="!canSubmit" :loading="loading" color="success" depressed @click="submitNew">
          <v-icon left>mdi-plus</v-icon>
          ساخت لینک کوتاه
        </v-btn>
      </template>
    </v-card-title>

    <v-card-text v-if="!addLink">
      <data-table :columns="columns" :data="data" :per-page="[10, 25, 50, 100, 400]" :translate="translate" class="mt-3"
                  @on-table-props-changed="reloadTable" @row-clicked="selectRow"/>
    </v-card-text>

    <v-row v-else class="p-1" no-gutters>
      <v-col class="pa-2" cols="12" md="6">
        <v-text-field v-model="linkObj.title" :rules="[rules.empty]" clear-icon="mdi-close-circle-outline" clearable
                      dense label="عنوان" messages="لطفا یک نام برای لینک کوتاه خود اضافه کنید." outlined/>
      </v-col>

      <v-col class="pa-2" cols="12" md="6">
        <v-text-field v-model="linkObj.link" :rules="[rules.link]" clear-icon="mdi-close-circle-outline" clearable dense
                      label="لینک" messages="لینک مورد نظر خود را وارد کنید." outlined/>
      </v-col>

      <v-col class="pa-2" cols="12">
        <v-select v-model="linkObj.domainId" :items="domainItems" dense label="انتخاب دامنه" outlined readonly/>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import shortLinkButtons from "./shortLinkButtons.vue";
import copyLinkBtn from "./copyLinkBtn.vue";
import {debounce} from "../../../install";

export default {
  name: "selectShortLink",

  props: {
    value: String,
  },

  data() {
    return {
      data: {},
      columns: [
        {
          label: 'ردیف',
          name: 'row',
          transform: (data) => {
            // console.log('data: ', data)
            return data.row + 1
            // return this.rowNumber(this.data, data)
          }
        },
        {
          label: "شناسه",
          name: "id",
          orderable: true,
        },
        {
          label: 'عنوان',
          name: 'title',
        },
        {
          label: 'لینک',
          name: 'destination',
          component: copyLinkBtn,
        },
        {
          label: 'لینک کوتاه شده',
          name: 'link',
          component: copyLinkBtn,
        },
        {
          label: 'تعداد کلیک',
          name: 'views',
        },
        {
          label: "مدیریت",
          name: "action",
          component: shortLinkButtons,
          event: "actions",
          handler: this.action,
          meta: {
            buttons: [{
              name: "removeLink",
              label: "حذف",
              icon: "trash",
              class: "btn-delete border-2 rounded-pill",
              action: this.action,
            }],
          },
        }
      ],
      tableProps: {
        search: '',
        filters: {},
        status: null,
        length: 10,
        column: 'id',
        dir: 'desc',
      },
      translate: {
        nextButton: 'بعدی',
        previousButton: 'قبلی',
        rowsPerPageText: 'تعداد در صفحه',
        noDataText: 'داده ای برای نمایش وجود ندارد',
        placeholderSearch: 'جستجو',
      },
      loading: false,
      addLink: false,
      rules: {
        empty: v => (!!v && v.length > 3) || 'عنوان الزامی می‌باشد.',
        link: v => (!!v && this.isDomain(v)) || 'لطفا لینک صحیح وارد نمایید.'
      },
      domainItems: [{
        value: 1, text: 't7r.ir'
      }],
      linkObj: {
        title: '',
        link: '',
        type_id: 1,
        domainId: 1,
        password: null,
        favoriteLink: null
      }
    }
  },

  created() {
    this.fetchLinks(this.tableProps)
  },

  computed: {
    canSubmit() {
      return typeof this.rules.empty(this.linkObj.title) === 'boolean'
        && typeof this.rules.link(this.linkObj.link) === 'boolean'
    }
  },

  methods: {
    fetchLinks(props = this.tableProps) {
      this.loading = true

      this.$api.get(this.$shortLinkApi + '/link', {
        params: props
      })
        .then(({data}) => this.data = data)
        .finally(() => this.loading = false)
    },
    reloadTable(props) {
      debounce(() => this.fetchLinks(props), 500);
    },
    selectRow(data) {
      const id = data.id;

      $('tr').css("background", "");

      $(`tr:contains("${id}")`).each(function (index, item) {
        if ($(item).find('td').eq(1).text() == id)
          $(item).css('background', 'rgba(99, 0, 244, 0.28)')
      });

      // this.computedValue = data;
      // this.dialog = false;
      // this.computedValue = data.link
      this.$emit('select', data.link)
      this.$emit('close')
    },
    submitNew() {
      this.loading = true

      this.$api.post(this.$shortLinkApi + '/add/link', this.linkObj)
        .then(({data}) => {
          this.$toast.success('با موفقیت اضافه شد.')
          this.addLink = false
          this.reloadTable()
        })
        .catch(({response}) => console.log('failed to add new link: ', response))
        .finally(() => this.loading = false)
    },
    action(data, type) {
      this[type](data);
    },
    async removeLink(data) {
      if (await this.$modal.yesNo('تایید حذف لینک کوتاه؟')) {
        this.loading = true

        this.$api.delete(`/link/delete/${data.id}`)
          .then(({data}) => {
            this.tableProps.page = 1
            this.$nextTick(() => {
              this.reloadTable()
            })
          })
          .finally(() => this.loading = false)
      }
    }
  }
}
</script>

<style scoped>
.v-card >>> .laravel-vue-datatable-tbody-tr {
  cursor: pointer;
}
</style>