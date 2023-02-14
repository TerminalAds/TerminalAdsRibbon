<template>
    <div class="container-fluid rounded" style="background-color: white">
        <p class="mt-2 mb-0">{{ $t('WALLET.Price') }} :</p>

        <v-flex class="flex-column align-items-center">
            <div class="text-center mt-2 justify-content-center">

                <v-btn-toggle class="flex-wrap justify-content-center" v-model="quickCharge" mandatory>
                    <v-row class="justify-content-center text-center">

                        <v-flex class="p-0" v-for="(price, i) in costs" style="margin-left:-6px; margin-right: -6px"
                                :key="price.val">
                            <v-btn :class="[price.class, {[price.classHover] : quickCharge === price.val}]"
                                   :value="price.val" :style="price.style">
                                <span class="d-inline-block h- mx-2">{{ price.val | numericPersianNumber }} ریال</span>
                            </v-btn>
                        </v-flex>

                        <v-btn :value="false" class="mt-2"
                               :class="['btn-charge-wallet', {'btn-charge-wallet-hover' : !quickCharge}]"
                               style="border-color: rgb(2, 191, 180) !important">
                            <span class="">{{ $t('WALLET.CustomCharge') }}</span>
                        </v-btn>

                    </v-row>
                </v-btn-toggle>

            </div>
        </v-flex>

        <div>
            <v-expand-transition>
                <div class="card p-4 my-4" v-show="!quickCharge">
                    <h3 class="text-center my-4">{{ $t('WALLET.CustomCharge') }}</h3>
                    <div class="col-md-6 align-self-center">
                        <price-input v-model="data.price" text-center="true"></price-input>
                        <p class="red--text" v-if="error" style="color: darkred">{{ error }}</p>
                        <v-row class="justify-content-center py-3 text-center">
                            <v-flex xs12 sm12 md6 xl6 lg6 class="p-2" v-for="(cost, index) in costsDefault"
                                    :key="index">
                                <v-btn @click="prices(cost.val)"
                                       class="charge btn-buy mx-3 btn-dec-with-text"
                                       :id="cost.val" :data-price="cost.val*(10000)">
                                    <v-icon small class="mx-2">
                                        mdi-plus-circle
                                    </v-icon>
                                    {{ cost.val | numericPersianNumber }}
                                    <p class="pt-3 pr-1">ریـال</p>
                                    <!--                                  {{ cost.val | numericPersianNumber}}-->
                                </v-btn>
                            </v-flex>
                        </v-row>
                    </div>

                </div>
            </v-expand-transition>
        </div>
        <p class="mt-2">{{ $t('WALLET.GateWay') }} :</p>

        <div class=" d-flex justify-content-center rounded-lg pa-1 wallet-charge mt-3 py-3">

            <p v-if="gateways == undefined" class="my-10">{{ $t('WALLET.noGateWay') }}</p>

            <v-btn-toggle v-else-if="gateways.length" v-model="data.gateway" borderless mandatory>
                <v-btn v-for="gate in gateways" :value="gate" width="6rem" height="6rem"
                       :class="['py-2' , {'activeGateWay' : data.gateway.id === gate.id}]"
                       style="background-color: white">

                    <div v-if="getGateWayImage(gate.driver)">
                        <v-img class="my-2" :src="getGateWayImage(gate.driver)" contain width="5rem" height="5rem"/>
                    </div>

                    <div v-else class="d-flex flex-column">
                        <v-icon class="mt-4">
                            fa-credit-card
                        </v-icon>
                        <p class="mt-2">{{ gate.name }}</p>
                    </div>

                </v-btn>

            </v-btn-toggle>

            <div v-else>
                <semipolar-spinner :animation-duration="2000" :size="40" color="#8b8e94"/>
            </div>


        </div>

        <div class="m-3">
            <p v-for="d in $t('WALLET.Details')">{{ d }}</p>

        </div>

        <div class="my-4 d-flex flex-row-reverse">
            <v-btn class="btn-payment" depressed @click="payment" block :disabled="!isValidData">
                <v-icon class="ml-2">fa-credit-card</v-icon>
                {{ $t('WALLET.Pay') }}
            </v-btn>
        </div>
    </div>

</template>

<script>
import priceInput from "../../pages/pickers/priceInput";
import {SemipolarSpinner} from 'epic-spinners'


export default {
    components: {priceInput, SemipolarSpinner},
    name: "increaseTransactions",
    data() {
        return {
            quickCharge: 0,
            costs: [
                {
                    val: 10_000_000,
                    class: 'btn-1000000',
                    classHover: 'btn-1000000-hover',
                    style: "border-color: #44b5ef !important",
                },
                {
                    val: 20_000_000,
                    class: 'btn-2000000',
                    classHover: 'btn-2000000-hover',
                    style: "border-color: #ef022a !important",
                },
                {
                    val: 30_000_000,
                    class: 'btn-3000000',
                    classHover: 'btn-3000000-hover',
                    style: "border-color: #2990ff !important",
                },
                {
                    val: 50_000_000,
                    class: 'btn-5000000',
                    classHover: 'btn-5000000-hover',
                    style: "border-color: #29d155 !important",
                },
                {
                    val: 100_000_000,
                    class: 'btn-10000000',
                    classHover: 'btn-10000000-hover',
                    style: "border-color: rgb(150, 85, 0) !important",
                },
            ],
            costsDefault: [
                {
                    val: 500_000,
                    class: 'btn-2000000',
                },
                {
                    val: 2_000_000,
                    class: 'btn-1000000',
                },
                {
                    val: 5_000_000,
                    class: 'btn-3000000'
                },
                {
                    val: 10_000_000,
                    class: 'btn-10000000'
                },
            ],
            balance: 0,
            radio: "giftCard",
            gateways: [],
            data: {
                price: 0,
                gateway: {}
            },
            min: 500_000,
            max: 500_000_000,
            error: ""
        }
    },
    mounted() {
        this.getGateways()
    },
    //todo: دزست کردن کیلیک روی تکست باکس مبلغ که دتای دکمه ها را پاک می کند
    methods: {
        prices(cost) {
            if (this.data.price === '')
                this.data.price = 0;
            // this.balance = this.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            this.data.price = this.data.price + cost;
        },
        getGateways() {
            this.$DashboardAxios.get('/api/core/gateways')
                .then(({data}) => {
                    if (data) {
                        this.gateways = data.data

                    } else {
                        console.log('gateway undefined')
                        this.gateways = undefined
                    }
                    // this.gateways=data

                    // this.$toast.success('موفق');
                    // this.$router.replace('/user/confirmed');
                })
                .catch(({response}) => {
                    if (response.data != null && response.data.message != null) this.$toast.error(response.data.message);
                    else this.$toast.error('ناموفق');
                    this.errors = response.data.errors;
                    this.gateways = undefined
                })
        },
        redirectMelatGateway(link, RefId) {
            var form = document.createElement("form");
            var element1 = document.createElement("input");

            form.method = "POST";
            form.action = link;

            element1.value = RefId;
            element1.name = "RefId";
            form.appendChild(element1);

            document.body.appendChild(form);

            form.submit();
        },

        payment() {
            if (this.data.price < this.min) {
                this.$toast.error('مبلغ وارد شده کمتر از ۵۰۰۰۰ تومان است.');
                return;
            }
            this.$modal.showLoading();
            this.requestApiGet('charge/' + this.data.price).then(({data}) => {
                // this.redirectMelatGateway(data.action,data.inputs.RefId)
                let url = data;
                window.location.href = url;
                // window.location = data.action + thisYear + "&"
                //     + "month=" +thisMonth + "&"
                //     + "day=" +thisDay;

                // window.location.href = data.action; // used for zarinPAl
            }).catch((e) => {
                this.$modal.hideLoading()
                this.$toast.error(this.$t('WALLET.ErrorOnRedirectToGateWay'));
            });
        },

        getGateWayImage(gatewayDriver) {
            console.log(gatewayDriver)
            switch (gatewayDriver) {
                case "zarinpal":
                    return "media/gateways/zarinpal.png";

                case "parsian":
                    return "media/gateways/parsian.png";

                case "mellat":
                    return "media/gateways/mellat.png";

            }

            return false;
        },

        isValidPrice(min, max) {
            return min <= this.data.price && this.data.price <= max;
        }

    },
    computed: {
        isValidData() {
            return !!(this.gateways ? this.gateways.length : false) && this.data.price && this.isValidPrice(this.min, this.max)
        }
    },
    watch: {
        quickCharge() {
            if (this.quickCharge) {
                this.data.price = this.quickCharge;
            }
        },
        'data.price'() {
            if (this.isValidPrice(this.min, this.max)) {
                this.error = "";
            } else {
                this.error = this.$t('WALLET.PriceNotInRange', {
                    min: this.min.num2persian(),
                    max: this.max.num2persian()
                })
            }
        }
    }
}
</script>

<style>
.btn-1000000, .btn-2000000, .btn-3000000, .btn-5000000, .btn-10000000 {
    background-color: white !important;
    cursor: pointer;
}

.btn-1000000 span, .btn-2000000 span, .btn-3000000 span, .btn-5000000 span, .btn-10000000 span {
    font-family: vazir !important;
    font-weight: bold !important;
    cursor: pointer;
}
</style>

<style scoped>
/*.fa-credit-card {*/
/*  color: blue!important;*/
/*  text-decoration: none!important;*/
/*  transition: 0.7s!important;*/
/*}*/

.activeGateWay {
    border-radius: 1rem !important;
    border: #0d8ddc solid 5px !important;
    cursor: pointer;
}

.btn-1000000, .btn-2000000, .btn-3000000, .btn-5000000, .btn-10000000 {
    border-radius: 5px !important;
    display: block;
    margin: 10px;
    padding: 15px 60px;
    text-align: center;
    text-transform: uppercase;
    transition: 0.7s !important;
    font-weight: bold !important;
    background-size: 200% auto;
    cursor: pointer;
}


.btn-1000000:hover, .btn-2000000:hover, .btn-3000000:hover, .btn-5000000:hover, .btn-10000000:hover {
    background-position: right center;
    color: #fff !important;
    font-weight: bold !important;
    fill: #fff !important;
    text-decoration: none !important;
    border: none !important;
    transition: 0.7s !important;
    box-shadow: 0 0 20px #eee;
    cursor: pointer;
}

.btn-1000000 {
    border: 1px solid #44b5ef !important;
    color: #44b5ef !important;
    cursor: pointer;
}

.btn-1000000:hover {
    background-image: linear-gradient(to right, #44b5ef 0, #088ed8 51%, #44b5ef 100%);
}

.btn-1000000-hover {
    background-image: linear-gradient(to right, #44b5ef 0, #088ed8 51%, #44b5ef 100%);
}

.btn-2000000 {
    border: 1px solid #ef022a !important;
    color: #ef022a !important;
    cursor: pointer;
}

.btn-2000000:hover {
    background-image: linear-gradient(to right, #ef022a 0, #f1809c 51%, #ef022a 100%);
}

.btn-2000000-hover {
    background-image: linear-gradient(to right, #ef022a 0, #f1809c 51%, #ef022a 100%);
}

.btn-3000000 {
    border: 1px solid #2990ff !important;
    color: #2990ff !important;
    cursor: pointer;
}

.btn-3000000:hover {
    background-image: linear-gradient(to right, #2990ff 0, #0067d6 51%, #2990ff 100%);
}

.btn-3000000-hover {
    background-image: linear-gradient(to right, #2990ff 0, #0067d6 51%, #2990ff 100%);
}

.btn-5000000 {
    border: 1px solid #29d155 !important;
    color: #29d155 !important;
}

.btn-5000000:hover {
    background-image: linear-gradient(to right, #29d155 0, #1b8d39 51%, #29d155 100%);
}

.btn-5000000-hover {
    background-image: linear-gradient(to right, #29d155 0, #1b8d39 51%, #29d155 100%);
}

.btn-10000000 {
    border: 1px solid rgb(150, 85, 0) !important;
    color: rgb(150, 85, 0) !important;

}

.btn-10000000:hover {
    background-image: linear-gradient(to right, rgb(150, 85, 0) 0%, rgb(255, 204, 0) 51%, rgb(150, 85, 0) 100%);
    color: #fff !important;
    font-weight: bold !important;
}

.btn-10000000-hover {
    background-image: linear-gradient(to right, rgb(150, 85, 0) 0%, rgb(255, 204, 0) 51%, rgb(150, 85, 0) 100%);
}

.btn-charge-wallet-hover {
    background-image: linear-gradient(to right, rgba(2, 191, 180, 1) 0%, rgba(171, 0, 255, 1) 51%, rgba(2, 191, 180, 1) 100%);
}

.btn-1000000-hover, .btn-2000000-hover, .btn-3000000-hover, .btn-5000000-hover, .btn-10000000-hover, .btn-charge-wallet-hover {
    background-position: right center;
    color: #fff !important;
    font-weight: bold !important;
    fill: #fff !important;
    text-decoration: none !important;
    border: none !important;
    transition: 0.7s !important;
    box-shadow: 0 0 20px #eee;
}
</style>
