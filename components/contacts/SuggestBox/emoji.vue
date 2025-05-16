<template>
  <v-card flat>
    <v-card-text>
      <div class="bg-white" style="max-height: 18rem;overflow: auto;direction: ltr;text-align: left">
        <div v-for="group in emojiGroup" :key="group" class="row mx-auto">
          <div class="col-12">
            <h5>{{ group }}</h5>

            <hr>
          </div>

          <div v-for="emoji in emojis.filter(emoji => emoji.group === group)" :data-slug="emoji.slug" class="col fa-2x"
               style="color: black;cursor: pointer" @click="selectEmoji(emoji.icon)">
            {{ emoji.icon }}
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "emojiSelector",

  props: {
    inputBox: {
      require: true
    },
  },

  data() {
    return {
      menu: false,
      emojis: require('./emoji.json')
    }
  },

  computed: {
    emojiGroup() {
      let groups = [];

      this.emojis.forEach(emoji => {
        if (groups.indexOf(emoji.group) < 0)
          groups.push(emoji.group);
      });

      return groups;
    }
  },

  methods: {
    selectEmoji(emoji) {
      const selector = this.inputBox;
      const el = selector.$el.querySelector('textarea')

      let currentInput = selector.value;
      let startPosition = el.selectionStart;
      let endPosition = el.selectionEnd;

      let textBefore = currentInput.substring(0, startPosition);
      let textAfter = currentInput.substring(endPosition, currentInput.length);

      selector.$emit('input', textBefore + emoji + textAfter);
      this.$emit('close')

      this.$nextTick(function () {
        el.focus();
        el.setSelectionRange(startPosition, startPosition + 1);
      })
    }
  }
}
</script>

<style scoped>

</style>