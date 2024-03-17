<template>
  <custom-popup v-model="computedValue" :cons="{title: info.gateway.name}" hide-confirm max-width="430">
    <div class="pa-4">
      <v-card class="rounded-xl mb-4">
        <v-card-subtitle class="text-center pb-1">
          مبلغ قابل پرداخت:
        </v-card-subtitle>
        <v-card-title class="justify-center text-center pt-1 font-size-h3">
          {{ price(info.price) }}
          <span class="font-size-h6 grey--text">ریال</span>
        </v-card-title>
      </v-card>

      <v-responsive :style="getCardBg" aspect-ratio="1.545"
                    class="rounded-xl mb-4 card-wrapper" max-width="450" width="100%">
        <div class="fill-height d-flex w-100 flex-column">
          <v-card-title style="padding-top: 5%;">
            <v-img v-if="!!banksPrefix" :src="banksPrefix.icon" contain max-width="64"/>
          </v-card-title>
          <v-spacer/>
          <v-card-text class="font-size-h2 text-center white--text font-weight-bold" style="direction: ltr">
            {{ displayPan(data.PAN) }}
          </v-card-text>
          <v-spacer/>
        </div>
      </v-responsive>
    </div>

    <v-card class="rounded-t-xl card-data-wrapper" elevation="5">
      <v-card-text>
        <v-text-field :rules="[rules.cardNumber]" :value="data.PAN | displayPanFilter" class="rounded-lg" color="info"
                      label="شماره کارت" max="19" outlined @input="updateValue">
          <template v-slot:append>
            <v-img :src="!!banksPrefix ? banksPrefix.icon : ''" contain min-width="32" width="32"/>
          </template>
        </v-text-field>

        <v-text-field v-model="data.Pin2" class="rounded-lg" color="info" label="رمز دوم" outlined>
          <template v-slot:append>
            <v-btn class="rounded-lg" color="info" depressed>
              دریافت رمز دوم
            </v-btn>
          </template>
        </v-text-field>

        <v-row class="expire-wrapper" no-gutters>
          <v-col class="pe-md-1" cols="12" md="6">
            <v-text-field v-model="data.Pin2" class="rounded-lg" color="info" hide-details label="CVV2" outlined/>
          </v-col>

          <v-col class="ps-md-1" cols="12" md="6">
            <v-card class="rounded-lg d-flex flex-nowrap align-center fill-height" outlined>
              <v-text-field class="mx-2" dense hide-details placeholder="ماه"/>
              <v-divider class="align-self-center" style="height: 70%;min-height: 80%" vertical/>
              <v-text-field class="mx-2" dense hide-details placeholder="سال"/>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </custom-popup>
</template>

<script>
import CustomPopup from "../../plugins/popup/customPopup.vue";
import {banks} from "../../assets/js/banksInfo";

export default {
  name: "increaseInApp",

  components: {CustomPopup},

  props: {
    value: Boolean,
    info: Object
  },

  filters: {
    displayPanFilter(input) {
      return input.toString().replace(/ /g, '').replace(/(.{4})/g, '$1 ')
    }
  },

  data() {
    return {
      banksInfo: [],
      data: {
        PAN: '',
        CV: '',
        Pin2: '',
        ExpM: '',
        ExpY: ''
      },
      rules: {
        cardNumber: v => !!v.trim() && v?.replace(/ /g, '').length === 16 || 'شماره کارت صحیح نمی باشد.'
      }
    }
  },

  mounted() {
    this.banksInfo = banks
  },

  computed: {
    computedValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    banksPrefix() {
      return this.banksInfo.findPrefix(this.data.PAN?.replace(' ', '') ?? '')
    },
    getCardBg() {
      return `background: url(${require('../../assets/img/line_pattern.png')}) ${!!this.banksPrefix ? this.banksPrefix.color : 'blue'};`
    }
  },

  methods: {
    displayPan(input) {
      return input.toString().replace(/ /g, '').replace(/(.{4})/g, '$1 ')
    },
    updateValue(e) {
      let str = e.replace(/ /g, '');
      if (str.length <= 16)
        this.data.PAN = str;
      else
        this.data.PAN = 1234;

    }
  }
}
</script>

<style scoped>
.card-data-wrapper >>> .v-text-field input {
  direction: ltr !important;
}

.v-autocomplete >>> .v-input__prepend-inner,
.card-data-wrapper >>> .v-input__append-inner {
  align-self: center;
  margin: 0 !important;
}

.card-wrapper {
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: top !important;
}

.card-data-wrapper >>> input::-webkit-outer-spin-button,
.card-data-wrapper >>> input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.expire-wrapper >>> input {
  text-align: center;
}
</style>