<template>
  <div class="mt-6">
    <v-text-field
      v-model="data.title"
      dense
      label="عنوان"
      outlined
      placeholder="عنوان"
    />

    <suggest-text
      v-model="data.text"
      :rules="rules.text"
      label="متن پیامک"
      placeholder="متن پیامک"
    />

    <v-row class="mt-5">
      <v-btn
        :loading="loading"
        class="btn-get-code"
        style="letter-spacing: normal"
        @click="submit"
      >
        ویرایش متن
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import i18n from "../../../../../plugins/EasyModal/i18n";
import { userUpdateItem } from "../../../../../Utilities/defaultSms";
import SuggestText from "../../suggestInput";

export default {
  name: "updateRequest",

  components: { SuggestText },

  props: {
    data: {
      require: true,
    },
    modal: {
      require: true,
      type: Function,
    },
  },

  data() {
    return {
      i18n,
      loading: false,
      rules: {
        text: [
          (n) => !!n || i18n.t("ERRORS.EmptyText"),
          (n) => n.includes("لغو11") || 'بایستی شامل عبارت "لغو11" باشد',
        ],
      },
    };
  },

  methods: {
    submit() {
      this.loading = true;
      userUpdateItem(this.data.id, {
        title: this.data.title,
        text: this.data.text,
      })
        .then((response) => {
          this.data.title = undefined;
          this.data.text = undefined;

          this.$modal.success("موفقیت", response.data.message);

          this.modal();
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style scoped></style>
