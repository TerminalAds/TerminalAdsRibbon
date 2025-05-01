<template>
  <v-autocomplete v-model="computedValue" :disabled="blacklistCheckFailed" :items="lines" :label="label"
                  :loading="loading" :placeholder="$t('FORMS.SourceNumber')" :rules="[rules.line]" dense outlined
                  prepend-inner-icon="sms" @change="checkPhoneType"/>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "sendOperatorPicker",

  props: {
    value: [String, Number],
    label: {
      type: String,
      default: 'سرشماره'
    }
  },

  data() {
    return {
      defaultNumber: null,
      rules: {
        line: v => !!v || this.$t("ERRORS.NoSelectedLineNumber"),
      }
    }
  },

  mounted() {
    this.computedValue = this.lines[0]?.value
    this.$forceUpdate()
  },

  computed: {
    ...mapGetters('smsNumbersIndex', ['lines', 'loading']),
    ...mapGetters('locals', ['blacklistCheckFailed', 'blacklistAlt', 'blacklistAlternateSends']),
    computedValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },

  watch: {
    blacklistCheckFailed(val) {
      if (val) {
        this.defaultNumber = this.computedValue
        this.computedValue = this.blacklistAlternateSends.find(item => item.value === this.blacklistAlt).number
      } else {
        this.computedValue = this.defaultNumber
      }
    },
    blacklistAlt(val) {
      this.computedValue = this.blacklistAlternateSends.find(item => item.value === val).number
    },
    lines: {
      deep: true,
      handler(val) {
        this.computedValue = val[0]?.value
        this.$forceUpdate()
      }
    }
  },

  methods: {
    checkPhoneType(val) {
      this.$emit('change')
      if (val === '123450')
        this.$modal.info('توجه فرمایید.', 'در زمان  ارسال پیامک با سرشماره "ارسال خبری"  حداقل تعداد بایستی ۱۰۰۰ عدد باشد.');
    },
  }
}
</script>

<style scoped>

</style>