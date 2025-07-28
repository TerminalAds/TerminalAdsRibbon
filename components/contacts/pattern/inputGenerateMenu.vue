<template>
  <v-menu bottom offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon
          >mdi-{{ value === "data" ? "form-textbox" : "form-select" }}</v-icon
        >
      </v-btn>
    </template>

    <v-list dense>
      <v-list-item
        :class="{ 'active-class': value === 'data' }"
        dense
        @click="computedState = 'data'"
      >
        <v-list-item-icon>
          <v-icon>mdi-form-textbox</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>متن</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        :class="{ 'active-class': value === 'userInfo' }"
        dense
        @click="computedState = 'userInfo'"
      >
        <v-list-item-icon>
          <v-icon>mdi-form-select</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>انتخاب مشخصات کاربر</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "inputGenerateMenu",

  props: {
    value: String,
  },

  computed: {
    computedState: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>

<style scoped>
.active-class {
  background-color: rgba(215, 215, 215, 0.5);
}
</style>
