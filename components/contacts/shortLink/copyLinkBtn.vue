<template>
  <div>
    <span>{{ data[name] }}</span>

    <v-tooltip left>
      <template v-slot:activator="{ on, attr }">
        <v-btn
          class="mr-2"
          icon
          small
          v-bind="attr"
          v-on="on"
          @click.stop="copyLink(data[name])"
        >
          <v-icon small>mdi-content-copy</v-icon>
        </v-btn>
      </template>
      <!--  -->

      <span>کپی لینک</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: "copyLinkBtn",

  props: {
    data: Object,
    name: String,
  },
};
</script>

<style scoped></style>
