<template>
  <v-card :loading="loading" flat>
    <v-card-title>
      موجودی قابل برداشت:
      <span class="text--primary mx-2">{{ persianNum(currency(Math.floor(balance))) }}</span>
      <span class="small-font">ریال</span>
    </v-card-title>

    <v-card-text>
      <v-divider/>
      <span class="red--text">کارمزد برداشت از حساب: ۵۰,۰۰۰ ریال می باشد!</span>
      <v-row class="pa-2" justify="center" no-gutters>
        <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
          <price-input v-model="inputBalance" label="مبلغ" to-char/>
        </v-col>

        <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
          <v-autocomplete v-model="selectedAccount" :items="accounts" :loading="loading" label="انتخاب حساب" outlined>
            <template v-slot:prepend-inner>
              <v-img :src="banksPrefix?.icon" contain width="48"/>
            </template>

            <template v-slot:append-item>
              <div class="mx-4">
                <v-btn depressed @click="addAccount = true">
                  <v-icon color="success" left>mdi-plus</v-icon>
                  افزودن حساب
                </v-btn>
              </div>
            </template>

            <template v-slot:item="data">
              <v-list-item-avatar>
                <v-img :src="data.item.icon"/>
              </v-list-item-avatar>
              <v-list-item-title v-text="data.item.text"/>
              <v-list-item-action>
                <v-btn color="#ff475a" icon @click="deleteAccount(data.item.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
          <v-divider/>
          <v-btn :disabled="!inputBalance || !selectedAccount" :loading="loading" block color="success" depressed
                 @click="addWithdraw">
            <v-icon left>mdi-plus</v-icon>
            ثبت برداشت
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <custom-popup v-model="addAccount" :cons="{title: 'افزدن حساب'}" hide-confirm max-width="600">
      <v-card flat>
        <v-card-title class="red--text">
          ورود کلیه اطلاعات الزامی است.
        </v-card-title>

        <v-row class="pa-2" justify="center" no-gutters>
          <v-col class="pa-2" cols="12" lg="6" md="9" sm="10">
            <v-text-field v-model="obj.bankName" :rules="[rules.persian]" class="rounded-lg icon-wrapper"
                          clear-icon="mdi-close-circle-outline" clearable dense label="نام بانک" outlined>
              <template v-slot:append>
                <v-img :src="banksPrefix?.icon" contain width="32"/>
              </template>
            </v-text-field>
          </v-col>

          <v-col class="pa-2" cols="12" lg="6" md="9" sm="10">
            <v-text-field v-model="obj.ownerName" :rules="[rules.persian]" class="rounded-lg"
                          clear-icon="mdi-close-circle-outline" clearable dense label="نام صاحب حساب" outlined/>
          </v-col>

          <v-col class="pa-2" cols="12" lg="6" md="9" sm="10">
            <v-text-field v-model="obj.ownerLastName" :rules="[rules.persian]" class="rounded-lg"
                          clear-icon="mdi-close-circle-outline" clearable dense label="نام خانوادگی" outlined/>
          </v-col>

          <v-col class="pa-2" cols="12" lg="6" md="9" sm="10">
            <v-text-field v-model="obj.accountNumber" class="rounded-lg" clear-icon="mdi-close-circle-outline" clearable
                          dense label="شماره حساب" outlined type="number"/>
          </v-col>

          <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
            <v-text-field v-model="obj.cardNumber" :rules="[rules.cardNumber]" class="rounded-lg"
                          clear-icon="mdi-close-circle-outline" clearable counter="16" dense label="شماره کارت" outlined
                          type="number"/>
          </v-col>

          <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
            <v-text-field v-model="obj.sheba" :rules="[rules.sheba]" class="rounded-lg" counter="24" dense
                          label="شماره شبا" outlined suffix="IR" type="number"/>
          </v-col>

          <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
            <v-divider/>
            <v-btn :disabled="canAddAcc" :loading="addLoading" block color="success" depressed
                   @click="addToAccountList">
              <v-icon left>mdi-plus</v-icon>
              افزودن حساب
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </custom-popup>
  </v-card>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import PriceInput from "../pickers/priceInput";
import CustomPopup from "../../plugins/popup/customPopup";

export default {
  name: "withdrawTransactions",

  components: {CustomPopup, PriceInput},

  data() {
    return {
      accounts: [],
      addAccount: false,
      addLoading: false,
      banksInfo: [],
      inputBalance: 0,
      loading: false,
      obj: {
        bankName: '',
        ownerName: '',
        ownerLastName: '',
        accountNumber: '',
        cardNumber: '',
        sheba: '',
      },
      rules: {
        persian: v => (this.justPersian(v)) || 'فقط مجاز به ورود حروف فارسی!',
        cardNumber: v => v.length === 16 || 'تعداد ارقام شماره کارت باید ۱۶ عدد باشد!',
        sheba: v => v.length === 24 || 'تعداد ارقام شماره شبا باید ۲۴ عدد باشد!'
      },
      selectedAccount: null
    }
  },

  mounted() {
    this.fetch()
    this.banksInfo = [
      {
        "text": "اقتصاد نوین",
        "value": "eghtesad novin",
        "prefix": ["627412"],
        "icon": require('../../assets/img/banks/eghtesad-novin.png')
      },
      {
        "text": "انصار",
        "value": "ansar",
        "prefix": ["627381"],
        "icon": require('../../assets/img/banks/ansar.png')
      },
      {
        "text": "ایران زمین",
        "value": "iran-zamin",
        "prefix": ["505785"],
        "icon": require('../../assets/img/banks/iran-zamin.png')
      },
      {
        "text": "پارسیان",
        "value": "parsian",
        "prefix": ["622106", "639194", "627884"],
        "icon": require('../../assets/img/banks/parsian.png')
      },
      {
        "text": "پاسارگاد",
        "value": "pasargad",
        "prefix": ["639347", "5022-29"],
        "icon": require('../../assets/img/banks/pasargad.png')
      },
      {
        "text": "تات",
        "value": "tat",
        "prefix": ["636214"],
        "icon": require('../../assets/img/banks/tat.png')
      },
      {
        "text": "تجارت",
        "value": "tejarat",
        "prefix": ["627353"],
        "icon": require('../../assets/img/banks/tejarat.png')
      },
      {
        "text": "توسعه تعاون",
        "value": "tosee-taavon",
        "prefix": ["502908"],
        "icon": require('../../assets/img/banks/taavon.png')
      },
      {
        "text": "توسعه صادرات ایران",
        "value": "tosee-saderat",
        "prefix": ["627648", "207177"],
        "icon": ''
      },
      {
        "text": "حکمت ایرانیان",
        "value": "hekmat-iraniyan",
        "prefix": ["636949"],
        "icon": require('../../assets/img/banks/hekmat.png')
      },
      {
        "text": "دی",
        "value": "dey",
        "prefix": ["502938"],
        "icon": require('../../assets/img/banks/dey.png')
      },
      {
        "text": "رفاه کارگران",
        "value": "refah-kargar",
        "prefix": ["589463"],
        "icon": require('../../assets/img/banks/refah.png')
      },
      {
        "text": "سامان",
        "value": "saman",
        "prefix": ["621986"],
        "icon": require('../../assets/img/banks/saman.png')
      },
      {
        "text": "سپه",
        "value": "sepah",
        "prefix": ["589210"],
        "icon": require('../../assets/img/banks/sepah.png')
      },
      {
        "text": "سرمایه",
        "value": "sarmayeh",
        "prefix": ["639607"],
        "icon": require('../../assets/img/banks/sarmayeh.png')
      },
      {
        "text": "سینا",
        "value": "sina",
        "prefix": ["639346"],
        "icon": require('../../assets/img/banks/sina.png')
      },
      {
        "text": "شهر",
        "value": "shahr",
        "prefix": ["502806"],
        "icon": require('../../assets/img/banks/shahr.png')
      },
      {
        "text": "صادرات ایران",
        "value": "saderat-iran",
        "prefix": ["603769"],
        "icon": require('../../assets/img/banks/saderat.png')
      },
      {
        "text": "صنعت و معدن",
        "value": "sanat-madan",
        "prefix": ["627961"],
        "icon": require('../../assets/img/banks/sanat-madan.png')
      },
      {
        "text": "قرض الحسنه مهر ایران",
        "value": "ghorze-alhasane-mehr-iran",
        "prefix": ["606373"],
        "icon": require('../../assets/img/banks/mehre-iran.png')
      },
      {
        "text": "قوامین",
        "value": "ghavamin",
        "prefix": ["639599"],
        "icon": require('../../assets/img/banks/ghavamin.png')
      },
      {
        "text": "کارآفرین",
        "value": "karaafarin",
        "prefix": ["627488", "502910"],
        "icon": require('../../assets/img/banks/karafarin.png')
      },
      {
        "text": "کشاورزی",
        "value": "keshavarzi",
        "prefix": ["603770", "639217"],
        "icon": require('../../assets/img/banks/keshavarzi.png')
      },
      {
        "text": "گردشگری",
        "value": "gardeshgari",
        "prefix": ["505416"],
        "icon": require('../../assets/img/banks/gardeshgari.png')
      },
      {
        "text": "مرکزی",
        "value": "markazi",
        "prefix": ["636795"],
        "icon": require('../../assets/img/banks/markazi.png')
      },
      {
        "text": "مسکن",
        "value": "maskan",
        "prefix": ["628023"],
        "icon": require('../../assets/img/banks/maskan.png')
      },
      {
        "text": "ملت",
        "value": "melat",
        "prefix": ["610433", "991975"],
        "icon": require('../../assets/img/banks/mellat.png')
      },
      {
        "text": "ملی",
        "value": "melli-iran",
        "prefix": ["603799"],
        "icon": require('../../assets/img/banks/melli.png')
      },
      {
        "text": "مهر اقتصاد",
        "value": "mehr-eghtesad",
        "prefix": ["639370"],
        "icon": require('../../assets/img/banks/mehre-eghtesad.png')
      },
      {
        "text": "پست بانک ایران",
        "value": "post-bank-iran",
        "prefix": ["627760"],
        "icon": ""
      },
      {
        "text": "موسسه اعتباری توسعه",
        "value": "etebari-tosee",
        "prefix": ["628157"],
        "icon": ""
      },
      {
        "text": "موسسه اعتباری کوثر",
        "value": "etebari-kosar",
        "prefix": ["505801"],
        "icon": require('../../assets/img/banks/kosar.png')
      }
    ]
  },

  computed: {
    ...mapGetters('ribbon', ['new_wallet']),
    balance() {
      return this.new_wallet.balance
    },
    canAddAcc() {
      let arr = Object.values(this.obj)
      return arr.filter(item => !!item).length !== arr.length
          || typeof this.rules.persian(this.obj.bankName) !== 'boolean'
          || typeof this.rules.persian(this.obj.ownerName) !== 'boolean'
          || typeof this.rules.persian(this.obj.ownerLastName) !== 'boolean'
          || typeof this.rules.cardNumber(this.obj.cardNumber) !== 'boolean'
          || typeof this.rules.sheba(this.obj.sheba) !== 'boolean'
    },
    // computedCardNumber: {
    //   get() {
    //     return this.obj.cardNumber.replace(/(\d)(?=(\d{4})+(?!\d))/g, '$1-')
    //   },
    //   set(val) {
    //     this.obj.cardNumber = val
    //   }
    // },
    banksPrefix() {
      let arr = this.banksInfo,
          str = ''
      if (this.addAccount)
        str = this.obj.cardNumber
      else
        str = this.accounts?.find(item => item.id === this.selectedAccount)?.cardNumber

      return arr.find(item =>
          item.prefix.includes(str?.substring(0, 6)))
    }
  },

  methods: {
    ...mapActions('ribbon', ['toggleWithdrawDialog']),
    fetch() {
      this.loading = true

      this.$DashboardAxios.get('/api/account')
          .then(({data}) => {
            try {
              this.accounts = data.data.data.map(item => {
                return {
                  ...item,
                  text: item.bankName + ' - ' + item.ownerName + ' ' + item.ownerLastName,
                  value: item.id,
                  icon: this.banksInfo.find(value =>
                      value.prefix.includes(item.cardNumber.substring(0, 6)))?.icon
                }
              })
            } catch (e) {
              console.error('error in accounts: ', e)
            }
          })
          .catch(({response}) => console.error('error in get list of accounts: ', response))
          .finally(() => this.loading = false)
    },
    addWithdraw() {
      if (5000000 < Math.floor(this.inputBalance)) {
        this.$toast.error('موجودی کیف پول شما کافی نمی باشد!')
        return
      }

      this.loading = true
      this.$DashboardAxios.post('/api/transferRequest', {
        to: this.selectedAccount,
        amount: Number(this.inputBalance)
      })
          .then(({data}) => {
            this.$toast.success('درخواست برداشت شما با موفقیت ثبت شد.');
            this.toggleWithdrawDialog(false);
          })
          .catch(({response}) => {
            if (!!response.data.message)
              this.$toast.error(response.data.message)
            else
              this.$toast.error('خطا در ارسال درخواست برداشت از کیف پول!')
            console.error('error to withdraw: ', response)
          })
          .finally(() => this.loading = false);
    },
    addToAccountList() {
      this.addLoading = true

      this.$DashboardAxios.post('/api/account', this.obj)
          .then(({data}) => {
            this.selectedAccount = data.data.id
            this.addAccount = false
            this.fetch()
          })
          .catch(({response}) => console.error('error in add account: ', response))
          .finally(() => this.addLoading = false);
    },
    deleteAccount(id) {
      if (this.$modal.yesNo('حذف حساب از لیست ؟')) {
        this.loading = true
        this.$DashboardAxios.delete(`/api/account/${id}`)
            .then(({data}) => {
            })
            .catch(({response}) => console.error('error in delete account: ', response))
            .finally(() => this.loading = false)
      }
    },
    justPersian(str) {
      var p = /^[\u0620-\u065F\u0671-\u06D5\s]+$/;
      return p.test(str)
    }
  }
}
</script>

<style scoped>
.small-font {
  font-size: .7em !important;
}

.v-autocomplete >>> .v-input__prepend-inner,
.icon-wrapper >>> .v-input__append-inner {
  align-self: center;
  margin: 0 !important;
}
</style>