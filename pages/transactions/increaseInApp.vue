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
          <v-card-text class="white--text pb-6 px-6 d-flex justify-space-between">
            <div>
              تاریخ انقضا:
              <b class="mx-1">
                {{ data.ExpM }}
                <span v-show="!!data.ExpY || !!data.ExpM" class="mx-1">/</span>
                {{ data.ExpY }}
              </b>
            </div>

            <div>
              <b class="mx-1">{{ data.CV }}</b>
              :CVV2
            </div>
          </v-card-text>
        </div>
      </v-responsive>
    </div>

    <v-card class="rounded-t-xl card-data-wrapper mt-8" elevation="5">
      <div class="timer">
        08:23
      </div>

      <v-card-text>
        <v-text-field :rules="[rules.cardNumber]" :value="data.PAN | displayPanFilter" autocomplete="off" autofocus
                      class="rounded-lg" color="info" label="شماره کارت" maxlength="19" outlined tabindex="1"
                      @input="updateValue($event)">
          <template v-slot:append>
            <v-img :src="!!banksPrefix ? banksPrefix.icon : ''" contain min-width="32" width="32"/>
          </template>
        </v-text-field>

        <v-text-field v-model="data.Pin2" autocomplete="new-password" class="rounded-lg rtl" color="info"
                      label="رمز دوم" outlined tabindex="2" type="password">
          <template v-slot:append>
            <v-btn class="rounded-lg" color="info" depressed>
              دریافت رمز دوم
            </v-btn>
          </template>
        </v-text-field>

        <v-row class="expire-wrapper position-relative" no-gutters>
          <v-col class="pe-md-1" cols="12" md="6">
            <v-text-field v-model="data.CV" :rules="[rules.cv]" class="rounded-lg" color="info" hide-details
                          label="CVV2" outlined tabindex="3" type="password"/>
          </v-col>

          <v-col class="ps-md-1" cols="12" md="6">
            <v-card class="rounded-lg d-flex flex-nowrap align-center fill-height expire-card" outlined>
              <v-text-field v-model="data.ExpM" class="mx-2" color="info" dense hide-details max="12" min="0"
                            oninput="if(Number(this.value) > Number(this.max)) this.value = this.max;
                            else if(Number(this.value) < Number(this.min)) this.value = this.min;
                            if (this.value.length === 1) this.value = `0${this.value}`;
                            else if (this.value.length > 2) this.value = this.value.substring(1)"
                            placeholder="ماه" tabindex="4" type="number"/>
              <v-divider class="align-self-center" style="height: 70%;min-height: 80%" vertical/>
              <v-text-field v-model="data.ExpY" class="mx-2" color="info" dense hide-details max="50" min="0"
                            oninput="if(Number(this.value) > Number(this.max))
                              this.value = this.max;
                            else if(Number(this.value) < Number(this.min))
                              this.value = this.min;"
                            placeholder="سال" tabindex="5" type="number"/>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn block class="rounded-lg" color="info" depressed tabindex="6">
          پرداخت
        </v-btn>
      </v-card-actions>
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
        cardNumber: v => !!v.trim() && v?.replace(/ /g, '').length === 16 || 'شماره کارت صحیح نمی باشد',
        cv: v => !!v && v.length >= 3 && v.length <= 4 || 'رمز CVV2 صحیح نیست',
      }
    }
  },

  mounted() {
    this.banksInfo = banks

    this.$DashboardAxios.post('/api/top/key')
        .then(({data}) => console.log('data top: ', data))
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
      return this.banksInfo.findPrefix(this.data.PAN?.replace(/ /g, '') ?? '')
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
      this.data.PAN = e.replace(/ /g, '');
    }
  }
}
</script>

<style scoped>
.card-wrapper {
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: top !important;
}

.timer {
  position: absolute;
  left: 30px;
  top: 0;
  padding: 4px 8px;
  border-radius: 12px 12px 0 0 !important;
  background: var(--v-info-base);
  color: #fff;
  transform: translateY(-100%);
  min-width: 80px;
  text-align: center;
  line-height: 1.5em;
}

.card-data-wrapper >>> .v-text-field:not(.rtl) input {
  direction: ltr !important;
}

.card-data-wrapper >>> .v-text-field :after,
.card-data-wrapper >>> .v-text-field :before {
  content: none !important;
}

.v-autocomplete >>> .v-input__prepend-inner,
.card-data-wrapper >>> .v-input__append-inner {
  align-self: center;
  margin: 0 !important;
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

.expire-card::before {
  content: 'تاریخ انقضا';
  background: #fff;
  padding: 4px;
  position: absolute;
  top: 0;
  right: 8px;
  transform: translateY(-50%);
}
</style>