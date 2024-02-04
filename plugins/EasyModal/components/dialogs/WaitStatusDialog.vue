<template>
    <v-dialog v-model="show" :width="loading ? 250 : width" :persistent="!closable"
              @click:outside="$emit('outsideClick')">
        <v-card v-if="loading" class="fill-height">

            <v-card-text class="text-center d-flex flex-column justify-center align-center">
                <!--                <div class="d-flex justify-center mb-3 pt-3 mx-auto">-->
                <!--                    <v-img src="sms.ico" max-height="80" max-width="80" contain/>-->
                <!--                </div>-->

                <p class="font-weight-bold font-size-h4 ">
                    {{ i18n.t('Loading.Waiting') }} ...
                </p>

                <atom-spinner class="mx-auto mt-10" :animation-duration="1000" :size="100" color="primary"/>
            </v-card-text>

            <p class="text-center mb-0 description">{{ i18n.t('Loading.Description') }}</p>
            <v-divider class="my-0 py-0"/>
        </v-card>

        <v-card v-else>
            <slot/>
        </v-card>
    </v-dialog>
</template>

<script>
import {AtomSpinner} from 'epic-spinners'

import i18n from "../../i18n";

export default {
    name: "WaitStatusDialog",
    components: {AtomSpinner},
    props: {
        show: {
            type: false,
            default: false
        },
        closable: true,
        loading: {
            type: Boolean,
            default: true
        },
        width: {
            default: 500
        }
    },
    data() {
        return {
            i18n
        }
    },
    watch: {
        show(n, o) {
            this.$emit("onShowChange", n)
        }
    }
}
</script>

<style scoped>
.description {
    font-size: 0.7rem;
    color: darkgray;
}
</style>