<template>
  <div v-if="!!data" class="w-100 text-center dir-ltr d-flex align-start py-2 px-6 flex-wrap">
    <v-card class="d-flex" flat max-width="200">
      <span class="text-no-wrap me-2 mt-md-3">برو به صفحه:</span>
      <v-text-field :disabled="data.last_page <= 1" :max="data.last_page"
                    :messages="`صفحه ${data.current_page} از ${data.last_page}`" :value="page" dense outlined
                    type="number" @keydown.enter="change"/>
    </v-card>

    <v-card v-if="$slots['per-page'] && (data.last_page >= 2 || data.total >= 10)" flat max-width="150">
      <slot name="per-page"/>
    </v-card>

    <div v-if="data && data.total > 0" class="px-2 py-3">
      نمایش
      {{ data.from }}
      تا
      {{ data.to }}
      از
      {{ data.total }}
    </div>

    <v-spacer/>

    <div>
      <v-pagination v-model="page" :disabled="data.last_page <= 1" :length="data.last_page"
                    :total-visible="totalVisible"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "vueTablePagination",

  props: {
    data: [Array, Object],
    hasInput: {
      type: Boolean,
      default: true
    },
    totalVisible: Number,
    value: {
      type: Number,
      default: 1
    }
  },

  computed: {
    page: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },

  methods: {
    change(e) {
      this.page = Number(e.target.value)
    }
  }
}

</script>

<style scoped>

</style>