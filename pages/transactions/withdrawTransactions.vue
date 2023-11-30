<template>
  <v-card :loading="loading" flat>
    <v-card-title>
      موجودی قابل برداشت:
      <span class="text--primary mx-2">{{ persianNum(currency(Math.floor(balance))) }}</span>
      <span class="small-font">ریال</span>
    </v-card-title>

    <v-card-text>
      <v-divider/>
      <span class="red--text">کارمزد برداشت از حساب: ۵۰۰۰۰ ریال می باشد!</span>
      <v-row class="pa-2" justify="center" no-gutters>
        <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
          <price-input v-model="inputBalance" label="مبلغ"/>
        </v-col>

        <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
          <v-autocomplete v-model="selectedAccount" :items="accounts" :loading="loading" label="انتخاب حساب" outlined>
            <template v-slot:append-item>
              <div class="mx-4">
                <v-btn depressed @click="addAccount = true">
                  <v-icon color="success" left>mdi-plus</v-icon>
                  افزودن حساب
                </v-btn>
              </div>
            </template>

            <template v-slot:item="data">
              <v-list-item-title v-text="data.item.text"/>
              <v-list-item-action>
                <v-btn icon @click="deleteAccount(data.item.id)">
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
            <v-text-field v-model="obj.bankName" class="rounded-lg" clear-icon="mdi-close-circle-outline" clearable
                          dense label="نام بانک" outlined/>
          </v-col>

          <v-col class="pa-2" cols="12" lg="6" md="9" sm="10">
            <v-text-field v-model="obj.ownerName" class="rounded-lg" clear-icon="mdi-close-circle-outline" clearable
                          dense label="نام صاحب حساب" outlined/>
          </v-col>

          <v-col class="pa-2" cols="12" lg="6" md="9" sm="10">
            <v-text-field v-model="obj.ownerLastName" class="rounded-lg" clear-icon="mdi-close-circle-outline" clearable
                          dense label="نام خانوادگی" outlined/>
          </v-col>

          <v-col class="pa-2" cols="12" lg="6" md="9" sm="10">
            <v-text-field v-model="obj.accountNumber" class="rounded-lg" clear-icon="mdi-close-circle-outline" clearable
                          dense label="شماره حساب" outlined type="number"/>
          </v-col>

          <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
            <v-text-field v-model="obj.cardNumber" class="rounded-lg" clear-icon="mdi-close-circle-outline" clearable
                          dense label="شماره کارت" outlined type="number"/>
          </v-col>

          <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
            <v-text-field v-model="obj.sheba" class="rounded-lg" dense label="شماره شبا" outlined suffix="IR"
                          type="number"/>
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
import {mapGetters} from 'vuex'
import PriceInput from "../pickers/priceInput";
import CustomPopup from "../../plugins/popup/customPopup";

export default {
  name: "withdrawTransactions",

  components: {CustomPopup, PriceInput},

  data: () => ({
    accounts: [],
    addAccount: false,
    addLoading: false,
    loading: false,
    obj: {
      bankName: '',
      ownerName: '',
      ownerLastName: '',
      accountNumber: '',
      cardNumber: '',
      sheba: '',
    },
    inputBalance: 0,
    selectedAccount: null
  }),

  mounted() {
    this.fetch()
  },

  computed: {
    ...mapGetters('ribbon', ['new_wallet']),
    balance() {
      return this.new_wallet.balance
    },
    canAddAcc() {
      let arr = Object.values(this.obj)
      return arr.filter(item => !!item).length !== arr.length
    }
  },

  methods: {
    fetch() {
      this.loading = true

      this.$DashboardAxios.get('/api/account')
          .then(({data}) => {
            let arr = data.data.data.map(item => {
              return {
                ...item,
                text: item.bankName + ' ' + item.ownerName + ' ' + item.ownerLastName,
                value: item.id
              }
            })
            // arr.push({
            //   disabled: true,
            //   text: 'افزودن',
            //   value: 'select',
            //   type: 'btn'
            // })
            this.accounts = arr
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
    }
  }
}
</script>

<style scoped>
.small-font {
  font-size: .7em !important;
}
</style>