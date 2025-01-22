<template>
  <v-row no-gutters>
    <v-col class="pa-2" cols="12" order="1" order-md="0" sm="6">
      <div v-if="dashboardIntro && $vuetify.breakpoint.lgAndUp" class="h_iframe-aparat_embed_frame">
        <!--        <span style="display: block;padding-top: 57%"></span>-->
        <iframe :src="dashboardIntro.src" allowFullScreen="true"
                mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
      </div>

      <user-pack v-else/>
    </v-col>

    <v-col class="pa-2" cols="12" order="0" order-md="1" sm="6">
      <v-card class="d-flex justify-space-between overflow-hidden rounded-lg fill-height" color="#ddeaf6" flat
              min-height="180">
        <div class="pa-6 d-flex flex-column justify-center text-center flex-grow-1">
          <h6 style="font-size: 10pt">سامانه را به دوستان خود معرفی کنید.
            <span class="btn-link text-primary line-height-lg cursor-pointer"
                  @click.stop="giftDialog = true">هدیه</span>
            دریافت کنید.
          </h6>
          <input id="invite.input" v-model="phoneNumber" v-intersect="onIntersect" :disabled="loading" :maxlength="11"
                 class="form-control" placeholder="شماره را وارد نمایید." @keydown.enter="invite">
          <v-btn :loading="loading" class="py-1 mt-5 white--text rounded-lg" color="#8950fc" depressed height="30"
                 min-height="30" style="margin-right: auto;" width="100" @click="invite">
            دعوت کن!
          </v-btn>
        </div>

        <div class="d-none d-md-block">
          <img alt="" class="img-fluid"
               src="https://cdn.dribbble.com/users/1247188/screenshots/8699871/media/4676a06d00a58fe9678d80fe1f8bd776.jpg?compress=1&resize=400x300"
               style="max-height: 120px;object-fit: contain;width: 150px">
        </div>
      </v-card>
    </v-col>

    <custom-popup v-model="giftDialog" :cons="cons" hide-confirm max-width="700" transition="slide-y-transition">
      <v-card class="d-flex flex-column justify-center" flat min-height="500">
        <v-spacer/>
        <v-card-text class="d-flex align-center justify-center">
          <v-img class="rounded" contain src="https://core-robot.terminalads.com/inviteFriends.jpeg" width="100%">
            <template v-slot:placeholder>
              <v-card class="transparent d-flex justify-center align-center" flat height="100%" width="100%">
                <v-progress-circular color="primary" indeterminate size="35" width="5"/>
              </v-card>
            </template>
          </v-img>
        </v-card-text>
        <v-spacer/>
        <v-divider/>
        <v-card-actions class="pa-4">
          <v-spacer/>
          <v-btn class="white--text px-3" color="blue lighten-2" depressed @click.stop="giftDialog = false">
            متوجه شدم
          </v-btn>
        </v-card-actions>
      </v-card>
    </custom-popup>
  </v-row>
</template>

<script>
import CustomPopup from "../../plugins/popup/customPopup";
import UserPack from "./userPack.vue";
import {mapGetters} from "vuex"

export default {
  name: "packInvite",

  components: {UserPack, CustomPopup},

  data: () => ({
    cons: {
      title: 'دریافت هدیه'
    },
    isIntersecting: false,
    seen: false,
    phoneNumber: '',
    giftDialog: false,
    loading: false,
  }),

  computed: {
    ...mapGetters('ribbon', ['dashboardIntro']),
  },

  methods: {
    invite() {
      if (this.phoneNumber === '' || this.phoneNumber.length <= 10 || !this.phoneNumber.startsWith('09')) {
        this.$toast.error('لطفا شماره صحیح وارد نمایید.')
        this.phoneNumber = ''
        return false;
      }
      this.loading = true

      this.$DashboardAxios.get(`/api/core/invite?phone=${this.phoneNumber}`)
        .then(({data}) => {
          this.$toast.success('پیام دعوت شما با موفقیت ارسال شد.')
        })
        .catch(({response}) => {
          if (response.data && response.data.message) {
            this.$toast.error(response.data.message)
          }
        })
        .finally(() => {
          this.phoneNumber = ''
          this.loading = false
        })
    },
    onIntersect(isIntersecting, entries, observer) {
      if (this.seen) return
      this.seen = true
      // More information about these options
      // is located here: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
      this.isIntersecting = isIntersecting

      const digitPeriodRegExp = new RegExp('\\d|\\.');
      const input = document.getElementById('invite.input')

      input.addEventListener('keydown', function (event) {
        if (event.ctrlKey
          || event.altKey
          || typeof event.key !== 'string'
          || event.key.length !== 1) {
          return;
        }

        if (!digitPeriodRegExp.test(event.key)) {
          event.preventDefault();
        }
      }, false);
    }
  }
}
</script>

<style scoped>
input.form-control::-webkit-outer-spin-button,
input.form-control::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input.form-control[type=number] {
  -moz-appearance: textfield;
}
</style>