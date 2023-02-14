<template>
    <div v-if="$route.meta.has_ribbon" class="d-inline-block" style="vertical-align: top">
        <div class="ribbon">
            <div class="cheat-div"></div>
            <div class="ribbon3 text-center">
                <span>{{ title }} {{ subTitle }}</span>
            </div>
        </div>
    </div>
</template>

<script>

import {mapGetters} from "vuex";

export default {
    name: "terminal_title_ribbon",

    computed: {
        ...mapGetters("ribbon", ["sub_title"]),
        title() {
            return this.$route.meta.title ?? "";
        },
        subTitle() {
            return this.sub_title ?? "";
        },
        haveFeature() {
            return this.tutorial?.features;
        }

    },
}
</script>

<style scoped>
.ribbon {
    width: fit-content;
    margin-bottom: 0;
    text-transform: uppercase;
    color: white;
    z-index: 1;
    margin-right: -12px;
    top: 8px;
}

.ribbon:nth-child(even) {
    margin-right: 4%;
}

.ribbon:before,
.ribbon:after {
    content: "";
    position: absolute;
}

.ribbon:before {
    width: 60px;
    height: 40px;
    right: 0;
    transform: rotate(19deg) translate(-1px, 7px);
    background-color: #b30f5b;
    top: -50%;
    z-index: -0;
    border-radius: 0 8px 0 0;
}

.ribbon:after {
    width: 45px;
    height: 20px;
    left: 0;
    transform: rotate(19deg) translate(-3px, -8px);
    background-color: #b30f5b;
    bottom: -50%;
    z-index: 0;
    border-radius: 0 0 0 8px;
}

.ribbon >>> .cheat-div {
    width: 60px;
    height: 20px;
    background-color: #fff;
    position: absolute;
    top: -8px;
    right: 12px;
    z-index: 2;
    border-radius: 0 12px 0 0;
}

@media screen and (max-width: 960px) {
    .ribbon {
        top: 0;
    }

    .ribbon >>> .cheat-div {
        width: 40px;
        top: -16px;
        border-radius: 0;
    }

    .ribbon:before {
        width: 16px;
        transform: rotate(19deg) translate(-1px, 13px);
    }
}

.ribbon3 {
    width: 180px;
    height: 40px;
    line-height: 40px;
    padding-left: 15px;
    position: relative;
    background: rgb(238, 49, 138);
    border-radius: 8px 0 8px 0;
    z-index: 2;
}

.ribbon3:before {
    position: absolute;
    content: '';
    width: 4px;
    height: 4px;
    background-color: transparent;
    box-shadow: 4px 2px 0 1px #ee318a;
    top: 0;
    right: 4px;
    transform: rotate(-65deg);
    border-radius: 0 0 13px;
}

.ribbon3:after {
    position: absolute;
    content: '';
    width: 4px;
    height: 4px;
    background-color: transparent;
    box-shadow: 4px 2px 0 1px #ee318a;
    bottom: 0;
    left: 4px;
    transform: rotate(-249deg);
    border-radius: 0 0 13px;
}
</style>