<template>
    <div class="card-custom card-stretch">
        <div class="card card-body d-flex flex-column py-4 mt-0">

            <div class="d-flex align-items-center">
                <div class="symbol symbol-60 symbol-xxl-100 mr-5 align-self-start align-self-xxl-center">
                    <div class="symbol-label"
                         :style="`background-image: url('http://api.terminalads.com/avatar/blank.jpg')`"/>
                    <i class="symbol-badge bg-success"></i>
                </div>
                <div>
                    <a href="#" class="font-weight-bold font-size-h5 text-dark-75 text-hover-primary">
                        {{ core.user[0].name ?? 'بدون نام' }}
                    </a>
                    <div class="text-muted">
                        {{ core.user[0].username ?? 'نامشخص' }}
                    </div>
                </div>
            </div>

            <div class="pt-12 pb-5">
                <div class="d-flex align-items-center justify-content-between mb-5">
                    <span class="font-weight-bold text-dark mr-2">ایمیل:</span>
                    <span class="text-dark">{{ core.user[0].email ?? 'ندارد' }}</span>
                </div>
                <div class="d-flex align-items-center justify-content-between mb-5">
                    <span class="font-weight-bold text-dark mr-2">شماره موبایل:</span>
                    <span class="">{{ core.user[0].phone ?? 'بدون شماره' }}</span>
                </div>
                <div class="d-flex align-items-center justify-content-between mb-5">
                    <span class="font-weight-bold text-dark mr-2">نوع پنل:</span>
                    <span class="text-hover-info">{{ packTitle }}</span>
                </div>
                <div class="d-flex align-items-center justify-content-between mb-5">
                    <span class="font-weight-bold mr-2">نوع کاربر:</span>
                    <span class="">{{ userType }}</span>
                </div>
            </div>

            <button @click="changeProfile"
                    class="btn btn-info font-weight-bold py-3 px-6 text-center btn-block rounded-lg">
                مشاهده پروفایل
            </button>
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
    name: "userProfile",
    data: () => ({
        userInfo: {},
    }),
    mounted() {
        // this.$DashboardAxios.get('/api/core/profile')
        //     .then(({data}) => {
        //         this.userInfo = data.data
        //         this.setUser(data.data)
        //     })
    },
    methods: {
        ...mapActions('ribbon', ['setUser']),
        changeProfile() {
            window.open(`${this.front_url}/#/profile/my-profile`)
        },
    },
    computed: {
        ...mapGetters("ribbon", ["core"]),
        userType() {
            let type = 'نامشخص';

            try {
                switch (this.core.user[0].type) {
                    case 'regular' :
                        type = 'حقیقی';
                        break;
                    case 'legal' :
                        type = ' حقوقی';
                        break;
                    default:
                        type = 'نامشخص';
                        break;
                }
            } catch (e) {

            }
            return type
        },
        packTitle() {
            if (this.core.pack[0]) {
                let title = this.core.pack[0].title
                if (this.core.pack[0].expire) {
                    title += ' ' + this.core.pack[0].expire + ' روزه'
                }
                return title
            }
            return 'اطلاعات پروفایل تکمیل نشده است'
        }
    }
}
</script>