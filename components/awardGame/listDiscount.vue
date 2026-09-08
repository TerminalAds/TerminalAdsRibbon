<template>
  <v-card flat class="pa-4">
    <!-- ==================== حالت لیست ==================== -->
    <div v-if="viewMode === 'list'">

      <infoUSer-dialog
        v-model="historyDialog"
        :award-id="selectedAwardId"
        v-if="historyDialog"
      />

      <v-card-title class="pa-0 mb-6 d-flex align-center w-100">
      </v-card-title>

      <vue-table
        :data="tableData"
        :headers="headers"
        :loading="loading"
        @change="onTableChange"
      >
        <template v-slot:filters="{ props, perPage }">
          <v-row no-gutters>
            <v-col class="pa-2" cols="12" lg="2" md="3" sm="6">
              <v-select
                v-model="props.length"
                :items="perPage"
                dense
                hide-details
                outlined
                label="تعداد در صفحه"
              />
            </v-col>
            <v-col class="pa-2" cols="12" lg="4" md="5" sm="6">
              <v-text-field
                v-model="props.search"
                append-icon="mdi-magnify"
                clearable
                dense
                hide-details
                label="جستجو ..."
                outlined
              />
            </v-col>
          </v-row>
        </template>

        <template v-slot:index="{ item }">
          {{
            item.index + 1 + (tableData.current_page - 1) * tableData.per_page
          }}
        </template>
        <template v-slot:username="{ item }">
            {{    `${item.user.name}/ ${item.user.lastName}` }}
        </template>

        <template v-slot:updated_at="{ item }">
            {{     jalalian(item.updated_at) }}
        </template>

        <template v-slot:sms_sent_at="{ item }">
            {{     jalalian(item.sms_sent_at) }}
        </template>


        <template v-slot:discount_status="{ item }">
          <v-chip :color="item.enable ? 'success' : 'error'" small dark>
            {{ item.discount_status==='used' ? "استفاده شده" : "قابل استفاده" }}
          </v-chip>
        </template>

        <!-- <template v-slot:action="{ item }">
          <manage-button :data="item" :meta="metaButtons"  v-if="item.discount_status==='used'"/>
        </template> -->
      </vue-table>
    </div>

  </v-card>
</template>

<script>
// import manageButtons from "@/view/content/button.vue";

export default {
  name: "listDiscount",
  components: {
    // manageButtons,
  },

  data: () => ({
    viewMode: "list",
    selectedItem: null,
    loading: false,
    historyDialog: false,
    selectedAwardId: null,

    tableData: { data: [], current_page: 1, per_page: 10, total: 0 },


    //  "id": 4,
    //     "qr_id": 488174,
    //     "user_id": 13,
    //     "customer_club_setting_id": 3,
    //     "phone": "09309494643",
    //     "discount_code": "gcewrggfwfer",
    //     "discount_status": "used",
    //     "sms_sent_at": "2026-09-08T09:48:27.000000Z",
    //     "created_at": "2026-09-08T09:48:27.000000Z",
    //     "updated_at": "2026-09-08T09:48:27.000000Z",
    //     "user": {
    //       "id": 13,
    //       "name": "هما",
    //       "lastName": "خواجه",
    //       "username": null,
    //       "phone": "989216554670",
    //       "price_id": null,
    //       "tag": null
    //     }
    headers: [
      {
        text: "ردیف",
        value: "index",
        sortable: false,
        align: "center",
        width: "80px",
      },
      { text: "شناسه کیوآر", value: "qr_id", align: "center" },//عوض یشه
      { text: "شماره مصرف کننده", value: "phone", align: "center" },
      { text: "نام/نام خانوادگی مصرف کننده", value: "username", align: "center" },
      { text: "کد تخفیف", value: "discount_code", align: "center" },
      { text: "وضعیت کد تخفیف", value: "discount_status", align: "center" },
      { text: "زمان ارسال پیام", value: "sms_sent_at", align: "center" },
      {
        text: "آخرین به روزرسانی",
        value: "updated_at",
        align: "center",
      },
      // {
      //   text: "مدیریت",
      //   value: "action",
      //   sortable: false,
      //   align: "center",
      //   width: "120px",
      // },
    ],

    tableParams: {
      page: 1,
      length: 10,
      search: "",
    },
  }),

  created() {
    this.smsLogs();
  },
  computed: {
    metaButtons() {
      return {
        buttons: [
        
          {
            name: "history",
            label: "اطلاعات مصرف کننده",
            icon: "history",
            class: "btn-history border-2 rounded-pill",
            action: this.historyAction,
            status: "phoneBook_show",
          },
        ],
      };
    },
  },
  methods: {
    historyAction(item) {
      this.selectedAwardId = item.id;
      this.historyDialog = true;
    },
    async smsLogs() {
      try {
        this.loading = true;
        const res = await this.requestApiGetPayamak(`club-settings/sms-logs`, {
          params: this.tableParams,
        });
        if (res.data.status) {
          this.tableData = res.data.data;
        }
      } catch (err) {
        console.error(err);
        this.$toast.error("خطا در بارگذاری جوایز");
      } finally {
        this.loading = false;
      }
    },

    onTableChange({ page, length, search }) {
      this.tableParams = { page, length, search };
      this.smsLogs();
    },

    startAdd() {
      this.viewMode = "add";
      this.selectedItem = null;
    },

    editAction(item) {
      this.selectedItem = { ...item };
      this.viewMode = "edit";
    },

    deleteAction(item) {
      this.$modal.yesNo(`آیا جایزه «${item.award}» حذف شود؟`).then(async () => {
        this.loading = true;
        try {
          const res = await this.requestApiDeletePayamak(
            `game/award/${item.id}`,
          );
          if (res.data?.status) {
            this.$toast.success("جایزه با موفقیت حذف شد.");
            this.smsLogs();
          }
        } catch (e) {
          this.$toast.error("خطا در حذف");
        } finally {
          this.loading = false;
        }
      });
    },

    getAwardTypeColor(type) {
      switch (type) {
        case "discount":
          return "rgb(255, 141, 11)";
        case "text":
          return "rgba(0, 255, 196, 1)";
        case "url":
          return "rgba(5, 255, 0, 1)";
        default:
          return "rgba(255, 0, 142, 1)";
      }
    },
    getAwardTypeText(type) {
      switch (type) {
        case "discount":
          return "تخفیف";
        case "text":
          return "متن";
        case "url":
          return "لینک";
        default:
          return type;
      }
    },

    backToList() {
      this.viewMode = "list";
      this.selectedItem = null;
      this.smsLogs();
    },
  },
};
</script>
