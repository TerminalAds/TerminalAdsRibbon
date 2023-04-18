<template>
  <div>
    <v-img src="../../../assets/img/communication/bg-1.jpg" max-width="350" class="rounded" contain>
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

          <ul class="nav nav-bold nav-tabs nav-tabs-line nav-tabs-line-3x nav-tabs-line-transparent-white nav-tabs-line-active-border-success mt-3 px-8"
              role="tablist">
            <li class="nav-item">
              <a v-on:click="setActiveTab" data-tab="0" class="nav-link active" data-toggle="tab" href="#"
                 role="tab">
                پیام ها
              </a>
            </li>
            <li class="nav-item">
              <a v-on:click="setActiveTab" data-tab="2" class="nav-link" data-toggle="tab" href="#"
                 role="tab">
                رویدادها
              </a>
            </li>
          </ul>
        </div>
      </template>
    </v-img>

    <b-tabs class="hide-tabs" v-model="tabIndex">
      <b-tab active class="pa-2">

        <div class="d-flex flex-center text-center text-muted min-h-200px" v-if="unreadNotif===0">
          <br/>پیام جدیدی موجود نیست!
        </div>

        <perfect-scrollbar v-else class="scroll pr-7 mr-n7" style="max-height: 40vh; position: relative;">
          <template>

            <v-list-item v-for="(item, i) in notifications.data" :key="i" @click="dialogShow(item)">
              <v-list-item-icon class="rounded-lg me-2">
                <img src="../../../assets/img/communication/Mail-notification.svg" alt="">
              </v-list-item-icon>

              <v-list-item-content style="max-width: 250px">
                <v-list-item-title v-text="item.data.title"/>
                <v-list-item-subtitle v-text="item.data.text"/>
              </v-list-item-content>
            </v-list-item>
          </template>
        </perfect-scrollbar>

        <v-card-actions class="justify-end pa-0">
          <v-btn text small color="primary" href="https://core.terminalads.com/#/user/notifications"
                 target="_blank">
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

    <custom-popup v-model="dialog" :cons="cons" max-width="600" transition="dialog-bottom-transition" hide-confirm>
      <v-card flat v-if="dialogData && dialogData.data">
        <v-card-text>
          <div class="font-size-h5 pt-5" v-html="dialogData.data.text"/>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="seenDialog">
            <v-icon small class="me-1">mdi-check</v-icon>
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
        this.$nextTick(() => {
          this.$emit('input', this.unreadNotif)
        })
      }).catch(({response}) => {
        if (response.status !== 401)
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
      this.cons.title = data.data.title
      this.dialog = true;
    },
  },
}
</script>
