<template>
  <help-info-wrapper
    :info.sync="helpData"
    :service-name="serviceName"
    class="warp"
  >
    <template>
      <v-card :loading="loading" flat>
        <v-card-title>
          موجودی قابل برداشت:
          <span class="text--primary mx-2">{{
            persianNum(currency(Math.floor(balance)))
          }}</span>
          <span class="small-font">ریال</span>
        </v-card-title>

        <v-card-text>
          <v-divider />
          <span class="red--text"
            >کارمزد برداشت از حساب: ۵۰,۰۰۰ ریال می باشد!</span
          >
          <v-row class="pa-2" justify="center" no-gutters>
            <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
              <div class="rowinfo">
                <price-input v-model="inputBalance" label="مبلغ" to-char />
                <help-info
                  :element-name="`${serviceName}-${componentName}-inputBalance`"
                  :service-name="serviceName"
                  :help-data="helpData"
                  class="buttoninfo"
                  label="مبلغ"
                />
              </div>
            </v-col>

            <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
              <div class="rowinfo">
                <v-autocomplete
                  v-model="selectedAccount"
                  :items="accounts"
                  :loading="loading"
                  label="انتخاب حساب"
                  outlined
                >
                  <template v-slot:prepend-inner>
                    <v-img
                      v-if="!!banksPrefix"
                      :src="banksPrefix.icon"
                      contain
                      width="48"
                    />
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
                      <v-img :src="data.item.icon" />
                    </v-list-item-avatar>
                    <v-list-item-title v-text="data.item.text" />
                    <v-list-item-action>
                      <v-btn
                        color="#ff475a"
                        icon
                        @click.stop="deleteAccount(data.item.id)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </template>
                </v-autocomplete>
                <help-info
                  :element-name="`${serviceName}-${componentName}-selectedAccount`"
                  :service-name="serviceName"
                  :help-data="helpData"
                  class="buttoninfo"
                  label="انتخاب حساب"
                />
              </div>
            </v-col>

            <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
              <v-divider />
              <div
                class="rowinfo"
                style="width: 100% !important"
                :disabled="!inputBalance || !selectedAccount"
              >
                <v-btn
                  :disabled="!inputBalance || !selectedAccount"
                  :loading="loading"
                  color="success"
                  class="contentinfo"
                  depressed
                  @click="addWithdraw"
                >
                  <v-icon left>mdi-plus</v-icon>
                  ثبت برداشت
                </v-btn>
                <help-info
                  :element-name="`${serviceName}-${componentName}-addWithdraw`"
                  :service-name="serviceName"
                  :help-data="helpData"
                  class="buttoninfo"
                  label="ثبت برداشت"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <custom-popup
          v-model="addAccount"
          :cons="{ title: 'افزدن حساب' }"
          hide-confirm
          max-width="600"
        >
          <v-card flat>
            <v-card-title class="red--text">
              ورود کلیه اطلاعات الزامی است.
            </v-card-title>

            <v-row class="pa-2" justify="center" no-gutters>
              <v-col class="pa-2" cols="12" lg="6" md="9" sm="10">
                <div class="rowinfo">
                  <v-text-field
                    v-model="obj.ownerName"
                    :rules="[rules.persian]"
                    class="rounded-lg contentinfo"
                    clear-icon="mdi-close-circle-outline"
                    clearable
                    dense
                    label="نام صاحب حساب"
                    outlined
                  />
                  <help-info
                    :element-name="`${serviceName}-${componentName}-account-ownerName`"
                    :service-name="serviceName"
                    :help-data="helpData"
                    class="buttoninfo"
                    label="نام صاحب حساب"
                  />
                </div>
              </v-col>

              <v-col class="pa-2" cols="12" lg="6" md="9" sm="10">
                <div class="rowinfo">
                  <v-text-field
                    v-model="obj.ownerLastName"
                    :rules="[rules.persian]"
                    class="rounded-lg contentinfo"
                    clear-icon="mdi-close-circle-outline"
                    clearable
                    dense
                    label="نام خانوادگی"
                    outlined
                  />
                  <help-info
                    :element-name="`${serviceName}-${componentName}-account-ownerLastName`"
                    :service-name="serviceName"
                    :help-data="helpData"
                    class="buttoninfo"
                    label="نام خانوادگی"
                  />
                </div>
              </v-col>

              <v-col class="pa-2" cols="12" lg="6" md="9" sm="10">
                <div class="rowinfo">
                  <v-text-field
                    v-model="obj.bankName"
                    :rules="[rules.persian]"
                    class="rounded-lg icon-wrapper contentinfo"
                    clear-icon="mdi-close-circle-outline"
                    clearable
                    dense
                    label="نام بانک"
                    outlined
                  >
                    <template v-slot:append>
                      <v-img
                        v-if="!!banksPrefix"
                        :src="banksPrefix.icon"
                        contain
                        width="32"
                      />
                    </template>
                  </v-text-field>
                  <help-info
                    :element-name="`${serviceName}-${componentName}-bankName`"
                    :service-name="serviceName"
                    :help-data="helpData"
                    class="buttoninfo"
                    label="نام بانک"
                  />
                </div>
              </v-col>

              <v-col class="pa-2" cols="12" lg="6" md="9" sm="10">
                <div class="rowinfo">
                  <v-text-field
                    v-model="obj.accountNumber"
                    class="rounded-lg"
                    clear-icon="mdi-close-circle-outline"
                    clearable
                    dense
                    label="شماره حساب"
                    outlined
                    type="number"
                  />
                  <help-info
                    :element-name="`${serviceName}-${componentName}-obj-accountNumber`"
                    :service-name="serviceName"
                    :help-data="helpData"
                    class="buttoninfo"
                    label="شماره حساب"
                  />
                </div>
              </v-col>

              <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
                <div class="rowinfo">
                  <v-text-field
                    v-model="obj.cardNumber"
                    :rules="[rules.cardNumber]"
                    class="rounded-lg"
                    clear-icon="mdi-close-circle-outline"
                    clearable
                    counter="16"
                    dense
                    label="شماره کارت"
                    outlined
                    type="number"
                  />
                  <help-info
                    :element-name="`${serviceName}-${componentName}-obj-cardNumber`"
                    :service-name="serviceName"
                    :help-data="helpData"
                    class="buttoninfo"
                    label="شماره کارت"
                  />
                </div>
              </v-col>

              <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
                <div class="rowinfo">
                  <v-text-field
                    v-model="obj.sheba"
                    :rules="[rules.sheba]"
                    class="rounded-lg contentinfo"
                    counter="24"
                    dense
                    label="شماره شبا"
                    outlined
                    suffix="IR"
                    type="number"
                  />
                  <help-info
                    :element-name="`${serviceName}-${componentName}-obj-sheba`"
                    :service-name="serviceName"
                    :help-data="helpData"
                    class="buttoninfo"
                    label="شماره شبا"
                  />
                </div>
              </v-col>

              <v-col class="pa-2" cols="12" lg="8" md="9" sm="10">
                <v-divider />
                <div class="rowinfo" style="width: 100% !important">
                  <v-btn
                    :disabled="canAddAcc"
                    :loading="addLoading"
                    color="success"
                    class="contentinfo"
                    depressed
                    @click="addToAccountList"
                  >
                    <v-icon left>mdi-plus</v-icon>
                    افزودن حساب
                  </v-btn>
                  <help-info
                    :element-name="`${serviceName}-${componentName}-obj-sheba`"
                    :service-name="serviceName"
                    :help-data="helpData"
                    class="buttoninfo"
                    label="شماره شبا"
                  />
                </div>
              </v-col>
            </v-row>
          </v-card>
        </custom-popup>
      </v-card>
    </template>
  </help-info-wrapper>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import PriceInput from "../pickers/priceInput";
import CustomPopup from "../../plugins/popup/customPopup";
import { banks } from "../../assets/js/banksInfo";

export default {
  name: "withdrawTransactions",

  components: { CustomPopup, PriceInput },

  data() {
    return {
      helpData: [],
      serviceName: "Qrland",
      componentName: "withdrawTransactions",
      accounts: [],
      addAccount: false,
      addLoading: false,
      banksInfo: [],
      inputBalance: 0,
      loading: false,
      obj: {
        bankName: "",
        ownerName: "",
        ownerLastName: "",
        accountNumber: "",
        cardNumber: "",
        sheba: "",
      },
      rules: {
        persian: (v) => this.justPersian(v) || "فقط مجاز به ورود حروف فارسی!",
        cardNumber: (v) =>
          v.length === 16 || "تعداد ارقام شماره کارت باید ۱۶ عدد باشد!",
        sheba: (v) =>
          v.length === 24 || "تعداد ارقام شماره شبا باید ۲۴ عدد باشد!",
      },
      selectedAccount: null,
    };
  },

  mounted() {
    this.fetch();
    this.banksInfo = banks;
  },

  computed: {
    ...mapGetters("ribbon", ["new_wallet"]),
    balance() {
      return this.new_wallet.balance;
    },
    canAddAcc() {
      let arr = Object.values(this.obj);
      return (
        arr.filter((item) => !!item).length !== arr.length ||
        typeof this.rules.persian(this.obj.bankName) !== "boolean" ||
        typeof this.rules.persian(this.obj.ownerName) !== "boolean" ||
        typeof this.rules.persian(this.obj.ownerLastName) !== "boolean" ||
        typeof this.rules.cardNumber(this.obj.cardNumber) !== "boolean" ||
        typeof this.rules.sheba(this.obj.sheba) !== "boolean"
      );
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
        str = "";
      if (this.addAccount) str = this.obj.cardNumber;
      else
        str = this.accounts?.find(
          (item) => item.id === this.selectedAccount
        )?.cardNumber;

      return arr.findPrefix(str);
    },
  },

  methods: {
    ...mapActions("ribbon", ["toggleWithdrawDialog"]),
    fetch() {
      this.loading = true;

      this.$DashboardAxios
        .get("/api/account")
        .then(({ data }) => {
          try {
            this.accounts = data.data.data.map((item) => {
              return {
                ...item,
                text:
                  item.bankName +
                  " - " +
                  item.ownerName +
                  " " +
                  item.ownerLastName,
                value: item.id,
                icon: this.banksInfo.find((value) =>
                  value.prefix.includes(item.cardNumber.substring(0, 6))
                )?.icon,
              };
            });
          } catch (e) {
            console.error("error in accounts: ", e);
          }
        })
        .catch(({ response }) =>
          console.error("error in get list of accounts: ", response)
        )
        .finally(() => (this.loading = false));
    },
    addWithdraw() {
      if (this.balance < Math.floor(this.inputBalance)) {
        this.$toast.error("موجودی کیف پول شما کافی نمی باشد!");
        return;
      } else if (this.balance < Math.floor(this.inputBalance) + 50000) {
        this.$toast.error(
          "مبلغ درخواست برداشت با کسر ۵۰,۰۰۰ ریال کارمزد بیشتر از موجودی کیف پول میباشد!",
          { timeout: 5000 }
        );
        return;
      }

      this.loading = true;
      this.$DashboardAxios
        .post("/api/transferRequest", {
          to: this.selectedAccount,
          amount: Number(this.inputBalance),
        })
        .then(({ data }) => {
          this.$toast.success("درخواست برداشت شما با موفقیت ثبت شد.");
          this.toggleWithdrawDialog(false);
        })
        .catch(({ response }) => {
          if (!!response.data.message) this.$toast.error(response.data.message);
          else this.$toast.error("خطا در ارسال درخواست برداشت از کیف پول!");
          console.error("error to withdraw: ", response);
        })
        .finally(() => (this.loading = false));
    },
    addToAccountList() {
      this.addLoading = true;

      if (
        this.obj.ownerName !== this.user.name ||
        this.obj.ownerLastName !== this.user.lastName
      ) {
        return this.$toast.error("حساب وارد شده به نام کاربر نیست!!");
      }

      this.$DashboardAxios
        .post("/api/account", this.obj)
        .then(({ data }) => {
          this.selectedAccount = data.data.id;
          this.obj = {
            bankName: "",
            ownerName: "",
            ownerLastName: "",
            accountNumber: "",
            cardNumber: "",
            sheba: "",
          };
          this.addAccount = false;
          this.fetch();
        })
        .catch(({ response }) =>
          console.error("error in add account: ", response)
        )
        .finally(() => (this.addLoading = false));
    },
    deleteAccount(id) {
      if (this.$modal.yesNo("حذف حساب از لیست ؟")) {
        this.loading = true;
        this.$DashboardAxios
          .delete(`/api/account/${id}`)
          .then(({ data }) => {
            this.fetch();
          })
          .catch(({ response }) =>
            console.error("error in delete account: ", response)
          )
          .finally(() => (this.loading = false));
      }
    },
    justPersian(str) {
      var p = /^[\u0620-\u065F\u0671-\u06D5\s]+$/;
      return p.test(str);
    },
  },
};
</script>

<style scoped>
.small-font {
  font-size: 0.7em !important;
}

.v-autocomplete >>> .v-input__prepend-inner,
.icon-wrapper >>> .v-input__append-inner {
  align-self: center;
  margin: 0 !important;
}
</style>
