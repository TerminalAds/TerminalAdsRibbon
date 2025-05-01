<template>
  <v-card :loading="loading" class="rounded-lg mb-2 pa-2" outlined>
    <v-card-title class="pt-2 px-2 pb-0">
      {{ title }}

      <div v-if="index === 0 && loading" class="pa-2 font-size-h6 red--text">
        درحال ارسال
        <v-progress-circular color="red" indeterminate size="20" width="2"/>
      </div>
      <template v-else>
        {{ index + 1 }}
      </template>

      <v-spacer/>
      <v-btn v-if="showDelete && !loading" :loading="loading" icon @click="$emit('deleteRow')">
        <v-icon color="red">mdi-delete</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider/>

    <v-row no-gutters>
      <v-col v-if="Object.hasOwn(item, 'date')" class="pa-2" cols="12" md="6">
        <custom-date-picker v-model="computedItem.date" :label="$t('FORMS.SendTime')" :min="nowDateTimeString()"
                            auto-submit display-format="jYYYY-jMM-jDD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"
                            type="datetime"/>

        <span v-show="!computedItem.date" class="red--text">انتخاب تاریخ الزامی است.</span>
      </v-col>

      <v-col v-else-if="index !== 0" class="pa-2" cols="12" md="6">
        <v-text-field v-model="computedItem.gap" :max="gapMinMax.max" :min="gapMinMax.min" :suffix="gapSuffix" clearable
                      dense hide-spin-buttons label="فاصله زمانی"
                      oninput="if(Number(this.value) > Number(this.max)) this.value = this.max;
                      else if(Number(this.value) < Number(this.min)) this.value = this.min;" outlined
                      placeholder="فاصله زمانی از پیام قبلی" type="number">
          <template v-slot:append-outer>
            <v-menu offset-y>
              <template v-slot:activator="{on, attrs}">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-calendar-today</v-icon>
                </v-btn>
              </template>

              <v-list dense min-width="120">
                <v-list-item v-for="(item, i) in gapItems" :key="i" dense @click="computedItem.type = item.value">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.text }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-text-field>
      </v-col>

      <v-col :md="!!Object.hasOwn(item, 'date') || index > 0 ? 6 : 12" class="pa-2" cols="12">
        <send-operator-picker v-model="computedItem.Operator"/>
      </v-col>

      <v-col class="pa-2" cols="12">
        <v-text-field v-model="computedItem.title" :placeholder="$t('FORMS.Title')" class="pt-0 mt-0" dense
                      hide-selected label="عنوان" outlined/>
      </v-col>

      <v-col v-if="tracking" class="pa-2" cols="12">
        <v-divider/>
        <v-text-field v-model="computedItem.link" :rules="rules.link" clear-icon="mdi-close-circle-outline" clearable
                      dense hint="any" label="وارد کردن لینک" outlined persistent-hint
                      placeholder="مثال‌: (https://example.ex/any)" @update:error="(e) => linkErrors = e">
          <template v-if="!linkErrors" v-slot:message>
            لینک شما پس از کوتاه شدن به
            <span class="primary--text">طول ۱۴ حرف</span>
            جایگزین
            <span class="primary--text">(example.ex/any)</span>
            داخل متن قرار گرفته و لینک اختصاصی برای هر پیام ارسال خواهد شد.
          </template>
          <template v-slot:append>
            <v-icon v-if="!linkErrors && !!computedItem.link" color="green">mdi-check</v-icon>
          </template>
        </v-text-field>
      </v-col>

      <v-col class="pa-2" cols="12">
        <suggest-text v-model="computedItem.text" :label="$t('FORMS.Text')" :rules="rules.text"
                      :text-suggest="textSuggest" @openCamp="$emit('openCamp')"
                      @textInfo="(e) => {computedItem.msgCount = e.smsCount;computedItem.lang = e.lang.name}"/>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import SuggestText from "../SuggestBox/suggestInput.vue";
import SendOperatorPicker from "../fragments/sendOperatorPicker.vue";
import CustomDatePicker from "../../../pages/pickers/custom-date-picker.vue";
import {mapGetters} from "vuex";

export default {
  name: "campaignListItem",

  components: {CustomDatePicker, SendOperatorPicker, SuggestText},

  props: {
    item: Object,
    index: Number,
    loading: Boolean,
    textSuggest: {
      type: Boolean,
      default: true
    },
    title: String,
    showDelete: Boolean,
    tracking: Boolean
  },

  data() {
    return {
      linkErrors: false,
      rules: {
        text: [
          (n) => !!n || this.$t("ERRORS.EmptyText"),
          (n) => n.includes(this.sendTextPattern)
            || `بایستی شامل عبارت ${this.sendTextPattern} باشد`,
        ],
        link: [n => this.isDomain(n) || 'لینک صحیح وارد نمایید']
      },
      gapItems: [
        {value: 'min', text: 'دقیقه', min: 1, max: 60},
        {value: 'hour', text: 'ساعت', min: 1, max: 24},
        {value: 'day', text: 'روز', min: 1, max: 30},
        {value: 'week', text: 'هفته', min: 1, max: 4},
      ]
    }
  },

  computed: {
    ...mapGetters('locals', ['sendTextPattern']),
    computedItem: {
      get() {
        return this.item
      },
      set(val) {
        this.$emit('update:item', val)
      }
    },
    gapSuffix() {
      return this.computedItem.type
        ? this.gapItems.find(item => item.value === this.computedItem.type)?.text
        : ''
    },
    gapMinMax() {
      return this.computedItem.type
        ? this.gapItems.find(item => item.value === this.computedItem.type)
        : {
          min: 0,
          max: 24
        }
    }
  },

  methods: {
    isDomain(str) {
      var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
      // var without_regex = new RegExp("^([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

      return !str || regex.test(str) || str.length <= 0
    }
  }
}
</script>

<style scoped>

</style>