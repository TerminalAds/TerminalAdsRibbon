<template>
  <v-list v-if="rerender" dark>
    <custom-popup
      v-model="openPaymentUrlLink"
      :cons="{ title: 'لینک پرداخت' }"
      hide-overlay
      hide-confirm
      max-width="500"
      transition="dialog-bottom-transition"
    >
      <v-card class="p-5">
        <v-text-field
          dense
          label="شماره کاربر"
          outlined
          class="centered-input"
          v-model="userPhone"
          :rules="[phoneRule]"
        />

        <price-input
          v-model="amount"
          :label="i18n.t('WALLET.Amount')"
          text-center="true"
        />

        <div class="row col justify-content-end mx-auto">
          <v-btn
            @click="sendLink"
            color="green"
            class="mr-auto"
            :loading="loading"
            :disabled="!userPhone && amount === 0"
          >
            <v-icon class="ml-2">mdi-send</v-icon>
            ارسال
          </v-btn>
        </div>
      </v-card>
    </custom-popup>

    <v-list-item @click="toggleMobileMenu()">
      <v-list-item-content>
        <div class="text-center">
          <img
            :src="DConfigs.header_logo"
            alt="Logo"
            class="logo-default max-h-40px"
          />
        </div>
      </v-list-item-content>
      <v-list-item-action>
        <span class="btn btn-xs btn-icon btn-light btn-hover-danger">
          <i class="ki ki-close icon-xs text-muted"></i>
        </span>
      </v-list-item-action>
    </v-list-item>

    <v-divider style="background-color: rgba(255, 255, 255, 0.3)" />

    <v-list-item :href="homeLink()" link @click="toggleMobileMenu()">
      <v-list-item-icon>
        <v-icon color="#6cdb72">mdi-home</v-icon>
      </v-list-item-icon>
      <v-list-item-title>{{ i18n.t("CONTACTS.HOME") }}</v-list-item-title>
    </v-list-item>

    <v-list-item link to="/dashboard" @click="toggleMobileMenu()">
      <v-list-item-icon>
        <v-icon color="#6cdb72">widgets</v-icon>
      </v-list-item-icon>
      <v-list-item-title>{{ i18n.t("dashboard_origin") }}</v-list-item-title>
    </v-list-item>

    <div v-if="DLoading.menus" class="group-wrapper">
      <v-list-item v-for="x in 3" :key="x" @click="toggleMobileMenu()">
        <v-list-item-icon>
          <v-icon>mdi-circle-small</v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          <v-skeleton-loader class="mb-n1" type="text" />
        </v-list-item-title>
      </v-list-item>
    </div>

    <div v-else-if="!sectionStatus.menus">
      <v-list-item>
        <v-list-item-action>
          <v-btn class="mx-1" dark text @click="$root.$emit('getMenus')">
            {{ i18n.t("get_menu_again") }}
            <v-icon right>mdi-reload</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </div>

    <template v-else>
      <template v-for="(item, i) in items">
        <div v-if="!!item" :key="`item-${i}`" class="group-wrapper">
          <v-list-item
            v-if="!item.children"
            :to="`/${item.slug}`"
            link
            @click="toggleMobileMenu()"
          >
            <v-list-item-icon>
              <v-icon>mdi-circle-small</v-icon>
            </v-list-item-icon>
            <v-list-item-title
              v-text="
                'MENUS.' + item.name !== i18n.t('MENUS.' + item.name)
                  ? i18n.t('MENUS.' + item.name)
                  : item.name
              "
            />
          </v-list-item>

          <v-list-group
            v-else
            v-model="item.selectedItem"
            :value="getActive(item)"
            active-class="active-child"
            color="white"
            no-action
            @click="item.selectedItem = true"
          >
            <template v-slot:activator>
              <v-list-item-title
                >{{
                  "MENUS." + item.name !== i18n.t("MENUS." + item.name)
                    ? i18n.t("MENUS." + item.name)
                    : item.name
                }}
              </v-list-item-title>
            </template>

            <v-list-item
              v-for="(sub, j) in item.children"
              :key="j"
              :to="`/${sub.slug}`"
              color="white"
              link
              style="padding-right: 32px"
              @click="toggleMobileMenu()"
            >
              <v-list-item-icon>
                <v-icon>mdi-menu-left</v-icon>
              </v-list-item-icon>
              <v-list-item-title
                v-text="
                  i18n.t('MENUS.' + sub.name) !== 'MENUS.' + sub.name
                    ? i18n.t('MENUS.' + sub.name)
                    : sub.name
                "
              />
            </v-list-item>
          </v-list-group>
        </div>
      </template>
    </template>

    <v-list-item :disabled="downloading" link @click="downloadDorsandesk">
      <v-list-item-icon>
        <v-icon color="#6cdb72">mdi-cloud-download-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-title>دانلود دورسان‌دسک</v-list-item-title>
    </v-list-item>

    <v-list-item
      link
      @click="openPaymentUrlLink = true"
      v-if="ribbon_can('send_payment_link')"
    >
      <v-list-item-icon>
        <v-icon color="#ff5b94">mdi-hand-coin</v-icon>
      </v-list-item-icon>
      <v-list-item-title>لینک پرداخت</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { reformatMenuResponse } from "../../assets/js/MenuFunctions";
import i18n from "../../plugins/EasyModal/i18n";
import CustomPopup from "../../plugins/popup/customPopup.vue";
import priceInput from "../../pages/pickers/priceInput.vue";

export default {
  name: "AsideMenu",
  components: { priceInput, CustomPopup },
  props: {
    visible: Boolean,
  },
  data: () => ({
    i18n,
    items: [],
    rerender: true,
    downloading: false,
    loading: false,
    openPaymentUrlLink: false,
    userPhone: undefined,
    amount: 0,
    phoneRule: (v) => {
      const pattern = /^09\d{9}$/;
      return pattern.test(v) || "شماره موبایل معتبر نمی‌باشد";
    },
  }),
  mounted() {
    this.$root.$on("getMenus", this.getMenus);
    this.getMenus();
  },
  computed: {
    ...mapGetters(["layoutConfig", "getClasses"]),
    ...mapGetters("ribbon", ["DLoading", "sectionStatus"]),
  },
  watch: {
    visible(val) {
      if (!val) {
        this.rerender = false;
        this.$nextTick(() => {
          this.rerender = true;
        });
      }
    },
  },
  methods: {
    ...mapActions("ribbon", ["setMenus", "toggleLoading", "setSectionStatus"]),
    getMenus() {
      this.toggleLoading({ field: "menus", status: true });
      try {
        this.$DashboardAxios
          .get("/api/core/menus", {
            params: {
              sid: this.sid,
            },
          })
          .then(({ data }) => {
            const menus = reformatMenuResponse(data.data);
            console.log("menus", menus);
            this.setMenus(menus);
            this.setSectionStatus({ field: "menus", status: true });
            this.items = menus;
          })
          .catch(({ response }) => {
            this.setSectionStatus({ field: "menus", status: false });
            if (response.status !== 401) {
              this.$toast.error("خطایی رخ داده است.");
            }
          })
          .finally(() => this.toggleLoading({ field: "menus", status: false }));
      } catch (e) {
        this.setSectionStatus({ field: "menus", status: false });
        console.log("catch error: ", e);
      }
    },
    homeLink() {
      return this.front_url || "/";
    },
    getActive(item) {
      let activate = item.children
        ?.map((a) => a.slug)
        .includes(this.$route.path.substring(1));
      return (item.selectedItem = activate);
    },
    downloadDorsandesk() {
      this.downloading = true;

      const el = document.createElement("a");
      el.href = `${this.$coreApi}/assets/application/DorsanDesk.msi`;
      el.setAttribute("download", "DorsanDesk.msi");
      el.setAttribute("target", "_blank");
      el.click();

      setTimeout(() => {
        this.downloading = false;
      }, 2000);
    },
    sendLink() {
      this.loading = true;

      this.$instanceAxios
        .post(`${this.$robotApi}/user/bazar/payment/link`, {
          amount: this.amount,
          phone: this.userPhone,
        })
        .then(() => {
          this.$toast.info("لینک پرداخت با موفقیت ارسال شد!");
          this.openPaymentUrlLink = false;
          this.userPhone = undefined;
          this.amount = 0;
        })
        .catch(({ response }) => {
          if (response.status === 404) {
            this.$toast.error("کاربر موردنظر پیدا نشد!");
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.group-wrapper >>> .active-child {
  background-color: rgba(255, 255, 255, 0.5);
}

.centered-input >>> input {
  text-align: center;
}
</style>
