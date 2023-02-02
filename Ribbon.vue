<template>
    <div v-if="$route.meta.has_ribbon" class="row position-relative">
        <div class="col-md-3 ribbon">
            <span class="ribbon3 text-center">
              <span>{{ title }} {{ subTitle }}</span>
            </span>
        </div>

        <div class="col-md ml-auto">
            <div style="left: 3rem;z-index: 1;top: 1.8rem;" :style="{ 'min-width':tutorialExists ? '5rem' :'' }" class="float-right position-absolute justify-content-between d-flex">
                <button v-if="tutorialExists" @click="getTutorial" v-b-tooltip.hover="'راهنما'">
                    <i class="fa fa-question text-primary"></i>
                </button>

                <button v-b-tooltip.hover="'بازگشت به صفحه قبلی'" @click="$router.back()">
                    <i class="fa fa-times text-danger"></i>
                </button>
            </div>
        </div>

        <div v-if="dialog">
            <v-dialog v-model="dialog" scrollable max-width="800px">
                <v-card elevation="2" outlined>
                    <v-card-title>
                        <v-tabs v-model="tab" align-with-title grow>
                            <v-tabs-slider/>
                          <v-tab v-if="tutorial && tutorial?.features">
                            <v-icon class="m-2">mdi-subtitles</v-icon>
                            معرفی نامه
                          </v-tab>
                            <v-tab>
                                <v-icon class="m-2">mdi-account</v-icon>
                                راهنما
                            </v-tab>

                            <v-tab v-if="hasQuestions">
                                <v-icon>mdi-help-circle-outline</v-icon>
                                سوالات متداول
                            </v-tab>

                            <v-tab v-if="ribbon_can('admin_access')">
                                <v-icon>mdi-shield-account-outline</v-icon>
                                راهنمای ادمین
                            </v-tab>
                        </v-tabs>
                    </v-card-title>

                    <v-card-text>
                        <v-tabs-items v-model="tab">

                          <v-tab-item v-if="tutorial && tutorial?.features">
                            <v-card>
                              <v-card-text v-html="tutorial?.features"></v-card-text>
                            </v-card>
                          </v-tab-item>

                            <v-tab-item>
                                <v-card v-if="Object.keys(tutorial).length>0">
                                    <v-card-title class="justify-content-center">
                                        {{ tutorial.title }}
                                    </v-card-title>

                                    <v-card-text v-html="tutorial.description"></v-card-text>
                                </v-card>
                            </v-tab-item>

                            <v-tab-item v-if="hasQuestions && tutorial!==null">
                                <v-card>
                                    <v-card-title class="justify-content-center">سوالات متداول</v-card-title>

                                    <v-expansion-panels>
                                        <v-expansion-panel v-for="(item,i) in tutorial.extras" :key="i">
                                            <v-expansion-panel-header>
                                                {{ item.question }}
                                            </v-expansion-panel-header>

                                            <v-expansion-panel-content>
                                                {{ item.answer }}
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                </v-card>
                            </v-tab-item>

                            <v-tab-item>
                                <v-card v-if="adminTutorial">
                                    <v-card-title class="justify-content-center">
                                        {{ adminTutorial.title }}
                                    </v-card-title>

                                    <v-card-text v-html="adminTutorial.description"></v-card-text>
                                </v-card>
                            </v-tab-item>
                        </v-tabs-items>
                    </v-card-text>

                    <v-card-actions class="justify-end" style="background: white; z-index: 999">
                        <hr>
                        <v-spacer></v-spacer>

                        <v-btn outlined class="mr-auto btn-cancel" text @click="dialog = false">
                            <v-icon>mdi-close-circle</v-icon>
                            <b>بستن</b>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>

        <div v-if="totalPopup">
            <b-modal id="modal-scrollable"
                     ok-only
                     ok-title="تایید"
                     scrollable
                     @ok="nextPopup"
                     :title="totalPopup[0] ? totalPopup[0].title:'' ">

                <p class="my-4"
                   v-html="totalPopup[0] ? totalPopup[0].description : ''"></p>
            </b-modal>
        </div>
    </div>
</template>

<script>

import {mapGetters} from "vuex";
import Axios from "axios";

export default {
    name: "terminal_title_ribbon",
    props: {},
    data() {
        return {
            project_title: null,
            tab: null,
            dialog: false,
            tutorialExists: false,
            hasQuestions: false,
            tutorial: [],
            adminTutorial: null,
            totalPopup: null,
            tutorials: [],
            popupSlugs: [],
            popups: [],
        };
    },
    methods: {
        allTutorials() {
            Axios.get(`${this.core_url}/api/allTutorials`, {
                headers: this.ribbon_header,
                params: {
                    sid: this.server_id,
                }
            }).then(response => {
                this.tutorials = response.data.slugTutorials;
                this.popupSlugs = response.data.slugPopups;
                this.popups = response.data.popups;

                this.$watch("$route", this.watchRoute, {
                    deep: true,
                    immediate: true
                })
            });
        },
        watchRoute(to, from) {
            let popupExists = this.popupSlugs.indexOf(to.path.substring(1)) > -1

            if (popupExists) {
                let seen = JSON.parse(localStorage.getItem('popup'))
                let popup = this.popups

                this.totalPopup = popup[to.path.substring(1)].filter(item => seen.indexOf(item.id) < 0);

                if (this.totalPopup.length > 0)
                    this.$bvModal.show('modal-scrollable');
            }

            this.tab = 0;
            this.tutorial = null;
            this.adminTutorial = null;
            this.hasQuestions = false;
            this.tutorialExists = this.tutorials.indexOf(to.path.substring(1)) > -1;

            document.title = this.project_title + (this.title !== "" ? ` - ${this.title} ${this.subTitle}` : '');
        },
        goToCore() {
            this.$router.go(-1);
        },
        nextPopup(event) {
            const lastItem = this.totalPopup.splice(0, 1);
            let seen = JSON.parse(localStorage.getItem('popup')) ?? [];

            seen.push(lastItem[0].id);

            localStorage.setItem('popup', JSON.stringify(seen));


            if (this.totalPopup.length > 0)
                event.preventDefault();
        },
        getTutorial() {
            this.$modal.showLoading();
            Axios.post(`${this.core_url}/api/contentTutorial`, {
                slug: this.$route.path.substring(1),
                sid: this.server_id,
            }, {
                headers: this.ribbon_header
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
                this.$modal.hideLoading();
                this.dialog = true;
            });
        }
    },
    computed: {
        ...mapGetters("ribbon", ["sub_title"]),
        title() {
            return this.$route.meta.title ?? "";
        },
        subTitle() {
            return this.sub_title ?? "";
        }
    },
    watch: {},
    beforeCreate() {
        if (!localStorage.getItem('popup'))
            localStorage.setItem('popup', "[]");
    },
    mounted() {
        this.project_title = document.title.split(" -")[0];

        this.allTutorials();
    }
}
</script>

<style scoped>
.ribbon {
    width: 100%;
    float: right;
    margin-bottom: 0;
    text-transform: uppercase;
    color: white;
    z-index: 1;

}

.ribbon:nth-child(even) {
    margin-right: 4%;
}

@media (max-width: 500px) {
    .ribbon {
        width: 100%;
    }

    .ribbon:nth-child(even) {
        margin-right: 0;
    }
}

.ribbon3 {
    width: 200px;
    height: 50px;
    line-height: 50px;
    padding-left: 15px;
    position: absolute;
    right: -1px;
    top: 30px;
    background: rgb(238, 49, 138);
}

.ribbon3:before, .ribbon3:after {
    content: "";
    position: absolute;
}

.ribbon3:before {
    height: 0;
    width: 0;
    top: -7.5px;
    right: 0;
    border-bottom: 9px solid black;
    border-left: 9px solid transparent;
}

.ribbon3:after {
    height: 0;
    width: 0;
    left: -14.5px;
    border-top: 25px solid transparent;
    border-bottom: 25px solid transparent;
    border-right: 15px solid rgb(238, 49, 138);

}
</style>