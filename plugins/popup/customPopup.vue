<template>
    <v-dialog v-model="dialog" :max-width="maxWidth" :hide-overlay="hideOverlay" :transition="transition"
              :scrollable="scrollable">
        <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on">
                <slot name="activator"/>
            </div>
        </template>

        <v-card flat height="fit-content" class="overflow-y-auto" max-height="calc(100vh - 120px)">
            <v-card-title class="sticky-top align-center popup-title flex-nowrap pa-2 pa-md-4">
                <span v-if="!$slots.extension" class="font-size-h4 white--text" v-text="cons.title || 'پاپ آپ'"/>
                <v-spacer v-if="!$slots.extension"/>

                <slot v-if="rerender" name="extension"/>

                <div class="pt-2 pa-md-0" v-if="rerender">
                    <slot name="title"/>
                </div>

                <v-btn v-if="!hideConfirm" min-width="36" class="ms-2 px-0" color="green lighten-3" depressed
                       @click="onHandler('submit')" title="تایید" :disabled="getDisabled('submit')">
                    <v-icon color="green darken-4">mdi-check</v-icon>
                </v-btn>

                <v-btn v-if="reloadable" depressed style="margin-right: 8px" color="rgb(215,187,227)"
                       @click="reloadPopup" min-width="36" class="px-0" title="به روزرسانی">
                    <v-icon color="#7b1fa2">mdi-reload</v-icon>
                </v-btn>

                <v-btn min-width="36" class="ms-2 px-0 text-danger" color="#fcc1c7" depressed
                       @click="closeDialog" title="بستن">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text ref="popup-card" class="pa-0" v-if="rerender" v-show="!loading">
                <slot name="default"/>
            </v-card-text>

            <v-card v-if="loading" flat width="100%" min-height="200" :height="cardHeight ? cardHeight : '200'"
                    max-height="calc(100vh - 188px)" class="d-flex align-center justify-center">
                <atom-spinner :animation-duration="1500" :size="100" class="mx-auto" color="var(--v-primary-base)"/>
            </v-card>

            <slot v-if="rerender" name="action"/>
        </v-card>
    </v-dialog>
</template>

<script>
import {AtomSpinner} from 'epic-spinners'

export default {
    name: "customPopup",

    components: {AtomSpinner},

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
        hideOverlay: Boolean,
        transition: String,
        scrollable: Boolean,
        reloadable: Boolean
    },

    model: {
        prop: 'value',
        event: 'input'
    },

    data: () => ({
        dialog: false,
        rerender: true,
        cardHeight: null,
        loading: false,
    }),

    watch: {
        value: function (val) {
            this.dialog = val
        },
        dialog: function (val) {
            // if (!val) {
            this.$emit('input', val);
            // }
        }
    },

    methods: {
        onHandler(type) {
            if (this.cons.buttons && this.cons.buttons.length > 0) {
                const obj = this.cons.buttons.filter((item) => item.type === type)[0]
                if (obj && typeof obj.handler === 'function')
                    obj.handler()
            }
            this.closeDialog()
        },
        getDisabled(type) {
            if (this.cons.buttons && this.cons.buttons.length > 0) {
                const obj = this.cons.buttons.filter((item) => item.type === type)[0]
                return obj && obj.disabled ? typeof obj.disabled === 'function' ? obj.disabled() : obj.disabled : false
            }
            return false
        },
        reloadPopup() {
            let card = this.$refs['popup-card']
            if (card) {
                this.cardHeight = card.getBoundingClientRect().height
            }

            this.rerender = false;
            this.loading = true
            this.$nextTick(() => {
                this.rerender = true
                setTimeout(() => {
                    this.loading = false
                    this.$emit('on-reload')
                }, 500)
            })
        },
        closeDialog() {
            this.dialog = false
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