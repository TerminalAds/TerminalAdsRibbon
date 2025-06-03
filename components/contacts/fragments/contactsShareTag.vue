<template>
  <div>
    <custom-popup v-model="computedValue" :cons="cons" hide-confirm max-width="420">
      <template v-slot:activator>
        <slot name="activator"/>
      </template>

      <v-card flat>
        <v-card-text class="pb-0">
          <v-text-field v-model="phone" :loading="loading" :rules="[rules.phone]" append-icon="mdi-phone"
                        class="rounded-lg" clearable dense label="افزودن شماره تلفن" outlined
                        @keydown.enter="addPhoneNumber">
            <template v-slot:append-outer>
              <v-btn :disabled="!canSubmit" color="blue" small text @click="addPhoneNumber">
                <v-icon left small>mdi-plus</v-icon>
                افزودن
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
            با انتخاب هریک از موارد زیر، دسترسی مورد نظر را با دیگران به اشتراک بگذارید.
          </v-card-subtitle>

          <template v-if="!!tag">
            <v-card-title class="pt-0">
              {{ `انتخاب دسترسی برای دفترچه تلفن ${tag.name}:` }}
            </v-card-title>

            <v-card-text class="d-flex align-center justify-space-around">
              <v-checkbox v-model="permissions.delete" dense hide-details label="حذف"/>
              <v-checkbox v-model="permissions.edit" dense hide-details label="ویرایش"/>
              <v-checkbox v-model="permissions.add" dense hide-details label="افزودن"/>
            </v-card-text>
          </template>

          <v-card-actions class="justify-end">
            <v-btn :disabled="!data || !data.length" class="btn-accept ma-0" depressed @click="shareTag">
              <v-icon left>mdi-content-save-plus-outline</v-icon>
              ارسال
            </v-btn>
          </v-card-actions>
        </template>

        <template v-else-if="!!sharedInfo && !!sharedInfo.length">
          <v-card-title class="pt-0">
            افرادی که دسترسی دارند
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
                    ویرایش
                    <v-icon right>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>

                <v-card flat>
                  <v-list-item dense @click="contact.delete = !contact.delete">
                    <v-list-item-action class="me-3">
                      <v-simple-checkbox :value="contact.delete" @click.stop="contact.delete = !contact.delete"/>
                    </v-list-item-action>

                    <v-list-item-content>
                      <v-list-item-title>حذف</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item dense @click="contact.edit = !contact.edit">
                    <v-list-item-action class="me-3">
                      <v-simple-checkbox :value="contact.edit" @click.stop="contact.edit = !contact.edit"/>
                    </v-list-item-action>

                    <v-list-item-content>
                      <v-list-item-title>ویرایش</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item dense @click="contact.add = !contact.add">
                    <v-list-item-action class="me-3">
                      <v-simple-checkbox :value="contact.add" @click.stop="contact.add = !contact.add"/>
                    </v-list-item-action>

                    <v-list-item-content>
                      <v-list-item-title>افزودن</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider class="mb-0"/>
                  <v-list-item @click="contact.action = 'delete'">
                    <v-list-item-content>
                      <v-list-item-title>
                        برداشتن دسترسی
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-menu>

              <v-btn v-else text @click="contact.action = 'update'">
                بازگشت
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-card-actions class="justify-end">
            <v-btn :loading="loading" class="rounded-lg btn-edit ma-0" depressed @click="updateInfo">
              <v-icon left>mdi-content-save-edit-outline</v-icon>
              ذخیره تغییرات
            </v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </custom-popup>
  </div>
</template>

<script>
export default {
  name: "contactsShareTag",

  props: {
    value: Boolean,
    tag: Object
  },

  data() {
    return {
      cons: {
        title: 'اشتراک گذاری دفترچه تلفن',
      },
      phone: '',
      data: [],
      permissions: {
        add: false,
        edit: false,
        delete: false
      },
      rules: {
        phone: v => (!v || this.isPhone(v)) || 'شماره تلفن صحیح وارد نماید'
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
          this.$toast.success('دفترچه تلفن با موفقیت به اشتراک گذاشته شد.');
          this.data = []
          this.fetchSharedTag()
        })
        .catch(({response}) => {
          if (!!response?.data?.message)
            this.$toast.error(response.data.message)
          else
            this.$toast.error('خطا در اشتراک گذاری دفترچه تلفن!')
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
          this.$toast.info('شماره قبلا وارد شده است!')
      }
    },
    updateInfo() {
      this.loading = true

      this.$payamakAxios.post('phoneTag/share/update', {
        data: this.sharedInfo
      })
        .then(({data}) => {
          this.$toast.success('تغییرات با موفقیت ذخیره شدند.')
          this.fetchSharedTag()
        })
        .catch(({response}) => {
          console.log('failed to update shared phone_tag: ', response)
          this.$toast.error('خطا در دخیره تغییرات!')
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