<template>
    <div class="card-custom card-stretch fill-height">
        <div class="card card-body d-flex flex-column py-4 mt-0 fill-height">

            <div class="d-flex align-items-center">
                <div class="symbol user-avatar symbol-60 symbol-xxl-100 mr-5 align-self-start align-self-xxl-center">
                    <v-hover v-slot:default="{hover}">
                        <div class="symbol-label" :class="hover ? 'elevation-8' : 'elevation-4'"
                             :style="`background-image: url('${userImage}')`"/>
                    </v-hover>

                    <i class="symbol-badge bg-success"></i>
                </div>
                <div>
                    <a href="#" class="font-weight-bold font-size-h5 text-dark-75 text-hover-primary">
                        {{ name }}
                    </a>
                    <div class="text-muted">
                        {{ username }}
                    </div>
                </div>
            </div>

            <div class="pt-12 pb-5">
                <div class="d-flex align-items-center justify-content-between mb-5">
                    <span class="font-weight-bold text-dark mr-2">ایمیل:</span>
                    <span class="text-dark">{{ email }}</span>
                </div>
                <div class="d-flex align-items-center justify-content-between mb-5">
                    <span class="font-weight-bold text-dark mr-2">شماره موبایل:</span>
                    <span class="">{{ phone }}</span>
                </div>
                <div class="d-flex align-items-center justify-content-between mb-5">
                    <span class="font-weight-bold text-dark mr-2">نوع پنل:</span>
                    <span class="text-hover-info text-left">{{ packTitle }}</span>
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
import {mapGetters} from 'vuex'

export default {
    name: "userProfile",
    data: () => ({
        userInfo: {},
    }),
    methods: {
        changeProfile() {
            window.open(`${this.front_url}/#/profile/my-profile`)
        },
    },
    computed: {
        ...mapGetters("ribbon", ["core"]),
        userType() {
            let type = 'نامشخص';

            if (this.core?.user?.length > 0 && this.core.user[0].type) {
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
            }
            return type
        },
        packTitle() {
            return this.core?.pack?.length > 0 && this.core.pack[0].title ?
                this.core.pack[0].title + ' ' + this.core.pack[0].expire + ' روزه' :
                'اطلاعات پروفایل تکمیل نشده است';
        },
        email() {
            return this.core?.user?.length > 0 && this.core?.user[0].email ? this.core?.user[0].email : 'ندارد';
        },
        phone() {
            return this.core?.user?.length > 0 && this.core?.user[0].phone ? this.core?.user[0].phone : 'بدون شماره';
        },
        name() {
            return this.core?.user?.length > 0 && this.core?.user[0].name ? this.core.user[0].name : 'بدون نام';
        },
        username() {
            return this.core?.user?.length > 0 && this.core?.user[0].username ? this.core.user[0].username : 'نامشخص';
        },
        userImage() {
            return this.core?.user?.length > 0 && this.core?.user[0].image
                ? 'http://api.terminalads.com/storage/' + this.core?.user[0].image
                : require('../../assets/img/user_avatar.jpeg')
        }
    }
}
</script>

<style>
.symbol.user-avatar,
.symbol.user-avatar .symbol-label {
    transition: all .3s ease-out;
}

.symbol.user-avatar:hover {
    transform: scale(1.1);
}
</style>