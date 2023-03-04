<template>
    <v-card v-if="loading" flat min-height="200" class="d-flex align-center justify-center">
        <v-progress-circular indeterminate color="primary"/>
    </v-card>

    <v-tabs-items v-else-if="tutorial" v-model="tab" class="pa-4">
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
</template>

<script>
import {mapGetters} from "vuex";
import Axios from "axios";


export default {
    name: "itemsTutorial",

    props: {
        value: Number,
        noCall: Boolean,
        calledTuts: [Object, Array]
    },

    data: () => ({
        loading: false,
        tab: 0,
        project_title: null,
        hasQuestions: false,
        tutorial: null,
        tabItems: null,
        adminTutorial: null,
    }),

    beforeCreate() {
        if (!localStorage.getItem('popup'))
            localStorage.setItem('popup', "[]");
    },

    mounted() {
        if (!this.noCall)
            this.getTutorial();
        else
            this.setTutorials(this.calledTuts)

        this.tabItems = this.fillItems
    },

    computed: {
        haveFeature() {
            return this.tutorial?.features;
        },
        ...mapGetters("ribbon", ["sub_title"]),
        title() {
            return this.$route.meta.title ?? "";
        },
        fillItems() {
            return [
                {
                    title: 'معرفی نامه',
                    icon: 'subtitles',
                    color: 'pink',
                    condition: () => this.tutorial !== null && this.haveFeature
                },
                {
                    title: 'راهنما',
                    icon: 'account',
                    color: 'green',
                    condition: () => this.tutorial !== null
                },
                {
                    title: 'سوالات متداول',
                    icon: 'help-circle-outline',
                    color: 'indigo',
                    condition: () => this.hasQuestions && this.tutorial !== null
                },
                {
                    title: 'راهنمای ادمین',
                    icon: 'shield-account-outline',
                    color: 'blue',
                    condition: () => this.ribbon_can('admin_access') && this.adminTutorial
                },
            ]
        },
    },

    watch: {
        value(val) {
            this.tab = val
        },
        tab(val) {
            this.$emit('input', val)
        },
        tabItems(val) {
            this.$emit('update:items', val)
        },
        calledTuts(val) {
            this.setTutorials(val)
            this.tabItems = this.fillItems
        },
        loading(val) {
            console.log('loading val: ', val)
        }
    },

    methods: {
        getTutorial() {
            this.loading = true;
            Axios.post(`${this.core_url}/api/contentTutorial`, {
                slug: this.$route.path.substring(1),
                sid: this.sid,
            }, {
                headers: this.DHeaders
            }).then(({data}) => {
                this.setTutorials(data)
            }).finally(() => {
                this.loading = false
            });
        },
        setTutorials(data) {
            this.loading = true
            this.tab = 0;
            this.tutorial = null;
            this.adminTutorial = null;
            this.hasQuestions = false;

            if (data && data.length > 0)
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

            this.tabItems = []
            this.$nextTick(() => {
                this.tabItems = this.fillItems
                this.loading = false
            })
        }
    },
}
</script>

<style scoped>
.v-expansion-panel--active >>> .v-expansion-panel-header {
    background-color: var(--v-warning-base);
    min-height: 49px;
}
</style>