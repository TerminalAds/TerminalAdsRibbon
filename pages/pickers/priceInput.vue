<template>
    <v-text-field outlined :messages="priceString"
                  class="centered-input" autofocus
                  v-model="input" clearable
                  :maxlength="maxLength ? maxLength + ( maxLength / 3 ) : 13"
                  :error-messages="error !== undefined ? error : []"
                  :dense="dense" @keypress="isNumberKey" @input="handleInput"
                  :readonly="readonly" append-icon="mdi-currency-rial" :label="label"/>
</template>
<script>
export default {
    name: "priceInput",

    props: ['value', 'error', 'label', 'dense', 'readonly', 'textCenter', 'maxLength'],

    model: {
        prop: 'value',
        event: 'priceInput'
    },

    data: function () {
        return {
            input: this.value,
        }
    },

    created: function (event) {
        this.$emit('priceInput', this.convertToRealPrice(this.value + ""))
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

                this.$emit('priceInput', this.convertToRealPrice(fix))
                return;
            }
            this.input = this.convertToHumanReadablePrice(this.value);
            if ((this.value + "").length > 10) {
                let fixPrice = this.convertToRealPrice((this.value + "").substring(0, 10));
                this.$emit('priceInput', fixPrice)
                this.input = this.convertToHumanReadablePrice(fixPrice);
            }
        },
    },

    computed: {
        priceString: function () {
            return this.input == null ? "" : (this.value + "") + " ریال";
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
            this.$emit('priceInput', this.convertToRealPrice(e))
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
