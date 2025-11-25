<template>
  <div v-if="dialogShow || isConnectionLostShow">
    <v-row v-if="dialogShow">
      <wait-status-dialog
        v-model="isDialogOpened"
        :closable="!(isLoading || isNotClosable)"
        :extra-text="extraText"
        :loading="isLoading"
        :width="width"
        @outsideClick="outsideClick"
      >
        <v-card>
          <v-card-title v-if="!isNotClosable" class="pa-2 justify-end">
            <v-btn
              v-b-tooltip="'بستن'"
              class="px-0"
              color="rgb(252,193,199)"
              depressed
              min-width="36"
              @click="closeDialog()"
            >
              <v-icon class="text-danger">mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text
            class="text-center d-flex flex-column justify-center align-center p-0"
          >
            <div class="d-flex justify-center mb-3 mx-auto">
              <v-img
                :src="getIcon"
                contain
                max-height="112"
                max-width="112"
                width="112"
              />
            </div>

            <p class="font-weight-bold font-size-h4 mt-2">
              {{ title }}
            </p>

            <p v-if="description">
              {{ description }}
            </p>

            <v-textarea
              v-if="getData"
              v-model="getData"
              class="mt-0 pt-1 mb-0 pb-0 mx-2 w-100"
              filled
              hide-details
              readonly
            />

            <div
              class="d-flex flex-wrap justify-content-center align-center mb-0 w-100 px-2"
            >
              <v-btn
                v-for="(b, i) in primaryButtons"
                :key="i"
                :class="['mx-2 mt-5 mb-0 white--text', b.class ? b.class : '']"
                :color="b.color"
                @click="clickOnActions(b)"
              >
                <v-icon class="me-2"
                  >mdi-{{ b.icon ? b.icon : "check" }}</v-icon
                >
                {{ b.text }}
              </v-btn>
            </div>
          </v-card-text>

          <v-card-actions
            class="flex-column mt-2 justify-center action-wrapper"
          >
            <v-btn
              v-if="activeAdsBtn"
              :color="activeAdsBtn.color"
              :href="computedAdsHref"
              block
              dark
              target="_blank"
            >
              <v-icon class="me-2"
                >mdi-{{
                  activeAdsBtn.icon ? activeAdsBtn.icon : "chevron-left"
                }}</v-icon
              >
              {{ activeAdsBtn.text }}
            </v-btn>

            <v-btn
              v-for="(item, i) in actionButtons"
              :key="i"
              :class="item.class ? item.class : ''"
              :color="item.color ? item.color : '#3ebd47'"
              block
              dark
              @click="clickOnActions(item)"
            >
              <v-icon class="me-2"
                >mdi-{{ item.icon ? item.icon : "circle-small" }}</v-icon
              >
              {{ item.text }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </wait-status-dialog>
    </v-row>

    <v-row v-if="isConnectionLostShow">
      <v-dialog
        v-model="isLostShow"
        :persistent="!isConnectClosable"
        width="250"
      >
        <v-card flat width="100%">
          <v-card-title v-if="isConnectClosable" class="pa-2 justify-end">
            <v-btn
              v-b-tooltip="'بستن'"
              class="px-0"
              color="rgb(252,193,199)"
              depressed
              min-width="36"
              @click="isLostShow = false"
            >
              <v-icon class="text-danger">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text
            class="d-flex flex-column justify-center align-center pt-4 text-center"
          >
            <div class="d-flex justify-center mb-3 mx-auto">
              <img
                :src="getIcon"
                alt=""
                loading="eager"
                style="width: 112px; max-width: 112px; max-height: 112px"
              />
            </div>

            <h6 class="primary--text">{{ getConnectionLostTitle }}</h6>
            {{ getConnectionLostSubtitle }}
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import vx from "./store/index";
import WaitStatusDialog from "./components/dialogs/WaitStatusDialog";
import {
  ActionButtons,
  Closable,
  Data,
  Description,
  ExtraText,
  Events,
  Icon,
  Loading,
  PrimaryButtons,
  Showing,
  Title,
  Width,
} from "./store/global";
import {
  FulfillingBouncingCircleSpinner,
  SemipolarSpinner,
} from "epic-spinners";
import i18n from "./i18n";

export default {
  name: "viewEasyModal",

  components: {
    WaitStatusDialog,
    FulfillingBouncingCircleSpinner,
    SemipolarSpinner,
  },

  data() {
    return {
      isDialogOpened: false,
      isLostShow: false,
      activeAdsBtn: null,
      i18n,
      activeAdsBtn: null,
    };
  },
  mounted() {},
  computed: {
    adsButtons() {
      return [
        {
          text: i18n.t("ADS.LIVE_SMS"),
          icon: "message-text",
          href: this.$corepayamakApi,
          color: "#005f73",
        },
        {
          text: i18n.t("ADS.BUY_JOB_DB"),
          icon: "database-check",
          href: this.$services[10] + "/#/shop/archives",
          color: "#ae2012",
        },
        {
          text: i18n.t("ADS.SMART_LADDER"),
          icon: "stairs-up",
          href: this.$robotCoreApi + "/#/Tools/SmartLadder",
          color: "#fca311",
        },
        {
          text: i18n.t("ADS.JOB_SMS"),
          icon: "wallet-travel",
          href: this.$services[2] + "/#/JobSms",
          color: "#7678ed",
        },
        {
          text: i18n.t("ADS.WEB_DESIGN"),
          icon: "web",
          href: this.$services[13] + "/#/site",
          color: "#6a994e",
        },
        {
          text: i18n.t("ADS.SEO"),
          icon: "finance",
          href: this.$services[13] + "/#/seo",
          color: "#7b2cbf",
        },
        {
          text: i18n.t("ADS.MAP_SMS"),
          icon: "cellphone-marker",
          href: this.$services[2] + "/#/MapSms",
          color: "#0466c8",
        },
        {
          text: i18n.t("ADS.GRADUAL_LADDER"),
          icon: "angle-acute",
          href: this.$services[4] + "/#/Tools/gradualLadder",
          color: "#56ab91",
        },
        {
          text: i18n.t("ADS.SEO_ALT"),
          icon: "bullseye-arrow",
          href: this.$services[13] + "/#/seo",
          color: "#85182a",
        },
        {
          text: i18n.t("ADS.SITE_SUPPORT"),
          icon: "face-agent",
          href: this.$services[13] + "/#/support",
          color: "#058c42",
        },
        {
          text: i18n.t("ADS.CITY_SMS"),
          icon: "home-city",
          href: this.$services[2] + "/#/CitySms",
          color: "#a68a64",
        },
        {
          text: i18n.t("ADS.AUTO_CHAT"),
          icon: "text-recognition",
          href: this.$services[4] + "/#/Tools/autoChats",
          color: "#ff477e",
        },
      ];
    },
    dialogShow() {
      this.isDialogOpened = vx.getters.isShow;
      return vx.getters.isShow;
    },
    isLoading() {
      return vx.getters[Loading];
    },
    isNotClosable() {
      return vx.getters[Closable];
    },
    title() {
      return vx.getters[Title];
    },
    description() {
      return vx.getters[Description];
    },
    extraText() {
      return vx.getters[ExtraText];
    },
    primaryButtons() {
      return vx.getters[PrimaryButtons];
    },
    onClose() {
      return vx.getters[Events.Close];
    },
    width() {
      return vx.getters[Width];
    },
    actionButtons() {
      return vx.getters[ActionButtons];
    },
    getData() {
      return vx.getters[Data];
    },
    getIcon() {
      return vx.getters[Icon];
    },
    isConnectionLostShow() {
      this.isLostShow = vx.getters["connectionLost/isShow"];
      return this.isLostShow;
    },
    getConnectionLostTitle() {
      return vx.getters["connectionLost/title"];
    },
    getConnectionLostSubtitle() {
      return vx.getters["connectionLost/subtitle"];
    },
    isConnectClosable() {
      return vx.getters["connectionLost/closable"];
    },
    getConnectionLostButtonText() {
      return vx.getters["connectionLost/button"];
    },
    getConnectionLostButtonAction() {
      return vx.getters["connectionLost/onClick"];
    },
    computedAdsHref() {
      let token = "?token=" + localStorage.getItem("id_token");
      if (this.activeAdsBtn.href.indexOf("/#/") > -1) {
        return this.activeAdsBtn.href.replace("/#/", `/${token}#/`);
      }
      return this.activeAdsBtn.href + token;
    },
  },

  watch: {
    isDialogOpened(val) {
      vx.dispatch(Showing, val);
      let index = this.getCookie("adIndex");

      if (index && index.length > 0) {
        if (val) {
          index = Number(index);
          if (index >= this.adsButtons.length) {
            index = 0;
            this.setCookie("adIndex", 0);
          }
          this.activeAdsBtn = this.adsButtons[index];
          this.setCookie("adIndex", ++index);
        }
      } else {
        this.activeAdsBtn = this.adsButtons[0];
        this.setCookie("adIndex", 0);
      }
    },
    isLostShow(val) {
      vx.dispatch("connectionLost/showing", val);
    },
  },

  methods: {
    closeDialog(byUser = true) {
      vx.dispatch(Showing, false);
      if (byUser && this.onClose) {
        this.onClose();
      }
    },
    runButtonEvent(event) {
      if (event) {
        event();
      }
      this.closeDialog(false);
    },
    outsideClick() {
      if (!this.isNotClosable) {
        this.closeDialog();
      }
    },
    clickOnActions(item) {
      if (item.closeOnClick ?? true) {
        this.closeDialog();
      }
      if (item.onClick) {
        item.onClick();
      }
    },
  },
};
</script>

<style scoped>
.closeBtn {
  cursor: pointer;
}

.actionBackgroundGray {
  background-color: rgba(169, 169, 169, 0.1);
}

.action-wrapper {
  border-top: 0.1em gray dotted;
}

.action-wrapper >>> .v-btn {
  margin-bottom: 8px;
  margin-right: 0 !important;
  margin-left: 0 !important;
}
</style>
