<template>
  <v-menu offset-y top :close-on-content-click="false" eager nudge-top="10">
    <template v-slot:activator="{ on, attrs }">
      <v-badge :value="unread" :content="persianNum(unread)" left overlap color="red"
               offset-x="20" offset-y="20">
        <div v-bind="attrs" v-on="on">
          <slot name="default"/>
        </div>
      </v-badge>
    </template>

    <v-card flat>
      <KTDropdownNotification v-model="unread"/>
    </v-card>
  </v-menu>
</template>

<script>
import KTDropdownNotification from "../extras/dropdown/DropdownNotification";
import KTLayoutHeaderTopbar from "../../assets/js/layout/header-topbar";

export default {
  name: "notifyMenu",

  components: {KTDropdownNotification},

  props: {
    icon: String
  },

  mounted() {
    // Init Header Topbar For Mobile Mode
    KTLayoutHeaderTopbar.init(this.$refs["kt_header_mobile_topbar_toggle"]);
  },

  data: () => ({
    unread: 0
  })
}
</script>

<style scoped>

</style>