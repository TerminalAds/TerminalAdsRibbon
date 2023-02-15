<template>
    <div class="exit-button">
        <v-btn app dark text @click="onLogout">
            <v-icon size="25">mdi-power</v-icon>
        </v-btn>

    </div>
</template>
<script>
import { LOGOUT } from "@/core/services/store/auth.module";

export default {
    name: "KTExitButton",
    methods: {
        onLogout() {
            localStorage.removeItem('id_token');
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