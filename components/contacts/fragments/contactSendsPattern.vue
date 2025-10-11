<template>
  <v-row no-gutters>
    <v-col class="pa-2 text-center" cols="12">
      <v-btn
        :disabled="!items || !items.length"
        outlined
        rounded
        @click="showSend = !showSend"
      >
        {{ i18n.t("FORMS.SEND_TO_SELECTED_NUMBERS") }}
        <v-icon right>mdi-chevron-{{ showSend ? "up" : "down" }}</v-icon>
      </v-btn>
    </v-col>

    <v-col cols="12">
      <v-expand-transition>
        <v-row v-if="showSend" no-gutters>
          <!--          <v-col class="pa-2" cols="12" md="6">-->
          <!--            <v-select v-model="phoneToSend" :items="phoneItems" :menu-props="{offsetY: true}" class="rounded-lg" dense-->
          <!--                      hide-details label="ارسال دفترچه تلفن" outlined/>-->
          <!--          </v-col>-->

          <v-col class="d-flex align-center pa-2" cols="12">
            <!-- <pattern-dialog v-model="selectedRow" :text.sync="texts" @reload="(e) => rerender = e"/> -->
            <v-btn class="btn-edit" depressed @click="dialog = true">
              <v-icon left>mdi-clipboard-list-outline</v-icon>
              تغییر پترن/کمپین
            </v-btn>
            <save-steps
              v-model="dialog"
              :selected.sync="selectedRow"
              :rerender.sync="rerender"
            />
            <v-spacer />
            <custom-date-picker
              v-model="date"
              :label="i18n.t('FORMS.SendTime')"
              :min="nowDateTimeString()"
              auto-submit
              display-format="jYYYY-jMM-jDD HH:mm:ss"
              format="YYYY-MM-DD HH:mm:ss"
              type="datetime"
            />
          </v-col>

          <v-col v-if="rerender && !selectedCamp" class="d-flex pa-2" cols="12">
            <div
              v-if="generateText"
              class="col-md-4 rounded p-5"
              style="background: rgba(193, 193, 193, 0.58)"
            >
              <p>پیام انتخاب شده:</p>

              <p
                class="font-size-lg"
                style="white-space: break-spaces"
                v-text="generateText"
              ></p>
            </div>

            <div
              v-if="inputs.length > 0"
              class="col-md mr-1 rounded p-5"
              style="background: rgba(193, 193, 193, 0.58)"
            >
              <p>ورودی های اجباری:</p>

              <v-text-field
                v-for="(input, index) in inputs"
                :key="input"
                v-model="texts[index]"
                :label="input"
                class="my-2"
                dense
              />
            </div>
          </v-col>

          <v-col
            v-else-if="
              selectedRow && Array.isArray(selectedRow) && selectedRow.length
            "
            class="pa-2"
            cols="12"
          >
            <v-card-title>
              <span class="grey--text font-size-h6"
                >{{
                  Object.hasOwn(selectedRow?.[0], "messages") ? "کمپین" : "پترن"
                }}
                انتخاب شده:
              </span>
              <span class="primary--text px-2"
                >شناسه {{ selectedRow?.[0].campId }}</span
              >
            </v-card-title>
          </v-col>

          <div
            v-if="
              selectedRow?.[0]?.messages && selectedRow?.[0]?.messages?.text
            "
            class="d-flex flex-wrap"
          >
            <div
              v-for="(item, i) in selectedRow?.[0]?.messages?.text"
              :key="i"
              class="ma-2 pa-4 grey lighten-2 rounded-lg fit-content"
              style="width: fit-content"
            >
              <v-avatar
                class="mt-n12 ms-n6 white--text pa-2"
                color="success"
                size="24"
                >{{ i + 1 }}</v-avatar
              >
              <pre class="mt-n6 ma-0" v-html="item" />
            </div>
          </div>
          <v-col class="pa-2" cols="12">
            <gradual-list :numbers-count="items.length" />
          </v-col>

          <v-col col="12">
            <v-card-actions class="justify-end">
              <v-btn
                :disabled="!isValid"
                :loading="loading"
                class="btn-send-sms"
                @click="sendPattern"
              >
                <span class="flaticon2-send-1 icon-md"></span>
                {{ i18n.t("FORMS.Send") }}
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-expand-transition>
    </v-col>
  </v-row>
</template>

<script>
import PatternDialog from "../pattern/patternDialog.vue";
import CustomDatePicker from "../../../pages/pickers/custom-date-picker.vue";
import { sendPatternSms } from "../../../assets/js/pattern";
import GradualList from "../gradualSend/gradualList.vue";
import { mapGetters, mapState } from "vuex";
import saveSteps from "@/view/pages/contacts/saveSteps.vue";
import i18n from "../../../plugins/EasyModal/i18n";

export default {
  name: "contactSendsPattern",

  components: { GradualList, CustomDatePicker, PatternDialog, saveSteps },

  props: {
    items: Array,
    tableProps: Object,
  },

  data: () => ({
    i18n,
    dialog: false,
    loading: false,
    showSend: false,
    selectedRow: null,
    selectedCamp: false,
    inputs: [],
    texts: [],
    rerender: true,
    date: "",
    phones: [],
  }),

  mounted() {
    this.date = this.nowDateTimeString();
  },

  computed: {
    ...mapState("locals", ["sendAsGradual", "gradualItem"]),
    ...mapGetters("locals", ["allowSendAsGradual"]),
    // phoneItems() {
    //   return [
    //     {value: 'all', text: 'همه شماره‌'},
    //     {value: 'checked', text: 'انتخاب شده ها', disabled: true},
    //   ]
    // },
    isValid() {
      return (
        ((this.selectedCamp && !!this.selectedRow?.[0]?.campId) ||
          (!this.selectedCamp &&
            this.selectedRow?.[0]?.id &&
            this.texts.filter((x) => x).length === this.inputs.length)) &&
        !!this.date &&
        !!this.items?.length &&
        (this.sendAsGradual ? this.allowSendAsGradual : true)
      );
    },
    generateText() {
      const regex = new RegExp(/data\d+/, "gd");
      let text = this?.selectedRow?.[0]?.content;

      this.inputs = this?.selectedRow?.[0]?.content?.match(regex) ?? [];

      this.texts.forEach((item, index) => {
        text = text.replace(this.inputs[index], item);
      });
      return text;
    },
  },

  watch: {
    // phoneToSend(val) {
    //   console.log('phoneToSend: ', val)
    // },
    // items: {
    //   deep: true,
    //   handler(val) {
    //     console.log(val, "itemss");
    //     this.selectedRow = val;
    //   },
    // },
    selectedRow: {
      deep: true,
      handler(val) {
        this.selectedCamp = Object.hasOwn(val, "campId");
      },
    },
  },

  methods: {
    sendPattern() {
      // if (!this.items?.length) {
      //   this.getAllPhones()
      //     .then(data => this.submitNew(data))
      // } else {
      const phones = this.items?.map((item) => item.phone);
      this.submitNew(phones);
      // }
    },
    // getAllPhones() {
    //   return new Promise((resolve, reject) => {
    //     this.requestApiGet('contact', {
    //       ...this.tableProps,
    //       getTotal: true
    //     })
    //       .then(({data}) => {
    //         resolve(data.data?.map(item => item.phone))
    //       })
    //       .catch(({response}) => {
    //         reject('rejected')
    //       })
    //   })
    // },
    submitNew(phones) {
      this.loading = true;

      // send as gradual
      let with_gradual = this.sendAsGradual;
      let gradual_item = with_gradual ? this.gradualItem : undefined;

      let data = {
        To: phones.join(","),
        [this.selectedCamp ? "campId" : "MsgId"]:
          this.selectedRow?.[0]?.[this.selectedCamp ? "campId" : "id"],
        timeouted_at: this.date,
        with_gradual,
        ...gradual_item,
      };

      if (!this.selectedCamp)
        this.texts.forEach((item, index) => {
          data[this.inputs[index]] = item;
        });

      sendPatternSms(data)
        .then((result) => {
          this.$modal.success("موفقیت", result.data.msg);
          this.selectedRow = null;
          this.selectedCamp = false;
          this.inputs = [];
          this.texts = [];
          this.rerender = true;
          // this.phones = [];
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style scoped></style>
