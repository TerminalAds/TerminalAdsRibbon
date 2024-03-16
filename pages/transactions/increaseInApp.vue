<template>
  <custom-popup v-model="computedValue" :cons="{title: info.gateway.name}" hide-confirm max-width="600">
    <v-card class="rounded-xl my-4 mx-auto" min-width="50%" width="fit-content">
      <v-card-subtitle class="text-center pb-1">
        مبلغ قابل پرداخت:
      </v-card-subtitle>
      <v-card-title class="justify-center text-center pt-1 font-size-h3">
        {{ price(info.price) }}
        <span class="font-size-h6 grey--text">ریال</span>
      </v-card-title>
    </v-card>

    <v-card class="rounded-xl mx-auto mb-4" color="blue lighten-2" flat height="230" width="65%">
      <div></div>
    </v-card>
  </custom-popup>
</template>

<script>
import CustomPopup from "../../plugins/popup/customPopup.vue";

export default {
  name: "increaseInApp",

  components: {CustomPopup},

  props: {
    value: Boolean,
    info: Object
  },

  computed: {
    computedValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style scoped>

</style>