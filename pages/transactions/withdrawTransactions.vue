<template>
  <v-card flat class="ma-3">
        <custom-tabs v-model="tabs" :tab-items="tabItems" grow>
      <template v-slot:staticItems>
        <v-tabs-items v-model="tabs">
      <v-tab-item>
        <withdraw-to-bank />
      </v-tab-item>

      <v-tab-item>
        <transfer-to-user />
      </v-tab-item>
    </v-tabs-items>
    </template>
    </custom-tabs>
  </v-card>
</template>

<script>
import WithdrawToBank from './WithdrawToBank.vue'
import TransferToUser from './TransferToUser.vue'

export default {
  components: { WithdrawToBank, TransferToUser },
  name:'withdrawTransactions',
  data() {
    return {
      tabs: 0,
      tabItems: [
        { text: 'واریز به حساب', icon: 'wallet-plus' },
        { text: 'انتقال به دیگری', icon: 'account-arrow-right' }
      ],
    }
  }
}
</script>


















