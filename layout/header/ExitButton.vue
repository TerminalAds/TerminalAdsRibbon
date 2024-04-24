<template>
  <div class="exit-button">
    <v-btn :dark="$vuetify.breakpoint.mdAndUp" :icon="$vuetify.breakpoint.smAndDown" :loading="loading" app text
           @click="onLogout">
      <v-icon size="25">mdi-power</v-icon>
    </v-btn>
  </div>
</template>
<script>

import {destroyToken} from "../../assets/js/jwt.service";

export default {
  name: "KTExitButton",

  data: () => ({
    loading: false
  }),

  methods: {
    onLogout() {
      this.loading = true

      this.$DashboardAxios.delete('/api/core/logout')
          .then(({data}) => console.log('logout: ', data))
          .catch(({response}) => console.log('error in logout: ', response))
          .finally(() => {
            this.loading = false
            destroyToken()
          })
    }
  }
}
</script>

<style>
body[data-scrolltop='on'] .exit {
  display: none;
}

body[data-scrolltop='on'] .hover-logout {
  color: #4ba5de !important;
}
</style>