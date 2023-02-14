<template>
    <div>
        <div class="d-flex flex-column pt-12 bgi-size-cover bgi-no-repeat rounded-top"
             :style="{ backgroundImage: `url(${backgroundImage})` }">
            <h4 class="d-flex flex-center rounded-top">
                <span class="text-white">نوتیفیکیشن های کاربر</span>
                <span class="btn btn-text btn-success btn-sm font-weight-bold btn-font-md ml-2">
                    {{ this.persian(unreadNotif) }} پیام جدید
                </span>
            </h4>

            <ul class="nav nav-bold nav-tabs nav-tabs-line nav-tabs-line-3x nav-tabs-line-transparent-white nav-tabs-line-active-border-success mt-3 px-8"
                role="tablist">
                <li class="nav-item">
                    <a v-on:click="setActiveTab" data-tab="0" class="nav-link active" data-toggle="tab" href="#"
                       role="tab">
                        پیام ها
                    </a>
                </li>
                <li class="nav-item">
                    <a v-on:click="setActiveTab" data-tab="2" class="nav-link" data-toggle="tab" href="#" role="tab">
                        رویدادها
                    </a>
                </li>
            </ul>
        </div>

        <b-tabs class="hide-tabs" v-model="tabIndex">
            <b-tab active class="p-8">

                <div class="d-flex flex-center text-center text-muted min-h-200px" v-if="unreadNotif===0">
                    <br/>پیام جدیدی موجود نیست!
                </div>

                <perfect-scrollbar v-else class="scroll pr-7 mr-n7" style="max-height: 40vh; position: relative;">
                    <template v-for="(item, i) in notifications.data">
                        <!--begin::Item-->
                        <div class="d-flex align-items-center mb-6" v-bind:key="i" @click="dialogShow(item)">
                            <!--begin::Symbol-->
                            <div class="symbol symbol-40 mr-5" v-bind:class="`symbol-light-${item.data.icon}`">
                                <span class="symbol-label">
                                    <span class="svg-icon svg-icon-lg" v-bind:class="`svg-icon-${item.data.icon}`"/>
                                </span>
                            </div>
                            <!--end::Symbol-->
                            <!--begin::Text-->
                            <div class="d-flex flex-column font-weight-bold">
                                <a @click="dialogShow(item)" class="text-dark text-hover-primary mb-1 font-size-lg">
                                    {{ item.data.title }}
                                </a>
                                <!--                v-html="this.summary(item.data.text)"-->
                                <span class="text-muted text-truncate cursor-pointer" style="width: 7rem;"
                                      v-html="item.data.text" @click="dialogShow(item)">
                                </span>
                            </div>
                        </div>
                    </template>
                </perfect-scrollbar>
            </b-tab>

            <b-tab>
                <perfect-scrollbar class="navi navi-hover scroll my-4" style="max-height: 40vh; position: relative;">
                    <template v-for="(item, i) in list2">
                        <a href="#" class="navi-item" v-bind:key="i">
                            <div class="navi-link">
                                <div class="navi-icon mr-2">
                                    <i v-bind:class="item.icon"></i>
                                </div>
                                <div class="navi-text">
                                    <div class="font-weight-bold">
                                        {{ item.title }}
                                    </div>
                                    <div class="text-muted">
                                        {{ item.desc }}
                                    </div>
                                </div>
                            </div>
                        </a>
                    </template>
                </perfect-scrollbar>
            </b-tab>

            <b-tab>
                <div class="d-flex flex-center text-center text-muted min-h-200px">
                    <br/>رویداد جدیدی موجود نیست!
                </div>
            </b-tab>
        </b-tabs>

        <v-dialog transition="dialog-bottom-transition" max-width="600" v-model="dialog">
            <template v-slot:default="dialog">
                <v-card>
                    <v-toolbar color="primary">
                        <div class="text-h3 text-center">{{ dialogData.data.title }}</div>
                    </v-toolbar>
                    <v-card-text>
                        <div class="text-h5 pt-5" v-html="dialogData.data.text"></div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text @click="seenDialog">مشاهده کردم</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>

    </div>
</template>

<style lang="scss">
/* hide default vue-bootstrap tab links */
.hide-tabs > div:not(.tab-content) {
  display: none;
}
</style>

<script>
export default {
    name: "KTDropdownNotification",
    data() {
        return {
            tabIndex: 0,
            dialog: false,
            unreadNotif: 0,
            dialogData: '',
            notifications: [],
            svg:
                process.env.BASE_URL +
                "media/svg/icons/Communication/Mail-notification.svg",
            list1: [
                {
                    title: "Briviba SaaS",
                    desc: "PHP, SQLite, Artisan CLIмм",
                    color: "primary",
                    svg: process.env.BASE_URL + "media/svg/icons/Home/Library.svg"
                },
                {
                    title: "Briviba SaaS",
                    desc: "PHP, SQLite, Artisan CLIмм",
                    color: "warning",
                    svg: process.env.BASE_URL + "media/svg/icons/Communication/Write.svg"
                },
                {
                    title: "Briviba SaaS",
                    desc: "PHP, SQLite, Artisan CLIмм",
                    color: "success",
                    svg:
                        process.env.BASE_URL +
                        "media/svg/icons/Communication/Group-chat.svg"
                },
                {
                    title: "Briviba SaaS",
                    desc: "PHP, SQLite, Artisan CLIмм",
                    color: "danger",
                    svg: process.env.BASE_URL + "media/svg/icons/General/Attachment2.svg"
                },
                {
                    title: "Briviba SaaS",
                    desc: "PHP, SQLite, Artisan CLIмм",
                    color: "info",
                    svg:
                        process.env.BASE_URL +
                        "media/svg/icons/Communication/Shield-user.svg"
                },
                {
                    title: "Briviba SaaS",
                    desc: "PHP, SQLite, Artisan CLIмм",
                    color: "info",
                    svg:
                        process.env.BASE_URL +
                        "media/svg/icons/Communication/Mail-notification.svg"
                },
                {
                    title: "Briviba SaaS",
                    desc: "PHP, SQLite, Artisan CLIмм",
                    color: "info",
                    svg: process.env.BASE_URL + "media/svg/icons/Design/Bucket.svg"
                }
            ],
            list2: [
                {
                    title: "New report has been received",
                    desc: "23 hrs ago",
                    icon: "flaticon2-line-chart text-success"
                },
                {
                    title: "Finance report has been generated",
                    desc: "25 hrs ago",
                    icon: "flaticon2-paper-plane text-danger"
                },
                {
                    title: "New order has been received",
                    desc: "2 hrs ago",
                    icon: "flaticon2-user flaticon2-line- text-success"
                },
                {
                    title: "New customer is registered",
                    desc: "3 hrs ago",
                    icon: "flaticon2-pin text-primary"
                },
                {
                    title: "Application has been approved",
                    desc: "3 hrs ago",
                    icon: "flaticon2-sms text-danger"
                },
                {
                    title: "New file has been uploaded",
                    desc: "5 hrs ago",
                    icon: "flaticon2-pie-chart-3 text-warning"
                },
                {
                    title: "New user feedback received",
                    desc: "8 hrs ago",
                    icon: "flaticon-pie-chart-1 text-info"
                },
                {
                    title: "System reboot has been successfully completed",
                    desc: "12 hrs ago",
                    icon: "flaticon2-settings text-success"
                },
                {
                    title: "New order has been placed",
                    desc: "15 hrs ago",
                    icon: "flaticon-safe-shield-protection text-primary"
                },
                {
                    title: "Company meeting canceled",
                    desc: "19 hrs ago",
                    icon: "flaticon2-notification text-primary"
                },
                {
                    title: "New report has been received",
                    desc: "23 hrs ago",
                    icon: "flaticon2-fax text-success"
                },
                {
                    title: "Finance report has been generated",
                    desc: "25 hrs ago",
                    icon: "flaticon-download-1 text-danger"
                }
            ]
        };
    },

    mounted() {
        this.getNotifications()
    },

    methods: {
        setActiveTab(event) {
            const tab = event.target.closest('[role="tablist"]');
            const links = tab.querySelectorAll(".nav-link");
            // remove active tab links
            for (let i = 0; i < links.length; i++) {
                links[i].classList.remove("active");
            }

            // set clicked tab index to bootstrap tab
            this.tabIndex = parseInt(event.target.getAttribute("data-tab"));

            // set current active tab
            event.target.classList.add("active");
        },
        getNotifications() {
            this.$DashboardAxios.get('/api/core/notifications').then(({data}) => {
                this.notifications = data.data
                this.unreadNotif = data.data.unread > data.data.data.length ? data.data.data.length : data.data.unread;
            }).catch(() => {
                this.$toast.error("خطا در دریافت اطلاعات نوتیفیکیشن از سمت سرور");
            })
        },
        seenDialog() {
            this.dialog = false;
            this.$DashboardAxios.post('/api/core/seenNotif', {notif_id: this.dialogData.id})
                .then(({data}) => {
                    this.getNotifications()
                })
        },
        dialogShow(data) {
            this.dialogData = data;
            this.dialog = true;

        },
        shorthand(string) {
            console.log(string)
            return string.substring(0, 15)
        },
    },
    computed: {
        backgroundImage() {
            return process.env.BASE_URL + "media/misc/bg-1.jpg";
        }
    }
};
</script>
