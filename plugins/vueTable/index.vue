<template>
  <div v-if="data">
    <div v-if="$vuetify.breakpoint.mobile" class="py-2 filters-wrapper">
      <v-bottom-sheet v-model="sheet" inset>
        <template v-slot:activator="{ on, attrs }">
          <v-badge :content="hasFilter" :value="!!hasFilter" overlap>
            <v-chip :color="!!hasFilter ? 'rgba(0, 21, 84, .2)' : ''" v-bind="attrs" v-on="on">
              اعمال فیلتر
              <v-icon right>mdi-tune</v-icon>
            </v-chip>
          </v-badge>
        </template>

        <v-sheet class="text-center" min-height="50vh">
          <v-card-title class="align-center">
            <v-btn class="me-2" icon @click="sheet = !sheet">
              <v-icon>mdi-close</v-icon>
            </v-btn>

            <b>فیلترها</b>
          </v-card-title>

          <slot name="filters" v-bind="{perPage: perPageItems, props: computedProps || {}}"/>

          <v-card-actions class="bottom-sticky white justify-end">
            <v-btn :loading="loading" class="rounded-lg" color="success" depressed min-width="50%"
                   @click="sheet = !sheet">
              اعمال فیلتر
            </v-btn>
          </v-card-actions>
        </v-sheet>
      </v-bottom-sheet>
    </div>

    <slot v-else name="filters" v-bind="{perPage: perPageItems, props: computedProps || {}}"/>

    <v-data-table
      :ref="`table-${randRef}`"
      v-model="computedValue"
      :headers="headers"
      :items="data.data"
      :itemsPerPage="computedProps ? computedProps.length : 10"
      :loading="computedLoading"
      :loading-text="$attrs['loading-text'] || 'درحال دریافت اطلاعات...'"
      :no-data-text="$attrs['no-data-text'] || 'بدون اطلاعات!'"
      :no-results-text="$attrs['no-results-text'] || 'رکوردی یافت نشد!'"
      hide-default-footer
      item-key="id"
      selectable-key="id"
      v-bind="$attrs"
      v-on="$listeners">
      <template v-if="$vuetify.breakpoint.mobile" v-slot:header.data-table-select="{isMobile, props, on}">
        <span class="mx-2">انتخاب همه</span>
        <v-simple-checkbox :indeterminate="props.indeterminate" :value="props.value" v-on="on"/>
      </template>

      <template v-for="(slot, i) in $slots" v-slot:[i]>
        <slot :name="i"/>
      </template>

      <template v-for="(slot, i) in $scopedSlots" v-slot:[i]="row">
        <slot :name="i" v-bind="{...row}"/>
      </template>

      <template v-for="({value}, i) in headers" v-slot:[`item.${value}`]="row">
        <slot :item="{...row, ...row.item}" :name="value">
          {{ row.item[value] || '-' }}
        </slot>
      </template>

      <template v-if="computedLoading" v-slot:footer>
        <v-progress-linear height="5" indeterminate/>
      </template>
    </v-data-table>

    <v-divider/>

    <vue-table-pagination v-if="!!data?.data && data?.last_page > 1 && !!computedProps" ref="pagination"
                          v-model="computedProps.page" :data="data" :totalVisible="totalVisible" @input="onPagination">
      <template v-slot:per-page>
        <v-select
          v-model="computedProps.length"
          :items="perPageItems"
          :menu-props="{ offsetY: true }"
          class="ma-2 my-md-0"
          dense
          label="تعداد نمایش"
          outlined
          @change="onPagination(true)"
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
        return {
          page: 1,
          length: 10
        }
      }
    },
    // noPagination: Boolean,
    filterOnEnter: Boolean
  },

  data() {
    return {
      options: {},
      randRef: null,
      sheet: false
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
        this.$forceUpdate()
      }
    },
    hasFilter() {
      if (!this.computedProps) return false

      let {length, page, column, dir, ...rest} = this.computedProps

      function check_fields(obj) {
        return !!obj && Object.values(obj).filter(item => {
          return (typeof item === 'object' && !(item instanceof Array))
            ? check_fields(item)
            : type_return(item)
        })?.length
      }

      function type_return(field) {
        switch (typeof field) {
          case 'number':
            return field >= 0
          case 'object':
            return !!field.length
          default:
            return !!field
        }
      }

      return check_fields(rest)
    },
  },

  watch: {
    computedProps: {
      deep: true,

      handler(val, oldVal) {
        oldVal != null && !this.filterOnEnter && this.onPagination(true)
      }
    },
    sheet(val) {
      this.changeBottomSheet(val)
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
    },
    changeBottomSheet(e) {
      let go = document.getElementById('goftino_w')

      if (go)
        go.style.setProperty('display', e ? 'none' : 'block')
    }
  }
}
</script>

<style scoped>
.v-data-table >>> tbody tr:nth-child(odd) {
  background-color: #ebedf3;
}

.v-data-table >>> .v-data-table-header-mobile__wrapper {
  justify-content: flex-end;
}

.bottom-sticky {
  position: sticky;
  bottom: 0;
}
</style>