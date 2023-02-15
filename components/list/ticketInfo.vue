<template>
    <v-row no-gutters>
        <v-col cols="12" md="6" lg="12" class="pa-2">
            <div class="card card-custom card-body">
                <!--                <div class="card-body px-3 py-4">-->
                <div class="row">
                    <div class="col-md-7 col-7 py-5 pr-3">
                        <h6 class="text-dark text-left font-weight-bolder line-height-lg"
                            style="font-size: 11pt">
                            در هر لحظه با شما هستیم...
                        </h6>
                        <p class="mt-5">
                            <a target="_blank" href="https://core.terminalads.com/#/tickets/create"
                               class="text-dark">
                                <span style="font-size: 7pt">  برای ارتباط با تیم پشتیبانی ما تیکت ثبت نمایید</span>
                                <br>
                                <span class="btn btn-info py-1  mt-10 mb-0 pb-0">ثبت تیکت</span>
                            </a>
                        </p>
                    </div>
                    <div class="col-md-5 col-5 p-0"
                         style="height: 190px; background-image:url('/customer-service-4471979-3735547.png'); background-position: left; background-size: contain">
                    </div>
                </div>

            </div>
            <!--            </div>-->
        </v-col>

        <v-col cols="12" sm="6" md="3" lg="6" class="pa-2">
            <a class="card card-custom cursor-pointer"
               :href="config.dashboardConfig.announcement.url"
               :style="`height: 165px;background-image: url(${config.dashboardConfig.announcement.img});background-size: 50%;background-color: rgb(245, 245, 245);`">
                <div class="card-body">
                    <div class="text-dark font-weight-bolder font-size-h2 mt-20"
                         v-text="typeof  config.dashboardConfig.announcement.data==='function' ? config.dashboardConfig.announcement.data() : config.dashboardConfig.announcement.data"/>
                    <p class="black--text">{{ config.dashboardConfig.announcement.text }}</p>
                </div>
            </a>
        </v-col>

        <v-col cols="12" sm="6" md="3" lg="6" class="pa-2">
            <a class="card ribbon card-custom" :href="config.dashboardConfig.numbers.url"
               :style="`height: 165px;background-image: url(${config.dashboardConfig.numbers.img});background-size: 50%;background-color: rgb(245, 245, 245);`">
                <div class="card-body">
                    <div class="text-dark font-weight-bolder font-size-h2 mt-20"
                         v-text="typeof config.dashboardConfig.numbers.data==='function' ? config.dashboardConfig.numbers.data() : config.dashboardConfig.numbers.data"/>
                    <p class="black--text" v-text="config.dashboardConfig.numbers.text"/>
                </div>
            </a>
        </v-col>
    </v-row>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "ticketInfo",
    data() {
        return {
            strokeColor: "#f86573",
            chartOptions: {},
            panelInfo: [],


            series: [
                {
                    name: "Net Profit",
                    data: [20, 22, 30, 28, 25, 26, 30, 28, 22, 24, 25, 35]
                }
            ],
        }
    },

    computed: {
        ...mapGetters(["layoutConfig"])
    },
}
</script>
<style>
</style>