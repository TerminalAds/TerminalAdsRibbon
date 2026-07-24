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
          v => (!!v && toEnglishDigits(v).length === 10) || 'کدپستی باید 10 رقم باشد',
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
          v => (!!v && v.trim().split(/\s+/).length >= 3) || 'آدرس باید حداقل سه کلمه باشد',
          v => !v || /^[\u0600-\u06FF\s\u200C0-9۰-۹،\-\/\\.]+$/.test(v) || 'لطفاً آدرس را با کیبورد فارسی وارد کنید'
        ]"
      ></v-textarea>

      <!-- سوییچ پرونده مالیاتی -->
      <v-switch 
        v-model="Ptax" 
        label="دارای پرونده مالیاتی هستم" 
        inset 
        dense
        class="mt-0"
      ></v-switch>

      <v-expand-transition>
        <div v-if="Ptax">
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="registration_number"
                label="شناسه ملی سازمانی"
                outlined
                dense
                @keypress="isNumericKey"
                :rules="Ptax ? [
                  v => !!v || 'وارد کردن شناسه ملی الزامی است',
                  v => (!!v && toEnglishDigits(v).length === 11) || 'باید 11 رقم باشد'
                ] : []"
                maxlength="11"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="economic_code"
                label="کد اقتصادی"
                outlined
                dense
                @keypress="isNumericKey"
                :rules="Ptax ? [
                  v => !!v || 'وارد کردن کد اقتصادی الزامی است',
                  v => (!!v && (toEnglishDigits(v).length === 11 || toEnglishDigits(v).length === 12)) || 'باید 11 یا 12 رقم باشد'
                ] : []"
                maxlength="12"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
      </v-expand-transition>

      <v-btn
        class="mt-4 btn-get-code rounded-lg"
        :loading="loading"
        :disabled="!valid"
        @click="submitAddress"
        block
      ><v-icon small>mdi-content-save-check</v-icon>
        ثبت اطلاعات
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
      Ptax: true, 
      valid: false,
      loading: false,
      address: "",
      postalCode: "",
      setedAddress: false, 
      registration_number: '',
      economic_code: '',
    };
  },
  computed: {
    dialog: {
      get() { return this.value; },
      set(val) { this.$emit("input", val); },
    },
    popupConfig() {
      return {
        title: "تکمیل اطلاعات پرونده و آدرس",
        icon: "map-marker",
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
      if (!str) return "";
      const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
      const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
      let result = String(str);
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
        
        const payload = {
          address: this.address.trim(),
          postalCode: this.toEnglishDigits(this.postalCode),
        };

        if (this.Ptax) {
          payload.economic_code = this.toEnglishDigits(this.economic_code);
          payload.registration_number = this.toEnglishDigits(this.registration_number);
        }

        let res = await axios.post(
          `https://api.terminalads.com/api/confirmprofile/fast`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status === 200 || res.status === 201) {
          this.$toast.success("اطلاعات با موفقیت ثبت شد.");
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
      let charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode >= 48 && charCode <= 57) return true; // 0-9
      if (charCode >= 1632 && charCode <= 1641) return true; // Persian 0-9
      evt.preventDefault();
      return false;
    },
  },
};
</script>
