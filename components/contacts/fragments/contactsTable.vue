<template>
  <div>
    <vue-table
        v-model="selected"
        :data="data"
        :headers="headers"
        :loading.sync="computedLoading"
        :props.sync="computedProps"
        class="contact-table"
        filter-on-enter
        show-select
        @change="onPagination"
        @toggle-select-all="toggleSelection"
    >
      <template v-slot:filters="{ props, perPage }">
        <v-row no-gutters>
          <v-col class="pa-2" cols="12" lg="3" md="4">
            <v-text-field
                v-model="props.search"
                append-icon="mdi-magnify"
                class="rounded-lg"
                clearable
                dense
                hide-details
                :label="i18n.t('FORM_LABELS.SEARCH')"
                outlined
                @keydown.enter="onPagination({ ['search']: props.search })"
            />
          </v-col>

          <v-col class="pa-2" cols="12" lg="3" md="4">
            <v-select
                v-model="props.tag"
                :items="fieldTagsItems"
                :loading="fieldTagsLoading"
                :menu-props="{ offsetY: true }"
                chips
                class="rounded-lg"
                clearable
                dense
                hide-details
                item-value="key"
                :label="i18n.t('FORM_LABELS.TITLE')"
                multiple
                outlined
                @change="changeFieldTag(props.tag)"
            >
              <template v-slot:item="{ item, on, attrs }">
                <v-list-item v-bind="attrs" v-on="on">
                  <v-list-item-icon>
                    <v-icon
                    >mdi-checkbox-{{
                        attrs.inputValue ? "marked" : "blank-outline"
                      }}</v-icon
                    >
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.text }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ item.type | fieldTagType }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-select>
          </v-col>

          <v-slide-x-reverse-transition>
            <v-col v-if="hasSearchTag" class="pa-2" cols="12" lg="3" md="4">
              <v-text-field
                  v-model="props.search_tag"
                  append-icon="mdi-tag-hidden"
                  class="rounded-lg"
                  clearable
                  dense
                  hide-details
                  :label="i18n.t('FORM_LABELS.SEARCH_IN_TITLE')"
                  outlined
                  @keydown.enter="
                  onPagination({ ['search_tag']: props.search_tag })
                "
              />
            </v-col>
          </v-slide-x-reverse-transition>

          <v-slide-x-reverse-transition>
            <v-col
                v-if="hasDateTag"
                class="pa-2 d-flex align-center"
                cols="12"
                lg="3"
                md="4"
            >
              <custom-date-picker
                  v-model="props[`datetimes_start`]"
                  :label="`${
                  selectedFiledTag.find((s) => s.type === 'datetimes').text
                } ${i18n.t('FORM_LABELS.FROM')}`"
                  append-icon="mdi-calendar-month"
                  class="flex"
                  dense
                  format="YYYY-MM-DD"
                  hide-details
                  input-class="datetime-start"
                  nullable
                  outlined
                  type="date"
                  wrapper-class="rounded-lg"
                  @input="
                  onPagination({
                    ['datetimes_start']: props[`datetimes_start`],
                  })
                "
              />
            </v-col>
          </v-slide-x-reverse-transition>

          <v-slide-x-reverse-transition>
            <v-col
                v-if="hasDateTag"
                class="pa-2 d-flex align-center"
                cols="12"
                lg="3"
                md="4"
            >
              <custom-date-picker
                  v-model="props['datetimes_end']"
                  :label="`${i18n.t('FORM_LABELS.TO')} ${
                  selectedFiledTag.find((s) => s.type === 'datetimes').text
                }`"
                  append-icon="mdi-calendar-month"
                  class="flex"
                  dense
                  format="YYYY-MM-DD"
                  hide-details
                  input-class="datetime-end"
                  nullable
                  outlined
                  type="date"
                  wrapper-class="rounded-lg"
                  @input="onPagination({ ['datetimes_end']: props['datetimes_end'] })"
              />
            </v-col>
          </v-slide-x-reverse-transition>

          <v-col class="pa-2 d-flex align-center" cols="12" lg="3" md="4">
            <custom-date-picker
                v-model="props.birthday_start"
                :max="maxStart"
                append-icon="mdi-cake-variant-outline"
                class="flex"
                dense
                format="jYYYY-jMM-jDD"
                hide-details
                input-class="bd-start"
                :label="i18n.t('FORM_LABELS.BIRTHDAY_FROM')"
                nullable
                outlined
                type="date"
                wrapper-class="rounded-lg"
                @input="
                onPagination({ ['birthday_start']: props.birthday_start })
              "
            />
          </v-col>

          <v-col class="pa-2 d-flex align-center" cols="12" lg="3" md="4">
            <custom-date-picker
                v-model="props.birthday_end"
                :max="maxEnd"
                :min="props.birthday_start"
                append-icon="mdi-cake-variant-outline"
                class="flex"
                dense
                format="jYYYY-jMM-jDD"
                hide-details
                input-class="bd-end"
                :label="i18n.t('FORM_LABELS.BIRTHDAY_TO')"
                nullable
                outlined
                type="date"
                wrapper-class="rounded-lg"
                @input="onPagination({ ['birthday_end']: props.birthday_end })"
            />
          </v-col>

          <v-col
              v-if="
              ribbonCan($route.meta.permission) &&
              $route.meta.permission !== 'phoneBook_access' &&
              $route.meta.title !== 'باشگاه مشتریان'
            "
              class="pa-2"
              cols="12"
              lg="3"
              md="4"
          >
            <user-picker
                v-model="props.user_id"
                hide-details
                @input="onPagination({ ['user_id']: props.user_id })"
            />
          </v-col>

          <v-spacer />
          <v-col class="pa-2" cols="12" lg="1" md="2">
            <v-select
                v-model="props.length"
                :items="perPage"
                :menu-props="{ offsetY: true }"
                class="rounded-lg"
                dense
                hide-details
                :label="i18n.t('FORM_LABELS.COUNT')"
                outlined
                @change="onPagination({ ['length']: props.length })"
            />
          </v-col>
        </v-row>
      </template>

      <template v-slot:image="{ item }">
        <img
            :src="item.avatar || '/media/users/blank.png'"
            alt=""
            class="pa-1 overflow-hidden rounded-pill"
            style="object-fit: cover; width: 44px; height: 44px"
        />
      </template>

      <template v-slot:name="{ item }">
        {{
          !item.name && !item.lastName
              ? "-"
              : (item.name || "") + " " + (item.lastName || "")
        }}
      </template>

      <template v-slot:email="{ item }">
        {{ item.email | getEmail }}
      </template>

      <template v-slot:phone="{ item }">
        {{ item.phone }}

        <v-tooltip top>
          <template v-slot:activator="{ on, attr }">
            <v-btn
                class="mx-1"
                icon
                small
                v-bind="attr"
                v-on="on"
                @click.stop="copyLink(item.phone, false, i18n.t('TOAST.PHONE_COPIED_SUCCESS'))"
            >
              <v-icon small>mdi-content-copy</v-icon>
            </v-btn>
          </template>

          <span>{{ i18n.t('TOOLTIP.COPY_NUMBER') }}</span>
        </v-tooltip>
      </template>

      <template v-slot:title="{ item }">
        {{
          !item.jobTitle && !item.companyName
              ? "-"
              : (item.jobTitle || "") + ", " + (item.companyName || "")
        }}
      </template>

      <template v-slot:created_at="{ item }">
        {{ datetime(item.created_at, "datetime") }}
      </template>

      <template v-slot:tag="{ item }">
        <div class="d-flex flex-wrap align-center" style="gap: 4px">
          <template v-for="(tag, i) in item.phone_tags">
            <v-chip
                v-if="!tag.parent_id"
                :key="i"
                class="rounded-lg"
                outlined
                small
            >
              {{ tag.name }}
            </v-chip>
          </template>
        </div>
      </template>

      <template v-slot:action="{ item }">
        <contacts-buttons
            :data="item"
            :tag="phoneTag"
            @delete="showDeleteDialog"
        />
      </template>
    </vue-table>

    <custom-popup v-model="deleteDialog" :cons="deleteCons" max-width="400">
      <v-card class="pa-4" flat>
        <v-card-title>{{ i18n.t('POPUP_TITLES.DELETE_CONTACT_FROM_GROUP') }}</v-card-title>

        <v-radio-group v-model="groupRadio" dense hide-details>
          <v-radio :label="i18n.t('RADIO_LABELS.DELETE_FROM_THIS_GROUP_ONLY')" value="phoneTag" />
          <v-radio :label="i18n.t('RADIO_LABELS.DELETE_FROM_ALL_GROUPS')" value="all" />
        </v-radio-group>
      </v-card>
    </custom-popup>

    <v-divider />
    <contact-sends-pattern :items="selected" :table-props="tableProps" />
  </div>
</template>

<script>
import UserPicker from "../../../pages/pickers/userPicker.vue";
import CustomDatePicker from "../../../pages/pickers/custom-date-picker.vue";
import ContactsButtons from "./contactsButtons.vue";
import ContactSendsPattern from "./contactSendsPattern.vue";
import CustomPopup from "../../../plugins/popup/customPopup.vue";
import VueTable from "../../../plugins/vueTable/index.vue";
import { deleteContactFromTag } from "../../../assets/js/ContactsFunctions";
import i18n from "@/plugins/EasyModal/i18n";

export default {
  name: "contactsTable",

  components: {
    ContactSendsPattern,
    ContactsButtons,
    CustomDatePicker,
    UserPicker,
    CustomPopup,
    VueTable,
  },

  filters: {
    getEmail(e) {
      if (typeof e === "string") {
        let emails = JSON.parse(e);
        return !!emails?.length ? emails?.[0].email : "-";
      }

      if (e instanceof Array && !!e?.length) return e?.[0].email || "-";

      return "-";
    },
    fieldTagType(type) {
      switch (type) {
        case "address":
          return i18n.t('FILTER_LABELS.ADDRESS');
        case "email":
          return i18n.t('FILTER_LABELS.EMAIL');
        case "website":
          return i18n.t('FILTER_LABELS.WEBSITE');
        case "custom":
          return i18n.t('FILTER_LABELS.CUSTOM_FIELD');
        case "datetimes":
          return i18n.t('FILTER_LABELS.DATE');
        default:
          return type;
      }
    },
  },

  props: {
    value: Array,
    data: Object,
    tableProps: Object,
    loading: Boolean,
    tagItems: Array,
    phoneTag: Object,
  },

  data() {
    return {
      i18n,
      headers: [
        { value: "image", text: i18n.t('TABLE_HEADERS.IMAGE'), sortable: false },
        { value: "name", text: i18n.t('TABLE_HEADERS.FULL_NAME'), sortable: false },
        { value: "email", text: i18n.t('TABLE_HEADERS.EMAIL'), sortable: false },
        { value: "phone", text: i18n.t('TABLE_HEADERS.PHONE_NUMBER'), sortable: false },
        { value: "title", text: i18n.t('TABLE_HEADERS.JOB_COMPANY'), sortable: false },
        { value: "created_at", text: i18n.t('TABLE_HEADERS.CREATION_TIME'), sortable: false },
        { value: "tag", text: i18n.t('TABLE_HEADERS.PHONEBOOK'), sortable: false },
        { value: "action", text: i18n.t('TABLE_HEADERS.ACTIONS'), sortable: false },
      ],
      fieldTagsItems: [],
      fieldTagsLoading: false,
      selectedFiledTag: null,
      deleteDialog: false,
      deletingItem: {},
      groupRadio: "phoneTag",
      deleteCons: {
        title: i18n.t('POPUP_TITLES.DELETE_CONTACT'),
        buttons: [{ type: "submit", handler: () => this.deleteItem() }],
      },
    };
  },

  created() {
    this.fetchFiledTags();

    if (
        ribbonCan("contact_monitoring") &&
        this.$route.name === "admin.contact.monitoring"
    )
      this.headers.splice(1, 0, {
        text: i18n.t('TABLE_HEADERS.USER'),
        value: "user_id",
        sortable: false,
        align: "center",
      });
  },

  computed: {
    selected: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    computedProps: {
      get() {
        return this.tableProps;
      },
      set(val) {
        this.$emit("update:tableProps", val);
      },
    },
    computedLoading: {
      get() {
        return this.loading;
      },
      set(val) {
        this.$emit("update:loading", val);
      },
    },
    maxStart() {
      const moment = require("moment");

      return !!this.tableProps.birthday_end
          ? this.tableProps.birthday_end
          : moment().format("YYYY-MM-DD");
    },
    maxEnd() {
      const moment = require("moment");

      return moment().format("YYYY-MM-DD");
    },
    hasSearchTag() {
      return !!this.selectedFiledTag?.filter(
          (item) => item.type.indexOf("date") < 0
      )?.length;
    },
    hasDateTag() {
      return !!this.selectedFiledTag?.filter(
          (item) => item.type.indexOf("date") >= 0
      )?.length;
    },
  },

  methods: {
    showDeleteDialog(item) {
      this.deleteDialog = true;
      this.deletingItem = item;
    },
    deleteItem() {
      this.computedLoading = true;

      deleteContactFromTag({
        contact: this.deletingItem.phone,
        tag: this.phoneTag.id,
        deleteFrom: this.groupRadio === "all" ? this.groupRadio : undefined,
      })
          .then(({ data }) => {
            this.$toast.success(this.i18n.t('TOAST.SUCCESSFULLY_DELETED'));
            this.deletingItem = {};
            this.$emit("reload");
          })
          .catch(({ response }) => {
            this.$toast.error(
                response?.data?.message || this.i18n.t('TOAST.ERROR_DELETING_CONTACT_FROM_PHONEBOOK')
            );
          })
          .finally(() => (this.computedLoading = false));
    },
    onPagination(e) {
      let props = {
        ...this.computedProps,
        ...e,
      };

      this.$emit("reload", props);
    },
    toggleSelection({ items, value }) {
      console.log("toggleSelection item: ", items);
      console.log("toggleSelection value: ", value);
    },
    changeFieldTag(value) {
      console.log("changeFieldTag value: ", value);

      if (!value?.filter((item) => item.indexOf("date") >= 0)?.length) {
        this.computedProps["datetimes_start"] = undefined;
        this.computedProps["datetimes_end"] = undefined;
        this.computedProps.search_tag = undefined;
      }

      this.selectedFiledTag = this.fieldTagsItems.filter((item) =>
          value.includes(item.value + "_" + item.type)
      );
      this.onPagination({ tag: value });
    },
    fetchFiledTags() {
      this.fieldTagsLoading = true;

      this.$payamakAxios("contact/tags", {
        phoneTag: this.tableProps.phone_tag_ids[0],
      })
          .then(
              ({ data }) =>
                  (this.fieldTagsItems = data.data.map((item) => {
                    return {
                      text: item.tag,
                      key: item.tag + "_" + item.type,
                      value: item.tag,
                      type: item.type,
                    };
                  }))
          )
          .catch(({ response }) =>
              console.log("failed to get field tags: ", response)
          )
          .finally(() => (this.fieldTagsLoading = false));
    },
    ribbonCan(gate) {
      return window.ribbonCan(gate);
    },
  },
};
</script>

<style scoped>
.contact-table >>> .laravel-vue-datatable-tbody-tr {
  transition: all 0.06s ease-out;
  cursor: pointer;
}

.contact-table >>> .laravel-vue-datatable-tbody-tr.tr-focused,
.contact-table >>> .laravel-vue-datatable-tbody-tr:hover {
  background-color: rgba(20, 103, 224, 0.2);
}

.contact-table >>> tr td {
  vertical-align: middle;
}
</style>