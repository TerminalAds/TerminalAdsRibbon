<template>
  <div class="pa-2 mt-4">
    <custom-tabs v-model="tabs" :tab-items="tabItems" grow>
      <template v-slot:staticItems>
        <v-tabs-items v-model="tabs">
          <v-tab-item>
            <add-award-manual-dialog
              @created="$emit('saved')"
              :is-edit="false"
            />
          </v-tab-item>
          <v-tab-item
            ><import-award-excel-dialog @imported="$emit('saved')"
          /></v-tab-item>
        </v-tabs-items>
      </template>
    </custom-tabs>
  </div>
</template>

<script>
import ImportAwardExcelDialog from "./ImportAwardExcelDialog.vue";
import AddAwardManualDialog from "./AddAwardManualDialog.vue";
export default {
  components: { ImportAwardExcelDialog, AddAwardManualDialog },
  props: { value: { type: Boolean, default: false } },
  name: "addawardgame",
  data() {
    return {
      tabItems: [
        { text: "افزدون تکی جایزه بازی", icon: "gift-outline" },
        {
          text: " افزودن گروهی جوایز بازی از اکسل",
          icon: "microsoft-excel",
        },
      ],
      tabs: 0,
    };
  },
};
</script>
<style scoped></style>
