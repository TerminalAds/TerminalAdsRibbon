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
      <!--      @click:row="rowClicked"-->
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
              label="جستجو"
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
              label="عنوان"
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
                label="جستجو در عنوان"
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
                } از`"
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
              <!--                                @input="changeBirthday(props)"/>-->
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
                :label="`تا ${
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
                @input="
                  onPagination({ ['datetimes_end']: props['datetimes_end'] })
                "
              />
              <!--                                @input="changeBirthday(props)"/>-->
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
              label="تاریخ تولد از"
              nullable
              outlined
              type="date"
              wrapper-class="rounded-lg"
              @input="
                onPagination({ ['birthday_start']: props.birthday_start })
              "
            />
            <!--                                @input="changeBirthday(props)"/>-->
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
              label="تا تاریخ"
              nullable
              outlined
              type="date"
              wrapper-class="rounded-lg"
              @input="onPagination({ ['birthday_end']: props.birthday_end })"
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
              label="تعداد"
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
              @click.stop="copyLink(item.phone, false, 'شماره همراه کپی شد.')"
            >
              <v-icon small>mdi-content-copy</v-icon>
            </v-btn>
          </template>

          <span>کپی شماره</span>
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
          <!--          <v-chip v-for="(tag, i) in item.phone_tags.removeDuplicateInArray('parent_id')" :key="i" class="rounded-lg"-->
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
        <v-card-title>حذف مخاطب از گروه</v-card-title>

        <v-radio-group v-model="groupRadio" dense hide-details>
          <v-radio label="مخاطب فقط از این گروه حذف شود" value="phoneTag" />
          <v-radio label="مخاطب از کلیه گروه‌ها حذف شود" value="all" />
        </v-radio-group>
      </v-card>
    </custom-popup>

    <v-divider />
    <contact-sends-pattern :items="selected" :table-props="tableProps" />
  </div>
</template>

<script>
import CustomDatePicker from "../../../pages/pickers/custom-date-picker.vue";
import ContactsButtons from "./contactsButtons.vue";
import ContactSendsPattern from "./contactSendsPattern.vue";
import CustomPopup from "../../../plugins/popup/customPopup.vue";
import VueTable from "../../../plugins/vueTable/index.vue";
import { deleteContactFromTag } from "../../../assets/js/ContactsFunctions";

export default {
  name: "contactsTableclub",

  components: {
    ContactSendsPattern,
    ContactsButtons,
    CustomDatePicker,
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
          return "آدرس";
        case "email":
          return "ایمیل";
        case "website":
          return "وبسایت";
        case "custom":
          return "فیلد سفارشی";
        case "datetimes":
          return "تاریخ";
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
      headers: [
        { value: "image", text: "عکس", sortable: false },
        { value: "name", text: "نام و نام‌خانوادگی", sortable: false },
        { value: "email", text: "ایمیل", sortable: false },
        { value: "phone", text: "شماره همراه", sortable: false },
        { value: "title", text: "عنوان شغلی و شرکت", sortable: false },
        { value: "created_at", text: "زمان ایجاد", sortable: false },
        { value: "tag", text: "دفترچه تلفن", sortable: false },
        { value: "action", text: "عملیات", sortable: false },
      ],
      birthday: {
        start: "",
        end: "",
      },
      fieldTagsItems: [],
      fieldTagsLoading: false,
      selectedFiledTag: null,
      deleteDialog: false,
      deletingItem: {},
      groupRadio: "phoneTag",
      deleteCons: {
        title: "حذف مخاطب",
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
        text: "کاربر",
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
    rowClicked(event) {
      this.$emit("select", event);
    },
    handleAction(e, state = "default") {
      if (state !== "default") {
        let els = document.getElementsByClassName(
          "laravel-vue-datatable-tbody-tr"
        );
        if (!!els) {
          els.forEach((value, index) => {
            if (state && e.id === Number(value.childNodes[1]?.textContent))
              value.classList.add("tr-focused");
            else if (value.classList.contains("tr-focused"))
              value.classList.remove("tr-focused");
          });
        }
      } else {
        this[e.name](e.data);
      }
    },
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
          this.$toast.success("با موفقیت حذف شد");
          this.deletingItem = {};
          this.$emit("reload");
        })
        .catch(({ response }) => {
          this.$toast.error(
            response?.data?.message || "خطا در حذف مخاطب از دفترچه تلفن!"
          );
        })
        .finally(() => (this.computedLoading = false));
    },
    // changeBirthday(props) {
    //   const moment = require('moment-jalaali')
    //   let birthday_start = !!this.birthday.start ? moment(this.birthday.start).format('jYYYY-jMM-jDD') : undefined
    //   let birthday_end = !!this.birthday.end ? moment(this.birthday.end).format('jYYYY-jMM-jDD') : undefined
    //
    //   this.computedProps['birthday_start'] = props['birthday_start'] = birthday_start
    //   this.computedProps['birthday_end'] = props['birthday_end'] = birthday_end
    //
    //   // this.$nextTick(() => {
    //   //   this.$emit('reload')
    //   // })
    // },
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

/*.contact-table >>> .laravel-vue-datatable-tbody-tr:not(.tr-focused) > :last-child div {*/
/*  visibility: hidden;*/
/*  transition: all .06s ease-out;*/
/*}*/

.contact-table >>> .laravel-vue-datatable-tbody-tr.tr-focused,
.contact-table >>> .laravel-vue-datatable-tbody-tr:hover {
  background-color: rgba(20, 103, 224, 0.2);
}

/*.contact-table >>> .laravel-vue-datatable-tbody-tr:hover > :last-child div {*/
/*  visibility: visible;*/
/*}*/

.contact-table >>> tr td {
  vertical-align: middle;
}
</style>
