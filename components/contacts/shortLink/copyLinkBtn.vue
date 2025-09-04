<template>
  <div>
    <span>{{ data[name] }}</span>

    <v-tooltip left>
      <template v-slot:activator="{ on, attr }">
        <v-btn
            class="mr-2"
            icon
            small
            v-bind="attr"
            v-on="on"
            @click.stop="copyLink(data[name])"
        >
          <v-icon small>mdi-content-copy</v-icon>
        </v-btn>
      </template>

      <span>{{ i18n.t('TOOLTIP.COPY_LINK') }}</span>
    </v-tooltip>
  </div>
</template>

<script>
import i18n from "@/plugins/EasyModal/i18n";

export default {
  name: "copyLinkBtn",

  props: {
    data: Object,
    name: String,
  },
  data() {
    return {
      i18n
    }
  },
};
</script>

<style scoped></style>