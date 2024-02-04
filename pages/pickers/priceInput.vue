<template>
  <v-text-field v-model="input" :error-messages="error !== undefined ? error : []"
                :maxlength="maxLength ? maxLength + ( maxLength / 3 ) : 13" :messages="priceString" autofocus
                class="centered-input" clearable label="مبلغ (﷼)" outlined v-bind="$attrs" @input="handleInput"
                @keypress="isNumberKey"/>
</template>

<script>
import Num2persian from 'num2persian';

export default {
  name: "priceInput",

  // props: ['value', 'error', 'label', 'dense', 'readonly', 'textCenter', 'maxLength'],

  props: {
    value: [String, Number],
    error: [Object, Array],
    label: String,
    maxLength: Number,
    toChar: Boolean
  },

  data() {
    return {
      input: this.value,
    }
  },

  created: function (event) {
    this.$emit('input', this.convertToRealPrice(this.value + ""))
  },

  mounted() {
    this.input = this.convertToHumanReadablePrice(this.value + "");
  },

  watch: {
    value: function (val) {
      if (val.toString().length > (this.maxLength ?? 10)) {

        let fix = "";
        for (let i = 0; i < (this.maxLength ?? 10); i++) {
          fix = fix + "9";
        }

        this.$emit('input', this.convertToRealPrice(fix))
        return;
      }
      this.input = this.convertToHumanReadablePrice(this.value);
      if ((this.value + "").length > 10) {
        let fixPrice = this.convertToRealPrice((this.value + "").substring(0, 10));
        this.$emit('input', fixPrice)
        this.input = this.convertToHumanReadablePrice(fixPrice);
      }
    },
  },

  computed: {
    priceString: function () {
      return !!this.input ? (this.toChar
          ? Num2persian(this.value)
          : this.persianNum(this.currency(this.value))) + " ریال"
          : '';
    }
  },

  methods: {
    convertToHumanReadablePrice(input) {
      return (this.english(input.toString())).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    },

    convertToRealPrice(input) {
      return parseInt(this.english(input ? (input.toString()).replace(/,/g, '') : '0'))
    },

    handleInput(e) {
      this.$emit('input', this.convertToRealPrice(e))
    },

    isNumberKey: function (evt) {
      let persianChars = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
      evt = (evt) ? evt : window.event;
      let charCode = (evt.which) ? evt.which : evt.keyCode;
      if (((charCode > 31 && (charCode < 48 || charCode > 57)) && (persianChars.indexOf(evt.key) === -1))) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
  }
}
</script>

<style scoped>
.centered-input >>> input {
  text-align: center
}

</style>
