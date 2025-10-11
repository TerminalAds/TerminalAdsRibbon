<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-textarea
        v-if="rerender"
        ref="textarea"
        v-model="text"
        :disabled="disabled"
        :label="label"
        :rules="rules"
        class="default-text"
        filled
        outlined
        v-bind="$attrs"
      >
        <template v-if="!disabled" v-slot:append-outer>
          <div
            v-if="$vuetify.breakpoint.smAndUp"
            class="d-flex flex-column fill-height justify-space-between py-2"
            style="height: 115px"
          >
            <v-btn
              class="px-2"
              style="font-size: 2em"
              text
              :title="i18n.t('emoji')"
              @click="emojiModel = true"
            >
              <div class="pt-1">🙂</div>
            </v-btn>

            <v-btn
              v-if="textSuggest"
              class="px-2"
              style="font-size: 2em"
              text
              :title="i18n.t('text_suggest_free')"
              @click="defaultModel = true"
            >
              <div>✉️</div>
            </v-btn>

            <v-btn
              v-else
              class="px-2"
              style="font-size: 2em"
              text
              :title="i18n.t('select_campaign')"
              @click="$emit('openCamp')"
            >
              <div>✉️</div>
            </v-btn>

            <v-btn
              v-if="sendPagesTab !== 1"
              text
              :title="i18n.t('short_link')"
              @click="openLink = true"
            >
              <v-icon color="blue lighten-2" large>mdi-link-variant</v-icon>
            </v-btn>
          </div>
        </template>
      </v-textarea>
    </v-col>

    <v-col v-if="$vuetify.breakpoint.xs" cols="12">
      <v-btn
        class="px-2"
        style="font-size: 2em"
        text
        :title="i18n.t('emoji')"
        @click="emojiModel = true"
      >
        <div>🙂</div>
      </v-btn>

      <v-btn
        v-if="textSuggest"
        class="px-2"
        style="font-size: 2em"
        text
        :title="i18n.t('text_suggest_free')"
        @click="defaultModel = true"
      >
        <div>✉️</div>
      </v-btn>

      <v-btn
        v-else
        class="px-2"
        style="font-size: 2em"
        text
        :title="i18n.t('select_campaign')"
        @click="$emit('openCamp')"
      >
        <div>✉️</div>
      </v-btn>
    </v-col>

    <custom-popup
      v-model="openLink"
      :cons="{ title: i18n.t('short_link') }"
      hide-confirm
      max-width="850"
    >
      <select-short-link
        v-if="openLink"
        @close="openLink = false"
        @select="getShortLink"
      />
    </custom-popup>

    <custom-popup
      v-model="emojiModel"
      :cons="cons"
      hide-confirm
      max-width="500"
    >
      <emoji-selector :inputBox="$refs.textarea" @close="emojiModel = false" />
    </custom-popup>

    <custom-popup v-model="defaultModel" :cons="cons1" hide-confirm>
      <template v-slot:title>
        <v-btn
          :href="$router.resolve({ name: 'suggestText' }).href"
          color="green"
          depressed
          style="letter-spacing: normal"
        >
          {{ i18n.t("text_suggest") }}
        </v-btn>
      </template>
      <default-sms
        v-if="defaultModel"
        :input-box="$refs.textarea"
        :title-box="titleInput"
        @selected="defaultModel = false"
      />
    </custom-popup>

    <v-col class="d-block d-sm-flex mt-2" cols="12">
      <p class="mx-2">
        <span v-text="i18n.t('FORMS.CharCount')"></span> :
        <span class="font-weight-bold" v-text="' ' + textInfo.total"></span>
      </p>

      <v-spacer />
      <p class="mx-2">
        <span v-text="i18n.t('FORMS.SmsCount')"></span> :
        <span class="font-weight-bold" v-text="' ' + textInfo.smsCount"></span>
      </p>
      <v-spacer />
      <p class="mx-2">
        <span v-text="i18n.t('FORMS.SmsLang')"></span> :
        <span
          class="font-weight-bold"
          v-text="' ' + i18n.t('LANGUAGE.' + textInfo.lang.name)"
        ></span>
      </p>

      <div class="d-none d-sm-block" style="width: 70px" />
    </v-col>
  </v-row>
</template>

<script>
import EmojiSelector from "./emoji";
import DefaultSms from "./defaultSms";
import { getTextSmsInfo, Language } from "../../../assets/js/Utilities";
import SelectShortLink from "../shortLink/selectShortLink.vue";
import { debounce } from "../../../install";
import customPopup from "../../../plugins/popup/customPopup.vue";
import { mapState } from "vuex";
import i18n from "../../../plugins/EasyModal/i18n";

export default {
  name: "suggestText",

  components: {
    SelectShortLink,
    DefaultSms,
    EmojiSelector,
    customPopup,
  },

  props: {
    rules: Array,
    value: String,
    label: {
      required: false,
    },
    titleInput: [String, Object],
    disabled: Boolean,
    textSuggest: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      i18n,
      emojiModel: false,
      defaultModel: false,
      cons: {
        title: i18n.t("select_emoji"),
      },
      cons1: {
        title: i18n.t("default_text"),
      },
      textInfo: {
        total: 0,
        farsi: 0,
        smsCount: 0,
        lang: Language.English,
        price: 0,
        coefficient: 1,
        readNumberCount: 0,
      },
      openLink: false,
      shortLinkUrl: "",
      rerender: true,
      text: "",
    };
  },

  mounted() {
    this.text = this.value || "";
  },

  computed: {
    ...mapState("locals", ["sendPagesTab"]),
  },

  watch: {
    text(val) {
      debounce(() => {
        this.$emit("input", val);

        let info = getTextSmsInfo(val);
        this.textInfo.total = val.length;
        this.textInfo.farsi = info.persianChar;
        this.textInfo.smsCount = info.smsCount;
        this.textInfo.lang = info.lang;

        this.$nextTick(() => {
          this.$emit("textInfo", this.textInfo);
        });
      }, 200);
    },
    value(val) {
      if (val !== this.text) this.text = val;
    },
  },

  methods: {
    getShortLink(val) {
      if (!!val) {
        let text = this.text;
        let index = text.indexOf("لغو11");

        this.text =
          text.slice(0, index) + "\n" + val + "\n" + text.slice(index);
      }
    },
  },
};
</script>

<style scoped>
.default-text >>> .v-input__append-outer {
  margin: 4px;
  height: 100%;
}
</style>
