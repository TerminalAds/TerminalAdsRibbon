<template>
  <custom-popup
    v-model="computedValue"
    :cons="{ title: info.gateway.name }"
    hide-confirm
    max-width="430"
  >
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

      <v-responsive
        :style="getCardBg"
        aspect-ratio="1.545"
        class="rounded-xl mb-4 card-wrapper"
        max-width="450"
        width="100%"
      >
        <div class="fill-height d-flex w-100 flex-column">
          <v-card-title style="padding-top: 5%">
            <v-img
              v-if="!!banksPrefix"
              :src="banksPrefix.icon"
              contain
              max-width="64"
            />
          </v-card-title>
          <v-spacer />
          <v-card-text
            class="font-size-h2 text-center white--text font-weight-bold"
            style="direction: ltr"
          >
            {{ displayPan(data.PAN) }}
          </v-card-text>
          <v-card-text
            class="white--text pb-6 px-6 d-flex justify-space-between"
          >
            <div>
              تاریخ انقضا:
              <b class="mx-1">
                {{ data.ExpM }}
                <span v-show="!!data.ExpY || !!data.ExpM" class="mx-1">/</span>
                {{ data.ExpY }}
              </b>
            </div>

            <div>
              <b v-if="!!data.CV" class="mx-1">{{
                data.CV.replace(/./g, "*")
              }}</b>
              :CVV2
            </div>
          </v-card-text>
        </div>
      </v-responsive>
    </div>

    <v-card class="rounded-t-xl card-data-wrapper mt-8" elevation="5">
      <!--      <div class="timer">-->
      <!--        08:23-->
      <!--      </div>-->

      <v-card-text class="pb-0">
        <v-text-field
          :value="data.PAN | displayPanFilter"
          autocomplete="off"
          autofocus
          class="rounded-lg"
          color="info"
          :label="i18n.t('INCREASE.PAN')"
          maxlength="19"
          onkeyup="if (this.value.replace(/ /g, '').length >= 16)
                        document.getElementById('cvv2').focus()"
          outlined
          tabindex="1"
          @input="updateValue($event)"
        >
          <template v-slot:append>
            <v-img
              :src="!!banksPrefix ? banksPrefix.icon : ''"
              contain
              min-width="32"
              width="32"
            />
          </template>
        </v-text-field>

        <v-row class="expire-wrapper position-relative mb-8" no-gutters>
          <v-col class="pe-md-1" cols="12" md="6">
            <v-text-field
              id="cvv2"
              v-model="data.CV"
              :rules="[rules.cv]"
              class="rounded-lg"
              color="info"
              hide-details
              :label="i18n.t('INCREASE.CVV2')"
              oninput="if (this.value.length >= 4) this.preventDefault()"
              onkeyup="if (this.value.length >= 4)
                            document.getElementById('month').focus()"
              outlined
              tabindex="2"
              type="password"
            />
          </v-col>

          <v-col class="ps-md-1" cols="12" md="6">
            <v-card
              class="rounded-lg d-flex flex-nowrap align-center fill-height expire-card"
              outlined
            >
              <v-text-field
                id="month"
                v-model="data.ExpM"
                class="mx-2"
                color="info"
                dense
                hide-details
                max="12"
                min="0"
                oninput="if (Number(this.value) > Number(this.max)) this.value = this.max;
                            else if (this.value < 0) this.value = 0"
                onkeyup="if (this.value.length >= 2)
                              document.getElementById('year').focus()"
                :placeholder="i18n.t('INCREASE.MONTH')"
                tabindex="3"
                type="number"
              />
              <v-divider
                class="align-self-center"
                style="height: 70%; min-height: 80%"
                vertical
              />
              <v-text-field
                id="year"
                v-model="data.ExpY"
                class="mx-2"
                color="info"
                dense
                hide-details
                max="99"
                min="0"
                oninput="if (Number(this.value) > Number(this.max)) this.value = this.max;
                            else if (this.value < 0) this.value = 0"
                onkeyup="if (this.value.length >= 2)
                              document.getElementById('pin2').focus()"
                :placeholder="i18n.t('INCREASE.YEAR')"
                tabindex="4"
                type="number"
              />
            </v-card>
          </v-col>
        </v-row>

        <v-text-field
          id="pin2"
          v-model="data.Pin2"
          autocomplete="new-password"
          class="rounded-lg rtl"
          color="info"
          :label="i18n.t('INCREASE.PIN2')"
          outlined
          tabindex="5"
          type="password"
        >
          <template v-slot:append>
            <v-btn
              :disabled="!canGetOtp || (!!otpCounter && !!otpTimer)"
              :loading="loading"
              class="rounded-lg"
              color="info"
              depressed
              tabindex="6"
              @click="getOtp"
            >
              <template v-if="!otpCounter && !otpTimer">
                {{ i18n.t("INCREASE.GET_OTP") }}
              </template>
              <span v-else style="direction: ltr" v-text="computedOtpCounter" />
            </v-btn>
          </template>
        </v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn
          :disabled="!canMore && false"
          :loading="loading"
          block
          class="rounded-lg"
          color="info"
          depressed
          tabindex="6"
          @click="getPublicKey"
        >
          {{ i18n.t("INCREASE.PAY") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </custom-popup>
</template>

<script>
import crypto from "jsencrypt";
import CustomPopup from "../../plugins/popup/customPopup.vue";
import { banks } from "../../assets/js/banksInfo";
import i18n from "../../plugins/EasyModal/i18n";

export default {
  name: "increaseInApp",

  components: { CustomPopup },

  props: {
    value: Boolean,
    info: Object,
  },

  filters: {
    displayPanFilter(input) {
      return input
        .toString()
        .replace(/ /g, "")
        .replace(/(.{4})/g, "$1 ");
    },
  },

  data() {
    return {
      banksInfo: [],
      data: {
        PAN: "",
        CV: "",
        Pin2: "",
        ExpM: "",
        ExpY: "",
      },
      otpCounter: 0,
      otpTimer: undefined,
      loading: false,
      i18n,
      rules: {
        cardNumber: (v) =>
          (!!v.trim() && v?.replace(/ /g, "").length === 16) ||
          i18n.t("INCREASE.INVALID_PAN"),
        cv: (v) =>
          (!!v && v.length >= 3 && v.length <= 4) ||
          i18n.t("INCREASE.INVALID_CVV2"),
      },
    };
  },

  mounted() {
    this.banksInfo = banks;
  },

  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    canGetOtp() {
      return (
        this.data.PAN.length === 16 &&
        typeof this.rules.cv(this.data.CV) === "boolean" &&
        !!this.data.ExpM &&
        !!this.data.ExpY &&
        this.data.ExpM.length === 2 &&
        this.data.ExpY.length === 2
      );
    },
    canMore() {
      return (
        this.data.PAN.length === 16 &&
        typeof this.rules.cv(this.data.CV) === "boolean" &&
        !!this.data.ExpM &&
        !!this.data.ExpY &&
        this.data.ExpM.length === 2 &&
        this.data.ExpY.length === 2 &&
        !!this.data.Pin2 &&
        this.data.Pin2.length >= 4
      );
    },
    banksPrefix() {
      return this.banksInfo.findPrefix(this.data.PAN?.replace(/ /g, "") ?? "");
    },
    getCardBg() {
      return `background: url(${require("../../assets/img/line_pattern.png")}) ${
        !!this.banksPrefix ? this.banksPrefix.color : "blue"
      };`;
    },
    computedOtpCounter() {
      let sec = ~~(this.otpCounter % 60);
      let min = ~~(this.otpCounter / 60);
      return `${min.toString().padStart(2, "0")} : ${sec
        .toString()
        .padStart(2, "0")}`;
    },
  },

  methods: {
    displayPan(input) {
      return input
        .toString()
        .replace(/ /g, "")
        .replace(/(.{4})/g, "$1 ");
    },
    updateValue(e) {
      this.data.PAN = e.replace(/ /g, "");
    },
    getOtp() {
      if (
        !this.data.PAN ||
        typeof this.rules.cardNumber(this.data.PAN) !== "boolean"
      )
        return this.$toast.error("شماره کارت صحبح وارد نمایید");
      else if (this.data.CV.length < 3 || this.data.CV.length > 4)
        return this.$toast.error("لطفا cvv2 را صحیح وارد نمایید");
      else if (this.data.ExpM.length < 2 || this.data.ExpY.length < 2)
        return this.$toast.error(
          "لطفا ماه و سال را به صورت دو رقمی وارد نمایید",
        );

      this.loading = true;

      this.$DashboardAxios
        .post("/api/top/cart/otp", {
          pan: this.data.PAN,
          amount: Number(this.info.price),
        })
        .then(({ data }) => {
          this.data.Pin2 = "";
          this.startOtpTimer();
        })
        .catch(({ response }) =>
          console.log("error in get cart otp: ", response),
        )
        .finally(() => (this.loading = false));
    },
    startOtpTimer() {
      let countdown = 120;

      this.otpTimer = setInterval(() => {
        countdown--;

        if (countdown <= 0) {
          clearInterval(this.otpTimer);
          this.otpTimer = undefined;
        }

        this.otpCounter = countdown;
      }, 1000);
    },
    getPublicKey() {
      this.loading = true;

      this.$DashboardAxios
        .post("/api/top/key")
        .then(({ data }) => this.charge(data.data.key))
        .catch(({ response }) => {
          this.loading = false;
          console.log("error in get public key: ", response);
        });
    },
    charge(key) {
      this.loading = true;

      const data = this.data;
      const dcrptkeycode = new crypto();
      dcrptkeycode.setPublicKey(key);
      this.$DashboardAxios
        .post("/api/top/charge", {
          data: dcrptkeycode.encrypt(JSON.stringify(data)),
          amount: Number(this.info.price),
        })
        .then(({ data }) => {
          if (!!data.data && data.data.Status === 200 && !!data.data.Message) {
            this.$toast.success(data.data.Message);
          } else if (!!data.data.Message) {
            this.$toast.info(data.data.Message);
          }
          this.computedValue = false;
          this.data = {
            PAN: "",
            CV: "",
            Pin2: "",
            ExpM: "",
            ExpY: "",
          };
        })
        .catch(({ response }) =>
          console.log("error in charge operation: ", response),
        )
        .finally(() => (this.loading = false));
    },
  },
};
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
input[type="number"] {
  -moz-appearance: textfield;
}

.expire-wrapper >>> input {
  text-align: center;
}

.expire-card::before {
  content: "تاریخ انقضا";
  background: #fff;
  padding: 4px;
  position: absolute;
  top: 0;
  right: 8px;
  transform: translateY(-50%);
}
</style>
