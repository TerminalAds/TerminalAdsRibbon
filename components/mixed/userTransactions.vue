<template>
  <div class="card card-custom card-stretch fill-height">
    <div class="card-body d-flex flex-column px-5">
      <div>
        <h4>آخرین تراکنش ها</h4>
        <span>موجودی شما:</span>
        <span class="float-left">
          {{ balance !== null && balance >= 0 ? persianNum(currency(Math.floor(balance))) : '---' }}
          <v-icon v-if="wallet.icon != null && wallet.icon.length > 0" class="ms-2" v-text="wallet.icon"/></span>
      </div>

      <v-fab-transition>
        <div v-if="loading" class="row  justify-content-center mt-10">
          <fingerprint-spinner :animation-duration="1500" :size="68" color="#ff1d5e"/>
        </div>

        <div v-else-if="transactions.length > 0">
          <div v-for="item in transactions" class="d-flex align-items-center justify-content-between mb-2">
            <div class="d-flex align-items-center mr-2 pt-3">
              <i :class="item.type === 'deposit' || item.state === 'increase'
              ? ['text-success','fa-check']
              : ['text-danger','fa-times']"
                 class="fa fa-2x"></i>
              <div>
                <span class="text-dark text-hover-primary pl-2 font-weight-bolder poi">
                  {{ transType(item) }}
                </span>
              </div>
            </div>
            <div v-b-tooltip.hover :title="item.created_at_p"
                 class="label label-light label-inline font-weight-bolder text-white bg-primary py-3 px-2 ">
                  <span>
                    {{ persianNum(currency(Math.abs(item.amount.$numberDecimal))) }} ﷼
                  </span>
            </div>
          </div>
        </div>

        <div v-else style="min-height: 9.6rem">
          <p class="text-danger text-center pt-17"> هنوز تراکنشی برای شما ثبت نشده است!</p>
        </div>
      </v-fab-transition>

      <div class="row">
        <div class="col-md mt-5">
          <b-btn class="btn btn-link-info mt-5" @click="toggleWalletDialog(true)">
            <i class="fa fa-plus"></i>
            افزایش موجودی
          </b-btn>
          <b-btn class="btn btn-link-success mt-5 d-block" style="font-size: 9pt"
                 @click="goToTransactions">
            <i class="fa fa-eye"></i>
            لیست تراکنش ها
          </b-btn>
        </div>
        <div class="col-md-7">
          <img alt="" class="img-fluid float-left" src="../../assets/img/cash-wallet.png"
               style="width: 120px;">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {FingerprintSpinner} from 'epic-spinners'
import {mapActions, mapGetters} from 'vuex'

export default {
  name: "userTransactions",
  components: {
    FingerprintSpinner
  },
  data() {
    return {
      strokeColor: "#f86573",
      chartOptions: {},
      loading: false,
      transactions: [],
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD4HznXqgGC7rvaM8z_AfFnrYfVqf-8NTWQyuZsXhkLiLiiYKsvRLuNp7Tzp1ZtSDn0m8&usqp=CAU'
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    ...mapActions('ribbon', ['toggleWalletDialog']),
    fetch() {
      this.loading = true;

      // this.$DashboardAxios.get('/api/transactions/user?length=3&filters=%7B%22type%22:%22%22,%22admin_type%22:null,%22confirmed%22:%22%22,%22date%22:%22%22%7D')
      //     .then(({data}) => this.transactions = data.data)
      //     .catch(({response}) => console.log('error in get transactions: ', response))
      //     .finally(() => this.loading = false)


      this.$DashboardAxios.get('/api/newWallet/latest')
        .then(({data}) => this.transactions = data.data)
        .catch(({response}) => console.log('error in get transactions: ', response))
        .finally(() => this.loading = false)
    },
    goToTransactions() {
      window.open('https://core.terminalads.com/#/user/transactions')
    },
    transType({state, type}) {

      if (type === 'withdraw' || state === 'decrease') {
        return 'برداشت وجه'
      } else if (type === 'deposit' || state === 'increase') {
        return 'واریز وجه'
      } else if (type === 'charge') {
        return 'شارژ کیف پول'
      } else if (type === 'refund') {
        return 'بازگشت وجه'
      } else {
        return 'تراکنش'
      }
    }
  },
  computed: {
    ...mapGetters("ribbon", ["wallet", 'new_wallet']),
    balance() {
      // return this.wallet.balance
      return this.new_wallet.balance
    },
  },
};
</script>