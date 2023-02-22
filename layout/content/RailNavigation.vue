<template>
    <v-navigation-drawer floating permanent mini-variant class="railNav mx-3">
        <v-list nav dense class="d-flex flex-column justify-center rounded-xl" color="rgba(3,3,3,0.50)">

            <v-list-item v-for="(item, i) in links" :key="i" link active-class="rail-blue-active"
                         class="active d-flex align-center justify-center" :href="item.href"
                         v-if="item.limit ? ribbon_can(item.limit) : true">
                <v-tooltip nudge-right="8" right>
                    <template v-slot:activator="{ on, attrs }">
                        <span v-if="item.type === 'icon'" class="fas icon-xl" :class="`fa-${item.icon}`"
                              style="color: #000000"/>

                        <inline-svg v-else :class="{'svg-white' : isActive}" :src="item.icon" alt="" title=""
                                    v-on="on" v-bind="attrs"/>
                    </template>
                    <span style="white-space: nowrap" class="d-inline-block" v-text="item.title"/>
                </v-tooltip>
            </v-list-item>

        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
    name: "RailNavigation",

    data: () => ({
        links: [
            {
                title: 'تماس باما',
                href: 'https://terminalads.com/contact',
                icon: 'headset',
                type: 'icon',
                limit: false
            }, {
                title: 'تیکت',
                href: 'https://core.terminalads.com/#/tickets/create',
                icon: 'comments',
                type: 'icon',
                limit: false
            }, {
                title: 'فرصت های همکاری',
                href: 'https://terminalads.com/%d8%b9%d8%a7%d9%85%d9%84%db%8c%d8%aa-%d9%81%d8%b1%d9%88%d8%b4/',
                icon: 'handshake',
                type: 'icon',
                limit: false
            }, {
                title: 'درباره ما',
                href: 'https://terminalads.com/about',
                icon: 'info-circle',
                type: 'icon',
                limit: false
            }
        ]
    })
}
</script>

<style scoped>
.railNav {
    position: fixed;
    z-index: 1;
    left: 0;
    background: transparent !important;
}

.railNav >>> .v-navigation-drawer__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    transform: translateY(25%);
    transition: all .8s ease-out;
}

.svg-white {
    filter: invert(96%) sepia(24%) saturate(2%) hue-rotate(316deg) brightness(111%) contrast(100%);
}

body[data-scrolltop="on"] .railNav >>> .v-navigation-drawer__content {
    transform: translateY(-10%);
}
</style>