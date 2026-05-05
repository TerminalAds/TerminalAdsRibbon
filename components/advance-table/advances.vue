<template>
  <v-row no-gutters>
    <v-col cols="12" sm="6" v-for="(item, i) in list" :key="i" class="pa-2">
      <div
        class="card card-custom"
        :style="`background-image: url(${item.src}`"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "advances",

  data: () => ({
    list: [
      {
        src: "https://cdn.terminalads.com/mobile-marketing-concept-illustration_114360-1497.jpg",
      },
      {
        src: "https://cdn.terminalads.com/tiny-people-marketing-manager-with-megaphone-push-advertising-push-advertising-traditional-marketing-strategy-interruption-marketing-concept-illustration_335657-2571.jpg",
      },
      {
        src: "https://cdn.terminalads.com/remarketing-manager-specialist-put-targeted-ads-remarketing-strategy-digital-marketing-tool-visitors-generation-methodology-concept-pinkish-coral-bluevector-isolated-illustration_335657-2284.jpg",
      },
      {
        src: "https://cdn.terminalads.com/social-strategy-concept-illustration_114360-724_2.jpg",
      },
    ],
  }),
};
</script>

<style scoped>
.card-custom {
  height: 150px;
  background-position: center;
  background-size: contain;
}
</style>
