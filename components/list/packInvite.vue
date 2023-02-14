<template>
    <v-row no-gutters>
        <v-col cols="12" sm="5" class="pa-2">
            <div
                    class="bgi-no-repeat bgi-no-repeat bgi-size-cover rounded-lg"
                    style="height: 180px; background-position:center"
                    :style="{backgroundImage: `url(${backgroundImage('media/bg/bg-10.jpg')})`}">

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

        <v-col cols="12" sm="7" class="pa-2">
            <v-card flat color="#ddeaf6" class="d-flex justify-space-between overflow-hidden rounded-lg"
                    height="180">
                <div class="pa-6 d-flex flex-column justify-center text-center flex-grow-1">
                    <h6 style="font-size: 10pt">سامانه را به دوستان خود معرفی کنید.
                        <br/>
                        <span class="btn-link text-primary line-height-lg cursor-pointer"
                              @click.stop="giftDialog = true">هدیه</span>
                        دریافت کنید.
                    </h6>
                    <input class="form-control" :maxlength="11" v-model="phoneNumber"
                           placeholder="شماره را وارد نمایید.">
                    <v-btn class="py-1 mt-5 purple lighten-1 white--text" style="margin-right: auto;" depressed
                           @click="invite" min-height="32"
                           height="32" width="100">
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

        <v-dialog v-model="giftDialog" max-width="700" transition="slide-y-transition">
            <v-card flat min-height="500" class="d-flex flex-column justify-center">
                <v-card-title>دریافت هدیه</v-card-title>
                <v-divider/>
                <v-card-text>
                    <v-img width="100%" contain src="https://core-robot.terminalads.com/inviteFriends.jpeg"
                           class="rounded"/>
                </v-card-text>
                <v-divider/>
                <v-card-actions class="pa-4">
                    <v-spacer/>
                    <v-btn color="blue lighten-2" class="white--text px-3" depressed @click.stop="giftDialog = false">
                        متوجه شدم
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
export default {
    name: "packInvite",

    data: () => ({
        pack: [],
        phoneNumber: '',
        giftDialog: false,
    }),

    mounted() {
        this.fetch();
    },

    methods: {
        fetch() {
            this.$DashboardAxios.get('/api/core/pack')
                .then(({data}) => {
                    this.pack = data.data
                    let myDate = this.pack.expired_at;
                    // this.fillExpire(myDate);
                })
        },
        invite() {
            if (this.phoneNumber === '' || this.phoneNumber.length <= 10) {
                this.$toast.error('لطفا شماره صحیح وارد نمایید.')
                return false;
            }

            this.$DashboardAxios.get(`/api/core/invite?phone=${this.phoneNumber}`)
                .then(({data}) => {
                    this.$toast.success('پیام دعوت شما با موفقیت ارسال شد.')
                }).catch(({response}) => {
                if (response.data && response.data.message) {
                    this.$toast.error(response.data.message)
                }
            })
        },
        backgroundImage(path) {
            return process.env.BASE_URL + path;
        },
    }
}
</script>

<style scoped>

</style>