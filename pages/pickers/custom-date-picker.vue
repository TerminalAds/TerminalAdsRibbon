<template>
  <div class="d-flex align-top">
    <slot name="default" v-bind="{ inputClass }">
      <v-text-field
        :class="[inputClass, wrapperClass]"
        :readonly="!editable"
        :value="getDisplayValue"
        v-bind="computedAttrs"
      />
    </slot>

    <v-expand-x-transition mode="out-in">
      <slot v-if="!!computedValuePicker" name="clear-action">
        <v-btn class="ms-2" icon @click="computedValuePicker = undefined">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </slot>
    </v-expand-x-transition>

    <date-picker
      v-model="computedValuePicker"
      :auto-submit="autoSubmit"
      :custom-input="`.${inputClass}`"
      :disable="disable"
      :display-format="getJFormat"
      :format="format"
      :max="max"
      :min="min"
      :multiple="multiple"
      :range="$attrs.range"
      :type="type"
    />
  </div>
</template>

<script>
export default {
  name: "custom-date-picker",

  props: {
    value: [String, Array],
    autoSubmit: {
      type: Boolean,
      default: true,
    },
    format: {
      type: String,
      default: "YYYY-MM-DD HH:mm:ss",
    },
    type: {
      type: String,
      default: "datetime",
    },
    inputClass: {
      type: String,
      default: "custom-input",
    },
    wrapperClass: String,
    min: String,
    max: String,
    nullable: Boolean,
    sp: {
      type: String,
      default: "-",
    },
    editable: Boolean,
    multiple: Boolean,
    sortable: Boolean,
    disable: Array,
  },

  data: () => ({
    date: "",
  }),

  mounted() {
    if (!this.value && !this.nullable) {
      const moment = require("moment");
      this.computedValuePicker = moment().format(this.format);
    } else {
      let val = this.value;
      this.computedValuePicker = null;
      this.$nextTick(() => {
        this.computedValuePicker = val;
      });
    }
  },

  computed: {
    computedValuePicker: {
      get() {
        return this.value;
      },
      set(val) {
        if (val !== this.value) {
          this.$emit("input", this.checkSort(val));
        }
      },
    },
    getJFormat: function () {
      let sp = this.sp;
      let dateFormat =
        this.format.indexOf("j") >= 0
          ? `YYYY${sp}MM${sp}DD`
          : `jYYYY${sp}jMM${sp}jDD`;

      switch (this.type) {
        case "datetime":
          return `${dateFormat} HH:mm:ss`;
        case "date":
          return dateFormat;
        case "time":
          return "HH:mm:ss";
      }
    },
    getDisplayValue() {
      if (!this.value) return "";

      const moment = require("moment-jalaali");
      const date_str = moment().format("YYYY-MM-DD");

      const init_multi = (value, isTime = false) => {
        if (isTime)
          return value
            .map((item) =>
              moment(`${date_str} ${item}`).format(this.getJFormat)
            )
            .join(", ");

        return value
          .map((item) => moment(item).format(this.getJFormat))
          .join(", ");
      };

      if (this.multiple) {
        return init_multi(this.value, this.type === "time");
      }

      if (this.type === "time")
        return moment(`${date_str} ${this.value}`).format(this.getJFormat);

      return moment(this.value).format(this.getJFormat);
    },
    computedAttrs() {
      let attrs = {
        ...this.$attrs,
      };

      if (!this.$attrs?.hasOwnProperty("append-icon"))
        attrs["append-icon"] = "mdi-calendar-month";

      return attrs;
    },
  },

  methods: {
    checkSort(val) {
      if (!this.sortable) return val;

      const moment = require("moment");
      let dates = val?.map((d) => new Date(d)).sort((a, b) => a - b);
      return dates?.map((item) => moment(item).format("YYYY-MM-DD"));
    },
    clearInput() {
      console.log("value: ", this.value);
      this.computedValuePicker = "";
    },
  },
};
</script>
