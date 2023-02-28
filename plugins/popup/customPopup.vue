<template>
    <v-dialog v-model="dialog" :max-width="maxWidth" :hide-overlay="hideOverlay" :transition="transition"
              :scrollable="scrollable">
        <v-card flat height="fit-content" class="overflow-y-auto" max-height="calc(100vh - 120px)">
            <v-card-title class="sticky-top align-center popup-title flex-nowrap pa-2 pa-md-4">
                <span v-if="!$slots.extension" class="font-size-h4 white--text" v-text="cons.title || 'پاپ آپ'"/>
                <v-spacer v-if="!$slots.extension"/>

                <slot name="extension"/>

                <div class="pt-2 pa-md-0">
                    <slot name="title"/>
                </div>

                <v-btn v-if="!hideConfirm" min-width="36" class="ms-2 px-0" color="green lighten-3" depressed
                       @click="onHandler('submit')" title="تایید" :disabled="getDisabled('submit')">
                    <v-icon color="green darken-4">mdi-check</v-icon>
                </v-btn>

                <v-btn min-width="36" class="ms-2 px-0 text-danger" color="#fcc1c7" depressed
                       @click="$emit('input', false)" title="بستن">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text class="pa-0">
                <slot name="default"/>
            </v-card-text>

            <slot name="action"/>
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
        },
        maxHeight: {
            type: [Number, String],
            default: undefined
        },
        scrollable: Boolean,
        hideOverlay: Boolean,
        transition: String
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
        },
        getDisabled(type) {
            if (this.cons.buttons && this.cons.buttons.length > 0) {
                const obj = this.cons.buttons.filter((item) => item.type === type)[0]
                return obj && obj.disabled ? typeof obj.disabled === 'function' ? obj.disabled() : obj.disabled : false
            }
            return false
        }
    }
}
</script>

<style scoped>
.popup-title {
    background-size: cover !important;
    background: linear-gradient(to left, #089D88 0%, #03BACF 51%, #514A9D 100%);
    word-break: break-word;
}
</style>