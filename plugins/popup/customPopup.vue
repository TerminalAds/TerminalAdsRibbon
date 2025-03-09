<template>
  <v-dialog
    v-model="computedValue"
    :hide-overlay="hideOverlay"
    :max-width="maxWidth"
    :persistent="persistent"
    :scrollable="scrollable"
    :transition="transition"
    content-class="popup-content"
    v-bind="$attrs"
  >
    <template v-if="$slots.activator" v-slot:activator="{ on, attrs }">
      <div class="d-inline-block" v-bind="attrs" v-on="on">
        <slot name="activator" />
      </div>
    </template>

    <v-card
      id="cp-container"
      :class="{ 'popup-card-loading': showLoading }"
      class="overflow-y-auto"
      flat
      height="fit-content"
      max-height="calc(100vh - 120px)"
    >
      <v-card-title
        class="sticky-top align-center popup-title flex-nowrap pa-2 pa-md-4"
      >
        <span
          v-if="!$slots.extension"
          class="font-size-h4 white--text"
          v-text="cons.title || 'پاپ آپ'"
        />
        <v-spacer v-if="!$slots.extension" />

        <slot v-if="rerender" name="extension" />

        <div v-if="rerender" class="pt-2 pa-md-0">
          <slot name="title" />
        </div>

        <v-btn
          v-if="!hideConfirm"
          :disabled="getDisabled('submit')"
          class="ms-2 px-0"
          color="green lighten-3"
          depressed
          min-width="36"
          title="تایید"
          @click="onHandler('submit')"
        >
          <v-icon color="green darken-4">mdi-check</v-icon>
        </v-btn>

        <v-btn
          v-if="reloadable"
          class="px-0"
          color="rgb(215,187,227)"
          depressed
          min-width="36"
          style="margin-right: 8px"
          title="به روزرسانی"
          @click="reloadPopup"
        >
          <v-icon color="#7b1fa2">mdi-reload</v-icon>
        </v-btn>

        <v-btn
          v-if="!hideClose"
          class="ms-2 px-0 text-danger"
          color="#fcc1c7"
          depressed
          min-width="36"
          title="بستن"
          @click="
            () => {
              onHandler('close');
              computedValue = false;
            }
          "
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text v-if="rerender" class="pa-0">
        <slot name="default" />
      </v-card-text>

      <slot v-if="rerender" name="action" />
    </v-card>

    <v-card
      v-if="showLoading"
      class="d-flex align-center justify-center loading-wrapper"
      color="rgba(255, 255, 255, .8)"
      flat
      height="calc(100% - 68px)"
      max-height="calc(100% - 68px)"
      width="100%"
    >
      <atom-spinner
        :animation-duration="1500"
        :size="100"
        class="mx-auto"
        color="var(--v-primary-base)"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import { AtomSpinner } from "epic-spinners";

export default {
  name: "customPopup",

  components: { AtomSpinner },

  props: {
    closeOnConfirm: {
      type: Boolean,
      default: true,
    },
    cons: Object,
    value: Boolean,
    hideClose: Boolean,
    hideConfirm: Boolean,
    hideOverlay: Boolean,
    maxWidth: {
      type: [Number, String],
      default: "1024",
    },
    maxHeight: {
      type: [Number, String],
      default: undefined,
    },
    transition: String,
    scrollable: Boolean,
    reloadable: Boolean,
    loading: Boolean,
    persistent: Boolean,
  },

  data: () => ({
    rerender: true,
    cardHeight: null,
    showLoading: false,
  }),

  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("close");
        this.$emit("input", val);
      },
    },
  },

  watch: {
    loading(val) {
      this.showLoading = val;
    },
    showLoading(val) {
      this.$emit("update:loading", val);
    },
  },

  methods: {
    async onHandler(type, close = true) {
      if (this.cons.buttons && this.cons.buttons.length > 0) {
        this.showLoading = true;
        const obj = this.cons.buttons.filter((item) => item.type === type)[0];
        if (obj && typeof obj.handler === "function") {
          await obj.handler();
        }
        this.showLoading = false;
      }
      if (type !== "close" && this.closeOnConfirm && close)
        this.computedValue = false;
    },
    getDisabled(type) {
      if (this.cons.buttons && this.cons.buttons.length > 0) {
        const obj = this.cons.buttons.filter((item) => item.type === type)[0];
        return obj && obj.disabled
          ? typeof obj.disabled === "function"
            ? obj.disabled()
            : obj.disabled
          : false;
      }
      return false;
    },
    reloadPopup() {
      this.rerender = false;
      this.showLoading = true;
      this.onHandler("reload", false);

      this.$nextTick(() => {
        this.rerender = true;
        this.$emit("reload");

        setTimeout(() => {
          this.showLoading = false;
        }, 1000);
      });
    },
  },
};
</script>

<style scoped>
.popup-title {
  background-size: cover !important;
  background: linear-gradient(to left, #089d88 0%, #03bacf 51%, #514a9d 100%);
  word-break: break-word;
}

.loading-wrapper {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 99;
  width: 100%;
}

.popup-card-loading {
  overflow: hidden !important;
}

.v-dialog__content >>> .popup-content {
  position: relative;
}
</style>
