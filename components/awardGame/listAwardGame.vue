<template>
  <v-card flat class="pa-4">
    <!-- ==================== حالت لیست ==================== -->
    <div v-if="viewMode === 'list'">
      <award-history-dialog
        v-model="historyDialog"
        :award-id="selectedAwardId"
        v-if="historyDialog"
      />

      <v-card-title class="pa-0 mb-6 d-flex align-center w-100">
        <v-btn class="btn-upload rounded-lg" @click="startAdd()">
          <v-icon right>mdi-plus</v-icon>
          افزودن جایزه بازی
        </v-btn>
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

        <template v-slot:award_type="{ item }">
          <v-chip :color="getAwardTypeColor(item.award_type)" small dark>
            {{ getAwardTypeText(item.award_type) }}
          </v-chip>
        </template>

        <template v-slot:enable="{ item }">
          <v-chip :color="item.enable ? 'success' : 'error'" small dark>
            {{ item.enable ? "فعال" : "غیرفعال" }}
          </v-chip>
        </template>

        <template v-slot:used_count="{ item }">
          {{ item.used_count || 0 }} / {{ item.max_use || "∞" }}
        </template>

        <template v-slot:action="{ item }">
          <manage-button :data="item" :meta="metaButtons" />
        </template>
      </vue-table>
    </div>

    <!-- ==================== حالت فرم (افزودن یا ویرایش) ==================== -->
    <div v-else>
      <v-card-title
        class="pa-0 mb-4 d-flex justify-space-between align-center w-100"
      >
        <v-card-title class="headline">
          <v-icon
            >{{
              viewMode !== "add" ? "mdi-gift-open-outline" : "mdi-gift-outline"
            }}
          </v-icon>

          {{ viewMode === "add" ? "افزودن جایزه جدید" : "ویرایش جایزه" }}
        </v-card-title>

        <v-btn outlined class="btn-back rounded-lg mx-4" @click="backToList">
          بازگشت
          <v-icon left>mdi-arrow-left</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <!-- حالت افزودن: دو تب -->
      <add-award-game
        v-if="viewMode === 'add'"
        @saved="backToList"
        @close="backToList"
      />

      <!-- حالت ویرایش: فقط فرم دستی -->
      <add-award-manual-dialog
        v-else-if="viewMode === 'edit'"
        :is-edit="true"
        :item="selectedItem"
        :id="selectedItem.id"
        @created="backToList"
        @input="backToList"
      />
    </div>
  </v-card>
</template>

<script>
import manageButtons from "@/view/content/button.vue";
import AddAwardManualDialog from "./AddAwardManualDialog.vue";
import AddAwardGame from "./addawardgame.vue";
import AwardHistoryDialog from "./AwardHistoryDialog.vue";

export default {
  name: "ListAwards",
  components: {
    manageButtons,
    AddAwardManualDialog,
    AddAwardGame,
    AwardHistoryDialog,
  },

  data: () => ({
    viewMode: "list",
    selectedItem: null,
    loading: false,
    historyDialog: false,
    selectedAwardId: null,

    tableData: { data: [], current_page: 1, per_page: 10, total: 0 },

    headers: [
      {
        text: "ردیف",
        value: "index",
        sortable: false,
        align: "center",
        width: "80px",
      },
      { text: "جایزه", value: "award", align: "center" },
      { text: "نوع جایزه", value: "award_type", align: "center" },
      { text: "حداقل امتیاز", value: "min_score", align: "center" },
      { text: "حداکثر امتیاز", value: "max_score", align: "center" },
      { text: "حداکثر استفاده", value: "used_count", align: "center" },
      {
        text: "مدت انتظار دریافت مجدد جایزه (روز)",
        value: "cooldown_days",
        align: "center",
      },
      { text: "وضعیت", value: "enable", align: "center" },
      {
        text: "مدیریت",
        value: "action",
        sortable: false,
        align: "center",
        width: "120px",
      },
    ],

    tableParams: {
      page: 1,
      length: 10,
      search: "",
    },
  }),

  created() {
    this.loadAwards();
  },
  computed: {
    metaButtons() {
      return {
        buttons: [
          {
            name: "edit",
            label: "ویرایش",
            icon: "edit",
            class: "btn-edit border-2 rounded-pill",
            action: this.editAction,
            status: "phoneBook_show",
          },
          {
            name: "delete",
            label: "حذف",
            icon: "trash",
            class: "btn-delete border-2 rounded-pill",
            action: this.deleteAction,
            status: "phoneBook_show",
          },
          {
            name: "history",
            label: "تاریخچه",
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
    async loadAwards() {
      try {
        this.loading = true;
        const res = await this.requestApiGetPayamak(`game/award`, {
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
      this.loadAwards();
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
            this.loadAwards();
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
      this.loadAwards();
    },
  },
};
</script>
