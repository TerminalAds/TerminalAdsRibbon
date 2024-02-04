<template>
  <div class="exit-button">
    <v-btn app text @click="onLogout"
           :icon="$vuetify.breakpoint.smAndDown"
           :dark="$vuetify.breakpoint.mdAndUp">
      <v-icon size="25">mdi-power</v-icon>
    </v-btn>
  </div>
</template>
<script>

export default {
  name: "KTExitButton",

  methods: {
    onLogout() {
      localStorage.removeItem('id_token');
      localStorage.removeItem('reloaded');
      window.location.replace(process.env.VUE_APP_LOGIN_URL);
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