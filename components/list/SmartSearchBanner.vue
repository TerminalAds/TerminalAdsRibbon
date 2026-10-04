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
      <div class="category-filter-row d-flex align-center mb-0 mx-auto pb-2" style="max-width: 100%;">
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
          <span>همه کیوآرها</span>
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
              <p class="grey--text mb-4">آیا کیوآر خاصی مد نظر شماست؟</p>
              
              <v-divider class="my-3"></v-divider>
              
                           <div class="rounded-lg pa-3 text-center" style="background-color: #f0f8ff;">
                <p class="mb-2 font-weight-bold text-primary text-caption">نیاز به راهنمایی یا ساخت کیوآر اختصاصی دارید؟</p>
                <div class="mb-3 d-flex align-center justify-center font-weight-medium text-body-2 text-dark">
                  <v-icon right color="red" small class="ml-1">mdi-phone-outline</v-icon>
                  گفتگو با پشتیبانی: 02191017077
                </div>
                
                <!-- دکمه‌های شبکه‌های اجتماعی -->
                <div class="d-flex justify-center align-center flex-wrap" style="gap: 10px;">
                  <a
                    v-for="item in supportSocials"
                    :key="item.id"
                    :href="item.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="social-squircle-small"
                    :class="item.bgClass"
                  >
                    <div class="svg-icon-wrap-small" v-html="item.svg"></div>
                  </a>
                </div>
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
            supportSocials: [
        {
          id: "telegram",
          link: "https://t.me/qrland999",
          bgClass: "bg-tele",
          svg: `<svg viewBox="0 0 24 24"><path fill="#ffffff" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
        },
        {
          id: "whatsapp",
          link: "https://wa.me/qrland999",
          bgClass: "bg-wa",
          svg: `<svg viewBox="0 0 24 24"><path fill="#ffffff" d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>`,
        },
        {
          id: "rubika",
          link: "https://rubika.ir/qrland999",
          bgClass: "bg-rubika",
          svg: `<svg viewBox="0 0 48.4 48.3"><path fill="#ffffff" d="M20.1 1.4c1.3-.7 2.7-1.3 4.2-1.3 0 2.8 0 5.6 0 8.4 0 1 0 2 0 2.9C22.7 10.6 21 9.9 19.4 9c-2.4-1.2-4.7-2.4-7.1-3.6C14.9 4.1 17.5 2.8 20.1 1.4z"/><path fill="#ffffff" d="M24.3.1c1.8 0 3.3.9 4.8 1.6 2.4 1.2 4.7 2.4 7.1 3.7-3.3 1.7-6.6 3.3-10 5-.7.4-1.4.6-2 1 0-1 0-2 0-2.9C24.3 5.8 24.3 2.9 24.3.1z"/><path fill="#ffffff" d="M36.2 5.4c0 4.1.1 8.3 0 12.4-4-2.1-8-4.2-11.9-6.4.6-.4 1.3-.7 2-1 3.3-1.6 6.6-3.3 9.9-5z"/><path fill="#ffffff" d="M4.2 9.7c2.7-1.4 5.4-2.8 8-4.2 0 4.1 0 8.3 0 12.4-1.2-.5-2.4-1.2-3.6-1.8-2.5-1.3-5.1-2.5-7.6-3.9 1.8-1.1 3-1.9 4.2-2.5z"/><path fill="#ffffff" d="M12.3 5.5c2.4 1.1 4.7 2.3 7.1 3.5 1.6.8 3.3 1.6 4.9 2.5-3.9 2.1-7.9 4.2-11.8 6.3 0-4.1 0-8.2-.2-12.3z"/><path fill="#ffffff" d="M36.3 5.5c2.6 1.3 5.2 2.7 7.8 4.1 1.3.7 2.7 1.4 3.4 2.7-3.7 1.9-7.4 3.8-11.2 5.6 0-4.2 0-8.3-.1-12.4z"/><path fill="#ffffff" d="M.5 14.1c.1-.6.3-1.3.7-1.9 2.5 1.3 5 2.6 7.6 3.8 1.2.6 2.4 1.2 3.6 1.8-4 2.1-8 4.3-12 6.4 0-2.1 0-4.2 0-6.3.1-1.2 0-2.5.3-3.8z"/><path fill="#ffffff" d="M36.3 17.9c3.7-1.9 7.4-3.8 11.1-5.6.5.9.7 2 .8 3.1 0 3 0 6 0 9h-.1c-.2-.2-.6-.4-.8-.5-3.6-2.1-7.3-4-11-6z"/><path fill="#ffffff" d="M36.2 17.9c3.8 2 7.4 4 11.1 5.9.3.2.6.3.8.5-4 2-8 4.1-12 6 0-4.1 0-8.3.1-12.4z"/><path fill="#ffffff" d="M.3 24.3c4-2.1 8-4.3 12-6.4 0 4.1 0 8.3 0 12.5-2.4-1.1-4.7-2.4-7.1-3.6C3.6 25.9 1.9 25.1.3 24.3z"/><path fill="#ffffff" d="M.3 24.3c1.6.8 3.2 1.6 4.9 2.5 2.4 1.2 4.7 2.4 7.1 3.6-3.7 2-7.4 3.9-11 5.9-.7-1-.9-2.2-.9-3.3-.1-2.2 0-4.5 0-6.7.1-1.5 0-2.1.1-2.7z"/><path fill="#ffffff" d="M36.2 30.4c4-2 8-4 12-6h.1c0 2.5 0 5.1 0 7.6 0 1.5-.1 3-1-4.3-3.2-1.7-6.3-3.4-9.5-5.1-.5-.7-1-1-1.6-1.2z"/><path fill="#ffffff" d="M1.2 36.2c3.7-2 7.4-3.9 11-5.9 0 4.2 0 8.3 0 12.5-2.1-1.1-4.2-2.2-6.3-3.3-.9-.5-1.7-.9-2.6-1.4-.7-.5-1.5-1.1-2.1-1.9z"/><path fill="#ffffff" d="M12.3 30.4c4 2 8 4.1 12 6.1-4 2.1-8 4.3-12 6.4 0-4.2 0-8.4 0-12.5z"/><path fill="#ffffff" d="M24.3 36.4c4-2 8-4 12-6 0 4.2 0 8.3 0 12.5-4.1-2.2-8-4.3-12-6.5z"/><path fill="#ffffff" d="M36.2 30.4c.5.2 1.1.6 1.6.8 3.2 1.7 6.3 3.4 9.5 5.1-.5.8-1.3 1.3-2.1 1.8-1.2.7-2.5 1.4-3.8 2-1.7.9-3.5 1.8-5.2 2.7 0-4.1.1-8.3 0-12.4z"/><path fill="#ffffff" d="M12.3 42.8c4-2.1 8-4.3 12-6.4 0 3.9 0 7.8 0 11.7-1 0-2-.3-2.9-.7-3.1-1.6-6.1-3.1-9.1-4.6z"/><path fill="#ffffff" d="M24.3 36.4c4 2.1 8 4.2 11.9 6.4-1.3.7-2.7 1.4-4 2.1-1.8.9-3.6 1.8-5.4 2.8-.8.3-1.6.5-2.5.5 0-3.9 0-7.8 0-11.8z"/><path fill="#ffffff" opacity="0.95" d="M24.2 24.1c-1.2-.6-2.3-1.1-3.4-1.7-.8-.4-1.6-.8-2.4-1.2-.9-.5-1.8-.9-2.6-1.3-1.1-.6-2.3-1.1-3.4-1.7L12.3 18c2-1.1 9.9-5.3 11.8-6.3 2.1 1.1 4.2 2.3 6.3 3.4 1.9 1 3.7 2 5.6 3-2.5 1.3-5.1 2.6-7.7 3.9-1.5.7-2.9 1.4-4.3 2.2l.2-.1z"/><path fill="#ffffff" opacity="0.8" d="M12.2 30.4c0-2.8 0-5.5 0-8.3l0-4.1.1-.1.2-.1.2.1v.1c1.3.7 2.7 1.4 4.1 2.1l1.9.9c.8.4 1.6.8 2.4 1.2 1.1.6 2.3 1.2 3.4 1.7l.1.1 0 4.2c0 2.8 0 5.5 0 8.3l-.2.1-11.8-6.2z"/><path fill="#ffffff" opacity="0.9" d="M24.1 36.4c0-3.4 0-6.9 0-10.3l0-2.1.1-.1c1.4-.7 2.9-1.5 4.3-2.2 2.5-1.3 5.1-2.6 7.6-3.9l.2.1v12.5l-.1.1c-2 1-4 2-5.9 3-2 1-4 2-6 3l-.2-.1z"/></svg>`,
        },
        {
          id: "eitaa",
          link: "https://eitaa.com/qrland999",
          bgClass: "bg-eitaa",
          svg: `<svg viewBox="0 0 48 48"><path fill="#ffffff" d="m9.67.49C11.52-.15,13.51.05,15.44.02c6.27,0,12.54,0,18.81,0,4.34-.24,8.63,1.98,11.13,5.4,1.72,2.22,2.68,5,2.62,7.79-.02,2.2,0,4.41,0,6.61-.04.3.06.73-.29.89-2.17,1.35-3.82,3.32-5.64,5.08-3.33,3.29-6.65,6.96-11.25,8.55-2.52.97-5.29.78-7.85.11-.74,1.59-1.13,3.34-1.17,5.09-2.64-.51-4.97-2.39-6-4.81-.55-1.08-.58-2.3-.78-3.46-.63-.64-1.37-1.18-1.87-1.93-1.31-1.81-1.6-4.28-.68-6.31,1.51-3.42,4.6-5.96,7.99-7.54,2.94-1.45,6.29-2.31,9.59-1.88,2.41.36,4.82,1.67,5.92,3.88.31.58-.13,1.18-.48,1.63-.96,1.09-2.32,1.76-3.67,2.3-2.5.94-5.21,1.51-7.9,1.19-1.12-.18-2.35-.59-2.99-1.57-.55-.87-.35-1.94-.27-2.9-1.86.49-3.09,2.27-3.51,4.03-.42,1.62.45,3.24,1.65,4.3-.81,1.21-1.71,2.44-1.89,3.92-.45,2.83,1.17,5.69,3.68,7.09.05-2.42,1.22-4.76,3.09-6.32,3.6-3.09,8.55-3.96,12.34-6.77,2.53-1.9,3.77-5.05,3.96-8.09.15-2.56-.25-5.27-1.77-7.42-2.11-3.21-6.18-4.86-10-4.62-3.16.08-6.12,1.42-8.75,3.05-5.3,3.45-9.33,8.66-11.39,14.53-1.4,3.88-1.96,8.17-.88,12.19.93,3.75,3.67,7.04,7.27,8.64,4.4,2.12,9.74,2.37,14.28.52,3.86-1.59,6.97-4.48,9.59-7.61,2.56-2.95,4.69-6.22,7.19-9.21.72-.83,1.41-1.75,2.43-2.24.04,2.96,0,5.91.02,8.87,0,1.42.08,2.85-.22,4.26-.71,3.36-2.75,6.44-5.66,8.37-1.97,1.3-4.27,2.15-6.64,2.36-7.08.02-14.16,0-21.24.01-3.57.18-7.19-1.17-9.8-3.55C1.59,41.91-.1,38.16,0,34.4c0-7.14,0-14.29,0-21.44C.03,7.35,4.18,2.08,9.67.49Z"/></svg>`,
        },
        {
          id: "bale",
          link: "https://ble.ir/qrland999",
          bgClass: "bg-bale",
          svg: `<svg viewBox="0 0 48 48"><path fill="#ffffff" d="m47.93,22.35C46.76,3.71,25.03-6.45,9.95,4.53c-1.8-1.35-3.61-2.71-5.52-3.9C3.61.06,2.54-.22,1.6.22-.37,1.07.05,3.05.02,4.8c-.01,6.55,0,13.11,0,19.66.12,15.28,15.28,26.73,30.02,22.74,10.97-2.72,18.81-13.58,17.9-24.85Zm-10.49-.85c-3.28,3.27-6.55,6.55-9.83,9.82-1.03,1.03-2.07,2.07-3.1,3.1-.74.81-1.66,1.48-2.75,1.69-1.49.33-3.13-.12-4.23-1.19-.38-.45-7.59-7.51-7.82-7.85-.52-.62-.87-1.38-1.01-2.18-.66-3.19,2.54-6.21,5.69-5.37,2.04.3,4.89,4.14,6.38,5.38,2.66-2.66,5.32-5.32,7.98-7.98,1.24-1.13,2.26-2.54,3.7-3.43,5.28-2.61,9.54,4.31,4.99,8Z"/></svg>`,
        }
      ],
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
/* استایل دکمه‌های شبکه‌های اجتماعی در پاپ‌آپ */
.social-squircle-small {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.social-squircle-small:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.svg-icon-wrap-small {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
}

.svg-icon-wrap-small >>> svg {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

.bg-tele { background: linear-gradient(135deg, #2aabee 0%, #229ed9 100%); }
.bg-wa { background: linear-gradient(135deg, #25d366 0%, #128c7e 100%); }
.bg-rubika { background: linear-gradient(135deg, #ff8000 0%, #e65100 100%); }
.bg-eitaa { background: linear-gradient(135deg, #ff7043 0%, #d84315 100%); }
.bg-bale { background: linear-gradient(135deg, #1eb686 0%, #00897b 100%); }

</style>
