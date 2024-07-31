<template>
  <div>
    <v-slide-x-transition mode="out-in">
      <v-tooltip v-if="isButton && (!value || !value.length)" key="button" bottom>
        <template v-slot:activator="{on , attr}">
          <div class="w-fit" v-bind="attr" @click="dialog = true" v-on="on">
            <slot name="button">
              <v-btn fab small v-bind="$attrs">
                <v-icon>mdi-crosshairs</v-icon>
              </v-btn>
            </slot>
          </div>
        </template>

        <span>انتخاب کاربر</span>
      </v-tooltip>

      <div v-else @click="dialog = true">
        <slot name="input">
          <v-text-field key="field" ref="input" :error-messages="errors" :value="displayValue"
                        append-icon="mdi-crosshairs" class="cursor-pointer" clear-icon="mdi-close-circle-outline"
                        clearable dense label="انتخاب کاربران" outlined readonly @click:clear="clearFilter"/>
        </slot>
      </div>
    </v-slide-x-transition>

    <custom-popup v-model="dialog" :cons="cons" max-width="800px">
      <v-card :loading="loading" class="transparent" flat>
        <v-row no-gutters>
          <v-col class="pa-2" cols="12" md="4" sm="6">
            <v-select v-model="tableProps.length" :items="[10, 25, 50, 100, 200, 400]" dense hide-details outlined
                      @change="reloadTable()"/>
          </v-col>

          <v-col class="pa-2" cols="12" md="4" sm="6">
            <v-text-field v-model="tableProps.search" append-icon="mdi-magnify" clear-icon="mdi-close-circle-outline"
                          clearable dense hide-details label="جستوجو" outlined @keydown.enter="reloadTable()"
                          @click:append="reloadTable()" @click:clear="clearFilter"/>
          </v-col>

          <v-col class="pa-2" cols="12">
            <vue-table v-model="tempSelection" :data="userInfo" :headers="headers" :loading="loading"
                       :per-page.sync="tableProps.length" item-key="id" show-select @change="onPagination">
              <template v-slot:type="{item}">
                <span>{{ item.type === 'regular' ? 'شخص حقیقی' : 'شخص حقوقی' }}</span>
              </template>
            </vue-table>
          </v-col>
        </v-row>
      </v-card>
    </custom-popup>
  </div>
</template>

<script>
import CustomPopup from "../../plugins/popup/customPopup.vue";
import VueTable from "../../plugins/vueTable/index.vue";

export default {
  name: "userPicker",

  components: {CustomPopup, VueTable},

  props: {
    value: Array,
    errors: [Array, String],
    returnKey: {
      type: [String, Boolean],
      default: 'id'
    },
    isButton: Boolean
  },

  data() {
    return {
      dialog: false,
      cons: {
        title: 'انتخاب کاربران',
        buttons: [
          {type: 'submit', handler: this.confirm}
        ]
      },
      tableProps: {
        page: 1,
        length: 10
      },
      loading: false,
      userInfo: {},
      headers: [
        {value: 'id', text: 'شناسه'},
        {value: 'name', text: 'نام'},
        {value: 'lastName', text: 'نام خانوادگی'},
        {value: 'username', text: 'نام کاربری'},
        {value: 'phone', text: 'شماره همراه'},
        {value: 'type', text: 'نوع کاربر'},
      ],
      tempSelection: []
    }
  },

  created() {
    this.getUserInfo()
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
    displayValue() {
      return this.value
        .map(item => typeof item === 'object' && Object.hasOwn(item, 'id')
          ? item.id
          : item)
        .join(', ')
    }
  },

  watch: {
    dialog(val) {
      if (!!val) {
        this.getUserInfo()
      }
    }
  },

  methods: {
    getUserInfo(params = this.tableProps) {
      this.loading = true

      this.$DashboardAxios('/api/admin/users', {
        params
      })
        .then(({data}) => {
          window.scrollTo({behavior: "smooth", top: 0, left: 0})

          this.userInfo = data;

          this.tempSelection = this.value
            .map(item => typeof item === 'object' && Object.hasOwn(item, 'id')
              ? item
              : ({id: item}))
        })
        .finally(() => this.loading = false)
    },
    confirm() {
      this.computedValue = !!this.returnKey
        ? this.tempSelection.map(item => item.id)
        : this.tempSelection

      this.$nextTick(() => {
        this.$emit('confirm')
      })
      this.dialog = false
    },
    clearFilter() {
      this.$nextTick(() => {
        this.$emit('input', [])
        this.reloadTable()
        setTimeout(() => {
          this.$emit('confirm')
        }, 100)
      })
    },
    onPagination(e) {
      this.tableProps = e
      this.$nextTick(() => {
        this.getUserInfo()
      })
    },
    reloadTable(params) {
      this.getUserInfo(params)
    },
    edit(data) {
      this.$router.push({name: 'admin.user.edit', params: {id: data.id}})
    },
    information(data) {
      this.$router.push({name: 'admin.users.information', params: {id: data.id}})
    },
  }
}
</script>

<style scoped>
.w-fit {
  width: fit-content;
}
</style>
