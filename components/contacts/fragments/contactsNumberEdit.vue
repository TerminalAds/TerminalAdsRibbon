<template>
  <div>
    <v-hover v-slot="{ hover }">
      <v-chip :color="prepare ? 'info' : ''" class="ma-1">
        <div class="px-2" style="direction: ltr">{{ !prepare ? value.phone : value }}</div>

        <template v-if="hover">
          <v-icon
            v-if="!prepare"
            :title="i18n.t('CONTACT_EDIT.EDIT')"
            @click="dialog = true"
          >mdi-pencil-outline</v-icon>

          <v-icon
            :title="i18n.t('CONTACT_EDIT.DELETE')"
            @click="$emit('delete', value)"
          >mdi-delete-outline</v-icon>
        </template>
      </v-chip>
    </v-hover>

    <template v-if="!prepare">
      <custom-popup v-model="dialog" :cons="{title: ''}" hide-confirm max-width="600">
        <edit-contact v-if="dialog" :id="value.id" popup/>
      </custom-popup>
    </template>
  </div>
</template>

<script>
import EditContact from "../editContact.vue";
import customPopup from "../../../plugins/popup/customPopup.vue";
import { i18n } from "../../../plugins/EasyModal/langs/fa"; // Adjust import if needed

export default {
  name: "contactsNumberEdit",

  components: {
    EditContact,
    customPopup
  },

  props: {
    value: [Object, String],
    prepare: Boolean
  },

  data: () => ({
    dialog: false,
    edit: false
  })
}
</script>

<style scoped>

</style>