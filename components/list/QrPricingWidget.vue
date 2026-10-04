<template>
  <v-card class="pricing-half-widget rounded-xl elevation-1 pa-4 h-100 d-flex flex-column justify-space-between" dir="rtl">
    <!-- هدر: عنوان + سلکتور نوع کیوآر -->
    <div class="d-flex align-center justify-space-between mb-3 flex-wrap header-wrapper" style="gap: 10px;">
      <!-- عنوان و آیکون -->
      <div class="d-flex align-center">
        <v-avatar size="44" class="ml-2 flex-shrink-0 avatar-badge">
          <v-img 
            v-if="selectedTypeObj && selectedTypeObj.image" 
            :src="selectedTypeObj.image" 
            contain 
            max-width="24" 
            max-height="24" 
          />
          <v-icon 
            v-else-if="selectedTypeObj && selectedTypeObj.icon" 
            color="primary" 
            size="22"
          >
            {{ `mdi-${selectedTypeObj.icon}` }}
          </v-icon>
          <v-icon v-else color="primary" size="22">mdi-qrcode-scan</v-icon>
        </v-avatar>

        <div class="title-section">
          <div class="widget-title">تعرفه کیوآر</div>
          <div class="widget-subtitle">پلن متناسب با کسب‌وکارتان را انتخاب کنید</div>
        </div>
      </div>

      <!-- انتخاب‌گر کیوآر -->
      <div class="select-container">
        <v-autocomplete
          v-model="selectedType"
          :items="qrTypeList"
          item-text="name"
          item-value="value"
          outlined
          dense
          rounded
          hide-details
          no-data-text="موردی یافت نشد"
          placeholder="انتخاب نوع کیوآر..."
          :loading="priceLoading"
          class="custom-autocomplete"
          @change="onQrTypeChange"
        >
          <template #item="{ item }">
            <div class="d-flex align-center py-1">
              <v-img 
                v-if="item.image" 
                :src="item.image" 
                max-width="18" 
                max-height="18" 
                class="ml-2 flex-shrink-0" 
                contain 
              />
              <v-icon 
                v-else-if="item.icon" 
                small 
                color="primary" 
                class="ml-2 flex-shrink-0"
              >
                mdi-{{ item.icon }}
              </v-icon>
              <v-icon v-else small color="grey lighten-1" class="ml-2 flex-shrink-0">mdi-qrcode</v-icon>
              <span class="text-body-2 font-weight-medium">{{ item.name }}</span>
            </div>
          </template>
          <template #selection="{ item }">
            <span class="select-selection-text">{{ item.name }}</span>
          </template>
        </v-autocomplete>
      </div>
    </div>

    <!-- اسلایدر دوره‌های زمانی -->
    <div class="mb-3">
      <v-slide-group v-if="prices.length" v-model="selectedPriceIndex" mandatory show-arrows>
        <v-slide-item
          v-for="(item, index) in prices"
          :key="item.id"
          v-slot="{ active, toggle }"
        >
          <v-btn
            class="mx-1 time-tab-btn"
            :input-value="active"
            :color="active ? 'primary' : '#f1f5f9'"
            :class="active ? 'white--text elevation-1' : 'grey--text text--darken-3'"
            rounded
            small
            depressed
            @click="toggle"
          >
            <span class="font-weight-bold tab-text">
              {{ item.name || (persian(item.time) + ' روزه') }}
            </span>
            <v-chip
              v-if="item.discount"
              x-small
              :color="active ? 'amber darken-2' : 'deep-orange lighten-1'"
              text-color="white"
              class="mr-1 px-1 font-weight-bold"
            >
              {{ persian(item.discount) }}%
            </v-chip>
          </v-btn>
        </v-slide-item>
      </v-slide-group>
    </div>

    <v-divider class="mb-3 border-divider" />

    <!-- لودینگ -->
    <div v-if="priceLoading" class="text-center py-6">
      <v-progress-circular indeterminate color="primary" size="32" width="3" />
    </div>

    <!-- نبود تعرفه -->
    <div v-else-if="!priceLoading && prices.length === 0" class="text-center py-5">
      <v-icon size="40" color="grey lighten-2">mdi-package-variant-closed</v-icon>
      <div class="text-body-2 grey--text mt-2">تعرفه‌ای برای این نوع یافت نشد.</div>
    </div>

    <!-- کارت قیمت و ویژگی‌ها -->
    <div v-else>
      <v-row dense align="center" class="mb-2">
        <v-col cols="6">
          <v-chip
            :color="activeCardStyle.bg"
            :text-color="activeCardStyle.color"
            small
            class="font-weight-bold px-3 plan-badge"
          >
            <v-icon x-small class="ml-1" :color="activeCardStyle.color">{{ activeCardStyle.icon }}</v-icon>
            {{ activeCardStyle.tag }}
          </v-chip>
        </v-col>

        <v-col cols="6" class="text-left">
          <div v-if="activePriceItem.discount" class="text-decoration-line-through grey--text text-caption" style="line-height: 1;">
            {{ persian(formatPrice(activePriceItem.price).num) }} {{ formatPrice(activePriceItem.price).text }}
          </div>
          <div class="d-flex align-baseline justify-end" style="gap: 4px;">
            <span class="font-weight-black price-value" :style="{ color: activeCardStyle.color }">
              {{ persian(formatPrice(activePriceItem.discount ? computedDiscount(activePriceItem) : activePriceItem.price).num) }}
            </span>
            <span class="price-currency">
              {{ formatPrice(activePriceItem.discount ? computedDiscount(activePriceItem) : activePriceItem.price).text }}
            </span>
          </div>
        </v-col>
      </v-row>

      <!-- لیست ویژگی‌ها -->
      <div class="features-box pa-3">
        <v-row dense>
          <v-col
            v-for="(feature, idx) in currentFeatures"
            :key="idx"
            cols="12"
            sm="6"
            class="py-1 d-flex align-center"
          >
            <v-icon size="16" color="#10b981" class="ml-1 flex-shrink-0">mdi-check-circle</v-icon>
            <span class="feature-text text-truncate">
              {{ feature }}
            </span>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "QrPricingWidget",
  props: {
    initialType: {
      type: String,
      default: "visitCard"
    }
  },
  data() {
    return {
      selectedType: this.initialType,
      selectedPriceIndex: 0,
      priceLoading: false,
      prices: []
    };
  },
  computed: {
    qrTypeList() {
      return typeof this.getQrTypes === "function" ? this.getQrTypes() : [];
    },
    selectedTypeObj() {
      return (
        this.qrTypeList.find(
          item => item.value && item.value.toLowerCase() === (this.selectedType || "").toLowerCase()
        ) || {}
      );
    },
    activePriceItem() {
      return this.prices[this.selectedPriceIndex] || {};
    },
    activeCardStyle() {
      if (!this.prices.length) {
        return { tag: "عادی", color: "#7367f0", bg: "#f3f2ff", icon: "mdi-tag" };
      }
      return this.getCardStyle(this.activePriceItem);
    },
    currentFeatures() {
      if (!this.activePriceItem || !this.activePriceItem.id) return [];
      return this.getFeatures(this.activePriceItem);
    }
  },
  mounted() {
    this.fetchPrices();
  },
  methods: {
    onQrTypeChange() {
      this.selectedPriceIndex = 0;
      this.fetchPrices();
    },
    fetchPrices() {
      this.priceLoading = true;
      const typeValue = this.selectedTypeObj.value || this.selectedType;

      this.$api
        .get("user/price", { params: { type: typeValue } })
        .then(response => {
          this.prices = (response.data.data || []).sort((a, b) => a.time - b.time);
          this.selectedPriceIndex = 0;
        })
        .catch(err => {
          this.prices = [];
          if (this.$modal && this.$modal.error) {
            this.$modal.error(
              this.$t("error"),
              err?.response?.data?.message || this.$t("no_tariff_exists")
            );
          }
        })
        .finally(() => {
          this.priceLoading = false;
        });
    },
    computedDiscount(item) {
      if (!item || !item.discount) return item.price;
      return Math.round(item.price - (item.price * item.discount) / 100);
    },
        formatPrice(amount) {
      if (!amount) return { num: 0, text: "رایگان" };
      
      // تبدیل ریال به تومان
      const toman = amount / 10; 

      if (toman >= 1000000 && toman % 100000 === 0) {
        const num = toman / 1000000;
        return {
          num: Number.isInteger(num) ? num : num.toFixed(1),
          text: "میلیون تومان"
        };
      } else if (toman >= 1000 && toman % 1000 === 0) {
        return { num: toman / 1000, text: "هزار تومان" };
      }
      return { num: toman.toLocaleString(), text: "تومان" };
    },

    getCardStyle(item) {
      const index = this.prices.findIndex(p => p.id === item.id);
      const totalLength = this.prices.length;
      const reverseIndex = totalLength - 1 - index;

      switch (reverseIndex) {
        case 0:
          return { tag: "باصرفه‌ترین", color: "#f59e0b", bg: "#fef3c7", icon: "mdi-crown" };
        case 1:
          return { tag: "پیشنهاد ویژه", color: "#7367f0", bg: "#ede9fe", icon: "mdi-diamond-stone" };
        case 2:
          return { tag: "محبوب", color: "#6366f1", bg: "#e0e7ff", icon: "mdi-star" };
        case 3:
          return { tag: "اقتصادی", color: "#0ea5e9", bg: "#e0f2fe", icon: "mdi-wallet-bifold" };
        case 4:
          return { tag: "پایه", color: "#7367f0", bg: "#f3f2ff", icon: "mdi-flag-variant" };
        default:
          return { tag: "عادی", color: "#64748b", bg: "#f1f5f9", icon: "mdi-calendar-month" };
      }
    },
    getFeatures(item) {
      const type = (this.selectedType || "").toLowerCase().trim();

      if (type === "qrlink") {
        let linkFeatures = [
          "اسکن نامحدود و بدون قطعی",
          "تغییر مقصد بدون تغییر شکل کیوآر",
          "ماندگاری دائمی لینک و اطلاعات",
          "گزارش تعداد کلیک و اسکن"
        ];
        if (item.time >= 360) {
          linkFeatures.push("گزارش پیشرفته دستگاه‌ها و مبدا");
          linkFeatures.push("پشتیبانی ویژه و اختصاصی VIP");
        }
        return linkFeatures;
      }

      if (type === "clickyarseo") {
        let seoFeatures = [
          "اسکن نامحدود و بدون قطعی",
          "هدایت هوشمند و بهینه‌سازی CTR",
          "ویرایش مسیر بدون تغییر کیوآر",
          "گزارش‌گیری دقیق بازدیدها"
        ];
        if (item.time >= 360) {
          seoFeatures.push("آنالیز پیشرفته رفتار اسکن کاربران");
          seoFeatures.push("پشتیبانی ویژه و اختصاصی VIP");
        }
        return seoFeatures;
      }

      let baseFeatures = [
        "اسکن نامحدود و بدون قطعی",
        "امکان ویرایش محتوا (داینامیک)",
        "شخصی‌سازی تم و قالب گرافیکی",
        "گزارش‌گیری دقیق بازدیدها"
      ];

      if (item.time >= 360) {
        baseFeatures.push("بهینه‌سازی پیشرفته سئو (SEO)");
        baseFeatures.push("پشتیبانی ویژه و اولویت‌دار VIP");
      }

      return baseFeatures;
    }
  }
};
</script>

<style scoped>
.pricing-half-widget {
  background-color: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.8) !important;
  box-shadow: 0 4px 20px rgba(34, 41, 47, 0.05) !important;
    border-radius: 8px !important;

}

.avatar-badge {
  background-color: rgba(115, 103, 240, 0.1) !important;
}

.title-section {
  display: flex;
  flex-direction: column;
}

.widget-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
}

.widget-subtitle {
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 400;
  line-height: 1.4;
}

.select-container {
  min-width: 170px;
  max-width: 210px;
  flex: 1;
}

.custom-autocomplete ::v-deep .v-input__control {
  min-height: 38px !important;
}

.custom-autocomplete ::v-deep .v-input__slot {
  min-height: 38px !important;
  padding: 0 12px !important;
  border-color: #e2e8f0 !important;
}

.select-selection-text {
  font-size: 0.84rem;
  font-weight: 600;
  color: #334155;
}

.time-tab-btn {
  height: 32px !important;
}

.tab-text {
  font-size: 0.8rem;
  letter-spacing: normal;
}

.border-divider {
  border-color: #f1f5f9 !important;
}

.plan-badge {
  font-size: 0.78rem !important;
  border-radius: 8px !important;
}

.price-value {
  font-size: 1.55rem;
  line-height: 1;
  font-family: inherit;
}

.price-currency {
  font-size: 0.82rem;
  color: #64748b;
  font-weight: 500;
}

.features-box {
  background-color: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
}

.feature-text {
  font-size: 0.82rem;
  color: #334155;
  font-weight: 500;
}
</style>
