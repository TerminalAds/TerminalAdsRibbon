<template>
  <v-card-text class="pt-4">
    <v-card-title class="px-0 pt-0">
      موجودی قابل برداشت:
      <span class="text--primary mx-2">{{ persianNum(currency(Math.floor(balance))) }}</span> ریال
    </v-card-title>
    <v-divider class="mb-4" />

    <v-row class="pa-2" justify="center" no-gutters>
      <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
        <!-- فیلد مبلغ -->
        <price-input v-model="inputBalance" label="مبلغ برای هر نفر" to-char />
      </v-col>

      <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
        <!-- فیلد شماره موبایل ها -->
        <div class="d-flex align-center mt-4">
          <div class="flex-grow-1" dir="ltr">
            <vue-tel-input
              v-model="currentPhone"
              mode="international"
              defaultCountry="IR"
              :inputOptions="{ placeholder: 'شماره موبایل' }"
              :dropdownOptions="{
                showDialCodeInSelection: true,
                showFlags: true,
                showSearchBox: true
              }"
              class="vuetify-like-phone-input"
              @validate="onPhoneValidate"
              @keyup.enter.native="addPhone"
            ></vue-tel-input>
          </div>
          
          <v-btn
            height="42"
            min-width="42"
            @click="addPhone"
            class="btn-get-code rounded-lg ms-2"
            :disabled="!isValidPhone"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>

        <!-- نمایش خطاهای احتمالی شماره -->
        <div v-if="phoneError" class="error--text mt-1 text-caption">
          {{ phoneError }}
        </div>

        <!-- نمایش شماره‌های انتخاب شده (Chips) -->
        <div class="mt-4" v-if="targetUsers.length > 0">
          <v-chip
            v-for="(phone, index) in targetUsers"
            :key="index"
            class="ma-1 font-weight-bold px-2"
            close
            color="primary"
            outlined
            dir="ltr"
            @click:close="removePhone(index)"
          >
          <span class="px-2">
            +{{ phone }}
            </span>
          </v-chip>
        </div>
      </v-col>

      <v-col v-if="totalAmount > 0" class="pa-2 text-center" cols="12">
        <div :class="{'red--text': !hasEnoughBalance, 'success--text': hasEnoughBalance}">
          جمع کل پرداختی: {{ persianNum(currency(totalAmount)) }} ریال
        </div>
        
        <div v-if="!hasEnoughBalance" class="red--text text-caption mt-2 font-weight-bold">
          مجموع مبالغ پرداختی از موجودی موجودی کیف پول شما بیشتر است.
        </div>
      </v-col> 
      <v-col class="pa-1" cols="12" lg="8" md="9" sm="10">
          <v-alert
          v-if="targetUsers.length > 0"
          dense
          text
          color="info"
          class="mt-4 rounded-lg text-body-2"
        >
          <strong>توضیحات تراکنش شما:</strong><br>
          انتقال به کیف پول شماره: {{ targetUsers.join(' ، ') }}
        </v-alert>
        </v-col>
      <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
        <v-btn
          :disabled="!isValidForm"
          :loading="loading"
          block color="success" depressed
          @click="submitTransfer"
        >
          <v-icon left>mdi-send</v-icon>
          انتقال وجه
        </v-btn>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script>
import { mapGetters } from 'vuex'
import PriceInput from "../pickers/priceInput"
import { VueTelInput } from 'vue-tel-input';
import 'vue-tel-input/dist/vue-tel-input.css';

export default {
  components: { PriceInput, VueTelInput },
  name:'TransferToUser',
  data() {
    return {
      currentPhone: "",
      inputBalance: 0,
      targetUsers: [],
      loading: false,
      isValidPhone: false, 
      phoneError: "",
    }
  },
  watch:{
     currentPhone(newVal) {
      if (newVal) {
        const englishVal = this.toEnglishDigits(newVal);
        if (englishVal !== newVal) {
          this.currentPhone = englishVal;
        }
      }
    }
  },
  computed: {
    ...mapGetters('ribbon', ['new_wallet']),
    balance() {
      return this.new_wallet.balance || 0
    },
    totalAmount() {
      return (Number(this.inputBalance) || 0) * (this.targetUsers.length || 0);
    },
    hasEnoughBalance() {
      return this.balance >= this.totalAmount;
    },
    isValidForm() {
      return this.targetUsers.length > 0 && this.inputBalance > 0 && this.hasEnoughBalance;
    }
  },
  methods: {
     toEnglishDigits(str) {
      if (!str) return str;
      const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      let result = str;
      for (let i = 0; i < 10; i++) {
        result = result
          .replace(new RegExp(persianDigits[i], 'g'), i)
          .replace(new RegExp(arabicDigits[i], 'g'), i);
      }
      return result;
    },
    onPhoneValidate(phone, phoneObject) {
      const obj = phoneObject || phone; 
      if (obj && typeof obj.valid !== 'undefined') {
        this.isValidPhone = obj.valid;
      } else if (typeof phone === 'boolean') {
        this.isValidPhone = phone;
      }
    },
    addPhone() {
      if (!this.currentPhone || !this.isValidPhone) return;
      const cleanPhone = this.currentPhone.replace(/\D/g, "");

      if (cleanPhone && !this.targetUsers.includes(cleanPhone)) {
        this.targetUsers.push(cleanPhone);
        this.currentPhone = ""; 
        this.phoneError = ""; 
        this.isValidPhone = false;
      } else if (this.targetUsers.includes(cleanPhone)) {
        this.phoneError = "این شماره قبلاً به لیست اضافه شده است.";
      }
    },
    removePhone(index) {
      this.targetUsers.splice(index, 1);
    },
    submitTransfer() {
      if (!this.hasEnoughBalance) return;
      
      this.loading = true;
      
      const payload = {
        amount: Number(this.inputBalance),
        phones: this.targetUsers 
      };

      this.$DashboardAxios.post('/api/newWallet/transfer', payload)
      .then(() => {
        this.$toast.success('انتقال با موفقیت انجام شد');
        this.targetUsers = [];
        this.inputBalance = 0;
      })
      .catch(error => {
        if (error.response && (error.response.status === 422 || error.response.status === 400)) {
             this.$toast.error('شما امکان انتقال وجه به کیف پول این شماره را ندارید.');
          } else {
             this.$toast.error('خطایی در انجام تراکنش رخ داد.');
          }
        // const msg = error.response?.data?.message;
        // if (msg) {
        //   this.$toast.error(msg); 
        // } else {
        //   this.$toast.error('شما امکان انتقال وجه به کیف پول این شماره را ندارید.');
        // }
      })
      .finally(() => {
        this.loading = false;
      })
    }
  }
}
</script>

<style scoped>
.vuetify-like-phone-input {
  border: 1px solid rgba(0, 0, 0, 0.38) !important;
  border-radius: 4px;
  height: 42px;
}
.vuetify-like-phone-input:focus-within {
  border-color: #1976d2 !important; 
  border-width: 2px !important;
}
</style>
