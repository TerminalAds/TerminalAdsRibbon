<template>
  <div class="card card-custom card-stretch pb-4">

    <div class="card-header border-0">
      <h3 class="card-title font-weight-bolder text-dark">{{ i18n.t('NEWS.TITLE') }}</h3>
    </div>

    <div class="card-body pt-2">
      <div v-if="loading" class="row justify-content-center mt-10">
        <fingerprint-spinner :animation-duration="1500" :size="68" color="#ff1d5e"/>
      </div>

      <div v-else-if="news.data && news.data.length > 0" class="d-flex flex-wrap align-items-center pb-10"
           v-for="(item, index) in news.data" :key="index">
        <div class="symbol symbol-50 symbol-2by3 flex-shrink-0 mr-4">
          <div class="symbol-label" :style="{backgroundImage: `url('${coreLandUrl(item.picture)}')`}"></div>
        </div>

        <div class="d-flex flex-column flex-grow-1 my-lg-0 my-2 mr-2 ">
          <router-link :to="{name:'news.index', params:{id:item.id}}"
                       class="text-dark font-weight-bold text-hover-primary mb-1 font-size-lg">
            <p class="text-truncate" style="width: 20rem">{{ item.title }}</p>
          </router-link>
          <span class="text-muted font-weight-bold">{{ item.updated_at | timeAgo }}</span>
        </div>

        <button @click="$router.push({name:'news.index', params:{id:item.id}})"
                class="text-dark-75 text-hover-primary font-weight-bold">
          {{ i18n.t('NEWS.VIEW_BUTTON') }}
        </button>
      </div>

      <div class="justify-content-center text-center" v-else>
        <div class="mt-15">
          <i class="fa la-frown fa-7x"></i>
          <h2 class="text-dark-50 mt-2">{{ i18n.t('NEWS.NO_NEWS') }}</h2>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {FingerprintSpinner} from 'epic-spinners'
import i18n from "../../plugins/EasyModal/i18n";

export default {
  name: "news",
  components: {
    FingerprintSpinner
  },
  data() {
    return {
      i18n,
      chartOptions: {},
      model: null,
      loading: false,
      news: [],
      series: [
        {
          name: "Net Profit",
          data: [35, 65, 75, 55, 45, 60, 55]
        },
        {
          name: "Revenue",
          data: [40, 70, 80, 60, 50, 65, 60]
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["layoutConfig"])
  },
  mounted() {
    this.chartOptions = {
      chart: {
        type: "bar",
        height: 200,
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: ["30%"],
          endingShape: "rounded",
          barHeight: "20%"
        }
      },
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          style: {
            colors: this.layoutConfig("colors.gray.gray-500"),
            fontSize: "12px",
            fontFamily: this.layoutConfig("font-family")
          }
        }
      },
      yaxis: {
        min: 0,
        max: 100,
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          style: {
            colors: this.layoutConfig("colors.gray.gray-500"),
            fontSize: "12px",
            fontFamily: this.layoutConfig("font-family")
          }
        }
      },
      fill: {
        opacity: 1
      },
      states: {
        normal: {
          filter: {
            type: "none",
            value: 0
          }
        },
        hover: {
          filter: {
            type: "none",
            value: 0
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: "none",
            value: 0
          }
        }
      },
      tooltip: {
        style: {
          fontSize: "12px",
          fontFamily: this.layoutConfig("font-family")
        },
        y: {
          formatter: function (val) {
            return "$" + val + " thousands";
          }
        }
      },
      colors: ["#fc8692", "#ffffff"],
      grid: {
        borderColor: this.layoutConfig("colors.gray.gray-200"),
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: false
          }
        }
      }
    };
  },

  methods: {
    getNews() {
      this.loading = true;
      this.$DashboardAxios.get(`api/core/content?type=news&sid=${this.sid}`)
          .then(({data}) => {
            this.news = data.data
          }).catch(() => {
        this.i18n.toast.error(this.i18n.t('NEWS.FETCH_ERROR'))
      }).finally(() => setTimeout(() => {
        this.loading = false
      }, 3000))
    },
  },
  created() {
    this.getNews()
  },
};
</script>
