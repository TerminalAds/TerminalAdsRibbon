<template>
    <v-row no-gutters>
        <v-col cols="12" sm="6" class="pa-2">
            <div class="bgi-no-repeat bgi-no-repeat bgi-size-cover rounded-lg"
                 style="height: 180px; background-position:center"
                 :style="{backgroundImage: `url('media/bg/bg-10.jpg')`}">

                <div class="card-body d-flex flex-column">
                    <a href="#"
                       class="text-white text-hover-primary font-weight-bolder font-size-h6">بسته های فعال </a>
                    <a href="#" class="text-white text-hover-primary font-weight-bolder mt-3"
                       style="font-size: 8pt">شما هیچ بسته فعالی ندارید.</a>

                    <div class="mt-12">
                        <b-progress :max="pack.expire" height="18px" v-b-tooltip.hover
                                    title="شما هیچ بسته ای ندارید." show-value :value="pack.diff_day"
                                    :variant="(pack.expire *20 / 100) < pack.diff_day  ? 'primary' : 'danger'"
                                    :striped="true" :animated="true"></b-progress>
                    </div>
                </div>
            </div>
        </v-col>

        <v-col cols="12" sm="6" class="pa-2">
            <v-card flat color="#ddeaf6" class="d-flex justify-space-between overflow-hidden rounded-lg"
                    height="180">
                <div class="pa-6 d-flex flex-column justify-center text-center flex-grow-1">
                    <h6 style="font-size: 10pt">سامانه را به دوستان خود معرفی کنید.
                        <span class="btn-link text-primary line-height-lg cursor-pointer"
                              @click.stop="giftDialog = true">هدیه</span>
                        دریافت کنید.
                    </h6>
                    <input :disabled="loading" class="form-control" :maxlength="11" v-model="phoneNumber" type="number"
                           placeholder="شماره را وارد نمایید.">
                    <v-btn class="py-1 mt-5 white--text rounded-lg" style="margin-right: auto;" depressed width="100"
                           height="30"
                           min-height="30"
                           @click="invite" :loading="loading" color="#8950fc">
                        دعوت کن!
                    </v-btn>
                </div>

                <div class="d-none d-md-block">
                    <img class="img-fluid" style="max-height: 120px;object-fit: contain;width: 150px"
                         src="https://cdn.dribbble.com/users/1247188/screenshots/8699871/media/4676a06d00a58fe9678d80fe1f8bd776.jpg?compress=1&resize=400x300"
                         alt="">
                </div>
            </v-card>
        </v-col>

        <custom-popup v-model="giftDialog" :cons="cons" max-width="700" transition="slide-y-transition" hide-confirm>
            <v-card flat min-height="500" class="d-flex flex-column justify-center">
                <v-spacer/>
                <v-card-text class="d-flex align-center justify-center">
                    <v-img width="100%" contain src="https://core-robot.terminalads.com/inviteFriends.jpeg"
                           class="rounded">
                        <template v-slot:placeholder>
                            <v-card flat class="transparent d-flex justify-center align-center" width="100%"
                                    height="100%">
                                <v-progress-circular indeterminate color="primary" width="5" size="35"/>
                            </v-card>
                        </template>
                    </v-img>
                </v-card-text>
                <v-spacer/>
                <v-divider/>
                <v-card-actions class="pa-4">
                    <v-spacer/>
                    <v-btn color="blue lighten-2" class="white--text px-3" depressed @click.stop="giftDialog = false">
                        متوجه شدم
                    </v-btn>
                </v-card-actions>
            </v-card>
        </custom-popup>
    </v-row>
</template>

<script>
import {mapGetters} from 'vuex'
import CustomPopup from "../../plugins/popup/customPopup";

export default {
    name: "packInvite",
    components: {CustomPopup},
    data: () => ({
        cons: {
            title: 'دریافت هدیه'
        },
        phoneNumber: '',
        giftDialog: false,
        loading: false,
        expire: 0,
    }),

    computed: {
        ...mapGetters("ribbon", ["core"]),
        pack() {
            return this.core?.pack?.length > 0 && this.core?.pack[0]
        }
    },

    methods: {
        invite() {
            if (this.phoneNumber === '' || this.phoneNumber.length <= 10) {
                this.$toast.error('لطفا شماره صحیح وارد نمایید.')
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
                .finally(() => this.loading = false)
        },
        fillExpire(expire_date) {
            if (!expire_date) {
                this.expire = "∞"
                return;
            }
            var expireDate = new Date(expire_date).getTime();
            let now = new Date().getTime();
            let diff = this.datediff(now, expireDate);
            this.expire = Math.max(Math.round(100 - (((this.pack.expire - diff) / this.pack.expire) * 100)), 0);
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