<template>
  <v-card :dark="dark" :max-width="$vuetify.breakpoint.mdAndUp ? '' : 400"
          :min-width="$vuetify.breakpoint.mdAndUp ? 232 : 85"
          class="d-flex flex-nowrap price-wallet align-self-center font-size-h4" flat height="32" @click="changeRoute">
    <v-btn v-b-tooltip.passive="'شارژ کیف پول'" class="price-walletButton px-0" color="#6cdb72" dark depressed
           height="32" min-height="32" min-width="32" style="margin-left: 12px"
           @click.stop="computedWalletDialog = true">
      <v-icon class="plus" small>
        mdi-plus
      </v-icon>
    </v-btn>

    <div v-b-tooltip="'لیست تراکنش های شما'" class="d-flex align-center fill-height" style="flex: 1 0 auto">
      <span>اعتبار</span>
      <v-spacer/>
      <span
          style="max-width: calc(90% - 40px);overflow: hidden;text-overflow: ellipsis;white-space: nowrap;direction: ltr">
        {{ balance !== null && balance >= 0 ? persianNum(currency(Math.floor(balance))) : '---' }}
      </span>
      <v-spacer/>
      <v-icon v-if="wallet.icon != null && wallet.icon.length > 0" :dark="dark" v-text="wallet.icon"/>
    </div>

    <v-btn v-b-tooltip.passive="'برداشت از کیف پول'" class="price-walletButton px-0 min" color="#ff475a" dark depressed
           height="32" min-height="32" min-width="32" style="margin-right: 12px" @click.stop="computedWithdraw = true">
      <v-icon small>mdi-minus</v-icon>
    </v-btn>

    <custom-popup v-model="computedWalletDialog" :cons="{title: 'شارژ کیف پول'}" hide-confirm hide-overlay
                  max-width="800px" reloadable transition="dialog-top-transition">
      <increase-transactions/>
    </custom-popup>

    <custom-popup v-model="computedWithdraw" :cons="{title: 'برداشت از کیف پول'}" hide-confirm hide-overlay
                  max-width="800px" reloadable transition="dialog-top-transition">
      <withdraw-transactions/>
    </custom-popup>
  </v-card>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import IncreaseTransactions from "./increaseTransactions";
import CustomPopup from "../../plugins/popup/customPopup";
import WithdrawTransactions from "./withdrawTransactions";

const exhale = ms =>
    new Promise(resolve => setTimeout(resolve, ms))

export default {
  name: "WalletOpenButton",

  components: {WithdrawTransactions, CustomPopup, IncreaseTransactions},

  props: {
    hideInMobile: {
      type: Boolean,
      default: false
    },
    dark: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({
    checking: false,
    heartbeats: []
  }),

  created() {
    this.takePulse(false)
  },

  mounted() {
    let classes = window.document.querySelectorAll(".price-wallet .v-input__control .v-text-field__slot *");
    for (let c of classes) {
      c.classList.add('on-scroll-shoed');
    }
  },

  computed: {
    ...mapGetters('ribbon', ['core', 'walletDialog', 'withdrawDialog', 'new_wallet']),
    balance() {
      return this.new_wallet.balance
    },
    avg() {
      const sum = this.heartbeats.reduce((acc, cur) => acc + cur, 0)
      const length = this.heartbeats.length

      if (!sum && !length) return 0

      return Math.ceil(sum / length)
    },
    computedWalletDialog: {
      get() {
        return this.walletDialog
      },
      set(val) {
        this.toggleWalletDialog(val)
      }
    },
    computedWithdraw: {
      get() {
        return this.withdrawDialog
      },
      set(val) {
        this.toggleWithdrawDialog(val)
      }
    }
  },

  methods: {
    ...mapActions('ribbon', ['toggleWalletDialog', 'toggleWithdrawDialog']),
    changeRoute() {
      let a = document.createElement('a');
      a.target = '_blank';
      a.href = `${this.front_url}/#/user/transactions`;
      a.click()
      document.removeChild(a);
    },
    heartbeat() {
      return Math.ceil(Math.random() * (120 - 80) + 80)
    },
    async takePulse(inhale = true) {
      this.checking = true

      inhale && await exhale(1000)

      this.heartbeats = Array.from({length: 20}, this.heartbeat)

      this.checking = false
    }
  },
}
</script>

<style scoped>
.header-fixed .price-wallet.theme--dark,
.header-fixed .price-wallet.theme--dark i {
  color: #fff;
}

.price-wallet {
  align-items: center;
  border-radius: 6px !important;
  background-color: rgba(255, 255, 255, .2) !important;
  flex: 1 0 0;
}

.price-walletButton {
  border-radius: 0 6px 6px 0 !important;
}

.price-walletButton.min {
  border-radius: 6px 0 0 6px !important;
}
</style>
