<template>
  <v-card :loading="loading" flat>
    <v-card-title>
      <template v-if="!addLink">
        <span class="font-size-sm grey--text">
          {{ i18n.t('shortLink.freeShorten') }}
          <br />
          {{ i18n.t('shortLink.clickToSelect') }}
        </span>
        <v-spacer />

        <v-btn color="success" depressed @click="addLink = true">
          <v-icon left>mdi-plus</v-icon>
          {{ i18n.t('shortLink.create') }}
        </v-btn>
      </template>

      <template v-else>
        <v-spacer />
        <v-btn
            :disabled="loading"
            class="mx-2"
            color="red"
            outlined
            @click="
            () => {
              addLink = false;
              reloadTable();
            }
          "
        >
          <v-icon left>mdi-close</v-icon>
          {{ i18n.t('general.back') }}
        </v-btn>

        <v-btn
            :disabled="!canSubmit"
            :loading="loading"
            color="success"
            depressed
            @click="submitNew"
        >
          <v-icon left>mdi-plus</v-icon>
          {{ i18n.t('shortLink.create') }}
        </v-btn>
      </template>
    </v-card-title>

    <v-card-text v-if="!addLink">
      <data-table
          :columns="columns"
          :data="data"
          :per-page="[10, 25, 50, 100, 400]"
          :translate="translate"
          class="mt-3"
          @on-table-props-changed="reloadTable"
          @row-clicked="selectRow"
      />
    </v-card-text>

    <v-row v-else class="p-1" no-gutters>
      <v-col class="pa-2" cols="12" md="6">
        <v-text-field
            v-model="linkObj.title"
            clear-icon="mdi-close-circle-outline"
            clearable
            :rules="[
            (v) => !!v || i18n.t('validation.titleRequired'),
            (v) => (v && v.length >= 4) || i18n.t('validation.minLength4'),
          ]"
            dense
            :label="i18n.t('shortLink.title')"
            :messages="i18n.t('shortLink.titleHint')"
            outlined
        />
      </v-col>

      <v-col class="pa-2" cols="12" md="6">
        <v-text-field
            v-model="linkObj.link"
            clear-icon="mdi-close-circle-outline"
            clearable
            dense
            :rules="[
            (v) => !!v || i18n.t('validation.linkRequired'),
            (v) => (v && v.include('https://')) || i18n.t('validation.mustIncludeHttps'),
          ]"
            :label="i18n.t('shortLink.link')"
            :messages="i18n.t('shortLink.linkHint')"
            outlined
        />
      </v-col>

      <v-col class="pa-2" cols="12">
        <v-select
            v-model="linkObj.domainId"
            :items="domainItems"
            dense
            :label="i18n.t('shortLink.selectDomain')"
            outlined
            readonly
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import i18n from "../../../plugins/EasyModal/i18n";
import shortLinkButtons from "./shortLinkButtons.vue";
import copyLinkBtn from "./copyLinkBtn.vue";
import { debounce } from "../../../install";

export default {
  name: "selectShortLink",
  props: {
    value: String,
  },
  data() {
    return {
      i18n,
      data: {},
      columns: [
        {
          label: i18n.t("general.row"),
          name: "row",
          transform: (data) => data.row + 1,
        },
        {
          label: i18n.t("general.id"),
          name: "id",
          orderable: true,
        },
        {
          label: i18n.t("shortLink.title"),
          name: "title",
        },
        {
          label: i18n.t("shortLink.link"),
          name: "link",
          component: copyLinkBtn,
        },
        {
          label: i18n.t("shortLink.shortenedLink"),
          name: "shortlink",
          component: copyLinkBtn,
        },
        {
          label: i18n.t("shortLink.clickCount"),
          name: "viewsC",
        },
        {
          label: i18n.t("general.manage"),
          name: "action",
          component: shortLinkButtons,
          event: "actions",
          handler: this.action,
          meta: {
            buttons: [
              {
                name: "removeLink",
                label: i18n.t("actions.remove"),
                icon: "trash",
                class: "btn-delete border-2 rounded-pill",
                action: this.action,
              },
            ],
          },
        },
      ],
      tableProps: {
        search: "",
        filters: {},
        status: null,
        length: 10,
        column: "id",
        dir: "desc",
      },
      translate: {
        nextButton: i18n.t("pagination.next"),
        previousButton: i18n.t("pagination.previous"),
        rowsPerPageText: i18n.t("pagination.rowsPerPage"),
        noDataText: i18n.t("pagination.noData"),
        placeholderSearch: i18n.t("pagination.search"),
      },
      loading: false,
      addLink: false,
      rules: {
        empty: (v) =>
            (!!v && v.length > 3) || i18n.t("validation.titleRequired"),
        link: (v) => (!!v && this.isDomain(v)) || i18n.t("validation.invalidLink"),
      },
      domainItems: [
        {
          value: 1,
          text: "t7r.ir",
        },
      ],
      linkObj: {
        title: "",
        link: "",
        type_id: 1,
        domainId: 1,
        password: null,
        favoriteLink: null,
      },
    };
  },

  created() {
    this.fetchLinks(this.tableProps);
  },

  computed: {
    canSubmit() {
      return (
          typeof this.rules.empty(this.linkObj.title) === "boolean" &&
          typeof this.rules.link(this.linkObj.link) === "boolean"
      );
    },
  },
  methods: {
    fetchLinks(props = this.tableProps) {
      this.loading = true;
      this.$api
          .get(this.$shortLinkApi + "/link", {
            params: props,
          })
          .then(({ data }) => {
            this.data = data;
            const updatedData = data.data.map((item) => ({
              ...item,
              shortlink: `${item.domains.domain}/${item.code}`,
            }));
            this.data.data = updatedData;
          })
          .finally(() => {
            this.loading = false;
          });
    },
    reloadTable(props) {
      debounce(() => this.fetchLinks(props), 500);
    },
    selectRow(data) {
      const id = data.id;
      $("tr").css("background", "");
      $(`tr:contains("${id}")`).each(function (index, item) {
        if ($(item).find("td").eq(1).text() == id)
          $(item).css("background", "rgba(99, 0, 244, 0.28)");
      });
      this.$emit("select", data.shortlink);
      this.$emit("close");
    },
    submitNew() {
      this.loading = true;
      this.$api
          .post(this.$shortLinkApi + "/add/link", this.linkObj)
          .then(() => {
            this.$toast.success(i18n.t("messages.addedSuccessfully"));
            this.addLink = false;
            this.reloadTable();
          })
          .catch(({ response }) =>
              console.log("failed to add new link: ", response)
          )
          .finally(() => (this.loading = false));
    },
    action(data, type) {
      this[type](data);
    },
    async removeLink(data) {
      if (await this.$modal.yesNo(i18n.t("messages.confirmDeleteShortLink"))) {
        this.loading = true;
        this.$api
            .delete(`/link/delete/${data.id}`)
            .then(() => {
              this.tableProps.page = 1;
              this.$nextTick(() => {
                this.reloadTable();
              });
            })
            .finally(() => (this.loading = false));
      }
    },
  },
};
</script>
