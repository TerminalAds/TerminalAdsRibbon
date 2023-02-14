<template>
    <div class="card-custom card-stretch" v-if="userInfo">
        <!--begin::Header-->
        <div class="card card-body d-flex flex-column py-4 mt-0">
            <!--begin::Chart-->
            <!--begin::User-->
            <div class="d-flex align-items-center">
                <div class="symbol symbol-60 symbol-xxl-100 mr-5 align-self-start align-self-xxl-center">
                    <div class="symbol-label"
                         style="background-image: url('http://api.terminalads.com/avatar/blank.jpg')"/>
                    <i class="symbol-badge bg-success"></i>
                </div>
                <div>
                    <a href="#" class="font-weight-bold font-size-h5 text-dark-75 text-hover-primary">
                        {{ userInfo.name | isEmpty }}
                    </a>
                    <div class="text-muted">
                        {{ userInfo.username | isEmpty }}
                    </div>
                </div>
            </div>
            <!--end::User-->

            <!--begin::Contact-->
            <div class="pt-12 pb-5">
                <div class="d-flex align-items-center justify-content-between mb-5">
                    <span class="font-weight-bold text-dark mr-2">ایمیل:</span>
                    <span class="text-dark">
                                    {{ userInfo.email ? userInfo.email : 'ندارد' }}
                                </span>
                </div>
                <div class="d-flex align-items-center justify-content-between mb-5">
                    <span class="font-weight-bold text-dark mr-2">شماره موبایل:</span>
                    <span class="">{{ userInfo.phone | isEmpty }}</span>
                </div>
                <div class="d-flex align-items-center justify-content-between mb-5">
                    <span class="font-weight-bold mr-2">نوع کاربر:</span>
                    <span v-if="userInfo.type" class="">{{ userInfo.type ? 'حقوقی' : 'حقیقی' }}</span>
                    <span v-else class="text-muted">هنوز اطلاعات خود راتکمیل نکرده است</span>
                </div>
                <div class="d-flex align-items-center justify-content-between mb-5">
                    <span class="font-weight-bold text-dark mr-2">نوع پنل:</span>
                    <!--                            <span v-if="pack.title" class="text-hover-info">{{ pack.title }}</span>-->
                    <span v-if="false" class="text-hover-info">{{ pack.title }}</span>
                    <span v-else>اطلاعات پروفایل تکمیل نشده است</span>
                </div>
            </div>
            <!--end::Contact-->

            <button @click="changeProfile"
                    class="btn btn-info font-weight-bold py-3 px-6 text-center btn-block">
                مشاهده پروفایل
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "userProfile",

    data: () => ({
        userInfo: null,
    }),

    mounted() {
        this.$DashboardAxios.get('/api/core/profile')
            .then(({data}) => {
                this.userInfo = data.data
            })
    },

    methods: {
        changeProfile() {
            window.open(`${this.$sarveLandFront}/#/profile/my-profile`)
        },
    }
}
</script>

<style scoped>

</style>