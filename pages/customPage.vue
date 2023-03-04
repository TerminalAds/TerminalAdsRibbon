<template>
    <v-card flat min-height="200">
        <div class="title-wrapper pb-2">
            <terminal_title_ribbon>
                <v-card-title class="justify-end pa-0 flex-nowrap">
                    <!--                    <v-btn depressed color="rgba(105, 147, 255, .35)" v-if="tutorialExists" @click="getTutorial"-->
                    <v-btn depressed color="rgb(202,217,255)" @click="getTutorial"
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

        <router-view v-if="rerender"/>

        <!--        <div v-if="dialog && ">-->
        <custom-popup v-model="tDialog" scrollable max-width="800" :cons="cons" v-if="tutorialExists" hide-confirm>
            <template v-slot:extension>
                <v-tabs v-model="tab" align-with-title grow background-color="transparent" dark color="primary"
                        style="flex: 1 0 0;max-width: calc(100% - 46px)"
                        show-arrows>
                    <v-tabs-slider/>
                    <v-tab v-for="(item, i) in tabItems" v-if="item.condition">
                        <!--                        <v-icon :color="tab === i ? item.color : ''" class="m-2">mdi-{{ item.icon }}</v-icon>-->
                        <v-icon class="m-2">mdi-{{ item.icon }}</v-icon>
                        {{ item.title }}
                    </v-tab>
                </v-tabs>
            </template>

            <v-tabs-items v-model="tab" class="pa-4">
                <v-tab-item v-if="tutorial && haveFeature">
                    <v-card flat>
                        <v-card-text v-html="tutorial.features"></v-card-text>
                    </v-card>
                </v-tab-item>

                <v-tab-item v-if="tutorial !== null">
                    <v-card flat v-if="Object.keys(tutorial).length > 0">
                        <v-card-title class="justify-content-center">
                            {{ tutorial.title }}
                        </v-card-title>

                        <v-card-text v-html="tutorial.description"/>
                    </v-card>
                </v-tab-item>

                <v-tab-item v-if="hasQuestions && tutorial !== null">
                    <v-expansion-panels flat>
                        <v-expansion-panel v-for="(item, i) in tutorial.extras" :key="i"
                                           class="grey lighten-2 mb-2">
                            <v-expansion-panel-header class="font-size-h4 font-weight-bold text-break">
                                {{ item.question }}
                            </v-expansion-panel-header>

                            <v-expansion-panel-content class="pt-2 font-size-h6 text-break">
                                <div v-html="item.answer"/>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-tab-item>

                <v-tab-item v-if="adminTutorial">
                    <v-card flat>
                        <v-card-title class="justify-content-center">
                            {{ adminTutorial.title }}
                        </v-card-title>

                        <v-card-text v-html="adminTutorial.description"></v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </custom-popup>
        <!--        </div>-->

        <div v-if="totalPopup">
            <b-modal id="modal-scrollable" ok-only ok-title="تایید" scrollable @ok="nextPopup"
                     :title="totalPopup[0] ? totalPopup[0].title : ''">

                <p class="my-4" v-html="totalPopup[0] ? totalPopup[0].description : ''"></p>
            </b-modal>
        </div>
    </v-card>
</template>

<script>
import {mapGetters} from "vuex";
import Terminal_title_ribbon from "../Ribbon";
import Axios from "axios";
import CustomPopup from "../plugins/popup/customPopup";

export default {
    name: "customPage",
    components: {CustomPopup, Terminal_title_ribbon},
    data: () => ({
        cons: {title: 'آموزش'},
        loading: false,
        reloadLoading: false,
        project_title: null,
        tab: null,
        tDialog: false,
        tutorialExists: false,
        hasQuestions: false,
        tutorial: null,
        adminTutorial: null,
        totalPopup: null,
        tutorials: [],
        popupSlugs: [],
        popups: [],
        rerender: true,
        tabItems: [
            {title: 'معرفی نامه', icon: 'subtitles', color: 'pink', condition: true},
            {title: 'راهنما', icon: 'account', color: 'green', condition: true},
            {title: 'سوالات متداول', icon: 'help-circle-outline', color: 'indigo', condition: true},
            {title: 'راهنمای ادمین', icon: 'shield-account-outline', color: 'blue', condition: true},
        ]
    }),
    methods: {
        reloadPage() {
            this.rerender = false
            this.reloadLoading = true
            this.$nextTick(() => {
                setTimeout(() => {
                    this.reloadLoading = false
                    this.rerender = true
                }, 1000)
            });
        },
        allTutorials() {
            Axios.get(`${this.core_url}/api/allTutorials`, {
                headers: this.DHeaders,
                params: {
                    sid: this.sid,
                }
            }).then(response => {
                this.tutorials = response.data.slugTutorials;
                this.popupSlugs = response.data.slugPopups;
                this.popups = response.data.popups;

                this.$watch("$route", this.watchRoute, {
                    deep: true,
                    immediate: true
                });
            });
        },
        watchRoute(to, from) {
            let popupExists = this.popupSlugs.indexOf(to.path.substring(1)) > -1

            if (popupExists) {
                let seen = JSON.parse(localStorage.getItem('popup'))
                let popup = this.popups

                this.totalPopup = popup[to.path.substring(1)].filter(item => seen.indexOf(item.id) < 0);

                if (this.totalPopup?.length > 0)
                    this.$bvModal.show('modal-scrollable');
            }

            this.tab = 0;
            this.tutorial = null;
            this.adminTutorial = null;
            this.hasQuestions = false;
            this.tutorialExists = this.tutorials.indexOf(to.path.substring(1)) > -1;

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
        getTutorial() {
            this.loading = true;
            Axios.post(`${this.core_url}/api/contentTutorial`, {
                slug: this.$route.path.substring(1),
                sid: this.sid,
            }, {
                headers: this.DHeaders
            }).then(({data}) => {
                for (let a of data) {
                    if (a.privilege_type === 'admin') {
                        this.adminTutorial = a;
                        a.extras !== null ? this.hasQuestions = true : false;
                    } else {
                        a.extras !== null ? this.hasQuestions = true : false;
                        this.tutorial = a;
                        this.tutorial.extras = JSON.parse(a.extras);
                    }
                }
            }).finally(() => {
                this.loading = false
                this.tDialog = true;
            });
        }
    },
    computed: {
        haveFeature() {
            return this.tutorial?.features;
        },
        ...mapGetters("ribbon", ["sub_title"]),
        title() {
            return this.$route.meta.title ?? "";
        },
    },
    beforeCreate() {
        if (!localStorage.getItem('popup'))
            localStorage.setItem('popup', "[]");
    },
    mounted() {
        this.project_title = document.title.split(" -")[0];

        this.allTutorials();
        this.tabItems[0].condition = () => this.tutorial !== null && this.haveFeature
        this.tabItems[1].condition = () => this.tutorial !== null
        this.tabItems[2].condition = () => this.hasQuestions && this.tutorial !== null
        this.tabItems[3].condition = this.ribbon_can('admin_access') && this.adminTutorial
    }
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

.v-expansion-panel--active >>> .v-expansion-panel-header {
    background-color: var(--v-warning-base);
    min-height: 49px;
}

.v-tabs >>> .v-slide-group__prev,
.v-tabs >>> .v-slide-group__next {
    min-width: 36px;
}

.v-tabs >>> .v-tab:not(.v-tab--active),
.v-tabs >>> .v-tab:not(.v-tab--active) .v-icon {
    color: white !important;
}
</style>