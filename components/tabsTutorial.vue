<template>
    <v-tabs v-model="tab" align-with-title grow background-color="transparent" dark color="primary" show-arrows>
        <v-tabs-slider/>
        <v-tab v-for="(item, i) in tabItems" v-if="item.condition()">
            <!--                        <v-icon :color="tab === i ? item.color : ''" class="m-2">mdi-{{ item.icon }}</v-icon>-->
            <v-icon class="m-2">mdi-{{ item.icon }}</v-icon>
            {{ item.title }}
        </v-tab>
    </v-tabs>
</template>

<script>
export default {
    name: "tabsTutorial",

    props: {
        value: Number,
        tabItems: Array
    },

    model: {
        prop: 'value',
        event: 'input'
    },

    watch: {
        value(val) {
            this.tab = val
        },
        tab(val) {
            this.$emit('input', val)
        }
    },

    data: () => ({
        tab: 0,
    })
}
</script>

<style scoped>
.v-tabs >>> .v-slide-group__prev,
.v-tabs >>> .v-slide-group__next {
    min-width: 36px;
}

.v-tabs >>> .v-tab:not(.v-tab--active),
.v-tabs >>> .v-tab:not(.v-tab--active) .v-icon {
    color: white !important;
}
</style>