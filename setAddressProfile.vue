<template>
  <custom-popup
    v-model="dialog"
    :cons="popupConfig"
    :loading="loading"
    max-width="550"
    :hide-close="!setedAddress"
    @close="closePopup"
    :hide-confirm="!setedAddress"
    :persistent="!setedAddress"
  >
    <v-form v-if="!setedAddress" ref="addressForm" v-model="valid" lazy-validation class="pa-6">
      <v-text-field
        v-model="postalCode"
        label="کد پستی"
        outlined
        dense
        :rules="[
          v => !!v || 'وارد کردن کد پستی الزامی است',
          v => (!!v && v?.trim()?.length === 10) || 'کدپستی باید 10 رقم باشد',
          v => {
              if (!v) return true;
              const englishCode = this.toEnglishDigits(v.trim());
              return /^(?!(\d)\1{9})[13456789]\d{9}$/.test(englishCode) || 'کد پستی نامعتبر است';
          }
        ]"
        @keypress="isNumericKey"
        maxlength="10"
      ></v-text-field>
      <v-textarea
        v-model="address"
        label="آدرس"
        outlined
        dense
        rows="6"
        :rules="[
          v => !!v || 'وارد کردن آدرس الزامی است', 
          v => (v && v?.trim()?.split(/\s+/)?.length >= 3) || 'آدرس باید حداقل سه کلمه باشد',
          v => !v || /^[\u0600-\u06FF\s\u200C0-9۰-۹،\-\/\\.]+$/.test(v) || 'لطفاً آدرس را با کیبورد فارسی وارد کنید'
        ]"
      ></v-textarea>

      <!-- دکمه سابمیت داخل فرم -->
      <v-btn

        class="mt-4 btn-get-code"
        :loading="loading"
        :disabled="!valid || !address || !postalCode"
        @click="submitAddress"
      >
        ثبت آدرس/ کدپستی
      </v-btn>
    </v-form>

    <v-card v-else class="pa-4 text-center" flat>
      <v-alert type="success" outlined class="mb-4">آدرس با موفقیت ثبت شد</v-alert>
      <v-btn
        color="primary"
        href="https://core.terminalads.com/#/profile/edit-personal"
        target="_blank"
      >
        تکمیل اطلاعات پروفایل
      </v-btn>
    </v-card>
  </custom-popup>
</template>

<script>
import customPopup from "./plugins/popup/customPopup.vue";
import axios from "axios";
import jwtService from "./assets/js/jwt.service.js";

export default {
  name: "setAddressProfile",
  components: {
    customPopup,
  },
  props: {
    value: Boolean,
  },
  data() {
    return {
      valid: false,
      loading: false,
      address: "",
      postalCode: "",
      setedAddress: false, 
    };
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    popupConfig() {
      return {
        title: "ثبت آدرس و کد پستی",
        icon: "map-marker",
        // آرایه باتن‌ها را خالی می‌گذاریم تا کامپوننت پدری دکمه‌ای نسازد
        buttons: []
      };
    },
  },
  methods: {
    closePopup() {
      this.dialog = false;
      if (this.$refs.addressForm) {
        this.$refs.addressForm.reset();
      }
      setTimeout(() => {
         this.setedAddress = false;
      }, 300);
    },
    toEnglishDigits(str) {
      if (!str) return str;
      const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
      const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
      let result = str;
      for (let i = 0; i < 10; i++) {
        result = result.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
      }
      return result;
    },
    async submitAddress() {
      if (!this.$refs.addressForm.validate()) return;

      this.loading = true;
      try {
        let token = jwtService.getToken(); 
        
        let res = await axios.post(
          `https://api.terminalads.com/api/confirmprofile/fast`,
          {
            address: this.toEnglishDigits(this.address),
            postalCode: Number(this.toEnglishDigits(this.postalCode)),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 200 || res.status === 201) {
          this.$toast.success("آدرس با موفقیت ثبت شد.");
          this.setedAddress = true;
          this.$emit("success"); 
        }
      } catch (error) {
        this.$toast.error("خطا در ثبت اطلاعات.");
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    isNumericKey(evt) {
      let persianChars = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
      evt = evt ? evt : window.event;
      let charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        (charCode < 96 || charCode > 105) &&
        persianChars.indexOf(evt.key) === -1
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
  },
};
</script>
