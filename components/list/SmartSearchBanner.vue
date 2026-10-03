<template>
  <div class="smart-banner-wrapper mt-2 mb-0 px-2 px-md-0 w-100">
    <div class="glass-banner elevation-0 py-2 px-4 px-sm-6 text-center mx-0 w-100 position-relative">
      
      <!-- عنوان -->
      <div class="d-flex align-center justify-center mb-4">
        <h3 class="banner-title text-sm-h6 font-weight-black mb-0">کیوآر بساز</h3>
        <span class="banner-subtitle mr-2 text-body-2 font-weight-medium d-none d-sm-inline">| جستجو کن یا از دسته‌بندی انتخاب کن</span>
      </div>

      <!-- جستجو -->
      <div class="search-box-container mx-auto mb-4" style="max-width: 800px;">
        <v-text-field
          v-model="searchQuery"
          @keyup.enter="openSearchDialog"
          @click:prepend-inner="openSearchDialog"
          placeholder="مثال: کیوآری برای معرفی من در شبکه اجتماعی..."
          prepend-inner-icon="mdi-magnify"
          clearable
          dense
          hide-details
          solo
          flat
          class="custom-glass-search py-2"
        ></v-text-field>
      </div>

      <!-- چیپ‌های دسته‌بندی -->
      <div class="category-filter-row d-flex align-center mb-4 mx-auto pb-2" style="max-width: 100%;">
        <button
          v-for="cat in qrCategories"
          :key="cat.id"
          class="category-chip flex-shrink-0"
          :class="{ 'category-chip--active': selectedCategory === cat.id }"
          :style="selectedCategory === cat.id ? { backgroundColor: cat.color + '15', borderColor: cat.color, color: cat.color } : {}"
          @click="selectCategory(cat.id)"
        >
          <v-icon 
            small 
            class="mr-1" 
            :color="selectedCategory === cat.id ? cat.color : '#64748b'"
          >
            {{ cat.icon }}
          </v-icon>
          <span class="font-weight-bold">{{ cat.label }}</span>
        </button>
      </div>

    <!-- اسلایدر -->
<div class="featured-slider-box d-flex align-center justify-center mx-auto" style="max-width: 95%;">
  <v-btn 
    icon 
    class="slider-nav-btn mx-1 elevation-1 d-none d-sm-flex" 
    @click="manualScroll('right')"
  >
    <v-icon color="#475569">mdi-chevron-right</v-icon>
  </v-btn>

  <v-slide-group 
    v-model="sliderIndex"
    ref="sliderRef"
    class="py-2 w-100 custom-slide-group" 
    :show-arrows="false"
  >
    <v-slide-item 
      v-for="(item, i) in displayItems" 
      :key="item.route"
    >
      <v-tooltip bottom color="rgba(15, 23, 42, 0.95)" transition="slide-y-transition">
        <template v-slot:activator="{ on: tooltipOn, attrs: tooltipAttrs }">
          <div class="slide-card-container mx-1 mx-sm-2 py-2 d-flex flex-column align-center">
            <v-card
              v-bind="tooltipAttrs"
              v-on="tooltipOn"
              class="category-app-card d-flex align-center justify-center position-relative"
              height="54"
              width="54"
              rounded="xl"
              @click="goToRoute(item.route)"
              :style="{
                background: `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})`,
                boxShadow: `0 8px 16px ${item.colors[0]}40`
              }"
            >
              <!-- تاج Pro -->
              <v-icon v-if="item.pro" class="integrated-crown" size="14">mdi-crown</v-icon>

              <img v-if="item.image" :src="item.image" width="28" height="28" style="object-fit: contain;" />
              <v-icon v-else color="#ffffff" size="26">{{ item.icon }}</v-icon>
            </v-card>

            <span class="mobile-item-label mt-1 text-center d-block d-sm-none">
              {{ item.nameKey ? $t(item.nameKey) : item.name }}
            </span>
          </div>
        </template>
        <span class="font-weight-bold">{{ item.nameKey ? $t(item.nameKey) : item.name }}</span>
      </v-tooltip>
    </v-slide-item>
  </v-slide-group>

  <v-btn 
    icon 
    class="slider-nav-btn mx-1 elevation-1 d-none d-sm-flex" 
    @click="manualScroll('left')"
  >
    <v-icon color="#475569">mdi-chevron-left</v-icon>
  </v-btn>
</div>

      <div class="mt-3">
        <v-btn 
          text 
          rounded 
          class="modern-show-all-btn font-weight-bold px-4" 
          color="primary"
          @click="$emit('show-all')"
        >
          <span>نمایش همه کیوآرها</span>
          <v-icon small right class="mr-1">mdi-arrow-left</v-icon>
        </v-btn>
      </div>
    </div>
    <!-- پاپ‌آپ نتایج جستجو -->
    <custom-popup
      v-model="searchDialog"
      :cons="{ title: 'نتایج جستجو', icon: 'search-web' }"
      hide-confirm
      width="95%"
      max-width="500"
      transition="dialog-bottom-transition"
      @close="searchDialog = false"
    >
      <v-card flat class="rounded-xl">
        <v-card-text class="pt-4 px-3 px-sm-6">
          <template v-if="searchResults.length > 0">
            <p class="mb-3 text-subtitle-2 text-right">بهترین پیشنهادها:</p>
            <v-list class="py-0">
              <v-list-item
                v-for="(result, index) in searchResults"
                :key="index"
                class="mb-2 rounded-lg elevation-1"
                style="border: 1px solid #eee;"
              >
                <!-- آواتار نتایج مشابه دکمه‌های اصلی -->
                <v-list-item-avatar rounded size="44" class="mr-0 ml-3">
                  <div 
                    class="d-flex align-center justify-center rounded-lg position-relative w-100 h-100"
                    :style="{ background: `linear-gradient(135deg, ${result.item.colors[0]}, ${result.item.colors[1]})` }"
                  >
                    <!-- تاج Pro یکپارچه در جستجو -->
                    <v-icon v-if="result.item.pro" class="integrated-crown2" size="12">mdi-crown</v-icon>
                    
                    <img v-if="result.item.image" :src="result.item.image" width="24" height="24" style="object-fit: contain;" />
                    <v-icon v-else color="#ffffff" size="24">{{ result.item.icon }}</v-icon>
                  </div>
                </v-list-item-avatar>

                <v-list-item-content class="py-0 text-right">
                  <v-list-item-title class="font-weight-bold text-body-2">
                    {{ result.item.nameKey ? $t(result.item.nameKey) : result.item.name }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action class="my-0">
                  <v-btn small depressed class="btn-get-code rounded-lg" @click="goToRoute(result.item.route)">
                    ساخت
                    <v-icon right small>mdi-arrow-left</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>

          </template>

          <template v-else>
            <div class="text-center py-4">
              <v-icon size="48" color="grey lighten-1" class="mb-2">mdi-magnify-close</v-icon>
              <h4 class="grey--text text--darken-2 mb-1">موردی پیدا نشد!</h4>
              <p class="grey--text text-caption mb-4">آیا کیوآر خاصی مد نظر شماست؟</p>
              
              <v-divider class="my-3"></v-divider>
              
              <div class="rounded-lg pa-3" style="background-color: #f0f8ff;">
                <p class="mb-2 font-weight-bold text-primary text-caption">نیاز به راهنمایی یا ساخت کیوآر اختصاصی دارید؟</p>
                <span>
                  <v-icon right color="red" small>mdi-phone-outline</v-icon>
                  گفتگو با پشتیبانی: 02191017077
                </span>
              </div>
            </div>
          </template>
        </v-card-text>
      </v-card>
    </custom-popup>
  </div>
</template>

<script>
import Fuse from "fuse.js";
import persianJs from "persianjs";
import { activeQRCategories, qrCategories, stopWords } from "../../assets/js/layout/searchIntents.js"; 

export default {
  name: "SmartSearchBanner",
  data() {
    return {
      searchQuery: "",
      searchResults: [],
      activeQRCategories,
      qrCategories,
      selectedCategory: null,
      fuseInstance: null,
      searchDialog: false,
      sliderIndex: 0
    };
  },
  computed: {
        displayItems() {
      if (!this.selectedCategory) return this.activeQRCategories;
      
      return this.activeQRCategories.filter(item => {
        const cat = this.qrCategories.find((c) => c.id === this.selectedCategory);
        if (!cat) return false;
        const itemCats = Array.isArray(item.categories) ? item.categories : [];
        return cat.matches.some((m) => itemCats.includes(m));
      });
    },
    sortedActiveItems() {
      if (!this.selectedCategory) return this.activeQRCategories;
      const matched = this.activeQRCategories.filter((item) =>
        this.itemMatchesCategory(item, this.selectedCategory)
      );
      const rest = this.activeQRCategories.filter(
        (item) => !this.itemMatchesCategory(item, this.selectedCategory)
      );
      return [...matched, ...rest];
    },
  },
   mounted() {
    const options = {
      includeScore: true,
      threshold: 0.35, 
      ignoreLocation: true,
      keys: [
        { name: "keywords", weight: 0.7 },
        { name: "name", weight: 0.3 }
      ]
    };
    this.fuseInstance = new Fuse(this.activeQRCategories, options);

    // رفع باگ خالی شدن اسلایدر در هنگام تغییر سایز صفحه
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    manualScroll(direction) {
    if (!this.$refs.sliderRef) return;
    
    // المان داخلی اسکرول‌شونده ویوتیفای
    const wrapper = this.$refs.sliderRef.$el.querySelector('.v-slide-group__wrapper');
    if (!wrapper) return;
    const step = 200; 
    const isRtl = this.$vuetify.rtl;

    let offset = 0;
    if (direction === 'left') {
      offset = isRtl ? -step : step;
    } else {
      offset = isRtl ? step : -step;
    }

    wrapper.scrollBy({
      left: offset,
      behavior: 'smooth'
    });
  },
        slideLeft() {
      if (this.$refs.sliderRef) {
        if (typeof this.$refs.sliderRef.scrollTo === "function") {
          this.$refs.sliderRef.scrollTo("prev");
        }
      }
    },
    slideRight() {
      if (this.$refs.sliderRef) {
        if (typeof this.$refs.sliderRef.scrollTo === "function") {
          this.$refs.sliderRef.scrollTo("next");
        }
      }
    },

    handleResize() {
      if (this.$refs.sliderRef) {
        if (typeof this.$refs.sliderRef.setWidths === "function") {
          this.$refs.sliderRef.setWidths();
        }
      }
    },
    selectCategory(categoryId) {
      this.selectedCategory = this.selectedCategory === categoryId ? null : categoryId;
      this.sliderIndex = 0;
      this.$nextTick(() => {
        if (this.$refs.sliderRef) {
          if (typeof this.$refs.sliderRef.setWidths === "function") {
            this.$refs.sliderRef.setWidths();
          }
          this.$refs.sliderRef.scrollOffset = 0; 
        }
      });
    },
    itemMatchesCategory(item, catId) {
      const cat = this.qrCategories.find((c) => c.id === catId);
      if (!cat) return false;
      const itemCats = Array.isArray(item.categories) ? item.categories : [];
      return cat.matches.some((m) => itemCats.includes(m));
    },

    getWrapperStyle(item) {
      if (!this.selectedCategory || this.itemMatchesCategory(item, this.selectedCategory)) {
        return {
          opacity: "1",
          transform: "scale(1)",
          transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
        };
      }
      return {
        opacity: "0.32",
        transform: "scale(0.9)",
        transition: "all 0.3s ease"
      };
    },

  cleanInput(text) {
    if (!text) return "";
    
    let cleaned = text
      .toLowerCase() // تبدیل انگلیسی به حروف کوچک
      .replace(/ي/g, "ی") // اصلاح ی عربی
      .replace(/ك/g, "ک") // اصلاح ک عربی
      .replace(/[\u200C]/g, " ") // تبدیل نیم‌فاصله به فاصله (کارت‌ویزیت -> کارت ویزیت)
      .replace(/\s+/g, " ") // تبدیل چند فاصله به یک فاصله
      .trim();

    if (stopWords && stopWords.length > 0) {
      const regex = new RegExp(`(?:^|\\s)(${stopWords.join('|')})(?=\\s|$)`, 'gi');
      cleaned = cleaned.replace(regex, ' ');
      cleaned = cleaned.replace(/\s+/g, " ").trim();
    }

    if (typeof persianJs !== 'undefined') {
      cleaned = persianJs(cleaned).arabicChar().englishNumber().toString();
    }
    return cleaned;
  },

  openSearchDialog() {
    if (!this.searchQuery || this.searchQuery.length < 2) return;
    
    const optimizedQuery = this.cleanInput(this.searchQuery);
    
    const finalQuery = optimizedQuery.length > 0 ? optimizedQuery : this.cleanInput(this.searchQuery.replace(new RegExp(`\\b(${stopWords.join('|')})\\b`, 'gi'), ''));
    
    const rawResults = this.fuseInstance.search(finalQuery);
    this.searchResults = rawResults.slice(0, 4);
    this.searchDialog = true;
  },

    goToRoute(routeName) {
      this.searchDialog = false;
      if (this.$route.name !== routeName) {
        this.$router.push({ name: routeName });
      }
    },

    openGoftino() {
      this.searchDialog = false;
      if (window.Goftino) {
        window.Goftino.open();
      } else {
        window.open('https://goftino.com/c/7WvGxT', '_blank');
      }
    }
  }
};
</script>

<style scoped>
/* کانتینر گلس‌مورفیسم */
.glass-banner {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04) !important;
  border-radius: 10px !important;
  max-width: 100%;
}

/* عناوین */
.banner-title {
  color: #0f172a;
  letter-spacing: -0.3px;
}

.banner-subtitle {
  color: #64748b;
}


/* اینپوت شیشه‌ای */
.custom-glass-search {
  background-color: rgba(255, 255, 255, 0.9) !important;
  /* border: 1px solid rgba(255, 255, 255, 0.95) !important; */
  border-radius: 16px !important;
  transition: all 0.25s ease;
  box-sizing: border-box;
}

.custom-glass-search:hover,
.custom-glass-search:focus-within {
  background-color: #ffffff !important;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08) !important;
}

::v-deep .custom-glass-search input {
  color: #1e293b !important;
  font-weight: 500;
}

::v-deep .custom-glass-search input::placeholder {
  color: #64748b !important;
  opacity: 1 !important;
}

::v-deep .custom-glass-search .v-icon {
  color: #007991 !important;
}
::v-deep .custom-glass-search .v-input__control .v-input__slot {
  background-color: rgba(255, 255, 255, 0.9) !important;
  border-radius: 16px !important;
  /* padding: 4px 16px !important; */
  /* box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important; */
  /* border: 1px solid rgba(226, 232, 240, 0.6); */
  transition: all 0.3s ease;

}

::v-deep .custom-glass-search.v-input--is-focused .v-input__control .v-input__slot {
  background-color: #ffffff !important;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
  border-color: #cbd5e1;
}

.category-filter-row {
  gap: 8px;
}

.category-chip {
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  background: rgba(255, 255, 255, 0.7);
  border: 1.5px solid transparent;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);

}

.category-chip:hover {
  background: #ffffff;
  transform: translateY(-1px);
}

.category-chip--active {
  background: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-1px);
}

/* اسلایدر */
.featured-slider-box {
  width: 100%;
  overflow: hidden;
}

::v-deep .v-slide-group__content {
  align-items: center;
  height: 75px;
}

::v-deep .v-slide-group__wrapper {
  overflow: hidden !important;
  touch-action: pan-y;
}

/* دکمه‌های ناوبری اسلایدر */
.slider-nav-btn {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  transition: all 0.2s ease;
  z-index: 2;
  width: 36px !important;
  height:36px !important;
}

.slider-nav-btn:hover {
  background: #f8fafc !important;
  transform: scale(1.1);
}

::v-deep .v-slide-group__prev,
::v-deep .v-slide-group__next {
  display: none !important;
  min-width: 0 !important;
  width: 0 !important;
  flex: 0 0 0 !important;
  padding: 0 !important;
  margin: 0 !important;
}

@media (min-width: 600px) {
  ::v-deep .v-slide-group__prev,
  ::v-deep .v-slide-group__next {
    display: flex !important;
    min-width: 36px !important;
    flex: 0 0 36px !important;
  }
}

/* کارت‌های اپلیکیشن */
.category-app-card {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  cursor: pointer;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
}

.category-app-card:hover {
  transform: translateY(-6px) scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2) !important;
}

/* نشان پرو */
.pro-crown-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #1e293b;
  border: 1.5px solid #FFffff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  z-index: 3;
}

/* دکمه نمایش همه */
.modern-show-all-btn {
    letter-spacing: normal;
  text-transform: none !important;
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  transition: all 0.2s ease;
}

.modern-show-all-btn:hover {
  background-color: rgba(0, 0, 0, 0.03);
  background: #f8fafc !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1) !important;
}
.integrated-crown {
  position: absolute;
  top: 4px;
  left: 9px; 
  color: #ffffff !important;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.35));
  transform: rotate(-0deg); 
  z-index: 3;
}
.integrated-crown2 {
  position: absolute;
  top: -12px;
  left: -8px; 
  color: #ffffff !important;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.35));
  transform: rotate(-0deg); 
  z-index: 3;
}

.w-100 { width: 100% !important; }
.h-100 { height: 100% !important; }
.category-filter-row {
  gap: 8px;
  overflow-x: auto;
  flex-wrap: nowrap; 
  scrollbar-width: none; 
  -webkit-overflow-scrolling: touch; 
  padding-right: 4px;
}

.category-filter-row::-webkit-scrollbar {
  display: none;
}

@media (min-width: 600px) {
  .category-filter-row {
    flex-wrap: wrap;
    justify-content: center;
    overflow-x: visible;
  }
}

.category-chip {
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  background: rgba(255, 255, 255, 0.7);
  border: 1.5px solid transparent;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}
.slide-card-container {
  width: 76px !important;
  min-width: 76px !important;
  max-width: 76px !important;
  user-select: none;
}

.mobile-item-label {
  font-size: 11px !important;
  font-weight: 600 !important;
  color: #334155 !important;
  width: 100% !important;
  line-height: 1.3 !important;
  text-align: center !important;
  white-space: normal !important;
  word-wrap: break-word !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
  height: 30px !important;
}

::v-deep .v-slide-group__content {
  align-items: flex-start !important;
  height: 110px !important;
  padding-top: 4px !important;
}

@media (min-width: 600px) {
  .slide-card-container {
    width: auto !important;
    min-width: unset !important;
    max-width: unset !important;
  }

  .mobile-item-label {
    display: none !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  ::v-deep .v-slide-group__content {
    align-items: center !important;
    height: 75px !important;
    padding-top: 0 !important;
  }
}
</style>
