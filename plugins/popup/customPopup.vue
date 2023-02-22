<template>
    <v-dialog v-model="dialog" :max-width="maxWidth">
        <v-card flat height="fit-content" min-height="350" max-height="calc(100vh - 120px)">
            <v-card-title class="sticky-top align-center"
                          style="background-size: cover !important;background: linear-gradient(to left, #089D88 0%, #03BACF 51%, #514A9D 100%);word-break: break-word">
                <span class="font-size-h4 white--text" v-text="cons.title || 'پاپ آپ'"/>
                <v-spacer/>

                <div class="pt-2 pa-md-0">
                    <slot name="title"/>
                </div>

                <v-btn v-if="!hideConfirm" min-width="36" class="ms-2 px-0" color="green lighten-3" depressed
                       @click="onHandler('submit')" title="تایید" style="order: 3">
                    <v-icon color="green darken-4">mdi-check</v-icon>
                </v-btn>

                <v-btn min-width="36" class="ms-2 px-0 text-danger" color="#fcc1c7" depressed
                       @click="$emit('input', false)" title="بستن" style="order: 2">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text class="pa-0">
                <slot name="default"/>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "customPopup",

    props: {
        cons: Object,
        value: Boolean,
        hideConfirm: Boolean,
        maxWidth: {
            type: [Number, String],
            default: '1024'
        }
    },

    model: {
        prop: 'value',
        event: 'input'
    },

    data: () => ({
        dialog: false,
    }),

    watch: {
        value: function (val) {
            this.dialog = val
        },
        dialog: function (val) {
            if (!val) {
                this.$emit('input', false);
            }
        }
    },

    methods: {
        onHandler(type) {
            if (this.cons.buttons && this.cons.buttons.length > 0) {
                const obj = this.cons.buttons.filter((item) => item.type === type)[0]
                if (obj && typeof obj.handler === 'function')
                    obj.handler()
            }
            this.$emit('input', false);
        }
    }
}
</script>

<style scoped>

</style>