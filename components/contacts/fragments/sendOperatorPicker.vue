<template>
  <v-autocomplete v-model="computedValue" :disabled="blacklistCheckFailed" :items="lines" :label="label"
                  :loading="loading" :placeholder="$t('FORMS.SourceNumber')" :rules="[rules.line]" dense outlined
                  prepend-inner-icon="sms" @change="checkPhoneType"/>
</template>

<script>
import {mapGetters} from "vuex";
import i18n from "@/plugins/EasyModal/i18n";

export default {
  name: "sendOperatorPicker",

  props: {
    value: [String, Number],
    label: {
      type: String,
      default: i18n.t('PROPS.SOURCE_NUMBER_LABEL')
    }
  },

  data() {
    return {
      i18n,
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
        this.$modal.info(
            this.i18n.t('MODAL.INFO_TITLE'),
            this.i18n.t('MODAL.INFO_MESSAGE_NEWS_NUMBER', { number: this.i18n.t('SPECIAL_NUMBERS.NEWS_SEND') })
        );
    },
  }
}
</script>

<style scoped>

</style>