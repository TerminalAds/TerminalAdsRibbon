<template>
  <v-card flat>
    <v-row class="pa-2" no-gutters>
      <v-col class="pa-2" cols="12" lg="4" md="6">
        <v-text-field v-model="group.name" class="rounded-lg" clearable dense :label="i18n.t('FORM_LABELS.DEFAULT_GROUP_NAME')" outlined/>
      </v-col>

      <v-col class="pa-2" cols="12" lg="4" md="6">
        <v-autocomplete v-model="group.parent_id" :items="groups" class="rounded-lg" clearable dense
                        :label="i18n.t('FORM_LABELS.PARENT_CATEGORY')" outlined/>
      </v-col>
    </v-row>

    <v-card-actions class="justify-end">
      <v-btn :disabled="!group.name" class="btn-accept ma-0" depressed @click="makeGroup">
        <v-icon>mdi-content-save-plus</v-icon>
        {{ i18n.t('BUTTON.ADD_GROUP') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import i18n from "@/plugins/EasyModal/i18n";

export default {
  name: "contactGroupCreate",

  data: () => ({
    i18n,
    loading: false,
    groups: [],
    group: {
      name: '',
      parent_id: null
    }
  }),

  mounted() {
    this.fetchGroups()
  },

  methods: {
    fetchGroups() {
      this.$payamakAxios.get('phoneTag/groups/get')
          .then(({data}) => this.groups = data.data.map(item => ({value: item.id, text: item.name})))
    },
    makeGroup() {
      this.loading = true

      this.$payamakAxios.post('phoneTag/groups/add', this.group)
          .then(({data}) => {
            this.$emit('fetch')
            this.$toast.success(data.message || this.i18n.t('TOAST.DEFAULT_GROUP_SUCCESS'))
          })
          .catch(({response}) => {
            console.log('failed to add default group: ', response)
            this.$toast.error(response?.data?.message || this.i18n.t('TOAST.DEFAULT_GROUP_ERROR'))
          })
          .finally(() => this.loading = false)
    }
  }
}
</script>

<style scoped>

</style>