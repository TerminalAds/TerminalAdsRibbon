<template>
  <div>
    <v-text-field
      :value="displayName"
      label="انتخاب کیوار"
      dense
      outlined
      readonly
      append-icon="mdi-qrcode"
      class="cursor-pointer"
      @click="dialog = true"
      :error-messages="errors"
      :loading="load"
      title="انتخاب کیوآر"
    />

    <custom-popup v-model="dialog" max-width="600px" :cons="cons">
      <v-card flat outlined :loading="loading">
        <v-card-actions>
          <v-text-field
            label="جستجو در کیوارها"
            append-icon="mdi-magnify"
            v-model="search"
            :loading="loading"
            outlined
            dense
            hide-details
            class="my-3"
          />
        </v-card-actions>

        <v-list
          style="background: white; max-height: 420px; overflow-y: auto"
          class="ma-8"
        >
          <v-list-item
            v-for="qr in qrs.data"
            :key="qr.id"
            @click="pick(qr)"
            :class="{ 'primary--text': qr.id === value }"
          >
            <v-list-item-content>
              <div class="d-flex flex-row">
                <v-icon class="px-2">{{
                  `mdi-${getQrType(qr.type)?.icon}` || "mdi-qrcode"
                }}</v-icon>
                <v-list-item-title>
                  {{ qr.title || "بدون عنوان" }}
                </v-list-item-title>
              </div>
            </v-list-item-content>

            <v-list-item-action v-if="qr.id === value">
              <v-icon color="green">mdi-check-circle</v-icon>
            </v-list-item-action>
          </v-list-item>

          <v-list-item v-if="qrs.data?.length === 0 && !loading">
            <v-list-item-content class="text-center grey--text">
              QR بازی‌دار یافت نشد
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-card-actions class="justify-end" style="background: white">
          <v-spacer />

          <Paginate
            :total="qrs.last_page"
            :links="qrs.links"
            :tableProps="tableProps"
            @changePage="onPageChange"
          />
        </v-card-actions>
      </v-card>
    </custom-popup>
  </div>
</template>

<script>
import Paginate from "@/view/pages/admin/Messages/Paginate";
import { qrAxios } from "@/main";

export default {
  name: "qrPicker",

  components: { Paginate },

  props: {
    value: [Number, String, null],
    errors: { type: Array, default: () => [] },
  },

  model: {
    prop: "value",
    event: "input",
  },

  data() {
    return {
      cons: {
        title: "انتخاب QR (دارای بازی)",
        buttons: [],
        icon: "qrcode",
      },
      load: false,

      dialog: false,
      loading: false,

      search: "",
      qrs: {
        data: [],
        links: [],
        last_page: 1,
        current_page: 1,
      },
      tableProps: {
        search: "",
        page: 1,
        length: 50,
      },
    };
  },

  computed: {
    displayName() {
      if (!this.value) return "انتخاب نشده";
      const selected = this.qrs.data.find((q) => q.id === this.value);
      return selected ? `${selected.title}` : `QR #${this.value}`;
    },
  },

  watch: {
    search(val) {
      this.tableProps.search = val?.trim() || "";
      this.tableProps.page = 1;
      this.fetch();
    },

    dialog(val) {
      if (val) {
        this.fetch();
      }
    },

    value(newVal) {
      if (!newVal) {
        this.search = "";
        this.tableProps.search = "";
      }
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    getQrType(type) {
      const qrTypes = [
        {
          value: "consultationQr",
          name: "فرم درخواست",
          icon: "list-box-outline",
        },
        {
          value: "feedbackGallery",
          name: "گالری بازخورد",
          icon: "comment-quote",
        },

        {
          value: "wheel",
          name: "چرخ شانس",
          icon: "clover-outline",
        },
        {
          value: "multicard",
          name: "مولتی کارت",
          icon: "card-multiple",
        },
        {
          value: "productpro",
          name: "محصول پرو",
          icon: "professional-hexagon",
        },
        {
          value: "instagram",
          name: "اینستاگرام",
          icon: "instagram",
        },
        {
          value: "visitCard",
          name: "کارت ویزیت",
          icon: "card-account-details",
        },
        {
          value: "appointment",
          name: "نوبت‌دهی",
          icon: "calendar-month",
        },
        {
          value: "insurance",
          name: "بیمه آنلاین",
          icon: "shield-account-outline",
        },
        {
          value: "Business",
          name: "کسب و کار",
          icon: "store",
        },
        {
          value: "Commericial",
          name: "سایت مجتمع تجاری/اداری",
          icon: "office-building-outline",
        },
        {
          value: "labelproduct",
          name: "لیبل محصول",
          icon: "tag-multiple",
        },
        {
          value: "bShop",
          name: "صفحه فروشگاهی",
          icon: "storefront",
        },
        {
          value: "SocialMedia",
          name: "شبکه های اجتماعی",
          icon: "comment-account",
        },
        {
          value: "VideoGallery",
          name: "گالری فیلم",
          icon: "video",
        },
        {
          value: "PhotoGallery",
          name: "گالری عکس",
          icon: "image",
        },
        {
          value: "singleProduct",
          name: "معرفی محصول",
          icon: "package",
        },
        {
          value: "menu",
          name: "منو",
          icon: "book-open-outline",
        },
        {
          value: "text",
          name: "متن",
          icon: "text",
        },
      ];
      return qrTypes.find((t) => t.value.toLowerCase() === type.toLowerCase());
    },
    async fetch() {
      if (this.loading) return;
      this.loading = true;

      try {
        const params = {
          fields: ["id", "title", "type", "domain_id", "identifier"],
          sort: "desc",
          page: this.tableProps.page,
          length: this.tableProps.length,
          hasGame: 1,
          search: this.tableProps.search || undefined,
        };

        const url = `${this.$qrApi}/v1/testQr/user`;

        const response = await qrAxios.get(url, { params });

        const result = response.data?.data || response.data || {};
        this.qrs = {
          data: result.data || [],
          links: result.links || [],
          last_page: result.last_page || 1,
          current_page: result.current_page || 1,
        };
      } catch (err) {
        console.error("خطا در لود QRها:", err);
        this.$toast.error("خطا در بارگذاری لیست QR");
        this.qrs = { data: [], last_page: 1, current_page: 1 };
      } finally {
        this.loading = false;
      }
    },

    pick(qr) {
      this.$emit("input", qr.id);
      this.dialog = false;
      // اگر می‌خوای عنوان رو هم جایی ذخیره کنی می‌تونی emit جدا کنی
      // this.$emit("selected:qr", qr);
    },

    onPageChange(newPage) {
      this.tableProps.page = newPage;
      this.fetch();
    },
  },
};
</script>

<style scoped>
.v-list-item--active,
.v-list-item.primary--text {
  background-color: #e3f2fd !important;
}
</style>
