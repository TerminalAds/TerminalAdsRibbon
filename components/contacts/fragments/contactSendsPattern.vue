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
          <v-col class="d-flex align-center pa-2" cols="12">
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

          <!-- حالت تک پترن -->
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
                v-html="generateText"
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

          <!-- هدر انتخاب کمپین -->
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

          <!-- نمایش مراحل کمپین با پیش‌نمایش و ورودی‌های data -->
          <div
            v-if="
              selectedRow?.[0]?.messages && selectedRow?.[0]?.messages?.text
            "
            class="d-flex flex-wrap w-100"
          >
            <div
              v-for="(item, i) in selectedRow?.[0]?.messages?.text"
              :key="i"
              class="ma-2 pa-4 grey lighten-2 rounded-lg col-12"
            >
              <v-avatar
                class="mt-n8 ms-n6 white--text pa-2"
                color="success"
                size="24"
                >{{ i + 1 }}</v-avatar
              >

              <v-row no-gutters class="mt-2">
                <!-- پیام انتخاب شده هر -->
                <div
                  class="col-md-5 rounded p-4"
                  style="background: rgba(193, 193, 193, 0.58)"
                >
                  <p class="font-weight-bold">پیام {{ i + 1 }}:</p>
                  <p
                    class="font-size-lg ma-0"
                    style="white-space: break-spaces"
                    v-html="getStepPreview(item, i)"
                  ></p>
                </div>

                <!-- ورودی‌های اجباری هر -->
                <div
                  v-if="getStepInputs(item).length > 0"
                  class="col-md mr-1 rounded p-4"
                  style="background: rgba(193, 193, 193, 0.58)"
                >
                  <p class="font-weight-bold">ورودی‌های اجباری {{ i + 1 }}:</p>
                  <v-text-field
                    v-for="input in getStepInputs(item)"
                    :key="input"
                    v-model="campTexts[i][input]"
                    :label="input"
                    class="my-2"
                    dense
                  />
                </div>
              </v-row>
            </div>
          </div>

          <v-col class="pa-2" cols="12">
            <gradual-list :numbers-count="items.length" />
          </v-col>

          <v-col cols="12">
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
    campTexts: {},
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

    isValid() {
      if (!this.date || !this.items?.length) return false;
      if (this.sendAsGradual && !this.allowSendAsGradual) return false;

      if (this.selectedCamp) {
        if (!this.selectedRow?.[0]?.campId) return false;
        // بررسی پر بودن تمام ورودی‌های کمپین
        const texts = this.selectedRow?.[0]?.messages?.text || [];
        for (let i = 0; i < texts.length; i++) {
          const required = this.getStepInputs(texts[i]);
          for (const key of required) {
            if (!this.campTexts?.[i]?.[key]) return false;
          }
        }
        return true;
      } else {
        return (
          !!this.selectedRow?.[0]?.id &&
          this.texts.filter((x) => x).length === this.inputs.length
        );
      }
    },
  generateText() {
    let text = this?.selectedRow?.[0]?.content;
    if (!text) return "";
    const matches = text.match(/data\d+/g) || [];
    this.inputs = matches;

    matches.forEach((placeholder, index) => {
      const val = this.texts?.[index];

      const replacement = val
        ? `<span class="primary--text font-weight-bold mx-1 colored">${val}</span>`
        : `<span class="grey--text text--darken-1 font-weight-bold mx-1 colored">${placeholder}</span>`;
      text = text.replace(new RegExp(placeholder, "g"), replacement);
    });

    return text;
  }
    },

  watch: {
    selectedRow: {
      deep: true,
      handler(val) {
        this.selectedCamp =
          Object.hasOwn(val?.[0] || {}, "campId") ||
          Object.hasOwn(val || {}, "campId");
        this.initCampTexts();
      },
    },
  },

  methods: {
    getStepInputs(text) {
      if (!text) return [];
      const matches = text.match(/data\d+/g);
      return matches ? [...new Set(matches)] : [];
    },

    getStepPreview(text, stepIndex) {
      if (!text) return "";
      let preview = text;
      const stepInputs = this.getStepInputs(text);
      stepInputs.forEach((key) => {
        const val = this.campTexts?.[stepIndex]?.[key];

        const displayVal = val
        ? `<span class="primary--text font-weight-bold mx-1 colored">${val}</span>`
        : `<span class="grey--text text--darken-1 font-weight-bold mx-1 colored">${key}</span>`;
        preview = preview.replaceAll(key, displayVal);
      });
      return preview;
    },

    initCampTexts() {
      this.campTexts = {};
      const texts = this.selectedRow?.[0]?.messages?.text;
      if (Array.isArray(texts)) {
        texts.forEach((text, i) => {
          const stepInputs = this.getStepInputs(text);
          const stepObj = {};
          stepInputs.forEach((key) => {
            stepObj[key] = "";
          });
          this.$set(this.campTexts, i, stepObj);
        });
      }
    },

    sendPattern() {
      const phones = this.items?.map((item) => item.phone);
      this.submitNew(phones);
    },

    submitNew(phones) {
      this.loading = true;

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

      if (!this.selectedCamp) {
        this.inputs.forEach((inputKey, index) => {
          data[inputKey] = this.texts[index];
        });
      } else {
        data.campData = this.campTexts;
        Object.keys(this.campTexts).forEach((stepIdx) => {
          Object.assign(data, this.campTexts[stepIdx]);
        });
      }

      sendPatternSms(data)
        .then((result) => {
          this.$modal.success("موفقیت", result.data.msg);
          this.selectedRow = null;
          this.selectedCamp = false;
          this.inputs = [];
          this.texts = [];
          this.campTexts = {};
          this.rerender = true;
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>
<style>
tr {
  cursor: pointer !important;
}

pre {
  font-family: "vazir", serif;
  color: unset !important;
}
.msg-preview-box {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.8;
  font-size: 0.95rem;
  font-family: inherit;
}

.border-top {
  border-top: 1px solid #e0e0e0;
}

.campaign-card {
  border: 1px solid #e2e8f0 !important;
  background-color: #ffffff;
}

.border-subtle {
  border: 1px solid #e2e8f0;
}

.bg-white {
  background-color: #ffffff;
}
.msg-preview-box {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 2;
  font-size: 0.95rem;
  color: #1e293b; /* رنگ متن پررنگ و کاملاً خوانا */
  min-height: 100px;
  height: 100%;
  max-height: 100%;
  background: rgba(193, 193, 193, 0.58)
}

.campaign-card {
  border: 1px solid #e2e8f0 !important;
  background-color: #ffffff;
}

.border-subtle {
  border: 1px solid #e2e8f0;
}

.bg-white {
  background-color: #ffffff;
}
.colored{
  background-color: rgba(172, 255, 47, 0.684);
  padding: 1px 4px !important;
  padding-left: 2px;
  padding-right: 2px;
  border-radius: 2px;

}
.ff{
    border-radius: 7px;
    border: rgba(128, 128, 128, 0.478) solid 1px;
    padding: 0px;
    background: rgba(193, 193, 193, 0.58)
    }
    .msg-preview-box {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 2;
  font-size: 0.95rem;
  color: #1e293b;
  min-height: 100px;
  height: 100%;
  background: rgba(193, 193, 193, 0.58);
  border: none !important;
  border-radius: 0 !important;
}

.ff {
  border: none !important;
  border-radius: 0 !important;
  background: rgba(193, 193, 193, 0.58);
  height: 100%;
}

.ff .v-input .v-input__slot {
  background-color: transparent !important;
  border-radius: 0 !important;
}

</style>
