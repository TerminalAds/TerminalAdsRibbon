<template>
  <v-card class="pt-4" flat>
    <v-tabs v-model="tabs" grow>
      <v-tab>
        <v-icon right>mdi-format-list-bulleted</v-icon>
        لیست
      </v-tab>
      <v-tab>
        <v-icon right>mdi-plus</v-icon>
        افزودن
      </v-tab>
    </v-tabs>
    <v-divider class="mt-0 mx-4"/>

    <v-tabs-items v-model="tabs">
      <v-tab-item class="pa-4">
        <vue-table :data="data" :headers="headers" :loading.sync="loading" @change="onPagination">
          <template v-slot:filters="{props, perPage}">
            <v-row no-gutters>
              <v-col class="pa-2" cols="12" lg="1" md="2">
                <v-select v-model="props.length" :items="perPage" class="rounded-lg" dense hide-details label="تعداد"
                          outlined/>
              </v-col>
              <v-col class="pa-2" cols="12" lg="4" md="6">
                <v-text-field v-model="props.search" append-icon="mdi-magnify" class="rounded-lg" clearable dense
                              hide-details label="جستجو" outlined/>
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

export default {
  name: "contactGroupList",

  components: {ContactGroupCreate},

  data: () => ({
    loading: false,
    tabs: null,
    data: {},
    headers: [
      {value: 'index', text: 'ردیف', align: 'center', sortable: false},
      {value: 'id', text: 'شناسه', align: 'center', sortable: false},
      {value: 'name', text: 'نام گروه', align: 'center', sortable: false},
      {value: 'parent_id', text: 'والد', align: 'center', sortable: false},
      {value: 'created_at', text: 'ایجاد', align: 'center', sortable: false},
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