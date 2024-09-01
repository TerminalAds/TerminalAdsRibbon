<template>
  <div>
    <slot name="default" v-bind="{inputClass}">
      <v-text-field :class="[inputClass, wrapperClass]" :readonly="!editable" :value="getDisplayValue" v-bind="$attrs"/>
    </slot>

    <date-picker v-model="computedValue" :auto-submit="autoSubmit" :custom-input="`.${inputClass}`"
                 :disable="disable" :display-format="getJFormat" :format="format" :max="max" :min="min"
                 :multiple="multiple" :range="$attrs.range" :type="type"/>
  </div>

</template>

<script>
export default {
  name: "custom-date-picker",

  props: {
    value: [String, Array],
    autoSubmit: {
      type: Boolean,
      default: true
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss'
    },
    type: {
      type: String,
      default: 'datetime'
    },
    inputClass: {
      type: String,
      default: 'custom-input'
    },
    wrapperClass: String,
    min: String,
    max: String,
    nullable: Boolean,
    sp: {
      type: String,
      default: '-'
    },
    editable: Boolean,
    multiple: Boolean,
    sortable: Boolean,
    disable: Array,
  },

  data: () => ({
    date: '',
  }),

  mounted() {
    if (!this.value && !this.nullable) {
      const moment = require('moment')
      this.computedValue = moment().format(this.format)
    } else {
      let val = this.value;
      this.computedValue = null;
      this.$nextTick(() => {
        this.computedValue = val
      });
    }
  },

  computed: {
    computedValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', this.checkSort(val));
      }
    },
    getJFormat: function () {
      let sp = this.sp
      switch (this.type) {
        case 'datetime':
          return `jYYYY${sp}jMM${sp}jDD HH:mm:ss`
        case 'date':
          return `jYYYY${sp}jMM${sp}jDD`
        case 'time':
          return 'HH:mm:ss'
      }
    },
    getDisplayValue() {
      if (!this.value) return ''

      const moment = require('moment-jalaali')

      return moment(this.value).format(this.getJFormat)
    }
  },

  methods: {
    checkSort(val) {
      if (!this.sortable) return val

      const moment = require('moment')
      let dates = val?.map(d => new Date(d)).sort((a, b) => a - b);
      return dates?.map(item => moment(item).format('YYYY-MM-DD'))
    },
    clearInput() {
      console.log('value: ', this.value)
      this.computedValue = ''
    }
  }
}
</script>

<style scoped>

</style>