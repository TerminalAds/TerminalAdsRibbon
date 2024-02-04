<template>
    <div v-if="banners.length > 0" class="px-4 py-2"
         @mouseenter="hoverEvent(false)" @mouseleave="hoverEvent(true)">
        <v-carousel :cycle="cycleActive" height="fit-content" hide-delimiter-background interval="3000" vertical
                    :vertical-delimiters="$vuetify.breakpoint.mdAndUp ? 'vertical': undefined" :show-arrows="false"
                    class="rounded-lg overflow-hidden" :hide-delimiters="$vuetify.breakpoint.xs">

            <v-carousel-item v-for="(slide, i) in banners" :key="i" eager :href="slide['0'].link">
                <img :src="slide.picture" :alt="`img-${i}`" style="width: 100%" class="rounded">
            </v-carousel-item>

        </v-carousel>
    </div>
</template>

<script>
export default {
    name: "dashboardBanners",
    data() {
        return {
            banners: [],
            cycleActive: true
        }
    },
    created() {
        this.getBanner()
    },
    methods: {
        getBanner() {
            this.$DashboardAxios.get(`api/core/content?type=banner&sid=${this.sid}`)
                .then(({data}) => {
                    this.banners = data.data.data
                }).catch(() => this.$toast.error('خطای رخ داده است'))
        },

        hoverEvent(e) {
            this.cycleActive = e
        }
    }
}
</script>