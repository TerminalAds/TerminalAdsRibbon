<template>
  <div
    v-if="!!data"
    class="w-100 text-center dir-ltr d-flex align-start py-2 px-6 flex-wrap"
  >
    <v-card class="d-flex" flat max-width="200">
      <span class="text-no-wrap me-2 mt-md-3">{{ i18n.t("go_to_page") }}:</span>
      <v-text-field
        :disabled="disabled || pageCount <= 1"
        :max="pageCount"
        :messages="
          data.unknown_total
            ? `${i18n.t('page')} ${data.current_page}`
            : `${i18n.t('page')} ${data.current_page} ${i18n.t('from')} ${
                data.last_page
              }`
        "
        :value="page"
        dense
        oninput="
          this.value =
            Number(this.value) > this.max
              ? this.max
              : Number(this.value) < 1
                ? 1
                : Number(this.value)
        "
        outlined
        type="number"
        @keydown.enter="change"
      />
    </v-card>

    <v-card
      v-if="
        $slots['per-page'] &&
        (data.unknown_total || data.last_page >= 2 || data.total >= 10)
      "
      flat
      max-width="150"
    >
      <slot name="per-page" />
    </v-card>

    <div v-if="data && data.total > 0" class="px-2 py-3">
      {{ i18n.t("show") }}
      {{ data.from }}
      {{ i18n.t("until") }}
      {{ data.to }}
      {{ i18n.t("from") }}
      {{ data.total }}
    </div>

    <v-spacer />

    <div>
      <v-pagination
        v-model="page"
        :disabled="disabled || pageCount <= 1"
        :length="pageCount"
        :total-visible="totalVisible"
      />
    </div>
  </div>
</template>

<script>
import i18n from "../../plugins/EasyModal/i18n";

export default {
  name: "vueTablePagination",
  props: {
    disabled: { type: Boolean, default: false },
    data: [Array, Object],
    hasInput: {
      type: Boolean,
      default: true,
    },
    totalVisible: Number,
    value: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return { i18n };
  },
  computed: {
    // For cursor/plain-list responses these are reachable pages, not a claimed total.
    pageCount() {
      return this.data.unknown_total
        ? Math.max(
            1,
            Number(this.data.current_page) + (this.data.has_more ? 1 : 0),
          )
        : Math.max(1, Number(this.data.last_page) || 1);
    },
    page: {
      get() {
        return this.value;
      },
      set(val) {
        const page = Number(val);
        if (
          !this.disabled &&
          Number.isInteger(page) &&
          page >= 1 &&
          page <= this.pageCount
        )
          this.$emit("input", page);
      },
    },
  },

  methods: {
    change(e) {
      let value = Number(e.target.value);

      this.page =
        value > this.pageCount ? this.pageCount : value < 1 ? 1 : value;
    },
  },
};
</script>

<style scoped></style>
