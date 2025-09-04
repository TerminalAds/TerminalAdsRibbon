<template>
  <v-speed-dial v-model="fab" :direction="direction">
    <template v-slot:activator>
      <v-btn v-b-tooltip.hover="i18n.t('actions.operations')" fab icon x-small @click.stop="fab = !fab">
        <v-icon v-if="fab" color="pink darken-1 icon-xl-2x">mdi-close</v-icon>
        <v-icon v-else class="icon-xl-2x" color="black">mdi-dots-vertical</v-icon>
      </v-btn>
    </template>

    <template v-for="(item, index) in meta.buttons">
      <v-btn v-if="checkCondition(item) && (!item.status || can(item.status))" :key="index"
             v-b-tooltip.hover.top="i18n.t('actions.' + item.name)" :class="item.class" fab small
             @click.stop="item.action(data, item.name)">
        <v-icon :class="'fa-' + item.icon" class="px-1 text-center icon-md fa"/>
      </v-btn>
    </template>
  </v-speed-dial>
</template>

<script>
import i18n from "../../../plugins/EasyModal/i18n";

export default {
  name: "campaignButtonsList",

  props: {
    data: Object,
    action: Function,
    meta: Object
  },

  data() {
    return {
      direction: 'right',
      color: {
        'edit': 'warning',
        'delete': 'error',
        'show': 'info',
        "refresh": 'indigo',
      },
      fab: false,
      fling: false,
      hover: false,
      tabs: null,
      top: false,
      right: true,
      bottom: true,
      left: false,
      transition: 'slide-x-reverse-transition',
      i18n
    };
  },

  methods: {
    checkCondition(item) {
      switch (this.data.status) {
        case 'pending':
          return ['accept', 'reject', 'edit'].includes(item.name);
        case 'deactive':
          return ['enable', 'download', 'edit'].includes(item.name);
        case 'accept':
          return ['reject', 'deactive', 'download', 'edit'].includes(item.name);
        case 'reject':
          return ['accept', 'download', 'edit'].includes(item.name);
        default:
          return item.name !== 'enable';
      }
    }
  }
}
</script>

<style scoped>
</style>