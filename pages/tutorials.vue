<template>
  <v-card flat class="pa-2 pb-10">

    <!--        <v-carousel height="200" hide-delimiters :show-arrows="columns < guidence.length" v-model="carouselModel">-->
    <!--            <template v-for="(item, index) in guidence.length">-->
    <!--                <v-carousel-item class="p-5 " v-if="(index + 1) % columns === 1 || columns === 1" :key="index">-->
    <!--                    <v-row class="flex-nowrap" no-gutters>-->
    <!--                        <template v-for="(n, i) in columns">-->
    <!--                            <template v-if="(+index + i) < guidence.length">-->
    <!--                                <div class="col-md-2 text-center cardStyle my-4 mx-5 pa-2"-->
    <!--                                     :class="activeProject === guidence[index+i].value ? ' cardActive' : '' "-->
    <!--                                     @click="getPages(guidence[index + i].sid,guidence[index + i].value)">-->
    <!--                                    <img :src="guidence[index + i].img" alt="" style="width: 50px">-->
    <!--                                    <p class="mt-4 font-weight-bold">{{ guidence[index + i].name }}</p>-->
    <!--                                </div>-->
    <!--                            </template>-->
    <!--                        </template>-->
    <!--                    </v-row>-->
    <!--                </v-carousel-item>-->
    <!--            </template>-->
    <!--        </v-carousel>-->

    <div class="swiper mySwiper pa-4">
      <div class="swiper-wrapper">

        <div class="swiper-slide" style="user-select: none" v-for="(item, i) in guidence" :key="i">
          <div class="text-center cardStyle pa-2"
               :class="activeProject === item.value ? ' cardActive' : ''"
               @click="getPages(item.sid, item.value)">
            <img :src="item.img" alt="" style="width: 50px">
            <p class="mt-4 font-weight-bold">{{ item.name }}</p>
          </div>
        </div>
      </div>
      <div class="swiper-button-prev d-none d-md-block">
        <v-btn fab depressed small>
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
      <div class="swiper-button-next d-none d-md-block">
        <v-btn fab depressed small>
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </div>
    </div>

    <v-row no-gutters justify="center">
      <v-col cols="12" md="3" class="pa-2">
        <v-card flat class="transparent" style="position: sticky;top: 78px">
          <v-btn @click="goTo(x.id,x.slug)" :key="x.slug" v-for="(x, index) in pages"
                 :class="{'bg-indigo btnActive' : isActive === x.slug}"
                 class="font-weight-bold btnStyles bg-white mb-2 col-md text-center"
                 style="border-color: navy!important;letter-spacing: unset">
            {{ x.name }}
          </v-btn>
        </v-card>
      </v-col>

      <v-col cols="12" md="8" class="pa-0 pa-md-2">
        <v-card class="cardMine" min-height="230" style="position: sticky; top: 78px">
          <v-card-title class="sticky-top align-center popup-title pa-2 pa-md-4">
            <tabs-tutorial v-model="tabModel" :tab-items="tabItems"/>
            <v-progress-linear v-show="!tutorials && showLoading" indeterminate color="primary"/>
          </v-card-title>

          <v-card-text class="px-0">
            <items-tutorial v-model="tabModel" :items.sync="tabItems" no-call :called-tuts="tutorials"/>
          </v-card-text>

          <v-speed-dial direction="top" absolute left bottom transition="slide-y-reverse-transition">
            <template v-slot:activator>
              <v-btn dark fab bottom small color="indigo">
                <v-icon>mdi-phone</v-icon>
              </v-btn>
            </template>
            <v-btn small class="text-white font-weight-bold" color="green" target="_blank"
                   href="https://wa.me/982191017077">
              <v-icon class="ml-2">mdi-whatsapp</v-icon>
              ارتباط در واتساپ
            </v-btn>
            <v-btn small class="text-white px-5 font-weight-bold" color="primary" href="tel:021-91017077">
              <v-icon class="ml-2">mdi-phone</v-icon>
              {{ persianNum('021-91017077') }}
            </v-btn>
            <v-btn small class="text-white text-dark px-7 font-weight-bold" color="warning"
                   href="https://core.terminalads.com/#/tickets/create" target="_blank">
              <v-icon class="ml-2">mdi-chat</v-icon>
              ثبت تیکت
            </v-btn>
          </v-speed-dial>
        </v-card>
      </v-col>
    </v-row>
    <!--        <div class="col-md-3">-->
    <!--            &lt;!&ndash; v-if="ribbon_can(x.gate)" &ndash;&gt;-->
    <!--            <v-btn-->
    <!--                    :class="isActive===x.slug ?'font-weight-bold bg-indigo mb-2 col-md text-center btnActive rounded' : 'font-weight-bold btnStyles bg-white mb-2 col-md text-center rounded' "-->
    <!--                    style="border-color: navy!important;letter-spacing: unset">-->

    <!--            </v-btn>-->
    <!--        </div>-->

    <!--        <div class="col-md cardMine pa-0">-->

    <!--        </div>-->

  </v-card>

  <!--      </div>-->
  <!--      <div class="swiper-button-prev d-none d-md-block">-->
  <!--        <v-btn fab depressed small>-->
  <!--          <v-icon>mdi-chevron-right</v-icon>-->
  <!--        </v-btn>-->
  <!--      </div>-->
  <!--      <div class="swiper-button-next d-none d-md-block">-->
  <!--        <v-btn fab depressed small>-->
  <!--          <v-icon>mdi-chevron-left</v-icon>-->
  <!--        </v-btn>-->
  <!--      </div>-->
  <!--    </div>-->

  <!--    <v-row no-gutters justify="center">-->
  <!--      <v-col cols="12" md="3" class="pa-2">-->
  <!--        <v-card flat class="transparent" style="position: sticky;top: 78px">-->
  <!--          <v-btn @click="goTo(x.id,x.slug)" :key="x.slug" v-for="(x, index) in pages"-->
  <!--                 :class="{'bg-indigo btnActive' : isActive === x.slug}"-->
  <!--                 class="font-weight-bold btnStyles bg-white mb-2 col-md text-center"-->
  <!--                 style="border-color: navy!important;letter-spacing: unset">-->
  <!--            {{ x.name }}-->
  <!--          </v-btn>-->
  <!--        </v-card>-->
  <!--      </v-col>-->

  <!--      <v-col cols="12" md="8" class="pa-0 pa-md-2">-->
  <!--        <v-card class="cardMine" min-height="230" style="position: sticky; top: 78px">-->
  <!--          <v-card-title class="sticky-top align-center popup-title pa-2 pa-md-4">-->
  <!--            <tabs-tutorial v-model="tabModel" :tab-items="tabItems"/>-->
  <!--            <v-progress-linear v-show="!tutorials && showLoading" indeterminate color="primary"/>-->
  <!--          </v-card-title>-->

  <!--          <v-card-text class="px-0">-->
  <!--            <items-tutorial v-model="tabModel" :items.sync="tabItems" no-call :called-tuts="tutorials"/>-->
  <!--          </v-card-text>-->

  <!--          <v-speed-dial direction="top" absolute left bottom transition="slide-y-reverse-transition">-->
  <!--            <template v-slot:activator>-->
  <!--              <v-btn dark fab bottom small color="indigo">-->
  <!--                <v-icon>mdi-phone</v-icon>-->
  <!--              </v-btn>-->
  <!--            </template>-->
  <!--            <v-btn small class="text-white font-weight-bold" color="green" target="_blank"-->
  <!--                   href="https://wa.me/982191017077">-->
  <!--              <v-icon class="ml-2">mdi-whatsapp</v-icon>-->
  <!--              ارتباط در واتساپ-->
  <!--            </v-btn>-->
  <!--            <v-btn small class="text-white px-5 font-weight-bold" color="primary" href="tel:021-91017077">-->
  <!--              <v-icon class="ml-2">mdi-phone</v-icon>-->
  <!--              {{ persianNum('021-91017077') }}-->
  <!--            </v-btn>-->
  <!--            <v-btn small class="text-white text-dark px-7 font-weight-bold" color="warning"-->
  <!--                   href="https://core.terminalads.com/#/tickets/create" target="_blank">-->
  <!--              <v-icon class="ml-2">mdi-chat</v-icon>-->
  <!--              ثبت تیکت-->
  <!--            </v-btn>-->
  <!--          </v-speed-dial>-->
  <!--        </v-card>-->
  <!--      </v-col>-->
  <!--    </v-row>-->
  <!--    &lt;!&ndash;        <div class="col-md-3">&ndash;&gt;-->
  <!--    &lt;!&ndash;            &lt;!&ndash; v-if="ribbon_can(x.gate)" &ndash;&gt;&ndash;&gt;-->
  <!--    &lt;!&ndash;            <v-btn&ndash;&gt;-->
  <!--    &lt;!&ndash;                    :class="isActive===x.slug ?'font-weight-bold bg-indigo mb-2 col-md text-center btnActive rounded' : 'font-weight-bold btnStyles bg-white mb-2 col-md text-center rounded' "&ndash;&gt;-->
  <!--    &lt;!&ndash;                    style="border-color: navy!important;letter-spacing: unset">&ndash;&gt;-->

  <!--    &lt;!&ndash;            </v-btn>&ndash;&gt;-->
  <!--    &lt;!&ndash;        </div>&ndash;&gt;-->

  <!--    &lt;!&ndash;        <div class="col-md cardMine pa-0">&ndash;&gt;-->

  <!--    &lt;!&ndash;        </div>&ndash;&gt;-->

  <!--  </v-card>-->
</template>
<script>
import TabsTutorial from "../components/tabsTutorial";
import ItemsTutorial from "../components/itemsTutorial";
import {FreeMode, Navigation, Swiper} from 'swiper';
import "swiper/swiper-bundle.min.css";

let swiper = null

export default {
  name: "tutorials",

  props: {
    loading: Boolean,
  },

  components: {ItemsTutorial, TabsTutorial},

  data() {
    return {
      carouselModel: null,
      showLoading: false,
      tab: 0,
      tabModel: 0,
      isActive: '',
      serverId: null,
      activeProject: 'terminal',
      guidence: [],
      guidList: [

        // {name: 'سامانه فروشگاه آنلاین شخصی', value: 'shopOnline'},
        // {name: 'سامانه تبلیغات در شبکه های اجتماعی', value: 'ads'},
        // {name: 'سامانه اجاره بیلبوردآنلاین', value: 'bilboard'},
        // {name: 'سامانه تبلیغات دررسانه های ملی', value: 'meli'},
        // {name: 'سامانه تبلیغات درناوگان حمل و نقل', value: 'transport'},
        // {name: 'سامانه تبلیغات دررسانه های تصویری', value: 'meliMedia'},
        // {name: 'سامانه مدیریت‌آنلاین فایل املاک', value: 'picMedia'},
        // {name: 'سامانه مدیریت‌آنلاین مشتریان', value: 'Qr'},
        // {name: 'سامانه سفارش ودرج تبلیغات اینترنتی', value: 'CRM'},
        // {name: 'سامانه ایمیل مارکتینگ', value: 'googleAds'},
        // {name: 'سامانه تبلیغات در ورزشگاه ونمایشگاه ها', value: 'emailMarket'},
        // {name: 'سامانه جامع مزایده آنلاین', value: 'gyms'},
        // {name: 'سامانه ابزارهای آنلاین کسب وکار', value: 'mozayede'},
        // {name: 'سامانه آموزش آنلاین مشاغل', value: 'freeTools'},
      ],
      tutorials: null,
      tabItems: [],
      pages: [],
    }
  },

  mounted() {
    this.getPageList()

    swiper = new Swiper(`.swiper`, {
      // Optional parameters
      // @see https://swiperjs.com/swiper-api#parameters
      freeMode: {
        enabled: true,
        sticky: true,
      },
      spaceBetween: 20,
      breakpoints: {
        1920: {
          slidesPerView: 5.4,
          spaceBetween: 20
        },
        1264: {
          slidesPerView: 4.4,
          spaceBetween: 20
        },
        960: {
          slidesPerView: 3.3,
          spaceBetween: 20
        },
        600: {
          slidesPerView: 2.2,
        },
        320: {
          slidesPerView: 1.1,
        }
      },
      // remove unused modules if needed
      modules: [Navigation, FreeMode],
      // Navigation arrows if needed
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    })
  },

  watch: {
    loading(val) {
      this.showLoading = val
    },
    showLoading(val) {
      this.$emit('update:loading', val)
    }
  },

  beforeMount() {
    this.guidList = [
      {
        name: 'سامانه ترمینال تبلیغات',
        value: 'terminal',
        sid: '1',
        img: require('../assets/img/guids/s5wXoRhzyw9PkGXA8qnIL2yvA3TPiXhwsFrwjmeX.png')
      },
      {
        name: 'سامانه ارسال پیامک هدفمند',
        sid: '2',
        value: 'sms',
        img: require('../assets/img/guids/payamak-land.png')

      },
      {
        name: 'سامانه تولید QR داینامیک',
        sid: '3',
        value: 'qrCode',
        img: require('../assets/img/guids/qr-land.png')

      },
      {
        name: 'سامانه مدیریت‌آگهی‌تبلیغاتی',
        value: 'rbLand',
        sid: '4',
        img: require('../assets/img/guids/robot-land.png')
      },
      {
        name: 'سامانه بانک اطلاعات مشاغل کشور',
        value: 'info',
        sid: '10',
        img: require('../assets/img/guids/info-land.png')
      },
      {
        name: 'سامانه مدیریت‌آنلاین فایل املاک',
        value: 'realEstate',
        sid: '11',
        img: require('../assets/img/guids/estate-land.png')
      },
      {
        name: 'سامانه خدمات طراحی گرافیکی و ویدئو',
        value: 'geraphic',
        sid: '14',
        img: require('../assets/img/guids/graphic-land-mix.png')
      },
      {
        name: 'سامانه طراحی،پشتیبانی و سئوسایت',
        value: 'digi',
        sid: '13',
        img: require('../assets/img/guids/web-land-1.png')
      },
    ]
  },

  methods: {
    getPageList() {
      this.showLoading = true
      this.$DashboardAxios.get('/api/contentService')
          .then(({data}) => {
            let list = []
            if (data.data && data.data.length > 0) {
              list = data.data.sort((a, b) => a - b);
              this.guidence = this.guidList.filter((item) => list.includes(Number(item.sid)))
              let index = this.guidence.findIndex(item => Number(item.sid) === Number(this.sid))
              index = index >= 0 ? index : 0
              this.activeProject = this.guidence[index].value
              if (this.$vuetify.breakpoint.smAndDown)
                this.carouselModel = index
              this.getPages(this.guidence[index].sid, this.activeProject)

              setTimeout(() => {
                swiper.slideTo(index, 500, false)
              }, 1000)
            }
          })
          .catch(({response}) => console.log('error in get category server list: ', response))
          .finally(() => this.showLoading = false)
    },
    // array_move(arr, old_index, new_index) {
    //     if (new_index >= arr.length) {
    //         let k = new_index - arr.length + 1;
    //         while (k--) {
    //             arr.push(undefined);
    //         }
    //     }
    //     arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    //     return arr; // for testing
    // },
    goTo(categoryID, value) {
      this.isActive = value;
      this.getContent(categoryID)
    },
    getPages(id, value) {
      this.showLoading = true
      this.activeProject = value;
      this.serverId = id
      this.tutorials = null
      this.tabModel = 0
      this.pages = []
      this.$DashboardAxios.get(`/api/categoryContent?sid=${id}`)
          .then(({data}) => {
            let visible = []
            let pages = data.data.filter((item) => !item.gate || this.ribbon_can(item.gate))
            for (let p in pages) {
              if (pages[p].meta_title
                  && pages[p].meta_title === 'admin'
                  && !this.ribbon_can('admin_access'))
                continue
              visible.push(pages[p])
            }
            if (visible?.length > 0) {
              //     let index = visible.findIndex(item => item.sort_order == 1)
              //     if (index > 0)
              //         visible = this.array_move(visible, 0, index)
              this.goTo(visible[0].id, visible[0].slug)
            }
            this.pages = visible
          })
          .finally(() => this.showLoading = false)
    },
    getContent(categoryId) {
      this.showLoading = true
      this.tutorials = null
      this.$DashboardAxios(`/api/categoryTutorial?sid=${this.serverId}&category_id=${categoryId}`)
          .then(({data}) => {
            this.tutorials = data.data
          })
          .finally(() => this.showLoading = false)
    },
  },
}
</script>

<style scoped>
.swiper-button-prev::after,
.swiper-button-next::after {
  content: none !important;
}

.bg-indigo {
  background-color: #1c0152 !important;
  color: #FFFFFF;
}

.cardMine {
  background-color: transparent !important;
  color: #1c0152;
}

@media screen and (min-width: 690px) {
  .cardMine {
    border-radius: 15px;
    box-shadow: 8px 5px 10px #7e8299 !important;
  }
}

.cardMine >>> .v-card__title {
  border-radius: 15px 15px 0 0 !important;
}

.btnStyles {
  border-radius: 15px;
  background-color: #FFFFFF;
  box-shadow: 5px 5px 5px #7e8299;
  border: 2px solid #1c0152 !important;
  letter-spacing: unset;
}

.v-card >>> .btnStyles:last-child {
  margin: 0 !important;
}

.btnActive {
  border-radius: 15px;
  background-color: #FFFFFF;
  color: #F49D1A;
  box-shadow: 5px 5px 5px #7e8299;
}

.cardStyle {
  border-radius: 15px;
  color: #1c0152;
  background-color: #FFFFFF;
  box-shadow: 8px 5px 10px #F49D1A;
}

.cardStyle:hover {
  box-shadow: 8px 5px 10px #7e8299;
  background-color: #1c0152;
  color: #FFFFFF;
}

.cardActive {
  box-shadow: 8px 5px 10px #7e8299 !important;
  background-color: #1c0152 !important;
  color: #F49D1A !important;

}

.popup-title {
  background-size: cover !important;
  background: linear-gradient(to left, #089D88 0%, #03BACF 51%, #514A9D 100%);
  word-break: break-word;
  z-index: 0 !important;
}

@media screen and (max-width: 960px) {
  .v-speed-dial >>> .v-speed-dial__list {
    left: 48px !important;
  }
}
</style>