<template>
  <div>
    <custom-popup v-model="computedValue" :cons="cons" hide-confirm max-width="420">
      <template v-slot:activator>
        <slot name="activator"/>
      </template>

      <v-card flat>
        <v-card-text class="pb-0">
          <v-text-field v-model="phone" :loading="loading" :rules="[rules.phone]" append-icon="mdi-phone"
                        class="rounded-lg" clearable dense :label="i18n.t('FORM_LABELS.ADD_PHONE_NUMBER')" outlined
                        @keydown.enter="addPhoneNumber">
            <template v-slot:append-outer>
              <v-btn :disabled="!canSubmit" color="blue" small text @click="addPhoneNumber">
                <v-icon left small>mdi-plus</v-icon>
                {{ i18n.t('BUTTON.ADD') }}
              </v-btn>
            </template>
          </v-text-field>
        </v-card-text>

        <template v-if="(!!data && !!data.length) || !sharedInfo || !sharedInfo.length">
          <div class="d-flex align-center flex-wrap pa-2">
            <v-chip v-for="(item, i) in data" :key="i" class="ma-2" close @click:close="data.splice(i, 1)">
              {{ item.phone }}
            </v-chip>
          </div>

          <v-card-subtitle class="pb-0">
            {{ i18n.t('CARD_SUBTITLES.SHARE_INSTRUCTION') }}
          </v-card-subtitle>

          <template v-if="!!tag">
            <v-card-title class="pt-0">
              {{ i18n.t('CARD_TITLES.SELECT_PERMISSIONS', { name: tag.name }) }}
            </v-card-title>

            <v-card-text class="d-flex align-center justify-space-around">
              <v-checkbox v-model="permissions.delete" dense hide-details :label="i18n.t('CHECKBOX_LABELS.DELETE')"/>
              <v-checkbox v-model="permissions.edit" dense hide-details :label="i18n.t('CHECKBOX_LABELS.EDIT')"/>
              <v-checkbox v-model="permissions.add" dense hide-details :label="i18n.t('CHECKBOX_LABELS.ADD')"/>
            </v-card-text>
          </template>

          <v-card-actions class="justify-end">
            <v-btn :disabled="!data || !data.length" class="btn-accept ma-0" depressed @click="shareTag">
              <v-icon left>mdi-content-save-plus-outline</v-icon>
              {{ i18n.t('BUTTON.SEND') }}
            </v-btn>
          </v-card-actions>
        </template>

        <template v-else-if="!!sharedInfo && !!sharedInfo.length">
          <v-card-title class="pt-0">
            {{ i18n.t('CARD_TITLES.PEOPLE_WITH_ACCESS') }}
            <v-spacer/>
            <v-icon>mdi-share-variant-outline</v-icon>
          </v-card-title>

          <v-list-item v-for="(contact, i) in sharedInfo" :key="i"
                       :class="{'red darken-1' : contact.action === 'delete'}" :dark="contact.action === 'delete'"
                       class="share-info-item" dense>
            <v-list-item-icon class="align-self-center">
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="contact.phone"/>
              <v-list-item-subtitle v-text="[contact.name, contact.lastName].join(' ')"/>
            </v-list-item-content>

            <v-list-item-action>
              <v-menu v-if="contact.action !== 'delete'" :close-on-content-click="false" absolute left min-width="150"
                      nudge-bottom="20">
                <template v-slot:activator="{on, attrs}">
                  <v-btn text v-bind="attrs" v-on="on">
                    {{ i18n.t('BUTTON.EDIT_PERMISSIONS') }}
                    <v-icon right>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>

                <v-card flat>
                  <v-list-item dense @click="contact.delete = !contact.delete">
                    <v-list-item-action class="me-3">
                      <v-simple-checkbox :value="contact.delete" @click.stop="contact.delete = !contact.delete"/>
                    </v-list-item-action>

                    <v-list-item-content>
                      <v-list-item-title>{{ i18n.t('LIST_ITEM_TITLES.DELETE') }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item dense @click="contact.edit = !contact.edit">
                    <v-list-item-action class="me-3">
                      <v-simple-checkbox :value="contact.edit" @click.stop="contact.edit = !contact.edit"/>
                    </v-list-item-action>

                    <v-list-item-content>
                      <v-list-item-title>{{ i18n.t('LIST_ITEM_TITLES.EDIT') }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item dense @click="contact.add = !contact.add">
                    <v-list-item-action class="me-3">
                      <v-simple-checkbox :value="contact.add" @click.stop="contact.add = !contact.add"/>
                    </v-list-item-action>

                    <v-list-item-content>
                      <v-list-item-title>{{ i18n.t('LIST_ITEM_TITLES.ADD') }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider class="mb-0"/>
                  <v-list-item @click="contact.action = 'delete'">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ i18n.t('LIST_ITEM_TITLES.REMOVE_ACCESS') }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-menu>

              <v-btn v-else text @click="contact.action = 'update'">
                {{ i18n.t('BUTTON.GO_BACK') }}
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-card-actions class="justify-end">
            <v-btn :loading="loading" class="rounded-lg btn-edit ma-0" depressed @click="updateInfo">
              <v-icon left>mdi-content-save-edit-outline</v-icon>
              {{ i18n.t('BUTTON.SAVE_CHANGES') }}
            </v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </custom-popup>
  </div>
</template>

<script>

import i18n from "../../../plugins/EasyModal/i18n";

export default {
  name: "contactsShareTag",

  props: {
    value: Boolean,
    tag: Object
  },

  data() {
    return {
      i18n,
      cons: {
        title: i18n.t('POPUP_TITLES.SHARE_PHONEBOOK'),
      },
      phone: '',
      data: [],
      permissions: {
        add: false,
        edit: false,
        delete: false
      },
      rules: {
        phone: v => (!v || this.isPhone(v)) || i18n.t('VALIDATION.INVALID_PHONE_NUMBER')
      },
      loading: false,
      sharedInfo: []
    }
  },

  computed: {
    computedValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    canSubmit() {
      return !!this.phone && typeof this.rules.phone(this.phone) !== 'string'
    }
  },

  watch: {
    value(val) {
      !!val && this.fetchSharedTag()
    },
  },

  methods: {
    fetchSharedTag() {
      this.loading = true

      this.$payamakAxios.get('phoneTag/share/users', {
        params: {
          phoneTag: this.tag?.id
        }
      })
          .then(({data}) => {
            this.sharedInfo = data?.data.removeDuplicateInArray('id')
                .map(({name, lastName, phone, ...rest}) => {
                  return {
                    user_id: rest.id,
                    phoneTag: rest.phone_tag.parent_id,
                    name,
                    lastName,
                    phone,
                    ...rest.phone_tag.setting,
                    action: 'update'
                  }
                })
          })
          .finally(() => this.loading = false)
    },
    isPhone(phone) {
      let rgx = new RegExp("^((\\+?98(0?)9|(0?9))[0-9]{2})[0-9]{3}[0-9]{4}$")
      return rgx.test(phone)
    },
    shareTag() {
      this.loading = true

      this.$payamakAxios.post(`phoneTag/share/${this.tag?.id}`, {
        data: this.data
      })
          .then(({data}) => {
            this.$toast.success(this.i18n.t('TOAST.SHARE_SUCCESS'));
            this.data = []
            this.fetchSharedTag()
          })
          .catch(({response}) => {
            if (!!response?.data?.message)
              this.$toast.error(response.data.message)
            else
              this.$toast.error(this.i18n.t('TOAST.SHARE_ERROR'))
          })
          .finally(() => this.loading = false)
    },
    addPhoneNumber() {
      if (this.canSubmit) {
        if (this.data.findIndex(item => item.phone === this.phone) < 0
            && this.sharedInfo?.findIndex(item => item.phone === this.phone) < 0) {
          this.data.push({
            phone: this.phone,
            ...this.permissions
          })
          this.phone = ''
        } else
          this.$toast.info(this.i18n.t('TOAST.NUMBER_ALREADY_ADDED'))
      }
    },
    updateInfo() {
      this.loading = true

      this.$payamakAxios.post('phoneTag/share/update', {
        data: this.sharedInfo
      })
          .then(({data}) => {
            this.$toast.success(this.i18n.t('TOAST.CHANGES_SAVED_SUCCESS'))
            this.fetchSharedTag()
          })
          .catch(({response}) => {
            console.log('failed to update shared phone_tag: ', response)
            this.$toast.error(this.i18n.t('TOAST.CHANGES_SAVE_ERROR'))
          })
          .finally(() => this.loading = false);
    }
  }
}
</script>

<style scoped>
.v-input--checkbox >>> label {
  margin: 0;
}

.share-info-item {
  transition: all .2s ease-in;
}
</style>