<template>
  <v-autocomplete
    :items="list"
    class="rounded-xl"
    clearable
    dark
    hide-details
    :label="i18n.t('locking_for_service')"
    outlined
    :placeholder="i18n.t('service_name')"
    prepend-inner-icon="mdi-text-search"
  >
    <template v-slot:append>
      <v-btn
        class="mt-n2 me-n1"
        color="rgba(255, 255, 255, .2)"
        depressed
        fab
        small
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </template>

    <template v-slot:item="{ item, on, attrs }">
      <v-list-item v-bind="attrs" @click="itemClickHandler(item)" v-on="on">
        <v-list-item-content>
          <v-list-item-title>
            {{ item.text }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
import i18n from "../../plugins/EasyModal/i18n";

export default {
  name: "findMenuPage",

  data: () => ({
    list: [],
    i18n,
  }),

  mounted() {
    this.getAllMenus();
  },
  computed: {
    services() {
      return this.$services || {};
    },
  },
  methods: {
    getAllMenus() {
      const allowedServices = [1, 2, 3, 4, 5, 10, 11, 13, 14];
      const userHasAccessTo = Object.keys(this.services)
        .map(Number)
        .filter((id) => allowedServices.includes(id));
      this.$instanceAxios
        .get(`${this.$coreApi2}/category/get-all-limited`)
        .then(({ data }) => {
          this.list = data
            .filter(
              (item) =>
                !!item.slug &&
                !!/[A-Za-z]+/.test(item.slug) &&
                userHasAccessTo.includes(item.service_id)
            )
            .map((item) => ({
              value: item.id,
              text: item.name,
              sid: item.service_id,
              slug: item.slug,
            }));
        });
    },
    itemClickHandler(menuItem) {
      console.log("menu item: ", menuItem);

      const token = localStorage.getItem("id_token");
      const baseUrl = this.$services[menuItem.sid];
      let finalUrl;
      if (menuItem.sid === 1) {
        finalUrl = `${baseUrl}/#/${menuItem.slug}`;
      } else {
        finalUrl = `${baseUrl}/?token=${token}#/${menuItem.slug}`;
      }
      const a = document.createElement("a");
      a.setAttribute("href", finalUrl);
      a.setAttribute("target", "_blank");
      a.click();
    },
  },
};
</script>

<style scoped></style>
