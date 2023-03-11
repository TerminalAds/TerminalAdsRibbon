<template>
    <v-dialog v-model="dialog" :max-width="maxWidth" :hide-overlay="hideOverlay" :transition="transition"
              :scrollable="scrollable">
        <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on" class="d-inline-block">
                <slot name="activator"/>
            </div>
        </template>

        <v-card flat height="fit-content" class="overflow-y-auto" max-height="calc(100vh - 120px)"
                :class="{'popup-card-loading' : showLoading}">
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

            <v-card-text class="pa-0" v-if="rerender">
                <slot name="default"/>
            </v-card-text>

            <v-card color="rgba(255, 255, 255, .8)" v-if="showLoading" flat width="100%" height="calc(100% - 68px)"
                    max-height="calc(100% - 68px)" class="d-flex align-center justify-center loading-wrapper">
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
        reloadable: Boolean,
        loading: Boolean
    },

    model: {
        prop: 'value',
        event: 'input'
    },

    data: () => ({
        dialog: false,
        rerender: true,
        cardHeight: null,
        showLoading: false,
    }),

    watch: {
        value: function (val) {
            this.dialog = val
        },
        dialog: function (val) {
            // if (!val) {
            this.$emit('input', val);
            // }
        },
        loading(val) {
            this.showLoading = val
        },
        showLoading(val) {
            this.$emit('update:loading', val)
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
            this.rerender = false;
            this.showLoading = true
            this.$nextTick(() => {
                this.rerender = true
                setTimeout(() => {
                    this.showLoading = false
                    this.$emit('on-reload')
                }, 1000)
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

.loading-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 99;
}

.popup-card-loading {
    overflow: hidden !important;
}
</style>