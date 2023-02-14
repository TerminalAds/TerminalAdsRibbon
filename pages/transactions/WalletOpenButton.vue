<template>
    <div class="d-flex flex-nowrap align-center">
        <v-card :href="`${front_url}/#/user/transactions`" target="_blank"
                class="d-flex flex-nowrap price-wallet align-self-center" flat
                :max-width="$vuetify.breakpoint.mdAndUp ? '' : 150" :min-width="$vuetify.breakpoint.mdAndUp ? 150 : 85"
                height="32" v-b-tooltip="'لیست تراکنش های شما'" v-if="walletInfo">
            <span>اعتبار</span>

            <span style="max-width: calc(90% - 40px);overflow: hidden;text-overflow: ellipsis;white-space: nowrap;direction: ltr">
                {{ persianNum(currency(walletInfo.balance)) }}
            </span>

            <span class="d-lg-none">&nbsp ر</span>

            <v-icon class="d-none d-lg-block">mdi-currency-rial</v-icon>
        </v-card>

        <v-btn color="#6cdb72" class="price-walletButton px-0" min-width="32" min-height="32" height="32" dark
               depressed @click="$store.dispatch('wallet/toggleOpen')">
            <v-icon class="plus" small>
                mdi-plus
            </v-icon>
        </v-btn>
    </div>
</template>

<script>
const exhale = ms =>
    new Promise(resolve => setTimeout(resolve, ms))

export default {
    name: "WalletOpenButton",
    data: () => ({
        checking: false,
        heartbeats: [],
        walletInfo: null
    }),
    props: {
        hideInMobile: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        let classes = window.document.querySelectorAll(".price-wallet .v-input__control .v-text-field__slot *");
        for (let c of classes) {
            c.classList.add('on-scroll-shoed');
        }

    },
    computed: {
        avg() {
            const sum = this.heartbeats.reduce((acc, cur) => acc + cur, 0)
            const length = this.heartbeats.length

            if (!sum && !length) return 0

            return Math.ceil(sum / length)
        },
    },

    created() {
        this.takePulse(false)

        this.$DashboardAxios.get(`api/core/wallet`).then(({data}) => {
            this.walletInfo = data.data
        })
    },

    methods: {
        heartbeat() {
            return Math.ceil(Math.random() * (120 - 80) + 80)
        },
        async takePulse(inhale = true) {
            this.checking = true

            inhale && await exhale(1000)

            this.heartbeats = Array.from({length: 20}, this.heartbeat)

            this.checking = false
        },
    },
}
</script>

<style scoped>
@media screen and (min-width: 960px) {
    .header-fixed[data-header-scroll=on] .price-wallet,
    .header-fixed[data-header-scroll=on] .price-wallet i {
        color: gray;
    }

    .header-fixed[data-header-scroll=on] .price-wallet {
        background-color: rgba(0, 0, 0, .1);
    }
}

.header-fixed .price-wallet,
.header-fixed .price-wallet i {
    color: #fff;
}

.price-wallet {
    justify-content: space-around;
    align-items: center;
    border-radius: 0 6px 6px 0 !important;
    background-color: rgba(255, 255, 255, .2);
    flex: 0 0 calc(100% - 32px)
}

.price-walletButton {
    border-radius: 6px 0 0 6px !important;
}
</style>
