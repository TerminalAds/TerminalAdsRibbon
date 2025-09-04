<template>
  <v-card :loading="loading" flat>
    <v-card-title class="white" style="position: sticky; top: 80px; z-index: 1">
      <v-btn v-show="!!hasQuery" depressed fab small @click="goBack">
        <v-icon cololr="red">mdi-arrow-right</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn
        v-if="!hasQuery && hasPhonebookPermission('edit')"
        class="btn-edit"
        depressed
        @click="goto(`phonebook/edit/${info.phone}?change=${info.name}`)"
      >
        <v-icon left>mdi-pencil-outline</v-icon>
        <span class="letter-spacing-none">{{ i18n.t('edit_contact') }}</span>
      </v-btn>

      <v-btn
        v-else
        :disabled="!canSave"
        class="btn-edit"
        depressed
        @click="saveEdited"
      >
        <v-icon left>mdi-check</v-icon>
        <span class="letter-spacing-none">{{i18n.t('save')}}</span>
      </v-btn>

      <template v-if="!hasQuery && hasPhonebookPermission('delete')">
        <v-btn
          :loading="loading"
          class="btn-delete ma-0"
          depressed
          @click="deleteContact"
        >
          <v-icon left>mdi-trash-can-outline</v-icon>
          {{i18n.t('delete')}}
        </v-btn>
      </template>
    </v-card-title>

    <template v-if="!hasQuery">
      <v-card-text>
        <v-list-item>
          <v-list-item-avatar size="156">
            <v-img contain src="/media/users/blank.png" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="font-size-h1" v-text="info.name" />
            <v-list-item-subtitle
              class="font-size-h3 mt-1"
              v-text="info.companyName || ''"
            />
          </v-list-item-content>
        </v-list-item>
      </v-card-text>

      <v-row no-gutters>
        <v-col :md="popup ? 12 : 6" cols="12">
          <v-card-title>
            {{i18n.t('contact_info')}}
            <v-divider class="mx-2" />
          </v-card-title>

          <v-card-text class="pb-0">
            <div v-for="(email, i) in info.email" :key="i" class="mb-3">
              <v-icon right>mdi-email-outline</v-icon>
              <a :href="`mailto:${email.email}`" class="text-primary">{{
                email.email
              }}</a>
              <span v-if="email.tag" class="px-1 grey--text">
                . {{ email.tag }}</span
              >
            </div>

            <div class="mb-2">
              <v-icon right>mdi-phone-outline</v-icon>
              <a :href="`tel:${info.phone}`" class="text-primary">{{
                info.phone
              }}</a>
            </div>

            <div v-for="(address, i) in info.address" :key="i" class="mb-2">
              <v-icon right>mdi-map-marker-outline</v-icon>
              {{ address.address }}
            </div>

            <div class="mb-2">
              <v-icon right>mdi-cake-variant-outline</v-icon>
              <span
                v-if="!info.birthday"
                class="text-primary cursor-pointer"
                @click="
                  goto(`phonebook/edit/${info.phone}?change=${info.name}`)
                "
                >{{i18n.t('add_birthday')}}</span
              >
              <span v-else>{{ info.birthday | showBirthday }}</span>
            </div>

            <div
              v-for="(website, i) in info.website"
              :key="i"
              class="mb-2 cursor-pointer"
            >
              <v-icon right>mdi-link</v-icon>
              <span v-if="!!website.tag" class="px-1 grey--text"
                >{{ website.tag }} .
              </span>
              <a :href="website.link" class="text-primary" target="_blank">{{
                website.link
              }}</a>
            </div>
          </v-card-text>

          <div v-if="!!info.description" class="px-4 pb-4 d-flex align-start">
            <v-icon class="mt-2">mdi-note-outline</v-icon>
            <pre
              class="flex py-2 px-4 ms-2 grey lighten-2 rounded-lg"
              v-html="info.description"
            />
          </div>
        </v-col>

        <v-col :md="popup ? 12 : 6" cols="12">
          <v-card-title>
            {{i18n.t('contacts')}}
            <v-divider class="mx-3" />
          </v-card-title>

          <v-card-text class="d-flex">
            <template v-if="!!info.phone_tags && !!info.phone_tags.length">
              <v-chip
                v-for="(tag, i) in info.phone_tags"
                :key="i"
                class="rounded-lg mx-1"
                close
                outlined
                @click:close="deleteContactTag(tag.id)"
              >
                <span class="font-size-h6 grey--text font-smaller">{{
                  tag.name
                }}</span>
              </v-chip>
            </template>

            <v-chip v-else :disabled="loading" class="rounded-lg" outlined>
              <span class="font-size-h6 grey--text font-smaller"
                >no tag/tags</span
              >
            </v-chip>

            <contacts-tags :tag-list="info.phone_tags" immediate picker />
          </v-card-text>

          <v-card-text>
            <div class="mb-2">
              {{i18n.t('last_updated_at')}}
              <span class="px-1 grey--text">
                . {{ info.updated_at | timeToNow }}</span
              >
            </div>

            <div class="mb-2">
              {{i18n.t('added_to_contact')}}
              <span class="px-1 grey--text">
                . {{ info.created_at | timeToNow }}</span
              >
            </div>
          </v-card-text>
        </v-col>
      </v-row>
    </template>

    <contacts-edit-fields
      v-else
      ref="editContact"
      v-model="info"
      :avatarFile.sync="avatarFile"
      :can-more.sync="canSave"
      :popup="popup"
    />
  </v-card>
</template>

<script>
import ContactsEditFields from "./fragments/contactsEditFields.vue";
import ContactsTags from "./fragments/contactsTags.vue";
import {
  deleteContactFromTag,
  updateContact,
} from "../../assets/js/ContactsFunctions";
import i18n from "../../plugins/EasyModal/i18n";

export default {
  name: "editContact",

  components: { ContactsTags, ContactsEditFields },

  props: {
    popup: Boolean,
    id: Number,
  },

  filters: {
    timeToNow(time) {
      let moment = require("moment");
      if (moment().diff(time, "days") > 1) {
        return moment(time).calendar();
      }

      return moment(time).fromNow();
    },
    showBirthday(str) {
      let moment = require("moment-jalaali");
      let date = str.split("-");
      let month = "";

      if (date.length > 2) {
        month = moment()
          .jMonth(Number(date[1]) - 1)
          .startOf("jMonth")
          .format("jMMMM");
        return date[0] + " " + month + " " + Number(date[2]);
      }
      month = moment()
        .jMonth(Number(date[0]) - 1)
        .startOf("jMonth")
        .format("jMMMM");
      return month + " " + Number(date[1]);
    },
  },

  data: () => ({
    loading: false,
    i18n,
    info: {
      phone: "",
      avatar: null,
      preName: "",
      name: "",
      middleName: "",
      lastName: "",
      postName: "",
      alias: "",
      companyName: "",
      jobTitle: "",
      birthday: "",
      description: "",
      province_id: "",
      city_id: "",
      email: [],
      address: [],
      website: [],
      custom: [],
      date_times: [],
    },
    canSave: false,
    avatarFile: null,
  }),

  created() {
    this.$root.$on("submitTag", this.editTags);

    this.getInfo();
  },

  computed: {
    slug() {
      return this.id ?? this.$route.params.slug;
    },
    hasQuery() {
      return !!this.$route.query && !!Object.keys(this.$route.query).length;
    },
    fromAndroid() {
      return (
        !!this.$route.query &&
        !!Object.keys(this.$route.query).length &&
        this.$route.query.from === "android"
      );
    },
  },
  methods: {
    getInfo() {
      this.loading = true;

      this.$payamakAxios
        .get(`contact/${this.slug}`)
        .then(({ data }) => {
          let d = data.data;

          try {
            this.info = {
              ...d,
              address: !!d.address
                ? typeof d.address === "string"
                  ? JSON.parse(d.address)
                  : d.address
                : [],
              custom: !!d.custom
                ? typeof d.address === "string"
                  ? JSON.parse(d.custom)
                  : d.custom
                : [],
              email: !!d.email
                ? typeof d.address === "string"
                  ? JSON.parse(d.email)
                  : d.email
                : [],
              website: !!d.website
                ? typeof d.address === "string"
                  ? JSON.parse(d.website)
                  : d.website
                : [],
              date_times: !!d.date_times
                ? typeof d.address === "string"
                  ? JSON.parse(d.date_times)
                  : d.date_times
                : [],
            };
          } catch (e) {
            console.log(e);
            this.info = {
              ...d,
              address: [],
              custom: [],
              email: [],
              website: [],
              date_times: [],
            };
          }
        })
        .catch(({ response }) => {
          console.log("error in contacts: ", response);
          if (this.fromAndroid && response.status === 404)
            this.$toast.error(i18n.t('contact_registered'));
        })
        .finally(() => (this.loading = false));
    },
    saveEdited() {
      this.loading = true;
      let formData = new FormData();

      let rgx = new RegExp(/[۰-۹]+/g);
      if (rgx.test(this.info.phone))
        this.info.phone = this.english(this.info.phone);

      let arr = Object.entries(this.info);

      arr.forEach((val) => {
        if (val[0] === "phone_tags")
          formData.append(
            val[0],
            val[1].map((item) => item.id)
          );
        else if (val[0] === "avatar")
          formData.append(val[0], this.avatarFile ?? "");
        else if (val[1] instanceof Array)
          formData.append(
            val[0],
            JSON.stringify(this.filterFormDateListItem(val[1]))
          );
        else formData.append(val[0], val[1] || "");
      });

      // send from=android when user editing contact from android notification
      if (this.fromAndroid) formData.append("from", "android");

      updateContact(this.slug, formData)
        .then(({ data }) => {
          this.goto("phonebook");
        })
        .finally(() => {
          this.loading = false;
          this.$nextTick(() => {
            this.getInfo();
          });
        });
    },
    editTags(tags) {
      this.info.phone_tags = tags;
      this.$nextTick(() => {
        this.saveEdited();
      });
    },
    deleteContact() {
      this.loading = true;

      this.requestApiDelete(`contact/${this.slug}`)
        .then(({ data }) => {
          // this.$emit('reload')
          this.goto("phonebook");
          this.$toast.success(i18n.t('successfully_deleted'));
        })
        .catch(({ response }) => {
          console.log("failed to delete contact: ", response);
          if (response?.data?.message) this.$toast.error(response.data.message);
        })
        .finally(() => (this.loading = false));
    },
    filterFormDateListItem(field) {
      console.log("filterFormDateListItem: ", field);

      const filterItems = (item) => {
        if (Array.isArray(item))
          return item.filter((subItem) => filterItems(subItem));
        else if (typeof item === "object")
          return !Object.values(item).every((v) => !v);

        return item;
      };

      return field.filter((item) => filterItems(item));
    },
    deleteContactTag(tag) {
      this.loading = true;

      deleteContactFromTag(this.info.id, tag)
        .then(({ data }) => {
          this.getInfo();
        })
        .finally(() => (this.loading = false));
    },
  },

  beforeDestroy() {
    this.$root.$off("submitTag", this.editTags);
  },
};
</script>

<style scoped>
.letter-spacing-none {
  letter-spacing: 0 !important;
}

pre {
  font-family: "vazir", serif;
  color: unset !important;
}
</style>
