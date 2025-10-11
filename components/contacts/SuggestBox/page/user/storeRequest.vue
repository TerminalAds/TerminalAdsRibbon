<template>
  <div class="mt-6">
    <v-autocomplete v-model="selectedOption" :items="options" dense outlined />

    <div v-if="selectedOption !== 'لطفا یک گزینه را انتخاب نمایید.'">
      <v-text-field
        ref="title"
        v-model="title"
        dense
        label="عنوان"
        outlined
        placeholder="عنوان"
      />

      <suggest-text
        v-model="text"
        :rules="rules.text"
        :title-input="$refs.title"
        label="متن پیامک"
      />

      <v-textarea
        v-if="selectedOption === 'درخواست مشاوره متن'"
        v-model="description"
        class="mt-4"
        dense
        label="توضیحات"
        outlined
        placeholder="توضیحات"
      />

      <v-row class="mt-5">
        <v-btn
          :disabled="validate"
          :loading="loading"
          class="btn-get-code"
          style="letter-spacing: normal"
          @click="submit"
        >
          ثبت درخواست
        </v-btn>
      </v-row>
    </div>
  </div>
</template>

<script>
import i18n from "../../../../../plugins/EasyModal/i18n";
import { userStoreItem } from "../../../../../Utilities/defaultSms";
import SuggestText from "../../suggestInput";

export default {
  name: "storeRequest",

  components: { SuggestText },

  data() {
    return {
      i18n,
      title: undefined,
      text: "\nلغو11",
      description: undefined,
      selectedOption: "لطفا یک گزینه را انتخاب نمایید.",
      options: [
        "لطفا یک گزینه را انتخاب نمایید.",
        "ثبت متن پیشفرض",
        "درخواست مشاوره متن",
      ],
      loading: false,
      rules: {
        text: [
          (n) => !!n || i18n.t("ERRORS.EmptyText"),
          (n) => n.includes("لغو11") || 'بایستی شامل عبارت "لغو11" باشد',
        ],
      },
    };
  },

  mounted() {
    window.rp = this;
  },

  computed: {
    validate() {
      let text = this.text ?? "";
      let description = this.description ?? "";
      let title = this.title ?? "";

      return (text.length < 1 && description.length < 1) || title.length < 1;
    },
  },

  watch: {
    selectedOption(value) {
      if (value !== "درخواست مشاوره متن") this.description = undefined;
    },
  },

  methods: {
    submit() {
      this.loading = true;

      userStoreItem({
        title: this.title,
        text: this.text,
        description: this.description,
        type:
          this.selectedOption === "درخواست مشاوره متن" ? "request" : "generate",
      })
        .then((response) => {
          this.title = undefined;
          this.text = undefined;
          this.description = undefined;

          this.$modal.success("موفقیت", response.data.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped></style>
