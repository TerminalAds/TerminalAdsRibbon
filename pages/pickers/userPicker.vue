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

        <span>{{ i18n.t('USER_PICKER.SELECT_USER') }}</span>
      </v-tooltip>

      <div v-else @click="dialog = true">
        <slot name="input">
          <v-text-field key="field" ref="input" :error-messages="errors" :value="displayValue"
                        append-icon="mdi-crosshairs" class="cursor-pointer rounded-lg"
                        clear-icon="mdi-close-circle-outline" clearable dense hide-details :label="i18n.t('USER_PICKER.SELECT_USERS')"
                        outlined readonly @click:clear="clearFilter"/>
        </slot>
      </div>
    </v-slide-x-transition>

    <custom-popup v-model="dialog" :cons="cons" max-width="800px">
      <v-card :loading="loading" class="transparent pa-4" flat>
        <vue-table v-model="tempSelection" :data="userInfo" :headers="headers" :loading.sync="loading"
                   item-key="id" show-select @change="onPagination">
          <template v-slot:filters="{perPage, props}">
            <v-row no-gutters>
              <v-col class="pa-2" cols="12" md="4" sm="6">
                <v-select v-model="props.length" :items="perPage" dense hide-details outlined/>
              </v-col>

              <v-col class="pa-2" cols="12" md="4" sm="6">
                <v-text-field v-model="props.search" append-icon="mdi-magnify"
                              clear-icon="mdi-close-circle-outline" clearable dense hide-details :label="i18n.t('USER_PICKER.SEARCH')"
                              outlined/>
              </v-col>
            </v-row>
          </template>

          <template v-slot:type="{item}">
            <span>{{ item.type === 'regular' ? i18n.t('USER_PICKER.PERSON') : i18n.t('USER_PICKER.COMPANY') }}</span>
          </template>
        </vue-table>
      </v-card>
    </custom-popup>
  </div>
</template>

<script>
import CustomPopup from "../../plugins/popup/customPopup.vue";
import VueTable from "../../plugins/vueTable/index.vue";
import i18n from "../../plugins/EasyModal/i18n";
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
        title: i18n.t('USER_PICKER.SELECT_USERS'),
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
        {value: 'id', text: i18n.t('USER_PICKER.ID'), sortable: false, align: 'center'},
        {value: 'name', text: i18n.t('USER_PICKER.NAME'), sortable: false, align: 'center'},
        {value: 'lastName', text: i18n.t('USER_PICKER.LASTNAME'), sortable: false, align: 'center'},
        {value: 'username', text: i18n.t('USER_PICKER.USERNAME'), sortable: false, align: 'center'},
        {value: 'phone', text: i18n.t('USER_PICKER.PHONE'), sortable: false, align: 'center'},
        {value: 'type', text: i18n.t('USER_PICKER.TYPE'), sortable: false, align: 'center'},
      ],
      tempSelection: [],
      i18n
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
      return this.value?.map(item => typeof item === 'object' && Object.hasOwn(item, 'id')
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

          this.tempSelection = this.value?.map(item => typeof item === 'object' && Object.hasOwn(item, 'id')
            ? item
            : ({id: item}))
        })
        .finally(() => this.loading = false)
    },
    confirm() {
      this.computedValue = !!this.returnKey
        ? this.tempSelection?.map(item => item.id)
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
