<template>
  <v-dialog v-model="show" :persistent="!closable" :width="loading ? 250 : width"
            @click:outside="$emit('outsideClick')">
    <v-card v-if="loading" class="fill-height">
      <v-card-title class="text-center justify-center font-weight-bold">
        {{ i18n.t('Loading.Waiting') }} ...
      </v-card-title>

      <v-card-text class="text-center d-flex flex-column justify-center align-center">
        <atom-spinner :animation-duration="1000" :size="100" class="mx-auto mt-10" color="primary"/>
      </v-card-text>

      <p class="text-center description">{{ i18n.t('Loading.Description') }}</p>
      <v-divider class="my-0 mx-4"/>
      <v-card-subtitle v-if="!!extraText" class="pa-2 text-center">{{ extraText }}</v-card-subtitle>
    </v-card>

    <v-card v-else>
      <slot/>
    </v-card>
  </v-dialog>
</template>

<script>
import {AtomSpinner} from 'epic-spinners'

import i18n from "../../i18n";

export default {
  name: "WaitStatusDialog",
  components: {AtomSpinner},
  props: {
    value: [Function, Boolean],
    closable: true,
    loading: {
      type: Boolean,
      default: true
    },
    width: {
      default: 500
    },
    extraText: String
  },
  data() {
    return {
      i18n
    }
  },
  computed: {
    show: {
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
.description {
  font-size: 0.7rem;
  color: darkgray;
}
</style>