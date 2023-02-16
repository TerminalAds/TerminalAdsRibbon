<template>
    <v-dialog v-model="dialog" hide-overlay transition="dialog-top-transition" scrollable max-width="800px">
        <v-card flat>
            <v-card-title>
                شارژ کیف پول
                <v-spacer/>
                <v-btn icon @click="$emit('input', false)">
                    <v-icon small color="red" class="text-danger">close</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider/>

            <increase-transactions></increase-transactions>
        </v-card>
    </v-dialog>
</template>

<script>
import IncreaseTransactions from "./increaseTransactions";

export default {
    name: "wallet",
    components: {IncreaseTransactions},
    props: {
        dialogModel: Boolean
    },
    model: {
        prop: 'dialogModel',
        event: 'input'
    },
    data: () => ({
        dialog: false,
    }),
    watch: {
        dialogModel(val) {
            this.dialog = val
        }
    }
}
</script>

<style scoped>

</style>
