<template>
  <v-card flat class="pa-4">
    <div >
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
            <v-col class="pa-2" cols="12" lg="3" md="4" sm="6">
              <v-select
                v-model="props.discount_status"
                :items="statusList"
                dense
                hide-details
                outlined
                label="وضعیت کد تخفیف"
              />
            </v-col>
          </v-row>
        </template>

        <template v-slot:index="{ item }">
          {{
            item.index + 1 + (tableData.current_page - 1) * tableData.per_page
          }}
        </template>
        <template v-slot:customer_full_name="{ item }">
            {{ item.customer_full_name ||"-" }}
        </template>
        <template v-slot:qr_title="{ item }">
          {{ item.qr_title || "-" }}
        </template>
        <template v-slot:updated_at="{ item }">
            {{     jalalian(item.updated_at) }}
        </template>

        <template v-slot:sms_sent_at="{ item }">
            {{     jalalian(item.sms_sent_at) }}
        </template>


        <template v-slot:discount_status="{ item }">
          <v-chip :color="getstatusColor(item.discount_status)" small dark>
            {{ getstatusText(item.discount_status) }}
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
    selectedItem: null,
    loading: false,
    historyDialog: false,
    selectedAwardId: null,
    tableData: { data: [], current_page: 1, per_page: 10, total: 0 },
    statusList: [{ text:'همه',value:'null'},{ text:'قابل استفاده',value:'unused'},{ text:'استفاده شده',value:'used'},],
    headers: [
      {
        text: "ردیف",
        value: "index",
        sortable: false,
        align: "center",
        width: "80px",
      },
      { text: "نام باشگاه", value: "qr_title", align: "center" },//عوض یشه
      { text: "شماره مصرف کننده", value: "phone", align: "center" },
      { text: "نام/نام خانوادگی مصرف کننده", value: "customer_full_name", align: "center" },
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
      discount_status: null,
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
        const params = { ...this.tableParams };
      if(params.discount_status===null)
      delete params.discount_status;
      try {
        this.loading = true;
        const res = await this.requestApiGetPayamak(`club-settings/sms-logs`, {
          params: params,
        });
        if (res.data.status) {
          this.tableData = res.data.data;
        }
      } catch (err) {
        console.error(err);
        this.$toast.error("خطا در بارگذاری کدتخفیف");
      } finally {
        this.loading = false;
      }
    },

    onTableChange({ page, length, discount_status }) {
      this.tableParams = { page, length, discount_status };
      this.smsLogs();
    },



    getstatusColor(type) {
      switch (type) {
        case "used":
          return "rgba(255, 0, 142, 1)";
        case "unused":
          return "rgba(0, 255, 196, 1)";
        default:
          return "#FFF700";
      }
    },
    getstatusText(type) {
      switch (type) {
        case "used":
          return "استفاده شده";
        case "unused":
          return "قابل استفاده";
        default:
          return type||"";
      }
    },

    backToList() {
      this.selectedItem = null;
      this.smsLogs();
    },
  },
};
</script>
