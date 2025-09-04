<template>
  <v-app>
    <v-container fluid>
      <WaitStatusDialog
        :loading="isLoading"
        :show="isShow"
        :closable="!isLoading"
        @onShowChange="(n) => show(n)"
      >
        <v-card-text class="d-flex align-center justify-center m-0 p-0 align-content-center">
          <div class="text-center py-2">
            <span class="d-block font-weight-bold font-size-h1 mt-2">{{ title }}</span>
            <span class="d-block my-2">{{ message }}</span>

            <v-textarea
              v-if="data"
              v-model="data"
              class="mt-0 pt-1 mb-0 pb-0 mx-2 rightFlexDirection"
              filled
              readonly
            ></v-textarea>

            <div>
              <v-btn
                v-for="btn in buttons"
                :key="btn.text"
                @click="btn.click === 'close' ? show(false) : btn.click()"
                :color="btn.color"
                :class="btn.class"
                depressed
              >
                {{ i18n.t(btn.text) }}
              </v-btn>
            </div>
          </div>

          <v-img
            v-if="image"
            :src="image"
            max-height="200"
            max-width="200"
            contain
          />
        </v-card-text>
      </WaitStatusDialog>
    </v-container>
  </v-app>
</template>

<script>
import i18n from "../i18n";
import WaitStatusDialog from "./dialogs/WaitStatusDialog";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "modal",
  components: { WaitStatusDialog },
  data() {
    return {
      i18n
    }
  },
  computed: {
    ...mapGetters('modal', ['isLoading', 'isShow', 'message', 'title', 'data', 'image', 'buttons'])
  },
  methods: {
    ...mapActions('modal', ['show'])
  }
}
</script>

<style scoped>
</style>