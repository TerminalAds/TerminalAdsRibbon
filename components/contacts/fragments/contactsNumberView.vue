<template>
  <v-card flat>
    <v-card-title class="align-center">
      <v-card
        class="rounded-pill d-flex justify-center align-center pa-2"
        outlined
      >
        <v-expand-x-transition>
          <v-card
            v-if="expandedSearch"
            :width="expandedSearch ? 300 : 0"
            class="ml-2"
            flat
          >
            <v-text-field
              v-model="search"
              dense
              hide-details
              :label="i18n.t('CONTACT_SEARCH.SEARCH')"
              @input="searchInPhones"
            />
          </v-card>
        </v-expand-x-transition>

        <v-btn
          icon
          @click="
            () => {
              expandedSearch = !expandedSearch;
              clearSearch();
            }
          "
        >
          <v-icon>mdi-{{ expandedSearch ? "close" : "magnify" }}</v-icon>
        </v-btn>
      </v-card>

      <v-btn
        v-if="!!bulk && !!bulk.length"
        class="rounded-lg mx-2"
        color="red"
        outlined
        @click="deleteBulkNumbers"
      >
        {{ i18n.t("BUTTONS.DELETE_NUMBERS") }}
      </v-btn>
      <v-spacer />

      <v-card flat width="200">
        <v-select
          v-model="paginate.per_page"
          :items="[10, 25, 50, 100, 200, 500]"
          :menu-props="{ offsetY: true }"
          class="rounded-lg"
          dense
          :label="i18n.t('CONTACT_PAGINATION.PER_PAGE')"
          outlined
        />
      </v-card>
    </v-card-title>

    <template
      v-if="(!!value.data && !!value.data.length) || (!!bulk && !!bulk.length)"
    >
      <v-row class="pa-4" justify="center" no-gutters>
        <template v-if="!bulk || !bulk.length">
          <contacts-number-edit
            v-for="(phone, i) in value.data"
            :key="i"
            :value="phone"
            @delete="deleteNumbers"
          />
        </template>

        <template v-else>
          <contacts-number-edit
            v-for="(phone, i) in computedBulk.list"
            :key="i"
            :value="phone"
            prepare
            @delete="deleteNumbers($event, true)"
          />
        </template>

        <v-col
          v-if="!bulk || !bulk.length"
          class="pa-2 d-flex justify-center align-center"
          cols="12"
        >
          <template v-if="!!value && !!value.last_page && value.last_page > 1">
            <v-pagination
              v-model="value.current_page"
              :length="value.last_page"
              circle
              total-visible="5"
              @input="$emit('changePage', $event)"
            />
          </template>

          <div class="mx-4">
            <span class="text-decoration-underline">{{
              i18n.t("CONTACT_PAGINATION.FROM")
            }}</span>
            {{ value.from }}
            <span class="text-decoration-underline">{{
              i18n.t("CONTACT_PAGINATION.TO")
            }}</span>
            / {{ i18n.t("CONTACT_PAGINATION.TOTAL") }}
            <span class="mx-1 blue--text text-decoration-underline">{{
              value.total
            }}</span>
          </div>
        </v-col>

        <v-col v-else class="pa-2 d-flex justify-center align-center" cols="12">
          <template v-if="computedLastPage > 1">
            <v-pagination
              v-model="paginate.current_page"
              :length="computedLastPage"
              circle
              total-visible="5"
            />
          </template>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-img
        class="mt-3 mx-auto"
        contain
        max-height="150"
        max-width="150"
        src="media/empty/add-number-2.png"
      />
      <p class="mt-2 text-center">
        <span class="font-weight-bold">{{ i18n.t("LISTS.AddANumber") }}</span>
      </p>
    </template>

    <v-card-actions class="flex-wrap">
      <v-text-field
        ref="phoneAdd"
        v-model="singlePhone"
        :label="i18n.t('FORMS.DestinationPhone')"
        :loading="loading"
        :rules="[phoneRule.phone]"
        class="pe-md-2 rounded-lg"
        dense
        hide-details
        outlined
        prepend-inner-icon="phone"
        @keydown.enter="addPhone"
      >
        <template v-slot:append>
          <div id="showHand" class="text-primary d-flex" @click="addPhone">
            <v-icon color="blue">mdi-plus-box</v-icon>
            <span class="d-none d-md-block small my-auto">{{
              i18n.t("FORMS.Add")
            }}</span>
          </div>
        </template>
      </v-text-field>

      <v-btn
        id="showHand"
        v-b-tooltip="i18n.t('TOOLTIP.CopyPhoneNumbers')"
        class="btn-upload mx-0"
        @click="handleReadClipboard"
      >
        <v-icon>mdi-plus-box-multiple-outline</v-icon>
        {{ i18n.t("BUTTONS.ADD_BULK") }}
      </v-btn>

      <input
        ref="fileInput"
        accept=".xlsx, .csv, .txt"
        class="d-none"
        type="file"
        @change="getFileContent"
      />

      <v-btn
        class="m-2 btn-upload text-info border-info font-weight-bold"
        @click="openFileDialog"
      >
        <span class="flaticon2-file icon-md"></span>
        {{ i18n.t("BUTTONS.FROM_FILE") }}
      </v-btn>
    </v-card-actions>

    <v-card-actions class="justify-end">
      <v-btn
        :disabled="!bulk || !bulk.length"
        :loading="loading"
        class="submit-btn"
        @click="$emit('addBulk', bulk)"
      >
        <span class="flaticon2-send-1 icon-md"></span>
        {{ i18n.t("BUTTONS.Save") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {
  filterCorrectPhoneNumbers,
  isValidPhone,
  readPhoneNumbersFromCsvFile,
  readPhoneNumbersFromTextFile,
  readPhoneNumbersFromXlsxFile,
} from "../../../assets/js/PhoneFunctions";
import ContactsNumberEdit from "./contactsNumberEdit.vue";
import readXlsxFile from "read-excel-file";

export default {
  name: "contactsNumberView",

  components: { ContactsNumberEdit },

  props: {
    value: Object,
    loading: Boolean,
    props: Object,
  },

  data() {
    return {
      expandedSearch: false,
      singlePhone: "",
      bulk: [],
      paginate: {
        per_page: 10,
        last_page: 1,
        current_page: 1,
      },
      phoneRule: {
        phone: (v) =>
          isValidPhone(v) || v.length === 0 || i18n.t("ERRORS.PhoneIsNotValid"),
      },
      search: "",
    };
  },

  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    computedBulk() {
      let { current_page, per_page } = this.paginate;

      let arr = this.bulk.filter(
        (item) => !this.search || item.includes(this.search)
      );
      return {
        len: arr.length,
        list: arr.slice(
          (current_page - 1) * per_page,
          (current_page - 1) * per_page + per_page
        ),
      };
    },
    computedLastPage() {
      return Math.ceil(this.computedBulk?.len / this.paginate.per_page);
    },
    computedProps: {
      get() {
        return this.props;
      },
      set(val) {
        this.$emit("update:props", val);
      },
    },
  },

  methods: {
    importFromClipboard(value) {
      const phone = value.split(" ");

      if (phone.length <= 2) return;

      filterCorrectPhoneNumbers(phone).then((validNumbers) => {
        this.addPhones(validNumbers);
      });

      this.$nextTick(() => {
        this.singlePhone = "";
      });
    },
    addPhones(array) {
      if (array.length > 50_000 || this.value.length > 49_999)
        return this.$toast.error(
          "شما نمی توانید بیشتر از 50000 شماره اضافه کنید."
        );

      this.bulk = [...new Set(this.bulk.concat(array))];

      // this.bulk = this.bulk.concat(this.removeExistsNumbers(array));
      // console.log('bulk: ', this.bulk)
    },
    addPhone() {
      this.extractPhoneNumbers(this.singlePhone, true);
    },
    deleteNumbers(data, temp = false) {
      if (temp) {
        let index = this.bulk.indexOf(data);
        this.bulk.splice(index, 1);
        return;
      }

      this.loading = true;

      this.requestApiDelete(`contact/${data.id}`)
        .then(({ data }) => {
          this.$emit("reload");
          this.$toast.success("با موفقیت حذف شد");
        })
        .catch(({ response }) => {
          console.log("failed to delete contact: ", response);
          if (response?.data?.message) this.$toast.error(response.data.message);
        })
        .finally(() => (this.loading = false));
    },
    // removeExistsNumbers(array) {
    //   let arr = this.value.data.map(item => item.phone)
    //   return array.reduce((acc, s) => {
    //     if (!arr.includes(s.match(/(\d+)/)[0]) && !this.bulk.includes(s.match(/(\d+)/)[0])) {
    //       acc.push(s.match(/(\d+)/)[0]);
    //     }
    //     return acc;
    //   }, []);
    // },
    openFileDialog() {
      let input = this.$refs.fileInput;
      input.click();
    },
    // readFile(e) {
    //   let input = this.$refs.fileInput;
    //   let file = input.files[0]
    //   let ns = file.name.split(".")
    //   let type = ns[ns.length - 1];
    //
    //   switch (type) {
    //     case "xlsx":
    //       readPhoneNumbersFromXlsxFile(file).then((numbers) => {
    //         this.extractPhoneNumbers(numbers);
    //
    //         // filterCorrectPhoneNumbers(numbers)
    //         //   .then((validNumbers) => {
    //         //     this.addPhones(validNumbers);
    //         //   })
    //       });
    //       break;
    //     case "csv":
    //       readPhoneNumbersFromCsvFile(file, (numbers) => {
    //         this.extractPhoneNumbers(numbers);
    //
    //         // filterCorrectPhoneNumbers(numbers)
    //         //   .then((validNumbers) => {
    //         //     this.addPhones(validNumbers);
    //         //   })
    //       });
    //       break;
    //     case "txt":
    //       readPhoneNumbersFromTextFile(file, (numbers) => {
    //
    //
    //         this.extractPhoneNumbers(numbers);
    //
    //         // filterCorrectPhoneNumbers(numbers)
    //         //   .then((validNumbers) => {
    //         //     this.addPhones(validNumbers);
    //         //   })
    //       });
    //       break;
    //
    //     default:
    //       window.alert(this.$t("NOTIFY.FileFormatInvalid"));
    //       break;
    //   }
    // },
    handleReadClipboard() {
      navigator.clipboard.readText().then((text) => {
        this.extractPhoneNumbers(text);
      });
    },
    getFileContent() {
      let input = this.$refs.fileInput;
      let file = input.files[0];
      let ns = file.name.split(".");
      let type = ns[ns.length - 1];

      function readFile(file, callback) {
        const reader = new FileReader();

        reader.onload = function () {
          const content = reader.result;
          callback(content);
        };
        reader.onerror = function () {
          console.error("Error reading the file");
        };
        reader.readAsText(file, "utf-8");
      }

      async function readXlsx(file) {
        const reader = await readXlsxFile(file);
        let txt = "";
        reader.forEach((row) => {
          row.forEach((col) => {
            txt += col + "\n";
          });
        });

        return txt;
      }

      switch (type) {
        case "xlsx":
          readXlsx(file).then((data) => this.extractPhoneNumbers(data));
          break;
        case "txt":
        case "csv":
          readFile(file, (data) => {
            this.extractPhoneNumbers(data);
          });
          break;
      }
    },
    extractPhoneNumbers(text, single = false) {
      // const phoneRegex = /\b09\d{2}\d{3}\d{4}\b/g;
      // const matches = text.match(phoneRegex);
      // return matches || [];

      const anyChar = /([-_()+a-zA-Z‬ا-ی‏|‏‪| ])/g,
        persian = /[۰-۹]/g,
        anyStart = /^(989|98|09|9)/gm,
        number1 = /\b98\d{0,9}\b/g,
        number2 = /98\d{10}(\d+)/g;

      if (
        anyChar.test(text) ||
        persian.test(text) ||
        anyStart.test(text) ||
        number1.test(text) ||
        number2.test(text)
      ) {
        let fileData = text
          .replace(anyChar, "")
          .replace(persian, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
          .replace(anyStart, "989")
          .replace(number1, "")
          .replace(number2, (match, p1) => {
            return match.slice(0, 12);
          })
          .replace(/[\r\n]+/gm, "\n");

        let arr = [...new Set(fileData.split("\n"))];

        this.addPhones(arr.filter((item) => !!item));

        this.$nextTick(() => {
          this.singlePhone = "";
        });
      }
    },
    removeBulks() {
      this.bulk = [];
    },
    async deleteBulkNumbers() {
      if (await this.$modal.yesNo("حذف شماره‌های ذخیره نشده‌؟")) {
        this.bulk = [];
      }
    },
    clearSearch() {
      this.search = "";
      this.computedProps.phone = "";
      setTimeout(() => {
        this.$emit("reload");
      }, 100);
    },
    searchInPhones() {
      if (!!this.bulk?.length) {
        this.paginate.current_page = 1;
      } else if (!!this.value?.data?.length) {
        console.log("props: ", this.props, this.search);
        this.computedProps.phone = this.search;

        setTimeout(() => {
          this.$emit("reload");
        }, 100);
      }
    },
  },
};
</script>

<style scoped></style>
