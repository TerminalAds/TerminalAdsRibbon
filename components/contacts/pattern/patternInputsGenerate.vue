<template>
  <v-row no-gutters>
    <v-col v-if="!isCampaign" class="d-flex pa-2" cols="12">
      <div v-if="generateText" class="col-md-4 rounded p-5 mx-auto" style="background: rgba(193,193,193,0.58)">
        <p>پیام انتخاب شده: </p>

        <p class="font-size-lg" style="white-space: break-spaces" v-text="generateText"></p>
      </div>

      <div v-if="computedField.length > 0" class="col-md mr-1 rounded p-5"
           style="background: rgba(193,193,193,0.58)">
        <p>ورودی های اجباری: </p>

        <template v-for="(input, index) in computedField">
          <v-text-field v-if="input.state === 'data'" :key="`${index}-data`" v-model="computedText[index]"
                        :label="input.text" :readonly="readonly" class="my-2" dense>
            <template v-slot:append-outer>
              <input-generate-menu :value="input.state" @input="changeFieldState($event, index)"/>
            </template>
          </v-text-field>

          <v-autocomplete v-else :key="`${index}-info`" v-model="computedText[index]" :items="userInfoItems"
                          :label="input.text" :readonly="readonly" dense>
            <template v-slot:append-outer>
              <input-generate-menu :value="input.state" @input="changeFieldState($event, index)"/>
            </template>
          </v-autocomplete>
        </template>
      </div>
    </v-col>

    <v-col v-else-if="isCampaign && value" class="pa-2" cols="12">
      <v-card-title class="justify-center">
        <span class="grey--text font-size-h6">کمپین انتخاب شده:</span>
        <span class="primary--text px-2">شناسه {{ value.id }}</span>
      </v-card-title>

      <div class="d-flex flex-wrap justify-center">
        <div v-for="(item, i) in value.messages.text" :key="i"
             class="ma-2 pa-4 grey lighten-2 rounded-lg fit-content font-size-h6" style="width: fit-content">
          <v-avatar class="mt-n12 ms-n6 white--text pa-2" color="success" size="24">{{ i + 1 }}</v-avatar>
          <pre class="mt-n6 ma-0" v-html="item"/>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import {debounce} from "@/main";
import InputGenerateMenu from "@/view/content/pattern/inputGenerateMenu.vue";

export default {
  name: "patternInputsGenerate",

  components: {InputGenerateMenu},

  props: {
    value: Object,
    text: Array,
    field: Array,
    isCampaign: Boolean,
    readonly: Boolean
  },

  data: () => ({
    userInfoItems: [
      {value: 'preName', text: 'پیشوند'},
      {value: 'name', text: 'نام'},
      {value: 'middleName', text: 'نام میانی'},
      {value: 'lastName', text: 'نام خانوادگی'},
      {value: 'postName', text: 'پسوند'},
      {value: 'alias', text: 'نام مستعار'},
      {value: 'companyName', text: 'شرکت'},
      {value: 'jobTitle', text: 'عنوان شغلی'},
      {value: 'phone', text: 'شماره تلفن'},
      {value: 'birthday', text: 'تاریخ تولد'},
      {value: 'description', text: 'توضیحات'},
    ]
  }),

  computed: {
    fields() {
      const regex = new RegExp(/data\d+/, 'g');

      return this.value?.content?.match(regex).map(item => ({
        text: item,
        state: 'data' /* ['userInfo', 'data'] */
      })) ?? []
    },
    generateText() {
      let genText = this?.value?.content;

      this.fields.forEach((match, index) => {
        const replacement = this.computedText[index];

        if (match.state === 'data')
          genText = genText.replace(new RegExp(match.text, 'g'), replacement || match.text);
        else
          genText = genText.replace(new RegExp(match.text, 'g'), `{${replacement || match.text}}`);
      });

      return genText;
    },
    computedText: {
      get() {
        return this.text
      },
      set(val) {
        debounce(() => {
          this.$emit('update:text', val)
        }, 1000)
      }
    },
    computedField: {
      get() {
        return this.field
      },
      set(val) {
        this.$emit('update:field', val)
      }
    }
  },

  watch: {
    fields: {
      deep: true,
      handler(val) {
        this.computedField = val
        this.computedText = val.map((item, index) => {
          return this.computedText[index] || ''
        })
      }
    }
  },

  methods: {
    changeFieldState(state, index) {
      if (this.readonly)
        return false

      this.computedText[index] = ''
      this.computedField[index].state = state
    }
  }
}
</script>

<style scoped>

</style>