<template>
    <v-card @click="changeRoute" class="d-flex flex-nowrap price-wallet align-self-center font-size-h4" flat
            :max-width="$vuetify.breakpoint.mdAndUp ? '' : 200" :min-width="$vuetify.breakpoint.mdAndUp ? 232 : 85"
            height="32" v-b-tooltip="'لیست تراکنش های شما'">
        <span>اعتبار</span>

        <v-spacer/>

        <span style="max-width: calc(90% - 40px);overflow: hidden;text-overflow: ellipsis;white-space: nowrap;direction: ltr">
            {{ persianNum(currency(56413465)) }}
        </span>

        <v-spacer class="d-none d-sm-block"/>

        <v-icon class="d-none d-sm-block" v-if="wallet.icon != null && wallet.icon.length > 0" v-text="wallet.icon"/>

        <v-btn color="#6cdb72" class="price-walletButton px-0" style="margin-right: 12px" min-width="32" min-height="32"
               height="32" dark depressed @click.stop="toggleWalletDialog">
            <v-icon class="plus" small>
                mdi-plus
            </v-icon>
        </v-btn>

        <wallet v-model="walletDialog"/>
    </v-card>
</template>

<script>
import Wallet from "./wallet";
import {mapActions, mapGetters} from 'vuex'

const exhale = ms =>
    new Promise(resolve => setTimeout(resolve, ms))

export default {
    name: "WalletOpenButton",
    components: {Wallet},
    data: () => ({
        checking: false,
        heartbeats: []
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
        ...mapGetters('ribbon', ['core', 'walletDialog', 'wallet']),
        balance() {
            return this.wallet?.balance || 0
        },
        avg() {
            const sum = this.heartbeats.reduce((acc, cur) => acc + cur, 0)
            const length = this.heartbeats.length

            if (!sum && !length) return 0

            return Math.ceil(sum / length)
        },
    },
    created() {
        this.takePulse(false)
    },
    methods: {
        ...mapActions('ribbon', ['toggleWalletDialog']),
        changeRoute() {
            let a = document.createElement('a');
            a.target = '_blank';
            a.href = `${this.front_url}/#/user/transactions`;
            a.click()
            document.removeChild(a);
        },
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
.header-fixed .price-wallet,
.header-fixed .price-wallet i {
    color: #fff;
}

.price-wallet {
    padding-right: 12px;
    align-items: center;
    border-radius: 6px !important;
    background-color: rgba(255, 255, 255, .2);
    flex: 1 0 0;
}

.price-walletButton {
    border-radius: 6px 0 0 6px !important;
}
</style>
