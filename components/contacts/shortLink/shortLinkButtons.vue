<template>
  <div>
    <div v-if="$vuetify.breakpoint.mdAndUp">
      <v-speed-dial v-model="fab" direction="right">
        <template v-slot:activator>
          <v-btn v-b-tooltip.hover="'عملیات'" fab icon x-small @click.stop="fab = !fab">
            <v-icon v-if="fab" color="pink darken-1 icon-xl-2x">mdi-close</v-icon>
            <v-icon v-else class="icon-xl-2x" color="black">mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <template v-for="(item, index) in meta.buttons">
          <v-btn :key="index" v-b-tooltip.hover.right="item.label" :class="classBtn + item.class" fab small
                 @click.stop="item.action(data, item.name)">
            <v-icon :class="iconClass + item.icon"></v-icon>
          </v-btn>
        </template>
      </v-speed-dial>
    </div>

    <div v-else>
      <div class="mt-3 row justify-content-center px-0">
        <v-btn v-for="(item, index) in meta.buttons" :key="index" v-b-tooltip.hover.top="item.label"
               :class="classBtn + item.class" class="m-1 col-5" @click.stop="item.action(data, item.name)">
          <v-icon :class="iconClass + item.icon"/>
          {{ item.label }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "shortLinkButtons",

  props: {
    data: {},
    action: {
      type: Function,
    },
    meta: {
      type: Object,
    }
  },

  data() {
    return {
      classBtn: 'btn btn-sm text-center ',
      iconClass: 'px-1 text-center icon-md fa fa-',
      fab: false
    };
  },
}
</script>
