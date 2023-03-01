<template>
    <v-row no-gutters class="fill-height">
        <v-col cols="12" sm="7" lg="12" class="pa-2">
            <div class="card card-custom card-stretch fill-height">
                <div class="card-body d-flex flex-column px-5">
                    <div>
                        <h4>آخرین تراکنش ها</h4>
                        <span>موجودی شما:</span>
                        <span class="float-left">
                                {{ persianNum(currency(balance)) }}
                                <v-icon class="ms-2" v-if="wallet.icon != null && wallet.icon.length > 0"
                                        v-text="wallet.icon"/>
                            </span>
                    </div>

                    <v-fab-transition>
                        <div v-if="loading" class="row  justify-content-center mt-10">
                            <fingerprint-spinner
                                    :animation-duration="1500"
                                    :size="68"
                                    color="#ff1d5e"
                            />
                        </div>

                        <div v-else-if="transactions.length > 0">
                            <div v-for="item in transactions"
                                 class="d-flex align-items-center justify-content-between mb-2">
                                <div class="d-flex align-items-center mr-2 pt-3">
                                    <i class="fa fa-2x"
                                       :class="item.type === 'withdraw' ? ['text-success','fa-check']:['text-danger','fa-times']"></i>
                                    <div>
                                        <a href="#" class="text-dark text-hover-primary pl-2 font-weight-bolder">
                                            {{ item.type === "withdraw" ? "واریز وجه" : "برداشت وجه" }}
                                        </a>
                                    </div>
                                </div>
                                <div v-b-tooltip.hover :title="item.created_at_p"
                                     class="label label-light label-inline font-weight-bolder text-white bg-primary py-3 px-2 ">
                                    <span>{{ persianNum(currency(Math.abs(item.amount))) }} ﷼</span>
                                </div>
                            </div>
                        </div>

                        <div style="min-height: 9.6rem" v-else>
                            <p class="text-danger text-center pt-17"> هنوز تراکنشی برای شما ثبت نشده است!</p>
                        </div>
                    </v-fab-transition>

                    <div class="row">
                        <div class="col-md mt-5">
                            <b-btn class="btn btn-link-info mt-5" @click="toggleWalletDialog">
                                <i class="fa fa-plus"></i>
                                افزایش موجودی
                            </b-btn>
                            <b-btn class="btn btn-link-success mt-5 d-block" style="font-size: 9pt"
                                   @click="goToTransactions">
                                <i class="fa fa-eye"></i>
                                لیست تراکنش ها
                            </b-btn>
                        </div>
                        <div class="col-md-7">
                            <img src="../../assets/img/cash-wallet.png" alt="" style="width: 120px;"
                                 class="img-fluid float-left">
                        </div>

                    </div>
                </div>
            </div>
        </v-col>

        <v-col cols="12" sm="5" lg="12" class="pa-2">
            <div class="card card-custom card-stretch fill-height">
                <div class="card-header border-0">
                    <div class="card-title">
                        <div class="card-label">
                            <div class="font-weight-bolder text-dark">ترمینال تبلیغات در شبکه های اجتماعی</div>
                            <div class="font-size-sm text-muted mt-2">ما را در این شبکه ها میتوانید دنبال کنید.
                            </div>
                        </div>
                    </div>
                </div>

                <v-row no-gutters class="pa-2">
                    <v-col cols="12" md="5" class="px-2">
                        <a v-b-tooltip.hover="'اینستاگرام ترمینال ادز'" target="_blank"
                           href="https://instagram.com/terminalads">
                            <img class="img-fluid" alt="" style="width: 56px"
                                 src="data:image/jpeg;base64,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">
                        </a>
                        <a v-b-tooltip.hover="'واتساپ ترمینال ادز'" target="_blank"
                           href="https://wa.me/982191017077">
                            <img class="img-fluid " alt="" style="width: 56px"
                                 src="data:image/jpeg;base64,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">
                        </a>
                    </v-col>
                    <v-col cols="12" md="7" class="text-left px-2">
                        <img src="../../assets/img/social-media-marketing-landing.jpg"
                             alt="" class="img-fluid" style="width: 100%;max-width: 130px;object-fit: contain">
                    </v-col>
                </v-row>
            </div>
        </v-col>
    </v-row>
</template>

<script>
import {FingerprintSpinner} from 'epic-spinners'
import {mapActions, mapGetters} from 'vuex'

export default {
    name: "userTransactions",
    components: {
        FingerprintSpinner
    },
    data() {
        return {
            strokeColor: "#f86573",
            chartOptions: {},
            loading: false,
            transactions: [],
            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD4HznXqgGC7rvaM8z_AfFnrYfVqf-8NTWQyuZsXhkLiLiiYKsvRLuNp7Tzp1ZtSDn0m8&usqp=CAU'
        };
    },
    mounted() {
        this.fetch();
    },
    methods: {
        ...mapActions('ribbon', ['toggleWalletDialog']),
        fetch() {
            this.loading = true;
            this.$DashboardAxios.get('/api/transactions/user?length=3&filters=%7B%22type%22:%22%22,%22admin_type%22:null,%22confirmed%22:%22%22,%22date%22:%22%22%7D')
                .then(({data}) => this.transactions = data.data)
                .catch(({response}) => console.log('error in get transactions: ', response))
                .finally(() => this.loading = false)
        },
        goToTransactions() {
            window.open('https://core.terminalads.com/#/user/transactions')
        },
    },
    computed: {
        ...mapGetters("ribbon", ["wallet"]),
        balance() {
            return this.wallet?.balance || 0
        }
    },
};
</script>