<template>
  <div>
    <v-img class="rounded" contain max-width="350" src="../../../assets/img/communication/bg-1.jpg">
      <template v-slot:default>
        <div class="d-flex flex-column fill-height">
          <v-spacer/>

          <h4 class="d-flex flex-center rounded-top">
            <span class="text-white">نوتیفیکیشن های کاربر</span>
            <span class="btn btn-text btn-success btn-sm font-weight-bold btn-font-md ml-2">
              {{ persianNum(unreadNotif) || 0 }}
              پیام جدید
            </span>
          </h4>

          <ul
            class="nav nav-bold nav-tabs nav-tabs-line nav-tabs-line-3x nav-tabs-line-transparent-white nav-tabs-line-active-border-success mt-3 px-8"
            role="tablist">
            <li class="nav-item">
              <a class="nav-link active" data-tab="0" data-toggle="tab" href="#" role="tab"
                 v-on:click="setActiveTab">
                پیام ها
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" data-tab="2" data-toggle="tab" href="#" role="tab"
                 v-on:click="setActiveTab">
                رویدادها
              </a>
            </li>
          </ul>
        </div>
      </template>
    </v-img>

    <b-tabs v-model="tabIndex" class="hide-tabs">
      <b-tab active class="pa-2">

        <div v-if="unreadNotif===0" class="d-flex flex-center text-center text-muted min-h-200px">
          <br/>پیام جدیدی موجود نیست!
        </div>

        <perfect-scrollbar v-else class="scroll pr-7 mr-n7" style="max-height: 40vh; position: relative;">
          <template>
            <v-list-item v-for="(item, i) in notifications.data" :key="i" @click="dialogShow(item)">
              <v-list-item-icon class="rounded-lg me-2">
                <img alt="" src="../../../assets/img/communication/Mail-notification.svg">
              </v-list-item-icon>

              <v-list-item-content style="max-width: 250px">
                <v-list-item-title v-text="item.data.title"/>
                <v-list-item-subtitle v-text="item.data.text"/>
              </v-list-item-content>
            </v-list-item>
          </template>
        </perfect-scrollbar>

        <v-card-actions class="justify-end pa-0">
          <v-btn color="primary" href="https://core.terminalads.com/#/user/notifications" small target="_blank"
                 text>
            <v-icon class="me-1" small>mdi-eye</v-icon>
            مشاهده همه
          </v-btn>
        </v-card-actions>
      </b-tab>

      <b-tab>
        <div class="d-flex flex-center text-center text-muted min-h-200px">
          <br/>رویداد جدیدی موجود نیست!
        </div>
      </b-tab>
    </b-tabs>

    <custom-popup v-model="dialog" :cons="cons" hide-confirm max-width="600" transition="dialog-bottom-transition">
      <v-card v-if="dialogData && dialogData.data" flat>
        <v-card-text>
          <div class="font-size-h5 pt-5" v-html="dialogData.data.text"/>
        </v-card-text>

        <v-card-text v-if="ribbon_can('admin_access')">
          <div v-if="containsKey(dialogData.data,'customerHistory')">
            <v-btn @click="goToCustomerHistory(dialogData.data.customerHistory.phone)">برو به کاربر</v-btn>
          </div>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn text @click="seenDialog">
            <v-icon class="me-1" small>mdi-check</v-icon>
            مشاهده کردم
          </v-btn>
        </v-card-actions>
      </v-card>
    </custom-popup>
  </div>
</template>

<style lang="scss">
/* hide default vue-bootstrap tab links */
.hide-tabs > div:not(.tab-content) {
  display: none;
}
</style>

<script>
import CustomPopup from "../../../plugins/popup/customPopup";

export default {
  name: "KTDropdownNotification",

  components: {CustomPopup},

  props: {
    value: Number
  },

  model: {
    prop: 'value',
    event: 'input'
  },

  data() {
    return {
      tabIndex: 0,
      dialog: false,
      unreadNotif: 0,
      dialogData: '',
      notifications: [],
      cons: {
        title: '',
      }
    };
  },

  mounted() {
    this.getNotifications()
  },

  methods: {
    containsKey(obj, key) {
      return Object.keys(obj).includes(key);
    },
    goToCustomerHistory(phone) {
      this.$router.push({name: 'admin.customers.history', params: {phone: phone}})
      this.dialog = false
    },
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
        this.unreadNotif = data.data.unread;
        this.$nextTick(() => {
          this.$emit('input', this.unreadNotif)
        })
      }).catch(({response}) => {
        if (response?.status !== 401)
          this.$toast.error("خطا در دریافت اطلاعات نوتیفیکیشن از سمت سرور");
      })
    },
    seenDialog() {
      this.dialog = false;
      this.$DashboardAxios.post('/api/core/seen/notification', {notif_id: this.dialogData.id})
        .then(({data}) => {
          this.getNotifications()
        })
    },
    dialogShow(data) {
      this.dialogData = data;
      this.cons.title = data.data.title
      this.dialog = true;
    },
  },
}
</script>
