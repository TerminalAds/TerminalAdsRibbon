<template>
  <v-expansion-panels v-model="panels" :disabled="!isAllowed" :mandatory="sendAsGradualModel" flat>
    <v-expansion-panel :disabled="!isAllowed" @change="changePanel">
      <v-expansion-panel-header :hide-actions="sendAsGradualModel" class="rounded-lg" color="grey lighten-3">
        <span>
          <b>{{ i18n.t('HEADERS.GRADUAL_SEND') }}</b>
          <span v-if="!isAllowed" class="mx-2">{{ i18n.t('HEADERS.GRADUAL_SEND_HINT') }}</span>
        </span>
      </v-expansion-panel-header>

      <v-expansion-panel-content class="pt-4">
        <v-card :disabled="!isAllowed" class="rounded-lg" outlined>
          <v-card-title>
            <v-checkbox v-model="sendAsGradualModel" class="ma-0" hide-details>
              <template v-slot:label>
                <div class="mb-n2">{{ i18n.t('CHECKBOX_LABELS.GRADUAL_SENDING') }}</div>
              </template>
            </v-checkbox>

          </v-card-title>

          <v-expand-transition>
            <v-card-text v-if="sendAsGradualModel">
              <v-row no-gutters>
                <v-col class="pa-2" cols="12" lg="4" md="6">
                  <v-text-field
                      v-model="gradual.phones_gradual_time"
                      :max="computedType.max"
                      :messages="i18n.t('MESSAGES.SENDING_INTERVAL_QUESTION', { time: computedType.text })"
                      :min="1"
                      :suffix="computedType.text" class="rounded-lg" clearable dense hide-spin-buttons
                      :label="i18n.t('LABELS.TIME_INTERVAL')"
                      oninput="if (Number(this.value) < this.min) this.value = this.min
                     else if (Number(this.value) > this.max) this.value = this.max"
                      outlined type="number">
                    <template v-slot:append>
                      <v-menu min-width="120" offset-y open-on-focus open-on-hover>
                        <template v-slot:activator="{on, attrs}">
                          <v-btn class="rounded-lg mt-n1 me-n1" color="grey lighten-3" depressed fab v-bind="attrs"
                                 x-small v-on="on">
                            <v-icon small>mdi-chevron-down</v-icon>
                          </v-btn>
                        </template>

                        <v-list dense rounded>
                          <v-list-item v-for="(item, i) in timeTypes" :key="i" dense
                                       @click="gradual.phones_gradual_type = item.value">
                            <v-list-item-title>
                              {{ item.text }}
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col class="pa-2" cols="12" lg="4" md="6">
                  <v-text-field v-model="gradual.phones_gradual_count" :max="numbersCount" :min="1"
                                :rules="[rules.count]" class="rounded-lg" clearable dense hide-spin-buttons
                                :hint="i18n.t('HINTS.MESSAGE_COUNT_PER_PART')"
                                :label="i18n.t('LABELS.MESSAGE_COUNT')"
                                oninput="if (Number(this.value) < this.min) this.value = this.min
                                else if (Number(this.value) > this.max) this.value = this.max"
                                outlined type="number"/>
                </v-col>
              </v-row>
            </v-card-text>
          </v-expand-transition>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import {mapActions, mapState} from "vuex";
import i18n from "../../../plugins/EasyModal/i18n";
export default {
  name: "gradualList",

  props: {
    numbersCount: Number
  },

  data: () => ({
    i18n,
    panels: null,
    timeTypes: [
      {value: 'min', text: i18n.t('TIME_TYPES.MINUTE'), min: 1, max: 60},
      {value: 'hour', text: i18n.t('TIME_TYPES.HOUR'), min: 1, max: 6},
    ],
    rules: {
      count: v => (!!v && Number(v) >= 500) || i18n.t('RULES.MESSAGE_COUNT_MIN_LIMIT')
    }
  }),

  mounted() {
    this.sendAsGradualModel = false
    this.setGradualItem({
      phones_gradual_time: 10,
      phones_gradual_type: 'min',
      phones_gradual_count: 500
    })
  },

  computed: {
    ...mapState('locals', ['sendAsGradual', 'gradualItem']),
    sendAsGradualModel: {
      get() {
        return this.sendAsGradual
      },
      set(val) {
        this.setSendAsGradual(val)
      }
    },
    gradual: {
      get() {
        return this.gradualItem
      },
      set(val) {
        this.setGradualItem(val)
      }
    },
    computedType() {
      return this.timeTypes.find(item => item.value === this.gradual.phones_gradual_type)
    },
    isAllowed() {
      return this.numbersCount >= 500
    }
  },

  watch: {
    computedType(val) {
      this.gradual.phones_gradual_time = val.value === 'min' ? 10 : 1
    },
    isAllowed(val) {
      !val && this.resetFields()
    },
    numbersCount(val) {
      this.gradual.phones_gradual_count = 500
    },
    sendAsGradualModel(val) {
      !val && (this.panels = null)
    }
  },

  methods: {
    ...mapActions('locals', ['setSendAsGradual', 'setGradualItem']),
    resetFields() {
      this.sendAsGradualModel = false;
      this.gradual.phones_gradual_type = 'min';
      this.gradual.phones_gradual_time = 10;
      this.gradual.phones_gradual_count = 500;
    },
    changePanel() {
      if (!this.sendAsGradualModel && !this.panels)
        this.sendAsGradualModel = true
    }
  }
}
</script>

<style scoped>
.v-expansion-panel-content >>> .v-expansion-panel-content__wrap {
  padding: 0;
}
</style>