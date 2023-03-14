<template>
    <v-card flat>
        <div class="title-wrapper pb-2">
            <terminal_title_ribbon>
                <v-card-title class="justify-end pa-0 flex-nowrap">
                    <!--                    <v-btn depressed color="rgba(105, 147, 255, .35)" v-if="tutorialExists" @click="getTutorial"-->
                    <v-btn depressed color="rgb(202,217,255)" v-if="tutorialExists" @click="tDialog = true"
                           v-b-tooltip.hover="'راهنما'" class="px-0" min-width="36" :loading="loading">
                        <v-icon small class="jump" color="#6993ff">mdi-help</v-icon>
                    </v-btn>

                    <!--                    <v-btn depressed style="margin-right: 8px" color="rgba(123, 31, 162, .3)"-->
                    <v-btn depressed style="margin-right: 8px" color="rgb(215,187,227)" :loading="reloadLoading"
                           @click="reloadPage" min-width="36" class="px-0" v-b-tooltip.hover="'به روزرسانی'">
                        <v-icon color="#7b1fa2">mdi-reload</v-icon>
                        <!--                    رفرش-->
                    </v-btn>

                    <!--                    <v-btn depressed color="rgba(246, 78, 96, .35)" v-b-tooltip.hover="'بازگشت به صفحه قبلی'"-->
                    <v-btn depressed color="rgb(252,193,199)" v-b-tooltip.hover="'بازگشت به صفحه قبلی'"
                           @click="$router.back()" style="margin-right: 8px" min-width="36" class="px-0">
                        <v-icon class="text-danger">mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
            </terminal_title_ribbon>
        </div>

        <router-view v-if="rerender" v-show="!reloadLoading"/>

        <v-card v-if="reloadLoading" flat class="d-flex align-center justify-center" height="300">
            <atom-spinner :animation-duration="1500" :size="100" class="mx-auto" color="var(--v-primary-base)"/>
        </v-card>

        <custom-popup v-model="tDialog" scrollable max-width="800" :cons="cons" hide-confirm>
            <!--            <custom-popup v-model="tDialog" scrollable max-width="800" :cons="cons" v-if="tutorialExists" hide-confirm>-->
            <template v-slot:extension>
                <tabs-tutorial v-model="tab" :tab-items="tabItems" v-if="routeChanged && tDialog" class="popup-tuts"/>
            </template>

            <items-tutorial v-model="tab" :items.sync="tabItems" v-if="routeChanged && tDialog"/>
        </custom-popup>

        <div v-if="totalPopup">
            <b-modal id="modal-scrollable" ok-only ok-title="تایید" scrollable @ok="nextPopup"
                     :title="totalPopup[0] ? totalPopup[0].title : ''">

                <p class="my-4" v-html="totalPopup[0] ? totalPopup[0].description : ''"></p>
            </b-modal>
        </div>
    </v-card>
</template>

<script>
import Terminal_title_ribbon from "../Ribbon";
import Axios from "axios";
import CustomPopup from "../plugins/popup/customPopup";
import TabsTutorial from "../components/tabsTutorial";
import ItemsTutorial from "../components/itemsTutorial";
import {AtomSpinner} from 'epic-spinners'

export default {
    name: "customPage",

    components: {ItemsTutorial, TabsTutorial, CustomPopup, Terminal_title_ribbon, AtomSpinner},

    data: () => ({
        cons: {title: 'آموزش'},
        loading: false,
        reloadLoading: false,
        tab: null,
        tDialog: false,
        rerender: true,
        routeChanged: true,
        tabItems: [],
        tutorialExists: false,
        project_title: null,
        totalPopup: null,
        tutorials: [],
        popupSlugs: [],
        popups: [],
    }),

    mounted() {
        this.project_title = document.title.split(" -")[0];
        this.allTutorials()
    },

    computed: {
        title() {
            return this.$route.meta.title ?? "";
        },
    },

    methods: {
        reloadPage() {
            this.rerender = false
            this.reloadLoading = true
            this.$nextTick(() => {
                this.rerender = true
                setTimeout(() => {
                    this.reloadLoading = false
                }, 500)
            });
        },
        allTutorials() {
            this.loading = true;
            Axios.get(`${this.core_url}/api/allTutorials`, {
                headers: this.DHeaders,
                params: {
                    sid: this.sid,
                }
            }).then(({data}) => {
                this.tutorials = data.slugTutorials;
                this.popupSlugs = data.slugPopups;
                this.popups = data.popups;

                this.$watch("$route", this.watchRoute, {
                    deep: true,
                    immediate: true
                });
            }).finally(() => {
                this.loading = false
            })
        },
        watchRoute(to, from) {
            this.routeChanged = false
            let popupExists = this.popupSlugs.indexOf(to.path.substring(1)) > -1

            if (popupExists) {
                let seen = JSON.parse(localStorage.getItem('popup'))
                let popup = this.popups

                this.totalPopup = popup[to.path.substring(1)].filter(item => seen.indexOf(item.id) < 0);

                if (this.totalPopup?.length > 0)
                    this.$bvModal.show('modal-scrollable');
            }

            this.tab = 0;
            this.tabItems = null
            this.tutorialExists = this.tutorials.indexOf(to.path.substring(1)) > -1;
            this.$nextTick(() => {
                this.routeChanged = true
            })

            document.title = this.project_title + (this.title !== "" ? ` - ${this.title} ${this.subTitle ?? ''}` : '');
        },
        goToCore() {
            this.$router.go(-1);
        },
        nextPopup(event) {
            const lastItem = this.totalPopup.splice(0, 1);
            let seen = JSON.parse(localStorage.getItem('popup')) ?? [];

            seen.push(lastItem[0].id);

            localStorage.setItem('popup', JSON.stringify(seen));


            if (this.totalPopup?.length > 0)
                event.preventDefault();
        },
    },
}
</script>

<style scoped>
@keyframes jump {
    0% {
        transform: scale(1.1);
    }

    10% {
        transform: scale(1.8) rotateY(0);
    }

    20% {
        transform: scale(1.1)
    }

    30% {
        transform: scale(1.8) rotateY(-180deg);
    }

    40% {
        transform: scale(1.1);
    }

    50% {
        transform: scale(1.8) rotateY(0);
    }

    60% {
        transform: scale(1.1);
    }

    70% {
        transform: scale(1.8) rotateY(-180deg);
    }

    80% {
        transform: scale(1.1);
    }

    90% {
        transform: scale(1.8) rotateY(0);
    }

    100% {
        transform: scale(1.1)
    }
}

.jump {
    animation: jump 7s linear infinite;
}

.title-wrapper {
    display: flex;
    flex-wrap: wrap-reverse;
}

.popup-tuts {
    max-width: calc(100% - 44px);
}
</style>