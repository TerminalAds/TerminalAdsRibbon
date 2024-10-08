<template>
  <div class="container-fluid rounded" style="background-color: white">
    <p class="mt-2 mb-0">انتخاب مبلغ :</p>

    <v-flex class="flex-column align-items-center mt-4">
      <v-btn-toggle v-model="quickCharge" class="flex-wrap justify-space-around w-100" dense mandatory>
        <v-btn v-for="(price, i) in costs" :key="price.val"
               :class="[price.class, {[price.classHover] : quickCharge === price.val}]" :style="price.style"
               :value="price.val" style="margin: 8px 0 0 8px" @click="data.price=price.val">
          <span class="d-inline-block">{{ price.val | numericPersianNumber }} ریال</span>
        </v-btn>

        <v-btn :class="['btn-charge-wallet', {'btn-charge-wallet-hover' : !quickCharge}]" :value="0"
               style="border-color: rgb(2, 191, 180) !important;margin: 8px 0 0 8px ;">
          <span class="">{{ $t('WALLET.CustomCharge') }}</span>
        </v-btn>
      </v-btn-toggle>
    </v-flex>

    <div>
      <v-expand-transition>
        <div v-if="!quickCharge" class="card p-4 my-4">
          <h3 class="text-center my-4">{{ $t('WALLET.CustomCharge') }}</h3>
          <div class="col-md-6 align-self-center">
            <price-input v-model="data.price" label="مبلغ" text-center="true"/>
            <p v-if="error" class="red--text" style="color: darkred">{{ error }}</p>
            <v-row class="justify-content-center py-3 text-center">
              <v-flex v-for="(cost, index) in costsDefault" :key="index" class="p-2" lg6 md6 sm12 xl6 xs12>
                <v-btn :id="cost.val" :data-price="cost.val*(10000)" class="charge btn-buy mx-3 btn-dec-with-text"
                       @click="prices(cost.val)">
                  <v-icon class="mx-2" small>
                    mdi-plus-circle
                  </v-icon>

                  {{ cost.val | numericPersianNumber }}

                  <p class="pt-3 pr-1">ریـال</p>
                </v-btn>
              </v-flex>
            </v-row>
          </div>

        </div>
      </v-expand-transition>
    </div>

    <p class="mt-4">{{ $t('WALLET.GateWay') }} :</p>

    <div class=" d-flex justify-content-center rounded-lg pa-1 wallet-charge mt-3 py-3">

      <p v-if="!gateways" class="my-10">{{ $t('WALLET.noGateWay') }}</p>

      <v-btn-toggle v-else-if="gateways.length" v-model="data.gateway" :mandatory="gateways.length === 1">
        <v-btn v-for="gate in gateways" :key="gate.id" :class="{'activeGateWay' : data.gateway.id === gate.id}"
               :style="{borderWidth: data.gateway.id !== gate.id ? 'thin !important' : ''}" :value="gate"
               class="mx-2 py-2 rounded-lg" height="fit-content" outlined style="background-color: aliceblue">

          <div v-if="getGateWayImage(gate.driver)">
            <v-img :src="getGateWayImage(gate.driver)" class="my-2 mx-auto" contain height="5rem" width="5rem"/>
            <div class="pa-1 text-center">{{ gate.name }}</div>
          </div>

          <div v-else class="d-flex flex-column">
            <v-icon class="mt-4">fa-credit-card</v-icon>
            <p class="mt-2">{{ gate.name }}</p>
          </div>
        </v-btn>
      </v-btn-toggle>

      <div v-else>
        <semipolar-spinner :animation-duration="2000" :size="40" color="#8b8e94"/>
      </div>
    </div>

    <increase-in-app v-model="showInApp" :info="data"/>

    <div class="my-4 d-flex flex-row-reverse">
      <v-btn :disabled="!isValidData" :loading="loading" block class="btn-payment" depressed @click="payment">
        <v-icon class="ml-2">fa-credit-card</v-icon>
        {{ $t('WALLET.Pay') }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import priceInput from "../../pages/pickers/priceInput";
import {SemipolarSpinner} from 'epic-spinners'
import IncreaseInApp from "./increaseInApp.vue";

export default {
  components: {IncreaseInApp, priceInput, SemipolarSpinner},

  name: "increaseTransactions",

  data() {
    return {
      loading: false,
      quickCharge: 10_000_000,
      costs: [
        {
          val: 10_000_000,
          class: 'btn-1000000',
          classHover: 'btn-1000000-hover',
          style: "border-color: #44b5ef !important",
        },
        {
          val: 20_000_000,
          class: 'btn-2000000',
          classHover: 'btn-2000000-hover',
          style: "border-color: #ef022a !important",
        },
        {
          val: 30_000_000,
          class: 'btn-3000000',
          classHover: 'btn-3000000-hover',
          style: "border-color: #2990ff !important",
        },
        {
          val: 50_000_000,
          class: 'btn-5000000',
          classHover: 'btn-5000000-hover',
          style: "border-color: #29d155 !important",
        },
        {
          val: 100_000_000,
          class: 'btn-10000000',
          classHover: 'btn-10000000-hover',
          style: "border-color: rgb(150, 85, 0) !important",
        },
      ],
      costsDefault: [
        {
          val: 2_000_000,
          class: 'btn-2000000',
        },
        {
          val: 3_500_000,
          class: 'btn-1000000',
        },
        {
          val: 5_000_000,
          class: 'btn-3000000'
        },
        {
          val: 10_000_000,
          class: 'btn-10000000'
        },
      ],
      balance: 0,
      radio: "giftCard",
      gateways: [],
      data: {
        price: 10_000_000,
        gateway: {}
      },
      min: 2_000_000,
      max: 500_000_000,
      error: "",
      gateObj: {
        zarinpal: {img: 'media/gateways/zarinpal.png', name: 'زرین پال'},
        bazar: {img: 'media/gateways/directPay.svg', name: 'پرداخت آزاد'}
      },
      showInApp: false
    }
  },

  mounted() {
    this.getGateways()
  },

  computed: {
    isValidData() {
      return !!(this.gateways ? this.gateways.length : false)
        && this.data.price
        && this.isValidPrice(this.min, this.max)
        && !!this.data.gateway && !!Object.keys(this.data.gateway).length
    }
  },

  watch: {
    quickCharge(val) {
      if (val === 0) this.data.price = 0
    },
    'data.price'() {
      if (this.isValidPrice(this.min, this.max)) {
        this.error = "";
      } else {
        this.error = this.$t('WALLET.PriceNotInRange', {
          min: this.persianNum(String(this.min).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")),
          max: this.persianNum(String(this.max).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"))
        })
      }
    }
  },

  methods: {
    ...mapActions('ribbon', ['toggleWalletDialog']),
    prices(cost) {
      if (this.data.price === '')
        this.data.price = 0;
      this.data.price = this.data.price + cost;
    },
    getGateways() {
      this.$DashboardAxios.get('/api/core/gateways')
        .then(({data}) => {
          if (data) {
            this.gateways = data.data
          } else {
            this.gateways = undefined
          }
        })
        .catch(({response}) => {
          if (response.data != null && response.data.message != null) this.$toast.error(response.data.message);
          else this.$toast.error('ناموفق');
          this.errors = response.data.errors;
          this.gateways = undefined
        })
    },
    // redirectMelatGateway(link, RefId) {
    //   const form = document.createElement("form");
    //   const element1 = document.createElement("input");
    //
    //   form.method = "POST";
    //   form.action = link;
    //
    //   element1.value = RefId;
    //   element1.name = "RefId";
    //   form.appendChild(element1);
    //
    //   document.body.appendChild(form);
    //
    //   form.submit();
    // },
    payment() {
      if (this.data.gateway.driver === 'bazar') {
        this.payBazar()
        return
      } else if (this.data.gateway.driver === 'top') {
        this.showInApp = true
        return
      }

      this.loading = true;
      if (this.data.price < this.min) {
        this.$toast.error('مبلغ وارد شده کمتر از ۲۰۰۰۰۰ تومان است.');
        return;
      }
      // this.$DashboardAxios.post('https://wallet.terminalads.com/api/transactions/charge', {
      // let backUrl = this.front_url + '/?token=' + localStorage.getItem('id_token') + '#/payment-callback-new'
      let backUrl = this.front_url + '/#/payment-callback-new'
      this.$DashboardAxios.post('/api/newWallet/charge', {
        amount: this.data.price,
        gateway: this.data.gateway.driver,
        // ['zarinpal', 'zarinpal2'].includes(this.data.gateway.driver)
        // ? this.data.gateway.driver
        // : undefined,
        callbackUrl: backUrl
      })
        .then(({data}) => {
          // window.location.href = data.data.data.action
          // window.location.href = data.data.data.url.replace('sandbox.', '')
          // console.log('href: ', data.data.data.url.replace('sandbox.', ''))
          if (['behpardakhtPublic', 'behpardakht'].includes(this.data.gateway.driver)) {
            this.payBehpardakht(data)
            return
          }

          let a = document.createElement('a');
          a.href = data.data.data.action
          a.target = '_blank'
          a.click()
        })
        .catch((e) => {
          this.$toast.error(this.$t('WALLET.ErrorOnRedirectToGateWay'));
        })
        .finally(() => this.loading = false);
    },
    payBazar() {
      if (this.data.price <= 100000)
        return this.$toast.error('مبلغ کمتر از 10 هزار تومان نمیتواند باشد!')

      this.loading = true

      this.$DashboardAxios.get(`https://robot-api.terminalads.com/api/user/bazar?amount=${this.data.price}`)
        .then(({data}) => {
          this.$toast.info('در صورت پرداخت موفق، 1 الی 3 دقیقه زمان لازم است تا کیف پول شما شارژ شود.', {timeout: 5000})
          window.open(data.data.redirect, '_blank');
          this.toggleWalletDialog(false);
        })
        .catch(({response}) => this.$toast.error(this.$t('WALLET.ErrorOnRedirectToGateWay')))
        .finally(() => this.loading = false)
    },
    payBehpardakht(data) {
      var form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute("action", "https://bpm.shaparak.ir/pgwchannel/startpay.mellat");
      form.setAttribute("target", "_self");
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("name", "RefId");
      hiddenField.setAttribute("value", data?.data?.data?.input?.RefId);
      form.appendChild(hiddenField);
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    },
    getGateWayImage(gatewayDriver) {
      switch (gatewayDriver) {
        case "zarinpal":
        case "zarinpal2":
          return "media/gateways/zarinpal.png";
        case "bazar":
          return "media/gateways/directPay.svg";
        case "parsian":
          return "media/gateways/parsian.png";
        case "mellat":
          return "media/gateways/mellat.png";
        case "top":
          return require('../../assets/img/gateways/inAppPayment.png')
        case "behpardakht":
        case "behpardakhtPublic":
          return require('../../assets/img/gateways/behpardakht.png')
      }
      return false;
    },
    isValidPrice(min, max) {
      return min <= this.data.price && this.data.price <= max;
    }
  },
}
</script>

<style>
.btn-1000000, .btn-2000000, .btn-3000000, .btn-5000000, .btn-10000000 {
  background-color: white !important;
  cursor: pointer;
}

.btn-1000000 span, .btn-2000000 span, .btn-3000000 span, .btn-5000000 span, .btn-10000000 span {
  font-family: vazir !important;
  font-weight: bold !important;
  cursor: pointer;
}
</style>

<style scoped>
/*.fa-credit-card {*/
/*  color: blue!important;*/
/*  text-decoration: none!important;*/
/*  transition: 0.7s!important;*/
/*}*/

.activeGateWay {
  border-radius: 1rem !important;
  border: #0d8ddc solid 5px !important;
  cursor: pointer;
}

.btn-1000000, .btn-2000000, .btn-3000000, .btn-5000000, .btn-10000000 {
  border-radius: 5px !important;
  display: block;
  text-align: center;
  text-transform: uppercase;
  transition: 0.7s !important;
  font-weight: bold !important;
  background-size: 200% auto;
  cursor: pointer;
}


.btn-1000000:hover, .btn-2000000:hover, .btn-3000000:hover, .btn-5000000:hover, .btn-10000000:hover {
  background-position: right center;
  color: #fff !important;
  font-weight: bold !important;
  fill: #fff !important;
  text-decoration: none !important;
  border: none !important;
  transition: 0.7s !important;
  box-shadow: 0 0 20px #eee;
  cursor: pointer;
}

.btn-1000000 {
  border: 1px solid #44b5ef !important;
  color: #44b5ef !important;
  cursor: pointer;
}

.btn-1000000:hover {
  background-image: linear-gradient(to right, #44b5ef 0, #088ed8 51%, #44b5ef 100%);
}

.btn-1000000-hover {
  background-image: linear-gradient(to right, #44b5ef 0, #088ed8 51%, #44b5ef 100%);
}

.btn-2000000 {
  border: 1px solid #ef022a !important;
  color: #ef022a !important;
  cursor: pointer;
}

.btn-2000000:hover {
  background-image: linear-gradient(to right, #ef022a 0, #f1809c 51%, #ef022a 100%);
}

.btn-2000000-hover {
  background-image: linear-gradient(to right, #ef022a 0, #f1809c 51%, #ef022a 100%);
}

.btn-3000000 {
  border: 1px solid #2990ff !important;
  color: #2990ff !important;
  cursor: pointer;
}

.btn-3000000:hover {
  background-image: linear-gradient(to right, #2990ff 0, #0067d6 51%, #2990ff 100%);
}

.btn-3000000-hover {
  background-image: linear-gradient(to right, #2990ff 0, #0067d6 51%, #2990ff 100%);
}

.btn-5000000 {
  border: 1px solid #29d155 !important;
  color: #29d155 !important;
}

.btn-5000000:hover {
  background-image: linear-gradient(to right, #29d155 0, #1b8d39 51%, #29d155 100%);
}

.btn-5000000-hover {
  background-image: linear-gradient(to right, #29d155 0, #1b8d39 51%, #29d155 100%);
}

.btn-10000000 {
  border: 1px solid rgb(150, 85, 0) !important;
  color: rgb(150, 85, 0) !important;

}

.btn-10000000:hover {
  background-image: linear-gradient(to right, rgb(150, 85, 0) 0%, rgb(255, 204, 0) 51%, rgb(150, 85, 0) 100%);
  color: #fff !important;
  font-weight: bold !important;
}

.btn-10000000-hover {
  background-image: linear-gradient(to right, rgb(150, 85, 0) 0%, rgb(255, 204, 0) 51%, rgb(150, 85, 0) 100%);
}

.btn-charge-wallet-hover {
  background-image: linear-gradient(to right, rgba(2, 191, 180, 1) 0%, rgba(171, 0, 255, 1) 51%, rgba(2, 191, 180, 1) 100%);
}

.btn-1000000-hover, .btn-2000000-hover, .btn-3000000-hover, .btn-5000000-hover, .btn-10000000-hover, .btn-charge-wallet-hover {
  background-position: right center;
  color: #fff !important;
  font-weight: bold !important;
  fill: #fff !important;
  text-decoration: none !important;
  border: none !important;
  transition: 0.7s !important;
  box-shadow: 0 0 20px #eee;
}
</style>
