<template>
    <custom-popup v-model="dialog" :cons="cons" hide-overlay hide-confirm transition="dialog-top-transition"
                  max-width="800px" reloadable>
        <increase-transactions/>
    </custom-popup>
</template>

<script>
import IncreaseTransactions from "./increaseTransactions";
import {mapActions} from "vuex";
import CustomPopup from "../../plugins/popup/customPopup";

export default {
    name: "wallet",
    components: {CustomPopup, IncreaseTransactions},
    props: {
        dialogModel: Boolean
    },
    model: {
        prop: 'dialogModel',
        event: 'input'
    },
    data: () => ({
        dialog: false,
        cons: {
            title: 'شارژ کیف پول'
        }
    }),
    watch: {
        dialogModel(val) {
            this.dialog = val
        },
        dialog(val) {
            if (!val) this.toggleWalletDialog();
        }
    },
    methods: {
        ...mapActions('ribbon', ['toggleWalletDialog'])
    }
}
</script>

<style scoped>

</style>
