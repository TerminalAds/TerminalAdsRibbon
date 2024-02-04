<template>
    <!-- begin::Page loader -->
    <div class="page-loader page-loader-logo">
        <img alt="Logo" :src="logo" width="100" class="mb-4" style="min-width: 100px"/>
        <!--        <div class="spinner" v-bind:class="spinnerClass || 'spinner-primary'"></div>-->
        <atom-spinner :animation-duration="1500" :size="100" class="mx-auto" color="var(--v-primary-base)"/>
    </div>
    <!-- end::Page Loader -->
</template>

<script>
import {AtomSpinner} from 'epic-spinners'

export default {
    name: "Loader",

    components: {AtomSpinner},

    props: {
        logo: String,
        spinnerClass: String
    }
};
</script>
