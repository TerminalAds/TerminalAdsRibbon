<template>
    <v-row no-gutters>
        <v-col cols="12" sm="6" v-for="(item, i) in list" :key="i" class="pa-2">
            <div class="card card-custom" :style="`background-image: url(${item.src}`"/>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: "advances",

    data: () => ({
        list: [
            {src: 'https://img.freepik.com/free-vector/mobile-marketing-concept-illustration_114360-1497.jpg?t=st=1658725589~exp=1658726189~hmac=a23a059b3afbbf13d40138ad35dba153d830fa70c0e89fe2de9fa5f04c623ccf&w=740'},
            {src: 'https://img.freepik.com/free-vector/tiny-people-marketing-manager-with-megaphone-push-advertising-push-advertising-traditional-marketing-strategy-interruption-marketing-concept-illustration_335657-2571.jpg?t=st=1658725589~exp=1658726189~hmac=78c39344073bf823c636fd9dc208e9563644a9e7a5832e95bb46a2684bdb31bd&w=900'},
            {src: 'https://img.freepik.com/free-vector/remarketing-manager-specialist-put-targeted-ads-remarketing-strategy-digital-marketing-tool-visitors-generation-methodology-concept-pinkish-coral-bluevector-isolated-illustration_335657-2284.jpg?t=st=1658720624~exp=1658721224~hmac=e0bc18bd0332a28a069a1da243cb0394255ba854d8bcd7729472270ca62c6a2c&w=900'},
            {src: 'https://img.freepik.com/free-vector/social-strategy-concept-illustration_114360-724.jpg?t=st=1658693852~exp=1658694452~hmac=3d67c7ef7700f79eb5357f6a564f10442aa63a1de1f31658c37906a1dc1e5013&w=900'},
        ]
    })
}
</script>

<style scoped>
.card-custom {
    height: 150px;
    background-position: center;
    background-size: contain;
}
</style>