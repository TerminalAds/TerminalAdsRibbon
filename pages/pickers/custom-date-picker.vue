<template>
  <div class="d-flex align-top">
    <slot name="default" v-bind="{inputClass}">
      <v-text-field :class="[inputClass, wrapperClass]" :readonly="!editable" :value="getDisplayValue" v-bind="$attrs"/>
    </slot>

    <v-expand-x-transition mode="out-in">
      <slot v-if="!!computedValue" name="clear-action">
        <v-btn class="ms-2" icon @click="computedValue = undefined">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </slot>
    </v-expand-x-transition>

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
      let dateFormat = this.format.indexOf('j') >= 0
        ? `YYYY${sp}MM${sp}DD`
        : `jYYYY${sp}jMM${sp}jDD`

      switch (this.type) {
        case 'datetime':
          return `${dateFormat} HH:mm:ss`
        case 'date':
          return dateFormat
        case 'time':
          return 'HH:mm:ss'
      }
    },
    getDisplayValue() {
      if (!this.value) return ''

      const moment = require('moment-jalaali')

      const date_str = moment().format('YYYY-MM-DD')

      if (this.type === 'time') {
        if (this.multiple) {
          return this.value.map(item => moment(`${date_str} ${item}`).format(this.getJFormat))
        }
        return moment(`${date_str} ${this.value}`).format(this.getJFormat)
      }

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