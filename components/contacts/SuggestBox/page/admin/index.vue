<template>
    <v-card flat class="pa-4">
        <terminal-table class="col-12" :currentPage="data.current_page"
                        :perPage="data.per_page" v-if="isMobile" :getData="getData"
                        :pageCount="data.last_page"
                        :options="tableProps" :datas="data" :headers="columns">
        </terminal-table>

        <data-table
                :data="data"
                v-if="!isMobile"
                :columns="columns"
                :orderDir="tableProps.dir"
                :translate="translate"
                :per-page="[10, 25, 50, 100, 400]"
                @on-table-props-changed="reloadTable">
            <template slot="filters" slot-scope="{ tableFilters, perPage }">
                <v-row no-gutters>
                    <v-flex xs12 sm12 md3 lg3 xl3 class="pe-md-2">
                        <v-select v-model="tableFilters.length" :items="perPage" item-value="page" item-text="page"
                                  outlined dense :menu-props="{offsetY: true}"/>
                    </v-flex>
                    <v-flex xs12 sm12 md3 lg3 xl3>
                        <v-text-field outlined dense v-model="tableFilters.search" label="جست و جو"
                                      append-icon="mdi-magnify"/>
                    </v-flex>
                </v-row>
            </template>
        </data-table>

        <v-dialog v-model="manageRequest" max-width="700">
            <v-card>
                <v-card-title class="sticky-top bg-white">
                    <span class="text-h5">مدیریت متن پیشفرض</span>

                    <v-spacer></v-spacer>

                    <v-btn small icon rounded @click="manageRequest = false" class="ml-1 text-danger">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text v-if="manageRequest">
                    <manage-request :model="()=>this.manageRequest=false" :data="selectedRequest"/>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
import ManageButton from "@/view/pages/ButtonGroup/button";
import ManageRequest from "./manageRequest";
import {adminDefaultList} from "../../../../../Utilities/defaultSms";

export default {
    name: "userSuggestList",
    components: {ManageRequest},
    data() {
        return {
            manageRequest: false,
            data: [],
            columns: [
                {
                    label: 'شناسه',
                    name: 'id',
                },
                {
                    label: 'عنوان',
                    name: 'title',
                },
                {
                    label: 'متن',
                    name: 'text',
                    transform(row) {
                        return row.data.text.substr(0, 25) + "...";
                    }
                },
                {
                    label: 'توضیحات',
                    name: 'description',
                    transform(row) {
                        return row.data.description.substr(0, 25) + "...";
                    }
                },
                {
                    label: 'مدیریت',
                    component: ManageButton,
                    width: '10',
                    event: 'actions',
                    handler: this.action,
                    meta: {
                        buttons: [
                            {
                                name: 'manage',
                                label: 'مدیریت',
                                icon: 'eye',
                                class: 'btn-show border-2 rounded-pill',
                                action: this.action,
                                status: 'phoneBook_show',
                            }
                        ]
                    }
                }
            ],
            tableProps: {
                search: '',
                filters: {},
                status: null,
                length: 10,
                column: 'id',
                dir: 'desc',
            },
            translate: {
                nextButton: 'بعدی',
                previousButton: 'قبلی',
                rowsPerPageText: 'تعداد در صفحه',
                noDataText: 'داده ای برای نمایش وجود ندارد',
                placeholderSearch: 'جستجو',
            },
            timer: null,
            selectedRequest: null
        }
    },
    methods: {
        debounce(fn, delay = 700) {
            clearTimeout(this.timer);

            this.timer = setTimeout(fn, delay)
        },
        getData() {
            adminDefaultList(this.tableProps).then(result => {
                this.data = result.data.data;
            });
        },
        reloadTable(props) {
            this.tableProps = props;

            this.debounce(this.getData);
        },
        action(data, action) {
            this[`${action}Action`](data);
        },
        manageAction(data) {
            this.manageRequest = true;

            this.selectedRequest = data;
        }
    },
    watch: {
        manageRequest(val) {
            if (!val)
                this.getData();
        },
    },
    computed: {
        isMobile() {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs':
                    this.getData(this.url, this.tableProps);
                    return true
                case 'sm':
                    this.getData(this.url, this.tableProps);
                    return true
                case 'md':
                    this.getData(this.url, this.tableProps);
                    return false
                case 'lg':
                    this.getData(this.url, this.tableProps);
                    return false
                case 'xl':
                    this.getData(this.url, this.tableProps);
                    return false
            }
        },

    },
    mounted() {
        this.getData();
    }
}
</script>

<style scoped>

</style>