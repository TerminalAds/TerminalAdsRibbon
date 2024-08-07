<template>
  <div v-if="data && data.data">
    <slot name="filters" v-bind="{perPage: perPageItems, props: tableProps}"/>

    <v-data-table
      v-model="computedValue"
      :headers="headers"
      :items="data.data"
      :itemsPerPage="tableProps.length"
      :loading="loading"
      hide-default-footer
      item-key="id"
      selectable-key="id"
      v-bind="$attrs"
      v-on="$listeners">
      <template v-for="(slot, i) in $slots" v-slot:[i]>
        <slot :name="i"/>
      </template>

      <template v-for="({value}, i) in headers" v-slot:[`item.${value}`]="{item}">
        <slot :item="item" :name="value">
          {{ item[value] }}
        </slot>
      </template>
    </v-data-table>

    <v-divider/>

    <vue-table-pagination v-if="data && data.data" ref="pagination" v-model="tableProps.page" :data="data"
                          :totalVisible="5"
                          @input="onPagination">
      <template v-slot:per-page>
        <v-select
          v-model="tableProps.length"
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
    }
  },

  data() {
    return {
      options: {},
      tableProps: {
        page: 1,
        length: 10
      }
    }
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
    }
  },

  watch: {
    tableProps: {
      deep: true,

      handler(val) {
        this.onPagination(true)
      }
    }
  },

  methods: {
    onPagination(immediately = false) {
      if (!immediately && this.tableProps.page === this.data?.current_page) return

      this.computedLoading = true
      this.debounce(() => {
        this.$emit('change', this.tableProps)
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