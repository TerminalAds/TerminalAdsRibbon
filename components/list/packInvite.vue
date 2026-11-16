<template>
  <v-row no-gutters>
    <v-col
      v-if="!inviteOnly"
      class="pa-2"
      cols="12"
      order="1"
      order-md="0"
      sm="6"
    >
      <div
        v-if="dashboardIntro && $vuetify.breakpoint.lgAndUp"
        class="h_iframe-aparat_embed_frame"
      >
        <!--        <span style="display: block;padding-top: 57%"></span>-->
        <iframe
          :src="dashboardIntro.src"
          allowFullScreen="true"
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
        ></iframe>
      </div>

      <user-pack v-else />
    </v-col>

    <v-col
      class="pa-2"
      cols="12"
      order="0"
      order-md="1"
      :sm="inviteOnly ? 12 : 6"
    >
      <v-card
        class="overflow-hidden pa-4 h-100 w-100"
        color="#f4f6fa"
        flat
        style="
          border-radius: 9px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03) !important;
        "
      >
        <div class="d-flex justify-space-between align-center mb-4">
          <div class="text-right flex-grow-1 pr-2">
            <h4
              class="font-weight-bold"
              style="font-size: 13px; line-height: 1.8; color: #1e1e1e"
            >
              {{ i18n.t("invite.title") }}
              <br />
              <span
                class="cursor-pointer"
                style="color: #8c52ff"
                @click.stop="giftDialog = true"
              >
                {{ i18n.t("invite.gift") }}
              </span>
              {{ i18n.t("invite.get") }}
            </h4>
          </div>
          <img
            alt="Invite Friends"
            src="../../assets/img/invite.webp"
            style="width: 110px; height: auto; object-fit: contain"
          />
        </div>

        <div class="d-flex align-stretch w-100">
          <v-text-field
            outlined
            dense
            clearable
            hide-details
            id="invite.input"
            v-model="phoneNumber"
            v-intersect="onIntersect"
            :disabled="loading"
            :maxlength="11"
            class="flex-grow-1"
            :placeholder="i18n.t('invite.phone')"
            @keydown.enter="invite"
          />

          <v-btn
            :loading="loading"
            class="modern-btn-compact white--text font-weight-bold mr-2"
            color="#8c52ff"
            depressed
            height="46"
            @click="invite"
          >
            {{ i18n.t("invite.invite") }}
          </v-btn>
        </div>
      </v-card>
    </v-col>

    <custom-popup
      v-model="giftDialog"
      :cons="cons"
      hide-confirm
      max-width="700"
      transition="slide-y-transition"
    >
      <v-card class="d-flex flex-column justify-center" flat min-height="500">
        <v-spacer />
        <v-card-text class="d-flex align-center justify-center">
          <v-img
            class="rounded"
            contain
            :src="`${$robotCoreApi}/inviteFriends.webp`"
            width="100%"
          >
            <template v-slot:placeholder>
              <v-card
                class="transparent d-flex justify-center align-center"
                flat
                height="100%"
                width="100%"
              >
                <v-progress-circular
                  color="primary"
                  indeterminate
                  size="35"
                  width="5"
                />
              </v-card>
            </template>
          </v-img>
        </v-card-text>
        <v-spacer />
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            class="white--text px-3"
            color="blue lighten-2"
            depressed
            @click.stop="giftDialog = false"
          >
            {{ i18n.t("invite.got_it") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </custom-popup>
  </v-row>
</template>

<script>
import CustomPopup from "../../plugins/popup/customPopup";
import UserPack from "./userPack.vue";
import { mapGetters } from "vuex";
import i18n from "../../plugins/EasyModal/i18n";

export default {
  name: "packInvite",

  props: { inviteOnly: { type: Boolean, default: false } },

  components: { UserPack, CustomPopup },

  data: () => ({
    cons: {
      title: i18n.t("get_gift"),
    },
    isIntersecting: false,
    seen: false,
    phoneNumber: "",
    giftDialog: false,
    loading: false,
    i18n,
  }),

  computed: {
    ...mapGetters("ribbon", ["dashboardIntro"]),
  },

  methods: {
    invite() {
      if (
        !this.phoneNumber ||
        this.phoneNumber.length <= 10 ||
        !this.phoneNumber.startsWith("09")
      ) {
        this.$toast.error(i18n.t("gift.wrong_number"));
        this.phoneNumber = "";
        return false;
      }
      this.loading = true;

      this.$DashboardAxios
        .get(`/api/core/invite?phone=${this.phoneNumber}`)
        .then(({ data }) => {
          this.$toast.success(i18n.t("gift.success"));
        })
        .catch(({ response }) => {
          if (response.data && response.data.message) {
            this.$toast.error(response.data.message);
          }
        })
        .finally(() => {
          this.phoneNumber = "";
          this.loading = false;
        });
    },
    onIntersect(isIntersecting, entries, observer) {
      if (this.seen) return;
      this.seen = true;
      // More information about these options
      // is located here: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
      this.isIntersecting = isIntersecting;

      const digitPeriodRegExp = new RegExp("\\d|\\.");
      const input = document.getElementById("invite.input");

      input.addEventListener(
        "keydown",
        function (event) {
          if (
            event.ctrlKey ||
            event.altKey ||
            typeof event.key !== "string" ||
            event.key.length !== 1
          ) {
            return;
          }

          if (!digitPeriodRegExp.test(event.key)) {
            event.preventDefault();
          }
        },
        false,
      );
    },
  },
};
</script>

<style scoped>
input.form-control::-webkit-outer-spin-button,
input.form-control::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input.form-control[type="number"] {
  -moz-appearance: textfield;
}
/* استایل‌های مدرن برای اینپوت و دکمه */
.modern-input {
  width: 100%;
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 12px; /* گوشه‌های گرد مشابه تصویر */
  padding: 12px 16px;
  font-size: 14px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03); /* سایه بسیار محو و نرم */
  outline: none;
}

.modern-input:focus {
  border-color: #8a53fd;
  box-shadow: 0 4px 15px rgba(138, 83, 253, 0.15);
}

.modern-btn {
  border-radius: 12px !important;
  font-size: 15px !important;
  letter-spacing: 0;
  box-shadow: 0 4px 12px rgba(138, 83, 253, 0.25) !important;
}

input.modern-input::-webkit-outer-spin-button,
input.modern-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input.modern-input[type="number"] {
  -moz-appearance: textfield;
}
.modern-input {
  width: 100%;
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 14px; /* کمی ظریف‌تر */
  padding: 12px 16px; /* پدینگ کمتر برای جلوگیری از اشغال فضای زیاد */
  font-size: 14px; /* فونت استاندارد ویجت */
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  outline: none;
  color: #333;
}

.modern-input::placeholder {
  color: #999;
}

.modern-input:focus {
  border-color: #8c52ff;
  box-shadow: 0 4px 12px rgba(140, 82, 255, 0.15);
}

.modern-btn {
  border-radius: 14px !important;
  font-size: 14px !important;
  letter-spacing: 0;
  box-shadow: 0 4px 12px rgba(140, 82, 255, 0.25) !important;
}

input.modern-input::-webkit-outer-spin-button,
input.modern-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input.modern-input[type="number"] {
  -moz-appearance: textfield;
}
.modern-input-compact {
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 0 12px;
  font-size: 13px;
  text-align: right;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  outline: none;
  color: #333;
  min-width: 0; /* برای جلوگیری از بیرون زدن در موبایل */
}

.modern-input-compact::placeholder {
  color: #999;
}

.modern-input-compact:focus {
  border-color: #8c52ff;
  box-shadow: 0 4px 12px rgba(140, 82, 255, 0.15);
}

.modern-btn-compact {
  border-radius: 12px !important;
  font-size: 13px !important;
  letter-spacing: 0;
  box-shadow: 0 4px 10px rgba(140, 82, 255, 0.25) !important;
  min-width: 90px !important; /* عرض ثابت برای دکمه */
}

input.modern-input-compact::-webkit-outer-spin-button,
input.modern-input-compact::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input.modern-input-compact[type="number"] {
  -moz-appearance: textfield;
}
</style>
