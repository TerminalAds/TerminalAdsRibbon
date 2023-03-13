<template>
  <v-app>
    <v-container fluid>
      <WaitStatusDialog
        :loading="isLoading"
        :show="isShow"
        :closable="! isLoading"
        @onShowChange="(n) => show(n)"
      >

        <v-card-text class="d-flex align-center justify-center m-0 p-0 align-content-center">
          <div class="text-center py-2">
            <span class="d-block font-weight-bold font-size-h1 mt-2">{{ title }}</span>
            <span class="d-block my-2">{{ message }}</span>

            <v-textarea
                v-if="data"
                v-model="data"
                class="mt-0 pt-1 mb-0 pb-0 mx-2 rightFlexDirection"
                filled
                readonly

            ></v-textarea>

            <div>
              <v-btn v-for="btn in buttons" @click="btn.click === 'close' ? show(false) : btn.click()" :color="btn.color" :class="btn.class" depressed >
                {{ btn.text }}
              </v-btn>
            </div>

          </div>

          <v-img
              v-if="image"
              :src="image"
              max-height="200"
              max-width="200"
              contain
          />

        </v-card-text>

<!--        <div v-else-if="response.responseCode == 200">-->
<!--          <v-card-text class="d-flex align-center justify-center m-0 p-0 align-content-center">-->
<!--            <div class="text-center py-5">-->
<!--              <span class="d-block font-weight-bold font-size-h1">{{ $t("INFOS.SuccessSentSms") }}</span>-->
<!--              <span class="d-block mt-4">{{ $t("INFOS.SmsRequestInQueue") }}</span>-->

<!--              <p class="mt-3">-->
<!--                <span v-text="$t('FORMS.SourceNumber')"></span> : <span class="font-weight-bold"-->
<!--                                                                        v-text="' ' + (response.payload.data.Message.operator)"></span>-->
<!--              </p>-->

<!--              <p >-->
<!--                <span v-text="$t('GLOBAL.MciNumberCount')"></span> : <span class="font-weight-bold"-->
<!--                                                                           v-text="' ' + (response.payload.data.Message.mciCount)"></span>-->
<!--              </p>-->

<!--              <p >-->
<!--                <span v-text="$t('GLOBAL.MtuNumberCount')"></span> : <span class="font-weight-bold"-->
<!--                                                                           v-text="' ' + (response.payload.data.Message.irancellCount)"></span>-->
<!--              </p>-->

<!--              <p >-->
<!--                <span v-text="$t('FORMS.SmsCount')"></span> : <span class="font-weight-bold"-->
<!--                                                                    v-text="' ' + response.payload.data.Message.countSmS"></span>-->
<!--              </p>-->

<!--              <p >-->
<!--                <span v-text="$t('FORMS.Price')"></span> : <span class="font-weight-bold"-->
<!--                                                                 v-text="' ' + response.payload.data.Message.price"></span>-->
<!--              </p>-->

<!--              <div>-->
<!--                <v-btn @click="dialog.show = false" class="primary mt-3" depressed>-->
<!--                  {{ $t("BUTTONS.Reports") }}-->
<!--                </v-btn>-->
<!--                <v-btn @click="dialog.show = false" class="mt-3" depressed>-->
<!--                  {{ $t("BUTTONS.OK") }}-->
<!--                </v-btn>-->
<!--              </div>-->

<!--            </div>-->

<!--            <v-img-->
<!--                class=" my-3 ms-5"-->
<!--                src="media/error/success.png"-->
<!--                max-height="150"-->
<!--                max-width="150"-->
<!--                contain-->
<!--            />-->

<!--          </v-card-text>-->

<!--        </div>-->

<!--        <div v-else-if="response.responseCode == 402">-->
<!--          <v-card-text class="d-flex align-center justify-center m-0 p-0 align-content-center">-->
<!--            <div class="text-center">-->
<!--              <span class="d-block font-weight-bold font-size-h1">{{ $t("ERRORS.NoAccountCharge") }}</span>-->
<!--              <span class="d-block mt-4">{{ $t("ERRORS.PleaseChargeYourAccount") }}</span>-->
<!--              <div>-->
<!--                <v-btn @click="dialog.show = false" class="primary mt-3" depressed>-->
<!--                  {{ $t("BUTTONS.AccountCharge") }}-->
<!--                </v-btn>-->
<!--                <v-btn @click="dialog.show = false" class="mt-3" depressed>-->
<!--                  {{ $t("BUTTONS.OK") }}-->
<!--                </v-btn>-->
<!--              </div>-->

<!--            </div>-->

<!--            <v-img-->
<!--                src="media/error/no_balance.png"-->
<!--                max-height="200"-->
<!--                max-width="200"-->
<!--                contain-->
<!--            />-->

<!--          </v-card-text>-->

<!--        </div>-->

<!--        <div v-else-if="response.responseCode == 403">-->
<!--          <v-card-text class="d-flex align-center justify-center m-0 p-0 align-content-center">-->
<!--            <div class="text-center">-->
<!--              <span class="d-block font-weight-bold font-size-h1">{{ $t("ERRORS.NoAccess") }}</span>-->
<!--              <span class="d-block mt-4">{{ $t("ERRORS.PleasebyeAPlane") }}</span>-->
<!--              <div>-->
<!--                <v-btn @click="dialog.show = false" class="primary mt-3" depressed>-->
<!--                  {{ $t("BUTTONS.BuyAPlane") }}-->
<!--                </v-btn>-->
<!--                <v-btn @click="dialog.show = false" class="mt-3" depressed>-->
<!--                  {{ $t("BUTTONS.OK") }}-->
<!--                </v-btn>-->
<!--              </div>-->

<!--            </div>-->

<!--            <v-img-->
<!--                src="media/error/access_denied.png"-->
<!--                max-height="200"-->
<!--                max-width="200"-->
<!--                contain-->
<!--            />-->

<!--          </v-card-text>-->

<!--        </div>-->

<!--        <div v-else>-->


<!--        </div>-->


      </WaitStatusDialog>
    </v-container>
  </v-app>

</template>

<script>
import WaitStatusDialog from "./dialogs/WaitStatusDialog";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "modal",
  components: {WaitStatusDialog},
  data(){
    return{

    }
  },
  computed:{
    ...mapGetters('modal', ['isLoading', 'isShow', 'message', 'title', 'data', 'image', 'buttons'])
  },
  methods:{
    ...mapActions('modal', ['show'])
  }
}
</script>

<style scoped>

</style>