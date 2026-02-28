<template>
  <custom-popup
    v-model="showDialog"
    max-width="900px"
    :cons="cons"
    hide-confirm
  >
    <v-card flat class="rounded-xl overflow-hidden pa-8">
      <vue-table
        :data="tableData"
        :headers="headers"
        :loading="loading"
        @change="onTableChange"
      >
        <template v-slot:filters="{ props, perPage }">
          <v-row no-gutters class="pa-2">
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="props.search"
                append-icon="mdi-magnify"
                label="جستجو در تاریخچه..."
                outlined
                dense
                hide-details
              />
            </v-col>
          </v-row>
        </template>

        <template v-slot:index="{ item }">
          {{
            item.index + 1 + (tableData.current_page - 1) * tableData.per_page
          }}
        </template>

        <template v-slot:user="{ item }">
          <div class="d-flex flex-column">
            <span class="font-weight-bold">{{
              item.contact?.lastname !== null || item.contact?.name !== null
                ? `${
                    item.contact?.lastname !== null
                      ? item.contact?.lastname
                      : ""
                  }${
                    item.contact?.lastname !== null &&
                    item.contact?.name !== null
                      ? "،"
                      : ""
                  } ${item.contact?.name !== null ? item.contact?.name : ""}`
                : "کاربر مهمان"
            }}</span>
            <span class="caption grey--text">{{ item.contact?.phone }}</span>
          </div>
        </template>

        <template v-slot:created_at="{ item }">
          {{ jalalian(item.created_at) }}
        </template>

        <template v-slot:is_used="{ item }">
          <v-chip :color="item.is_used ? 'success' : 'warning'" x-small px-2>
            {{ item.is_used ? "استفاده شده" : "در انتظار" }}
          </v-chip>
        </template>
      </vue-table>
    </v-card>
  </custom-popup>
</template>

<script>
export default {
  name: "AwardHistoryDialog",
  props: {
    value: { type: Boolean, default: false },
    awardId: { type: [Number, String], default: null },
  },
  data() {
    return {
      cons: {
        title: "تاریخچه دریافت جوایز",
        buttons: [],
        icon: "history",
      },
      loading: false,
      tableData: { data: [], current_page: 1, per_page: 10, total: 0 },
      headers: [
        { text: "ردیف", value: "index", align: "center", width: "70px" },
        { text: "کاربر", value: "user", align: "center" },
        { text: "امتیاز کسب شده", value: "score", align: "center" },
        { text: "تاریخ دریافت جایزه", value: "created_at", align: "center" },
      ],
      tableParams: {
        page: 1,
        length: 10,
        search: "",
      },
    };
  },
  computed: {
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.tableParams = { page: 1, length: 10, search: "" };
          this.fetchHistory();
        }
      },
      immediate: true,
    },
  },
  methods: {
    async fetchHistory() {
      if (!this.awardId) return;
      this.loading = true;
      try {
        const params = {
          ...this.tableParams,
          award_id: this.awardId,
        };
        const res = await this.requestApiGetPayamak(`game/award/history`, {
          params,
        });
        if (res.data?.status) {
          this.tableData = res.data.data;
        }
      } catch (err) {
        this.$toast.error("خطا در بارگذاری تاریخچه");
      } finally {
        this.loading = false;
      }
    },
    onTableChange({ page, length, search }) {
      this.tableParams = { page, length, search };
      this.fetchHistory();
    },
  },
};
</script>
