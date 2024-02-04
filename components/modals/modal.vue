<template>
    <v-app
            v-if="isShow"
    >
        <v-container fluid>
<!--            <WaitStatusDialog-->
<!--                    :loading="isLoading"-->
<!--                    :show="isShow"-->
<!--                    :closable="! isLoading"-->
<!--                    @onShowChange="(n) => show(n)"-->
<!--            >-->

<!--                <v-card-text class="d-flex align-center justify-center m-0 p-0 align-content-center">-->
<!--                    <div class="text-center py-2">-->
<!--                        <span class="d-block font-weight-bold font-size-h1 mt-2">{{ title }}</span>-->
<!--                        <span class="d-block my-2">{{ message }}</span>-->

<!--                        <v-textarea-->
<!--                                v-if="data"-->
<!--                                v-model="data"-->
<!--                                class="mt-0 pt-1 mb-0 pb-0 mx-2 rightFlexDirection"-->
<!--                                filled-->
<!--                                readonly-->

<!--                        ></v-textarea>-->

<!--                        <div>-->
<!--                            <v-btn v-for="btn in buttons" @click="btn.click === 'close' ? show(false) : btn.click()"-->
<!--                                   :color="btn.color" :class="btn.class" depressed>-->
<!--                                {{ btn.text }}-->
<!--                            </v-btn>-->
<!--                        </div>-->

<!--                    </div>-->

<!--                    <v-img-->
<!--                            v-if="image"-->
<!--                            :src="image"-->
<!--                            max-height="200"-->
<!--                            max-width="200"-->
<!--                            contain-->
<!--                    />-->

<!--                </v-card-text>-->

<!--                &lt;!&ndash;        <div v-else-if="response.responseCode == 200">&ndash;&gt;-->
<!--                &lt;!&ndash;          <v-card-text class="d-flex align-center justify-center m-0 p-0 align-content-center">&ndash;&gt;-->
<!--                &lt;!&ndash;            <div class="text-center py-5">&ndash;&gt;-->
<!--                &lt;!&ndash;              <span class="d-block font-weight-bold font-size-h1">{{ $t("INFOS.SuccessSentSms") }}</span>&ndash;&gt;-->
<!--                &lt;!&ndash;              <span class="d-block mt-4">{{ $t("INFOS.SmsRequestInQueue") }}</span>&ndash;&gt;-->

<!--                &lt;!&ndash;              <p class="mt-3">&ndash;&gt;-->
<!--                &lt;!&ndash;                <span v-text="$t('FORMS.SourceNumber')"></span> : <span class="font-weight-bold"&ndash;&gt;-->
<!--                &lt;!&ndash;                                                                        v-text="' ' + (response.payload.data.Message.operator)"></span>&ndash;&gt;-->
<!--                &lt;!&ndash;              </p>&ndash;&gt;-->

<!--                &lt;!&ndash;              <p >&ndash;&gt;-->
<!--                &lt;!&ndash;                <span v-text="$t('GLOBAL.MciNumberCount')"></span> : <span class="font-weight-bold"&ndash;&gt;-->
<!--                &lt;!&ndash;                                                                           v-text="' ' + (response.payload.data.Message.mciCount)"></span>&ndash;&gt;-->
<!--                &lt;!&ndash;              </p>&ndash;&gt;-->

<!--                &lt;!&ndash;              <p >&ndash;&gt;-->
<!--                &lt;!&ndash;                <span v-text="$t('GLOBAL.MtuNumberCount')"></span> : <span class="font-weight-bold"&ndash;&gt;-->
<!--                &lt;!&ndash;                                                                           v-text="' ' + (response.payload.data.Message.irancellCount)"></span>&ndash;&gt;-->
<!--                &lt;!&ndash;              </p>&ndash;&gt;-->

<!--                &lt;!&ndash;              <p >&ndash;&gt;-->
<!--                &lt;!&ndash;                <span v-text="$t('FORMS.SmsCount')"></span> : <span class="font-weight-bold"&ndash;&gt;-->
<!--                &lt;!&ndash;                                                                    v-text="' ' + response.payload.data.Message.countSmS"></span>&ndash;&gt;-->
<!--                &lt;!&ndash;              </p>&ndash;&gt;-->

<!--                &lt;!&ndash;              <p >&ndash;&gt;-->
<!--                &lt;!&ndash;                <span v-text="$t('FORMS.Price')"></span> : <span class="font-weight-bold"&ndash;&gt;-->
<!--                &lt;!&ndash;                                                                 v-text="' ' + response.payload.data.Message.price"></span>&ndash;&gt;-->
<!--                &lt;!&ndash;              </p>&ndash;&gt;-->

<!--                &lt;!&ndash;              <div>&ndash;&gt;-->
<!--                &lt;!&ndash;                <v-btn @click="dialog.show = false" class="primary mt-3" depressed>&ndash;&gt;-->
<!--                &lt;!&ndash;                  {{ $t("BUTTONS.Reports") }}&ndash;&gt;-->
<!--                &lt;!&ndash;                </v-btn>&ndash;&gt;-->
<!--                &lt;!&ndash;                <v-btn @click="dialog.show = false" class="mt-3" depressed>&ndash;&gt;-->
<!--                &lt;!&ndash;                  {{ $t("BUTTONS.OK") }}&ndash;&gt;-->
<!--                &lt;!&ndash;                </v-btn>&ndash;&gt;-->
<!--                &lt;!&ndash;              </div>&ndash;&gt;-->

<!--                &lt;!&ndash;            </div>&ndash;&gt;-->

<!--                &lt;!&ndash;            <v-img&ndash;&gt;-->
<!--                &lt;!&ndash;                class=" my-3 ms-5"&ndash;&gt;-->
<!--                &lt;!&ndash;                src="media/error/success.png"&ndash;&gt;-->
<!--                &lt;!&ndash;                max-height="150"&ndash;&gt;-->
<!--                &lt;!&ndash;                max-width="150"&ndash;&gt;-->
<!--                &lt;!&ndash;                contain&ndash;&gt;-->
<!--                &lt;!&ndash;            />&ndash;&gt;-->

<!--                &lt;!&ndash;          </v-card-text>&ndash;&gt;-->

<!--                &lt;!&ndash;        </div>&ndash;&gt;-->

<!--                &lt;!&ndash;        <div v-else-if="response.responseCode == 402">&ndash;&gt;-->
<!--                &lt;!&ndash;          <v-card-text class="d-flex align-center justify-center m-0 p-0 align-content-center">&ndash;&gt;-->
<!--                &lt;!&ndash;            <div class="text-center">&ndash;&gt;-->
<!--                &lt;!&ndash;              <span class="d-block font-weight-bold font-size-h1">{{ $t("ERRORS.NoAccountCharge") }}</span>&ndash;&gt;-->
<!--                &lt;!&ndash;              <span class="d-block mt-4">{{ $t("ERRORS.PleaseChargeYourAccount") }}</span>&ndash;&gt;-->
<!--                &lt;!&ndash;              <div>&ndash;&gt;-->
<!--                &lt;!&ndash;                <v-btn @click="dialog.show = false" class="primary mt-3" depressed>&ndash;&gt;-->
<!--                &lt;!&ndash;                  {{ $t("BUTTONS.AccountCharge") }}&ndash;&gt;-->
<!--                &lt;!&ndash;                </v-btn>&ndash;&gt;-->
<!--                &lt;!&ndash;                <v-btn @click="dialog.show = false" class="mt-3" depressed>&ndash;&gt;-->
<!--                &lt;!&ndash;                  {{ $t("BUTTONS.OK") }}&ndash;&gt;-->
<!--                &lt;!&ndash;                </v-btn>&ndash;&gt;-->
<!--                &lt;!&ndash;              </div>&ndash;&gt;-->

<!--                &lt;!&ndash;            </div>&ndash;&gt;-->

<!--                &lt;!&ndash;            <v-img&ndash;&gt;-->
<!--                &lt;!&ndash;                src="media/error/no_balance.png"&ndash;&gt;-->
<!--                &lt;!&ndash;                max-height="200"&ndash;&gt;-->
<!--                &lt;!&ndash;                max-width="200"&ndash;&gt;-->
<!--                &lt;!&ndash;                contain&ndash;&gt;-->
<!--                &lt;!&ndash;            />&ndash;&gt;-->

<!--                &lt;!&ndash;          </v-card-text>&ndash;&gt;-->

<!--                &lt;!&ndash;        </div>&ndash;&gt;-->

<!--                &lt;!&ndash;        <div v-else-if="response.responseCode == 403">&ndash;&gt;-->
<!--                &lt;!&ndash;          <v-card-text class="d-flex align-center justify-center m-0 p-0 align-content-center">&ndash;&gt;-->
<!--                &lt;!&ndash;            <div class="text-center">&ndash;&gt;-->
<!--                &lt;!&ndash;              <span class="d-block font-weight-bold font-size-h1">{{ $t("ERRORS.NoAccess") }}</span>&ndash;&gt;-->
<!--                &lt;!&ndash;              <span class="d-block mt-4">{{ $t("ERRORS.PleasebyeAPlane") }}</span>&ndash;&gt;-->
<!--                &lt;!&ndash;              <div>&ndash;&gt;-->
<!--                &lt;!&ndash;                <v-btn @click="dialog.show = false" class="primary mt-3" depressed>&ndash;&gt;-->
<!--                &lt;!&ndash;                  {{ $t("BUTTONS.BuyAPlane") }}&ndash;&gt;-->
<!--                &lt;!&ndash;                </v-btn>&ndash;&gt;-->
<!--                &lt;!&ndash;                <v-btn @click="dialog.show = false" class="mt-3" depressed>&ndash;&gt;-->
<!--                &lt;!&ndash;                  {{ $t("BUTTONS.OK") }}&ndash;&gt;-->
<!--                &lt;!&ndash;                </v-btn>&ndash;&gt;-->
<!--                &lt;!&ndash;              </div>&ndash;&gt;-->

<!--                &lt;!&ndash;            </div>&ndash;&gt;-->

<!--                &lt;!&ndash;            <v-img&ndash;&gt;-->
<!--                &lt;!&ndash;                src="media/error/access_denied.png"&ndash;&gt;-->
<!--                &lt;!&ndash;                max-height="200"&ndash;&gt;-->
<!--                &lt;!&ndash;                max-width="200"&ndash;&gt;-->
<!--                &lt;!&ndash;                contain&ndash;&gt;-->
<!--                &lt;!&ndash;            />&ndash;&gt;-->

<!--                &lt;!&ndash;          </v-card-text>&ndash;&gt;-->

<!--                &lt;!&ndash;        </div>&ndash;&gt;-->

<!--                &lt;!&ndash;        <div v-else>&ndash;&gt;-->


<!--                &lt;!&ndash;        </div>&ndash;&gt;-->


<!--            </WaitStatusDialog>-->
        </v-container>
    </v-app>

</template>

<script>
// import WaitStatusDialog from "../../core/plugins/EasyModal/components/dialogs/WaitStatusDialog";
import {mapActions, mapGetters} from "vuex";

export default {
    name: "modal",
    // components: {WaitStatusDialog},
    data() {
        return {}
    },
    computed: {
        ...mapGetters('modal', ['isLoading', 'isShow', 'message', 'title', 'data', 'image', 'buttons'])
    },
    methods: {
        ...mapActions('modal', ['show'])
    }
}
</script>

<style>
.modal-v-app, .modal-v-app .v-application--wrap {
    height: 0 !important;
}
</style>