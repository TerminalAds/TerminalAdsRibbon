<template>
  <!-- <custom-popup
    v-model="dialog"
    max-width="500"
    persistent
    :cons="
      !isEdit
        ? { title: 'افزودن جایزه جدید', icon: 'gift-outline' }
        : { title: 'ویرایش جایزه', icon: 'gift-open-outline' }
    "
  > -->
  <v-card>
    <!-- <v-card-title class="headline"
      >{{ !isEdit ? "افزودن جایزه جدید" : "ویرایش جایزه" }}
      <v-icon
        >{{ isEdit ? "mdi-gift-open-outline" : "mdi-gift-outline" }}
      </v-icon>
    </v-card-title> -->

    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="form.title"
          label="عنوان جایزه"
          :rules="[(v) => !!v || 'الزامی است']"
          outlined
          dense
        />
        <v-select
          v-model="form.award_type"
          :items="awardTypes"
          label="نوع جایزه"
          outlined
          dense
          @change="revalidateForm"
        />
        <v-text-field
          v-model="form.award"
          :label="form.award_type === 'url' ? 'لینک جایزه' : 'مقدار جایزه'"
          :rules="awardRules"
          :dir="form.award_type === 'url' ? 'ltr' : 'auto'"
          :placeholder="
            form.award_type === 'url' ? 'https://terminalads.com' : ''
          "
          outlined
          dense
        />

        <qr-picker v-model="form.qr_id" />

        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model.number="form.min_score"
              label="حداقل امتیاز"
              type="number"
              :rules="minScoreRules"
              @keypress="onlyNumbers"
              outlined
              dense
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model.number="form.max_score"
              label="حداکثر امتیاز"
              type="number"
              :min="Number(form.min_score) + 1"
              :rules="maxScoreRules"
              @keypress="onlyNumbers"
              outlined
              dense
            />
          </v-col>
        </v-row>

        <v-text-field
          v-model.number="form.max_use"
          label="حداکثر تعداد استفاده"
          type="number"
          min="1"
          @keypress="onlyNumbers"
          :rules="[(v) => v > 0 || 'باید بیشتر از 0 باشد']"
          outlined
          dense
        />

        <v-text-field
          v-model.number="form.cooldown_days"
          label="مدت زمان انتظار برای دریافت مجدد جایزه (روز)"
          type="number"
          min="0"
          @keypress="onlyNumbers"
          outlined
          dense
        />
      </v-form>
    </v-card-text>
    <!-- <v-spacer /> -->
    <v-divider />

    <v-card-actions class="d-flex space justify-content-space-between">
      <v-btn class="btn-delete rounded-lg" @click="$emit('input', false)">
        <v-icon>mdi-close</v-icon>

        انصراف</v-btn
      >
      <v-btn
        class="btn-get-code rounded-lg"
        :loading="saving"
        :disabled="!valid || saving"
        @click="saveAward"
      >
        <v-icon>{{ isEdit ? "mdi-pencil" : "mdi-plus" }}</v-icon>
        {{ isEdit ? "ویرایش جایزه" : "ثبت جایزه" }}
      </v-btn>
    </v-card-actions>
  </v-card>
  <!-- </custom-popup> -->
</template>

<script>
import QrPicker from "./qrPicker.vue";

export default {
  name: "AddAwardManualDialog",
  props: {
    isEdit: { type: Boolean, default: false },
    value: { type: Boolean, default: false },
    id: { type: Number, default: null },
    item: {
      type: Object,
      default: {
        award: "",
        award_type: "discount",
        qr_id: null,
        min_score: 10,
        max_score: 50,
        max_use: 100,
        cooldown_days: 7,
      },
    },
  },
  components: { QrPicker },

  data: () => ({
    dialog: false,
    valid: false,
    saving: false,

    awardTypes: [
      { text: "تخفیف", value: "discount" },
      { text: "متن", value: "text" },
      { text: "لینک", value: "url" },
    ],
  }),
  computed: {
    form: {
      get() {
        return this.item;
      },
      set(val) {
        this.item = val;
      },
    },
    awardRules() {
      const rules = [(v) => !!v || "الزامی است"];

      if (this.form.award_type === "url") {
        const urlPattern =
          /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
        rules.push(
          (v) =>
            urlPattern.test(v) ||
            "لطفاً یک لینک معتبر وارد کنید (مثال: https://google.com)",
        );
      }

      return rules;
    },

    minScoreRules() {
      return [
        (v) => (v !== null && v !== "") || "الزامی است",
        (v) => v >= 0 || "حداقل امتیاز نمی‌تواند منفی باشد",
      ];
    },

    maxScoreRules() {
      return [
        (v) => (v !== null && v !== "") || "الزامی است",
        (v) =>
          Number(v) > Number(this.form.min_score) ||
          "حداکثر امتیاز باید حتماً بزرگتر از حداقل امتیاز باشد",
      ];
    },
  },
  watch: {
    value(v) {
      this.dialog = v;
      if (!v) this.resetForm();
    },
    dialog(v) {
      this.$emit("input", v);
    },
  },

  methods: {
    onlyNumbers(event) {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
      }
    },
    revalidateForm() {
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.validate();
        }
      }, 50);
    },
    resetForm() {
      this.form = {
        award: "",
        award_type: "discount",
        qr_id: null,
        min_score: 10,
        max_score: 50,
        max_use: 100,
        cooldown_days: 7,
      };
      this.$refs.form?.resetValidation();
    },

    async saveAward() {
      if (!this.$refs.form.validate()) return;

      this.saving = true;
      try {
        let res = null;
        if (this.isEdit === true) {
          res = await this.requestApiPutPayamak(`game/award/${this.id}`, this.form);
        } else {
          res = await this.requestApiPostPayamak("game/award", this.form);
        }
        if (res?.data?.status || res?.status) {
          let message = this.isEdit
            ? "جایزه با موففیت ثبت شد"
            : "جایزه با موففیت ویرایش شد";
          this.$toast.success(message);

          this.$emit("created");
          this.dialog = false;
        }
      } catch (err) {
        console.error(err);
        this.$toast.error("خطا در ثبت جایزه");
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
<style>
tr {
  cursor: pointer !important;
}

#uploader {
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0.2);
  border: 2px dashed #797979 !important;
}

.drag-over {
  border: 2px dashed #fff !important;
  background-color: rgba(33, 150, 243, 0.33) !important;
}

pre {
  font-family: "vazir", serif;
  color: unset !important;
}
.space {
  justify-content: space-between !important;
}
</style>
