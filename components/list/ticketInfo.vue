<template>
    <v-row no-gutters class="fill-height">
        <v-col cols="12" md="6" lg="12" class="pa-2">
            <div class="card card-custom card-body fill-height pt-4 px-6">
                <v-row no-gutters>
                    <v-col cols="7">
                        <h6 class="text-dark font-weight-bolder line-height-lg"
                            style="font-size: 11pt">
                            در هر لحظه با شما هستیم...
                        </h6>
                        <p class="mt-5">
                            <a target="_blank" href="https://core.terminalads.com/#/tickets/create"
                               class="text-dark">
                                <span style="font-size: 7pt">  برای ارتباط با تیم پشتیبانی ما تیکت ثبت نمایید</span>
                                <br>
                                <span class="btn btn-info py-1 mt-21">ثبت تیکت</span>
                            </a>
                        </p>
                    </v-col>
                    <v-col cols="5">
                        <img src="../../assets/img/customer-service.png" alt=""
                             style="width: 100%;object-fit: contain"/>
                    </v-col>
                </v-row>
            </div>
        </v-col>

        <v-col cols="12" sm="6" md="3" lg="6" class="pa-2">
            <a class="card card-custom cursor-pointer"
               :href="DConfigs.dashboardConfig.announcement.url"
               :style="`height: 165px;background-image: url(${DConfigs.dashboardConfig.announcement.img});background-size: 50%;background-color: rgb(245, 245, 245);`">
                <div class="card-body">
                    <div class="text-dark font-weight-bolder font-size-h2 mt-20"
                         v-text="announcement"/>
                    <p class="black--text">{{ DConfigs.dashboardConfig.announcement.text }}</p>
                </div>
            </a>
        </v-col>

        <v-col cols="12" sm="6" md="3" lg="6" class="pa-2">
            <a class="card ribbon card-custom" :href="DConfigs.dashboardConfig.numbers.url"
               :style="`height: 165px;background-image: url(${DConfigs.dashboardConfig.numbers.img});background-size: 50%;background-color: rgb(245, 245, 245);`">
                <div class="card-body">
                    <div class="text-dark font-weight-bolder font-size-h2 mt-20" v-text="numbers"/>
                    <p class="black--text" v-text="DConfigs.dashboardConfig.numbers.text"/>
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
            announcement: '-',
            numbers: '-',
            series: [
                {
                    name: "Net Profit",
                    data: [20, 22, 30, 28, 25, 26, 30, 28, 22, 24, 25, 35]
                }
            ],
        }
    },
    computed: {
        ...mapGetters(["layoutConfig"]),
    },
    mounted() {
        this.DConfigs.dashboardConfig.counter.then(res => {
            this.announcement = res.announcement
            this.numbers = res.numbers
        });
    }
}
</script>
<style>
</style>