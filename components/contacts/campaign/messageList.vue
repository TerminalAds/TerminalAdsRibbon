<template>
  <v-card id="msg-list" flat>
    <v-tabs-items v-model="computedTabs">
      <v-tab-item>
        <v-row v-if="isCampaign" class="mt-2" no-gutters>
          <v-col class="pa-2" cols="12" lg="3" md="4">
            <v-text-field v-model="campName" class="rounded-lg" clear-icon="mdi-close-circle-outline" clearable dense
                          label="نام کمپین" outlined/>
          </v-col>
        </v-row>
        <campaign-list-item v-for="(item, i) in computedValue" :key="i + 'msg'" :index="i" :item.sync="item"
                            :loading="i === 0 && loading" :show-delete="computedValue.length > 1"
                            :title="isCampaign ? 'متن' : 'پیام'" @deleteRow="deleteRow(i)"/>
      </v-tab-item>

      <v-tab-item disabled>
        <campaign-list-item v-for="(item, i) in computedValue" :key="i + 'tracking'" :index="i" :item.sync="item"
                            :loading="i === 0 && loading" :show-delete="computedValue.length > 1"
                            :title="isCampaign ? 'متن' : 'پیام'" tracking @deleteRow="deleteRow(i)"/>
      </v-tab-item>

      <v-tab-item>
        <v-card :loading="campLoading" class="px-3 pb-3 rounded-lg" outlined>
          <v-card-title class="font-size-h6 pa-2">
            برای
            <span class="red--text mx-1">انتخاب کمپین</span>
            روی ردیف مورد نظر کلیک کنید.
          </v-card-title>

          <data-table :columns="columns" :data="data" :orderDir="tableProps.dir" :per-page="[10, 25, 50, 100, 400]"
                      :translate="translate" class="mt-3" @on-table-props-changed="reloadTable"
                      @row-clicked="selectRow"/>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

    <v-card-actions v-if="sendPagesTab !== 2 && !stage" class="px-0">
      <v-btn :disabled="!canMore" block class="rounded-lg btn-send-sms ma-0"
             depressed width="100%" @click="addRow">
        <v-icon left>mdi-plus</v-icon>
        افزودن
        <span class="px-1">{{ isCampaign ? 'متن' : 'پیام' }}</span>
        جدید
      </v-btn>
    </v-card-actions>

    <slot v-if="isCampaign && !stage" name="submit">
      <v-card-actions class="px-0 justify-end">
        <v-btn :disabled="!canMore" :loading="loading" class="btn-send-sms" @click="addCamp">
          <span class="flaticon2-send-1 icon-md"></span>
          ثبت کمپین
        </v-btn>
      </v-card-actions>
    </slot>
  </v-card>
</template>

<script>
import SuggestText from "../SuggestBox/suggestInput.vue";
import CampaignListItem from "./campaignListItem.vue";
import {mapActions, mapGetters, mapState} from "vuex";
import {debounce} from "../../../install";

export default {
  name: "messageList",

  components: {CampaignListItem, SuggestText},

  props: {
    campId: Number,
    isCampaign: Boolean,
    value: Array,
    title: {
      type: String,
      default: function () {
        return this.$route.meta.title
      }
    },
    loading: Boolean,
    stage: Boolean,
    srcObj: Object
  },

  data() {
    return {
      campLoading: false,
      data: {},
      campName: '',
      columns: [
        {
          label: 'ردیف',
          transform: (val) => {
            return this.rowNumber(this.data, val);
          },
        },
        {
          label: "شناسه",
          name: "id",
          orderable: true,
        },
        {
          label: 'تاریخ',
          name: 'created_at',
          transform: ({data}) => {
            return this.datetime(data.created_at)
          }
        },
        {
          label: 'ساعت',
          name: 'created_at_time',
          transform: ({data}) => {
            return this.getTime(data.created_at)
          }
        },
        {
          label: 'تعداد پیام',
          name: 'text',
          transform: ({data}) => {
            return data.messages.text.length || 0
          }
        },
        {
          label: 'مجموع پیام (صفحه)',
          name: 'count',
          transform: ({data}) => {
            return data.messages.count || '-' + ' صفحه'
          }
        },
        {label: "نام کمپین", name: "messages.name", serchable: true,}
      ],
      tableProps: {
        search: '',
        filters: {},
        status: 'accept',
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
    }
  },

  created() {
    this.campName = this.srcObj?.messages?.name
    this.fetchCamps(this.tableProps);
  },

  computed: {
    ...mapState('locals', ['sendPagesTab']),
    ...mapGetters('locals', ['sendTextPattern']),
    canMore() {
      return this.value?.filter(item =>
          (!!item.date || (item.gap != null && item.gap >= 0))
          && !!item.title
          && !!item.text.trim()
          && !!item.Operator
          && item.text.includes(this.sendTextPattern)
          && (Object.hasOwn(item, 'link')
            ? !!item.link && this.isDomain(item.link)
            : true)
        )?.length === this.value?.length
        && (this.isCampaign ? !!this.campName && this.campName.length >= 3 : true)
    },
    computedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    computedTabs() {
      return this.sendPagesTab
    }
  },

  watch: {
    computedValue: {
      deep: true,
      handler(val) {
        this.SetSendOperator(val[0]?.Operator)
      }
    },
    computedTabs(val) {
      if (!val)
        this.computedValue = [{
          title: this.$route.meta.title,
          date: this.nowDateTimeString(),
          text: '\nلغو11',
          lang: '',
          msgCount: 0
        }]
      else if (val === 1)
        this.computedValue = [{
          title: 'لینک قابل رهگیری',
          date: this.nowDateTimeString(),
          link: '',
          text: '\nexample.ex/any\nلغو11',
          lang: '',
          msgCount: 0
        }]
      else {
        this.computedValue = []
        this.reloadTable(this.tableProps)
      }
    },
    srcObj(val) {
      val && (this.campName = val.messages?.name)
    }
  },

  methods: {
    ...mapActions('locals', ['SetSendTabs', 'SetSendOperator']),
    fetchCamps(props = this.tableProps) {
      this.$emit('update:loading', true)
      this.campLoading = true

      this.requestApiGet('campaign/list', props)
        .then(({data}) => this.data = data)
        .catch(({response}) => console.log('error in res: ', response))
        .finally(() => {
          this.$emit('update:loading', false)
          this.campLoading = false
        })
    },
    reloadTable(props) {
      debounce(() => this.fetchCamps(props), 500);
    },
    selectRow(data) {
      let arr = []
      data.messages.text.forEach((item, i) => {
        this.$toast.clear()
        if (!item) {
          return this.$toast.warning('لطفا متن/های کمپین انتخابی خود را تصحیح نمایید!', {timeout: 4000})
        } else if (!data.messages.title[i]) {
          return this.$toast.warning('لطفا عنوان/های کمپین انتخابی خود را تصحیح نمایید!', {timeout: 4000})
        } else if (!(data.messages.gap[i] >= 0)) {
          return this.$toast.warning('لطفا فاصله زمانی/های کمپین انتخابی خود را تصحیح نمایید!', {timeout: 4000})
        } else if (!data.messages.Operator || !data.messages.Operator[i]) {
          return this.$toast.warning('لطفا اپراتور/های کمپین انتخابی خود را تصحیح نمایید!', {timeout: 4000})
        }

        arr.push({
          text: item,
          title: data.messages.title[i],
          gap: i === 0 ? 0 : data.messages.gap[i],
          type: data.messages.type ? data.messages.type[i] : null,
          operator: data.messages?.Operator ? data.messages?.Operator[i] : ''
        });
      })

      this.computedValue = arr
      this.$emit('update:campId', data.id)

      const id = data.id;
      $('tr').css("background", "");

      $(`tr:contains("${id}")`).each(function (index, item) {
        if ($(item).find('td').eq(1).text() == id)
          $(item).css('background', 'rgba(99, 0, 244, 0.28)')
      });
    },
    addRow() {
      if (!this.value) return

      let obj = {
        title: `${this.isCampaign ? 'متن' : this.title} ${this.value?.length + 1 || 2}`,
        [this.isCampaign ? 'gap' : 'date']: this.isCampaign ? null : '',
        text: '\n' + this.sendTextPattern,
        type: 'hour'
      }
      if (this.sendPagesTab === 1) {
        obj.link = ''
      }

      if (this.value?.length >= 10) return this.$toast.error('حداکثر 10 مورد میتوان اضافه نمود.')
      this.computedValue.push(obj);
    },
    deleteRow(index) {
      this.computedValue.splice(index, 1)
      if (this.isCampaign && index === 0)
        this.computedValue[0].gap = 0
    },
    addCamp() {
      let obj = {
        name: '',
        title: [],
        text: [],
        gap: [],
        type: [],
        Operator: [],
        count: 0
      };
      this.computedValue.forEach(({title, text, gap, Operator, msgCount, type}) => {
        obj.name = this.campName
        obj.title.push(title)
        obj.text.push(text)
        obj.gap.push(gap)
        obj.type.push(type)
        obj.Operator.push(Operator)
        obj.count += msgCount
      })
      this.$emit('submit', {campaign: obj})
    },
    isDomain(str) {
      var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
      // var without_regex = new RegExp("^([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

      return !str || regex.test(str) || str.length <= 0
    }
  },

  beforeDestroy() {
    this.SetSendTabs(0)
  }
}
</script>