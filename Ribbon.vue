<template>
    <div v-if="$route.meta.has_ribbon" class="po-rel" style="height: 44px">
        <div class="ribbon">
            <div class="cheat-div"/>
            <div class="cheat-div-left"/>
            <div class="ribbon3 text-center d-flex">
                <span id="ribbon.text.wrapper" class="ribbon-text-wrapper me-1" ref="ribbonText">
                     <span id="ribbon.text">{{ title }} {{ subTitle }}</span>
                </span>
                <v-spacer/>
                <slot name="default"/>
            </div>
        </div>
    </div>
</template>

<script>

import {mapGetters} from "vuex";

export default {
    name: "terminal_title_ribbon",

    data: () => ({
        status: 0
    }),

    mounted() {
        this.checkTextOverflow();
    },

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

    methods: {
        checkTextOverflow() {
            if (this.status > 1) return

            this.$nextTick(() => {
                let wrapper = document.getElementById('ribbon.text.wrapper')
                let text = document.getElementById('ribbon.text')

                let wrapperCliW = wrapper.getClientRects()[0].width
                let textCliW = text.getClientRects()[0].width

                if (wrapperCliW >= textCliW) {
                    setTimeout(() => {
                        this.status += 1
                        this.checkTextOverflow()
                    }, 5000)
                } else if (wrapperCliW < textCliW) {
                    text.classList.add('set-transition')
                }
            })
        }
    }
}
</script>

<style scoped>
.ribbon {
    width: calc(100% + 32px);
    margin-bottom: 0;
    text-transform: uppercase;
    color: white;
    z-index: 1;
    /*margin-right: -12px;*/
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
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
    transform: rotate(19deg) translate(-1px, 8px);
    background-color: #b30f5b;
    top: -50%;
    z-index: -0;
    border-radius: 0 8px 0 0;
}

/*.ribbon:after {*/
/*    width: 45px;*/
/*    height: 20px;*/
/*    left: 0;*/
/*    transform: rotate(19deg) translate(-3px, -8px);*/
/*    background-color: #b30f5b;*/
/*    bottom: -50%;*/
/*    z-index: 0;*/
/*    border-radius: 0 0 0 8px;*/
/*}*/

.ribbon:after {
    width: 20px;
    height: 20px;
    left: 0;
    transform: rotate(19deg) translate(-4px, -14px);
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
    right: 16px;
    z-index: 2;
    border-radius: 0 12px 0 0;
}

.ribbon >>> .cheat-div-left {
    width: 60px;
    height: 30px;
    background-color: #fff;
    position: absolute;
    bottom: -12px;
    left: 15px;
    z-index: 2;
}

/*@media screen and (max-width: 960px) {*/
/*    .ribbon {*/
/*        top: 0;*/
/*    }*/

/*    .ribbon >>> .cheat-div {*/
/*        width: 40px;*/
/*        top: -16px;*/
/*        border-radius: 0;*/
/*    }*/

/*    .ribbon:before {*/
/*        width: 16px;*/
/*        transform: rotate(19deg) translate(-1px, 13px);*/
/*    }*/
/*}*/

.ribbon3 {
    /*width: fit-content;*/
    min-width: 180px;
    height: 44px;
    line-height: 40px;
    padding: 4px 12px 4px 20px;
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

.ribbon-text-wrapper {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
}

.ribbon-text-wrapper >>> span {
    display: inline-block;
    transition: all .1s linear;
}

.set-transition {
    transform: translateX(-100%);
    animation-delay: 1000s;
    animation: scrolling-text 5s infinite linear;
}

@keyframes scrolling-text {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(100%);
    }
}
</style>