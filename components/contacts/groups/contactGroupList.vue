<template>
  <v-card class="pt-4" flat>
    <v-tabs v-model="tabs" grow>
      <v-tab>
        <v-icon right>mdi-format-list-bulleted</v-icon>
        {{ i18n.t('TABS.LIST') }}
      </v-tab>
      <v-tab>
        <v-icon right>mdi-plus</v-icon>
        {{ i18n.t('TABS.ADD') }}
      </v-tab>
    </v-tabs>
    <v-divider class="mt-0 mx-4"/>

    <v-tabs-items v-model="tabs">
      <v-tab-item class="pa-4">
        <vue-table :data="data" :headers="headers" :loading.sync="loading" @change="onPagination">
          <template v-slot:filters="{props, perPage}">
            <v-row no-gutters>
              <v-col class="pa-2" cols="12" lg="1" md="2">
                <v-select v-model="props.length" :items="perPage" class="rounded-lg" dense hide-details :label="i18n.t('TABLE_CONTROLS.COUNT')"
                          outlined/>
              </v-col>
              <v-col class="pa-2" cols="12" lg="4" md="6">
                <v-text-field v-model="props.search" append-icon="mdi-magnify" class="rounded-lg" clearable dense
                              hide-details :label="i18n.t('TABLE_CONTROLS.SEARCH')" outlined/>
              </v-col>
            </v-row>
          </template>

          <template v-slot:index="{item}">
            {{ (item.index + 1) + ((data.current_page - 1) * data.per_page) }}
          </template>

          <template v-slot:parent_id="{item}">
            <span v-if="data.data.find(p => p.id === item.parent_id)">{{
                data.data.find(p => p.id === item.parent_id).name
              }}</span>
          </template>

          <template v-slot:created_at="{item}">
            {{ datetime(getIsoDatetime(item.created_at), 'datetime') }}
          </template>
        </vue-table>
      </v-tab-item>

      <v-tab-item>
        <contact-group-create @fetch="() => {tabs = 0; this.fetchGroups()}"/>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import ContactGroupCreate from "@/view/pages/contacts/groups/contactGroupCreate.vue";
import i18n from "@/plugins/EasyModal/i18n";

export default {
  name: "contactGroupList",

  components: {ContactGroupCreate},

  data: () => ({
    i18n,
    loading: false,
    tabs: null,
    data: {},
    headers: [
      {value: 'index', text: i18n.t('TABLE_HEADERS.ROW'), align: 'center', sortable: false},
      {value: 'id', text: i18n.t('TABLE_HEADERS.ID'), align: 'center', sortable: false},
      {value: 'name', text: i18n.t('TABLE_HEADERS.GROUP_NAME'), align: 'center', sortable: false},
      {value: 'parent_id', text: i18n.t('TABLE_HEADERS.PARENT'), align: 'center', sortable: false},
      {value: 'created_at', text: i18n.t('TABLE_HEADERS.CREATED_AT'), align: 'center', sortable: false},
    ],
    tableProps: {
      page: 1,
      length: 10,
      flat: true,
      dir: 'desc'
    }
  }),

  created() {
    this.fetchGroups()
  },

  methods: {
    fetchGroups(params = this.tableProps) {
      this.loading = true

      this.$payamakAxios.get('phoneTag/groups/get', {params})
          .then(({data}) => this.data = data.data)
          .finally(() => this.loading = false)
    },
    onPagination(e) {
      this.fetchGroups({
        ...this.tableProps,
        ...e
      })
    }
  }
}
</script>

<style scoped>

</style>