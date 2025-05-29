<template>
  <div class="text-nowrap">
    <v-btn icon title="افزودن تاریخچه" @click.stop="showHistory = true">
      <v-icon>mdi-history</v-icon>
    </v-btn>

    <custom-popup v-model="showHistory" :cons="{title: 'لیست تاریخچه‌ها'}" hide-confirm max-width="640" reloadable>
      <show-create-history v-if="showHistory" :item="data"/>
    </custom-popup>

    <v-btn v-if="hasPhonebookPermission('edit')" icon title="ویرایش مخاطب"
           @click="goto(`phonebook/edit/${data.phone}?change=${data.name}`)">
      <v-icon>mdi-pencil-outline</v-icon>
    </v-btn>

    <v-menu class="rounded-lg" min-width="200" offset-y right>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list dense>
        <v-list-item @click="goto(`phonebook/edit/${data.phone}`)">
          <v-list-item-icon>
            <v-icon>mdi-account-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>نمایش مخاطب</v-list-item-title>
        </v-list-item>
        <v-list-item disabled>
          <v-list-item-icon>
            <v-icon>mdi-printer-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>چاپ</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="hasPhonebookPermission('delete')" @click="$emit('delete', data)">
          <v-list-item-icon>
            <v-icon>mdi-trash-can-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>حذف</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import CustomPopup from "../../../plugins/popup/customPopup.vue";
import ShowCreateHistory from "./showCreateHistory.vue";

export default {
  name: "contactsButtons",

  components: {ShowCreateHistory, CustomPopup},

  props: {
    data: Object,
    tag: Object
  },

  data: () => ({
    showHistory: false
  })
}
</script>