<template>
  <div v-if="data && data.data">
    <slot name="filters" v-bind="{perPage: perPageItems, props: computedProps}"/>

    <v-data-table
      :ref="`table-${randRef}`"
      v-model="computedValue"
      :headers="headers"
      :items="data.data"
      :itemsPerPage="computedProps.length"
      :loading="loading"
      :loading-text="$attrs['loading-text'] || 'درحال دریافت اطلاعات...'"
      :no-results-text="$attrs['no-results-text'] || 'رکوردی یافت نشد!'"
      hide-default-footer
      item-key="id"
      selectable-key="id"
      v-bind="$attrs"
      v-on="$listeners">
      <template v-for="(slot, i) in $slots" v-slot:[i]>
        <slot :name="i"/>
      </template>

      <template v-for="({value}, i) in headers" v-slot:[`item.${value}`]="row">
        <slot :item="{...row, ...row.item}" :name="value">
          {{ row.item[value] }}
        </slot>
      </template>

      <template v-if="loading" v-slot:footer>
        <v-progress-linear height="5" indeterminate/>
      </template>
    </v-data-table>

    <v-divider/>

    <vue-table-pagination v-if="data && data.data" ref="pagination" v-model="computedProps.page" :data="data"
                          :totalVisible="5" @input="onPagination">
      <template v-slot:per-page>
        <v-select
          v-model="computedProps"
          :items="perPageItems"
          :menu-props="{ offsetY: true }"
          class="ma-2 my-md-0"
          dense
          label="تعداد نمایش"
          outlined
        />
      </template>
    </vue-table-pagination>
  </div>
</template>

<script>
import VueTablePagination from "../../components/vueTable/vueTablePagination.vue";

export default {
  name: "index.vue",

  components: {VueTablePagination},

  props: {
    value: [Array, Object],
    data: Object,
    loading: Boolean,
    headers: Array,
    perPageItems: {
      type: Array,
      default: () => [10, 25, 50, 100, 300, 500, 700, 1000, 2500, 5000]
    },
    totalVisible: {
      type: Number,
      default: 5
    },
    debounceDelay: {
      type: Number,
      default: 2000
    },
    props: {
      type: Object,
      default: function () {
        return this.tableProps
      }
    }
  },

  data() {
    return {
      options: {},
      tableProps: {
        page: 1,
        length: 10
      },
      randRef: null
    }
  },

  created() {
    this.randRef = Math.floor(Math.random() * (100 - 1) + 1)

    // setTimeout(() => {
    //   const el = this.$refs[`table-${this.randRef}`]
    //   console.log(el.$el)
    // }, 5000)
  },

  computed: {
    computedValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    computedLoading: {
      get() {
        return this.loading
      },
      set(val) {
        this.$emit('update:loading', val)
      }
    },
    computedProps: {
      get() {
        return this.props
      },
      set(val) {
        this.$emit('update:props', val)
      }
    }
  },

  watch: {
    computedProps: {
      deep: true,

      handler(val) {
        this.onPagination(true)
      }
    }
  },

  methods: {
    onPagination(immediately = false) {
      if (!immediately && this.computedProps.page === this.data?.current_page) return

      if (this.computedProps.page === this.data?.current_page)
        this.computedProps.page = 1

      this.computedLoading = true
      this.debounce(() => {
        this.$emit('change', this.computedProps)
      }, this.debounceDelay)
      window.scrollTo({behavior: "smooth", top: 0, left: 0})
    }
  }
}
</script>

<style scoped>
.v-data-table >>> tbody tr:nth-child(odd) {
  background-color: #ebedf3;
}
</style>