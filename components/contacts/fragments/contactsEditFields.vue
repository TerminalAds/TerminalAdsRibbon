<template>
  <v-row class="px-3" no-gutters>
    <v-col cols="12">
      <v-card-text>
        <input ref="fileInput" accept="image/*" class="d-none" type="file" @change="inputChanged">

        <v-list-item>
          <v-list-item-avatar class="overflow-visible" size="156">
            <v-btn v-if="!!avatarFile" absolute class="avatar-clear-btn" color="red" dark depressed fab
                   x-small @click="computedAvatar = null">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <img id="avatar" :src="!!computedValue.avatar ? computedValue.avatar : '/media/users/blank.png'"
                 alt="user_profile" style="object-fit: cover">
            <v-btn absolute class="avatar-float-btn" depressed fab height="46" width="46" @click="handelUpload">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="font-size-h1" v-text="value.name"/>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
    </v-col>

    <v-col :md="popup ? 12 : 7" class="d-flex align-start pa-2 pe-10" cols="12">
      <v-icon class="mt-4">mdi-account-outline</v-icon>

      <transition-group class="row no-gutters" name="slide-y-transition" tag="div">
        <v-col v-if="expandedName" key="preName" class="pa-2" cols="12">
          <v-text-field v-model="computedValue.preName" class="rounded-lg" clear-icon="mdi-close-circle-outline"
                        clearable dense hide-details :label="i18n.t('CONTACTS.PREFIX')" outlined/>
        </v-col>

        <v-col key="name" class="pa-2" cols="12">
          <v-text-field v-model="computedValue.name" class="rounded-lg" clear-icon="mdi-close-circle-outline"
                        clearable dense hide-details :label="i18n.t('CONTACTS.NAME')" outlined/>
        </v-col>

        <v-col v-if="expandedName" key="middleName" class="pa-2" cols="12">
          <v-text-field v-model="computedValue.middleName" class="rounded-lg" clear-icon="mdi-close-circle-outline"
                        clearable dense hide-details :label="i18n.t('CONTACTS.MIDDLENAME')" outlined/>
        </v-col>

        <v-col key="lastName" class="pa-2" cols="12">
          <v-text-field v-model="computedValue.lastName" class="rounded-lg" clear-icon="mdi-close-circle-outline"
                        clearable dense hide-details :label="i18n.t('CONTACTS.LASTNAME')" outlined/>
        </v-col>

        <v-col v-if="expandedName" key="postName" class="pa-2" cols="12">
          <v-text-field v-model="computedValue.postName" class="rounded-lg" clear-icon="mdi-close-circle-outline"
                        clearable dense hide-details :label="i18n.t('CONTACTS.POSTFIX')" outlined/>
        </v-col>

        <v-col key="alias" class="pa-2" cols="12">
          <v-text-field v-model="computedValue.alias" class="rounded-lg" clear-icon="mdi-close-circle-outline"
                        clearable dense hide-details :label="i18n.t('CONTACTS.ALIAS')" outlined/>
        </v-col>
      </transition-group>

      <v-btn absolute class="more-btn-float" icon @click="expandedName = !expandedName">
        <transition mode="out-in" name="fab-transition">
          <v-icon v-if="!expandedName" key="down">mdi-chevron-down</v-icon>
          <v-icon v-else key="up">mdi-chevron-up</v-icon>
        </transition>
      </v-btn>
    </v-col>

    <v-col :md="popup ? 12 : 7" class="d-flex align-start pa-2 pe-10" cols="12">
      <v-icon class="mt-4">mdi-domain</v-icon>

      <v-row no-gutters>
        <v-col class="pa-2" cols="12">
          <v-text-field v-model="computedValue.companyName" class="rounded-lg" clear-icon="mdi-close-circle-outline"
                        clearable dense hide-details :label="i18n.t('CONTACTS.COMPANY')" outlined/>
        </v-col>

        <v-col class="pa-2" cols="12">
          <v-text-field v-model="computedValue.jobTitle" class="rounded-lg" clear-icon="mdi-close-circle-outline"
                        clearable dense hide-details :label="i18n.t('CONTACTS.JOBTITLE')" outlined/>
        </v-col>
      </v-row>
    </v-col>

    <v-col :md="popup ? 12 : 7" class="d-flex align-start pa-2 pe-10" cols="12">
      <v-icon class="mt-4">mdi-phone-outline</v-icon>

      <v-row no-gutters>
        <v-col class="pa-2" cols="12">
          <v-text-field v-model="computedValue.phone"
                        :hide-details="typeof rules.phone(computedValue.phone) === 'boolean'" :rules="[rules.phone]"
                        class="rounded-lg phone-field" clear-icon="mdi-close-circle-outline" clearable dense
                        :label="i18n.t('CONTACTS.PHONE')"
                        outlined :placeholder="i18n.t('CONTACTS.PHONE_PLACEHOLDER')"/>
        </v-col>
      </v-row>
    </v-col>

    <v-col v-if="!!computedValue.email.length" :md="popup ? 12 : 7" class="d-flex align-start pa-2 pe-0" cols="12">
      <v-icon class="mt-4">mdi-email-outline</v-icon>

      <div class="flex">
        <div v-for="(item, i) in computedValue.email" :key="i" class="position-relative pa-2 pe-10">
          <v-row no-gutters>
            <v-col class="pe-2 flex">
              <v-text-field v-model="item.email" :hide-details="typeof rules.email(item.email) === 'boolean'"
                            :rules="[rules.email]" class="rounded-lg" clear-icon="mdi-close-circle-outline" clearable
                            dense :label="i18n.t('CONTACTS.EMAIL')" outlined/>
            </v-col>

            <v-col v-if="!!item.email" class="pe-2" style="flex: 0 0 35%;max-width: 35%">
              <v-combobox v-model="item.tag" class="rounded-lg" clear-icon="mdi-close-circle-outline" clearable dense
                          hide-details hide-selected :label="i18n.t('CONTACTS.TAG')" outlined/>
            </v-col>
          </v-row>

          <v-btn absolute class="more-btn-float more-deep" icon @click="removeField('email', i)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>
    </v-col>

    <v-col :md="popup ? 12 : 7" class="pa-2 px-md-10" cols="12">
      <div class="pe-2">
        <v-btn block class="rounded-pill" color="blue lighten-4" depressed @click="pushField('email')">
          <v-icon v-if="!!computedValue.email.length" left>mdi-plus</v-icon>
          <v-icon v-else left>mdi-email-outline</v-icon>
          {{ i18n.t('CONTACTS.ADD_EMAIL') }}
        </v-btn>
      </div>
    </v-col>

    <v-col v-if="!!computedValue.address.length" :md="popup ? 12 : 7" class="d-flex align-start pa-2 pe-0" cols="12">
      <v-icon class="mt-4">mdi-map-marker-outline</v-icon>

      <div class="flex">
        <div v-for="(item, i) in computedValue.address" :key="i" class="position-relative pa-2 pe-10">
          <v-row no-gutters>
            <v-col class="pe-2 pb-4" cols="12">
              <v-autocomplete v-model="item.province" :items="provinces" :menu-props="{offsetY: true}"
                              clear-icon="mdi-close-circle-outline" clearable dense hide-details item-value="text"
                              :label="i18n.t('CONTACTS.PROVINCE')" outlined @change="getCities(item.province)"/>
            </v-col>

            <v-col class="pe-2 pb-4" cols="12">
              <v-autocomplete v-model="item.city" :disabled="!item.province" :items="cities[item.province]"
                              :loading="cityLoading" :menu-props="{offsetY: true}" clear-icon="mdi-close-circle-outline"
                              clearable dense hide-details item-value="text" :label="i18n.t('CONTACTS.CITY')" outlined
                              @focus="getCities(item.province)"/>
            </v-col>

            <v-col class="pe-2 pb-4" cols="12">
              <v-text-field v-model="item.address" class="rounded-lg" clear-icon="mdi-close-circle-outline"
                            clearable dense hide-details :label="i18n.t('CONTACTS.ADDRESS')" outlined/>
            </v-col>

            <v-col class="pe-2 pb-4" cols="12">
              <v-text-field v-model="item.postalCode" class="rounded-lg" clear-icon="mdi-close-circle-outline"
                            clearable dense hide-details :label="i18n.t('CONTACTS.POSTALCODE')" outlined/>
            </v-col>

            <v-col class="pe-2 pb-4" cols="12">
              <v-combobox v-model="item.tag" :items="tagsItem['address']" class="rounded-lg"
                          clear-icon="mdi-close-circle-outline" clearable dense hide-details hide-selected :label="i18n.t('CONTACTS.TAG')"
                          outlined/>
            </v-col>
          </v-row>

          <v-btn absolute class="more-btn-float more-deep" icon @click="removeField('address', i)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>
    </v-col>

    <v-col :md="popup ? 12 : 7" class="pa-2 px-md-10" cols="12">
      <div class="pe-2">
        <v-btn block class="rounded-pill" color="blue lighten-4" depressed @click="pushField('address')">
          <v-icon v-if="!!computedValue.address.length" left>mdi-plus</v-icon>
          <v-icon v-else left>mdi-map-marker-outline</v-icon>
          {{ i18n.t('CONTACTS.ADD_ADDRESS') }}
        </v-btn>
      </div>
    </v-col>

    <v-col v-if="showBirthday" :md="popup ? 12 : 7" class="d-flex align-start pa-2 pe-10" cols="12">
      <v-icon class="mt-4">mdi-cake-variant-outline</v-icon>

      <v-row no-gutters>
        <v-col class="pa-2" cols="12" md="4">
          <v-text-field v-model="birthday.year" :max="maxYear" class="rounded-lg" clear-icon="mdi-close-circle-outline"
                        clearable dense hide-details :label="i18n.t('CONTACTS.YEAR_OPTIONAL')"
                        oninput="if (Number(this.value) > this.max) this.value = this.max; else if (Number(this.value) < 1) this.value = 1;"
                        outlined type="number"/>
        </v-col>

        <v-col class="pa-2" cols="12" md="6">
          <v-select v-model="birthday.month" :items="months" :menu-props="{ offsetY: true }" class="rounded-lg"
                    clear-icon="mdi-close-circle-outline" clearable dense hide-details :label="i18n.t('CONTACTS.MONTH')" outlined/>
        </v-col>

        <v-col class="pa-2" cols="12" md="2">
          <v-text-field v-model="birthday.day" class="rounded-lg" clear-icon="mdi-close-circle-outline" clearable dense
                        hide-details :label="i18n.t('CONTACTS.DAY')" max="31"
                        oninput="if (Number(this.value) > Number(this.max)) this.value = this.max; else if (Number(this.value) < 1) this.value = 1;"
                        outlined type="number"/>
        </v-col>
      </v-row>

      <v-btn absolute class="more-btn-float" icon @click="clearBirthday">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-col>

    <v-col v-else :md="popup ? 12 : 7" class="pa-2 px-md-10" cols="12">
      <div class="pe-2">
        <v-btn block class="rounded-pill" color="blue lighten-4" depressed @click="showBirthday = true">
          <v-icon left>mdi-cake-variant-outline</v-icon>
          {{ i18n.t('CONTACTS.ADD_BIRTHDAY') }}
        </v-btn>
      </div>
    </v-col>

    <v-col v-if="!!computedValue.website.length" :md="popup ? 12 : 7" class="d-flex align-start pa-2 pe-0" cols="12">
      <v-icon class="mt-4">mdi-link</v-icon>

      <div class="flex">
        <div v-for="(item, i) in computedValue.website" :key="i" class="position-relative pa-2 pe-10">
          <v-row no-gutters>
            <v-col class="pe-2 flex">
              <v-text-field v-model="item.link" :hide-details="typeof rules.website(item.link) === 'boolean'"
                            :rules="[rules.website]" class="rounded-lg" clear-icon="mdi-close-circle-outline" clearable
                            dense :label="i18n.t('CONTACTS.WEBSITE')" outlined/>
            </v-col>

            <v-col v-if="!!item.link" class="pe-2" style="flex: 0 0 35%;max-width: 35%">
              <v-text-field v-model="item.tag" class="rounded-lg" clear-icon="mdi-close-circle-outline" clearable dense
                            hide-details :label="i18n.t('CONTACTS.TAG')" outlined/>
            </v-col>
          </v-row>

          <v-btn absolute class="more-btn-float more-deep" icon @click="removeField('website', i)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>
    </v-col>

    <v-col :md="popup ? 12 : 7" class="pa-2 px-md-10" cols="12">
      <div class="pe-2">
        <v-btn block class="rounded-pill" color="blue lighten-4" depressed @click="pushField('website')">
          <v-icon v-if="!!computedValue.website.length" left>mdi-plus</v-icon>
          <v-icon v-else left>mdi-link</v-icon>
          {{ i18n.t('CONTACTS.ADD_WEBSITE') }}
        </v-btn>
      </div>
    </v-col>

    <v-col v-if="!!computedValue.date_times.length" :md="popup ? 12 : 7" class="d-flex align-start pa-2 pe-0" cols="12">
      <v-icon class="mt-4">mdi-calendar-month</v-icon>

      <div class="flex">
        <div v-for="(item, i) in computedValue.date_times" :key="i" class="position-relative pa-2 pe-10">
          <v-row no-gutters>
            <v-col class="pe-2 flex">
              <custom-date-picker v-model="item.date" :input-class="`date-input-${i}`" dense hide-details :label="i18n.t('CONTACTS.DATE')"
                                  nullable outlined wrapper-class="rounded-lg"/>
            </v-col>

            <v-col v-if="!!item.date" class="pe-2" style="flex: 0 0 35%;max-width: 35%">
              <v-text-field v-model="item.tag" class="rounded-lg" clear-icon="mdi-close-circle-outline" clearable
                            dense hide-details :label="i18n.t('CONTACTS.TAG')" outlined/>
            </v-col>
          </v-row>

          <v-btn absolute class="more-btn-float more-deep" icon @click="removeField('date_times', i)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>
    </v-col>

    <v-col :md="popup ? 12 : 7" class="pa-2 px-md-10" cols="12">
      <div class="pe-2">
        <v-btn block class="rounded-pill" color="blue lighten-4" depressed @click="pushField('date_times')">
          <v-icon v-if="!!computedValue.date_times.length" left>mdi-plus</v-icon>
          <v-icon v-else left>mdi-view-agenda-outline</v-icon>
          {{ i18n.t('CONTACTS.ADD_DATE') }}
        </v-btn>
      </div>
    </v-col>

    <v-col v-if="!!computedValue.custom.length" :md="popup ? 12 : 7" class="d-flex align-start pa-2 pe-0" cols="12">
      <v-icon class="mt-4">mdi-view-agenda-outline</v-icon>

      <div class="flex">
        <div v-for="(item, i) in computedValue.custom" :key="i" class="position-relative pa-2 pe-10">
          <v-row no-gutters>
            <v-col class="pe-2 flex">
              <v-text-field v-model="item.text" class="rounded-lg" clear-icon="mdi-close-circle-outline"
                            clearable dense hide-details :label="i18n.t('CONTACTS.CUSTOM_FIELD')" outlined/>
            </v-col>

            <v-col v-if="!!item.text" class="pe-2" style="flex: 0 0 35%;max-width: 35%">
              <v-text-field v-model="item.tag" class="rounded-lg" clear-icon="mdi-close-circle-outline" clearable dense
                            hide-details :label="i18n.t('CONTACTS.TAG')" outlined/>
            </v-col>
          </v-row>

          <v-btn absolute class="more-btn-float more-deep" icon @click="removeField('custom', i)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>
    </v-col>

    <v-col :md="popup ? 12 : 7" class="pa-2 px-md-10" cols="12">
      <div class="pe-2">
        <v-btn block class="rounded-pill" color="blue lighten-4" depressed @click="pushField('custom')">
          <v-icon v-if="!!computedValue.custom.length" left>mdi-plus</v-icon>
          <v-icon v-else left>mdi-view-agenda-outline</v-icon>
          {{ i18n.t('CONTACTS.ADD_CUSTOM_FIELD') }}
        </v-btn>
      </div>
    </v-col>

    <v-col v-if="showNote" :md="popup ? 12 : 7" class="d-flex align-start pa-2 pe-10" cols="12">
      <v-icon class="mt-4">mdi-note-outline</v-icon>

      <v-row no-gutters>
        <v-col class="pa-2" cols="12">
          <v-textarea v-model="computedValue.description" class="rounded-lg" clear-icon="mdi-close-circle-outline"
                      clearable dense hide-details :label="i18n.t('CONTACTS.NOTE')" outlined/>
        </v-col>
      </v-row>

      <v-btn absolute class="more-btn-float" icon @click="clearNote">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-col>

    <v-col v-else :md="popup ? 12 : 7" class="pa-2 px-md-10" cols="12">
      <div class="pe-2">
        <v-btn block class="rounded-pill" color="blue lighten-4" depressed @click="showNote = true">
          <v-icon left>mdi-note-outline</v-icon>
          {{ i18n.t('CONTACTS.ADD_NOTE') }}
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import CustomDatePicker from "@/view/content/pickers/custom-date-picker.vue";
import i18n from "../../../plugins/EasyModal/i18n";

export default {
  name: "contactsEditFields",

  components: {CustomDatePicker},

  props: {
    value: Object,
    canMore: Boolean,
    avatarFile: [File, null],
    popup: Boolean
  },

  data() {
    return {
      i18n,
      expandedName: false,
      tagsItem: {
        address: [i18n.t('CONTACTS.HOME'), i18n.t('CONTACTS.WORK'), i18n.t('CONTACTS.OTHER')],
        email: [i18n.t('CONTACTS.HOME'), i18n.t('CONTACTS.WORK'), i18n.t('CONTACTS.OTHER')],
        website: [i18n.t('CONTACTS.PROFILE'), i18n.t('CONTACTS.BLOG'), i18n.t('CONTACTS.HOMEPAGE'), i18n.t('CONTACTS.WORK')]
      },
      types: {
        address: {
          province: null,
          city: null,
          address: '',
          postalCode: '',
          tag: ''
        },
        custom: {
          text: '',
          tag: ''
        },
        email: {
          email: '',
          tag: ''
        },
        website: {
          link: '',
          tag: ''
        }
      },
      loading: false,
      provinces: [],
      cities: {},
      cityLoading: false,
      months: [
        { value: 1, text: i18n.t('MONTH.FARVARDIN') },
        { value: 2, text: i18n.t('MONTH.ORDIBEHESHT') },
        { value: 3, text: i18n.t('MONTH.KHORDAD') },
        { value: 4, text: i18n.t('MONTH.TIR') },
        { value: 5, text: i18n.t('MONTH.MORDAD') },
        { value: 6, text: i18n.t('MONTH.SHAHRIVAR') },
        { value: 7, text: i18n.t('MONTH.MEHR') },
        { value: 8, text: i18n.t('MONTH.ABAN') },
        { value: 9, text: i18n.t('MONTH.AZAR') },
        { value: 10, text: i18n.t('MONTH.DEY') },
        { value: 11, text: i18n.t('MONTH.BAHMAN') },
        { value: 12, text: i18n.t('MONTH.ESFAND') },
      ],
      showBirthday: true,
      birthday: {
        day: '',
        month: '',
        year: ''
      },
      showNote: true,
      rules: {
        birthday: () => ((!!this.birthday.day && !!this.birthday.month)
          || (!this.birthday.day && !this.birthday.month)) || i18n.t('CONTACTS.INVALID_BIRTHDAY'),
        year: v => (v.length === 4 || !v.length) || i18n.t('CONTACTS.YEAR_4DIGIT'),
        email: v => (this.isEmail(v) || !v) || i18n.t('CONTACTS.INVALID_EMAIL'),
        website: v => (this.isDomain(v) || !v) || i18n.t('CONTACTS.INVALID_WEBSITE'),
        phone: v => this.isPhone(v) || i18n.t('CONTACTS.INVALID_PHONE')
      },
      rerender: true,
    }
  },

  created() {
    this.getProvince()

    setTimeout(() => {
      this.$emit('update:canMore', this.computedCanMore)
    }, 1000)
  },

  mounted() {
    !!this.value.birthday && this.getBirthday(this.value.birthday)
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
    maxYear() {
      const date = new Date()

      return Number(this.english(date.toLocaleDateString('fa-IR').substring(0, 4)))
    },
    computedCanMore() {
      return typeof this.rules.birthday() === 'boolean'
        && typeof this.rules.year(this.birthday.year) === 'boolean'
        && typeof this.rules.phone(this.computedValue.phone) === 'boolean'
        && !this.computedValue.website
          .filter(item => typeof this.rules.website(item.link) !== 'boolean')?.length
        && !this.computedValue.email
          .filter(item => typeof this.rules.email(item.email) !== 'boolean')?.length
    },
    computedAvatar: {
      get() {
        return this.avatarFile
      },
      set(val) {
        this.$emit('update:avatarFile', val)
      }
    }
  },

  watch: {
    computedValue: {
      deep: true,

      handler(val, oldVal) {
        (!oldVal.birthday && !!val.birthday) && this.getBirthday(val.birthday)
      }
    },
    computedCanMore(val) {
      this.$emit('update:canMore', val)
    },
    birthday: {
      deep: true,

      handler(val) {
        if (Object.values(val).some(item => !!item) && (!val.month || isNaN(val.month))) {
          this.birthday.month = 1;
        }

        let arr = [val.month.toString().padStart(2, '0'), val.day.toString().padStart(2, '0')]
        if (!!val.year)
          arr.unshift(val.year)

        this.computedValue.birthday = arr.join('-')
      }
    }
  },

  methods: {
    handelUpload() {
      this.$refs.fileInput.click()
    },
    pushField(field) {
      this.computedValue[field].push({
        ...this.types[field]
      })
    },
    removeField(field, index) {
      this.computedValue[field].splice(index, 1)
    },
    getProvince() {
      this.loading = true

      this.$payamakAxios.get('provinces')
        .then(({data}) => this.provinces = data.data.map(item => {
          return {
            value: item.id,
            text: item.name
          }
        }))
        .catch(({response}) => console.log('error in get provinces: ', response))
        .finally(() => this.loading = false)
    },
    getCities(index) {
      let id = this.provinces.find(item => item.name = index)?.value

      if (this.cities.hasOwnProperty(id))
        return

      this.cityLoading = true

      this.$payamakAxios.get(`city/${id}`)
        .then(({data}) => this.cities[index] = data.data.map(item => ({
          value: item.id,
          text: item.name
        })))
        .catch(({response}) => console.log('error in get provinces: ', response))
        .finally(() => this.cityLoading = false)
    },
    clearBirthday() {
      this.computedValue.birthday = ''
      this.showBirthday = false
      this.birthday = {
        day: '',
        month: '',
        year: ''
      }
    },
    clearNote() {
      this.computedValue.descriptor = ''
      this.showNote = false
    },
    isDomain(str) {
      let regex = new RegExp("[(http(s)?):\\/\\/(www\\.)?a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)", 'ig');

      return !str || regex.test(str) || str.length <= 0
    },
    isEmail(email) {
      let rgx = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
      return rgx.test(email)
    },
    isPhone(phone) {
      let rgx = new RegExp("^((\\+?98(0?)9|(0?9))[0-9]{2})[0-9]{3}[0-9]{4}$|^((\\+?۹۸(۰?)|(۰?۹))[۰-۹]{2})[۰-۹]{3}[۰-۹]{4}$")
      return rgx.test(phone)
    },
    inputChanged(event) {

      // Stop the form from reloading the page
      event.preventDefault();

      let src = this.computedAvatar = event.target.files[0];
      // If there's no file, do nothing
      // if (!file.value.length) return;

      // Create a new FileReader() object
      let reader = new FileReader();

      // Setup the callback event to run when the file is read
      reader.onload = this.logFile;

      // Read the file
      reader.readAsDataURL(src);

    },
    logFile(e) {
      let str = e.target.result;
      let img = document.getElementById('avatar');
      img.src = str;
    },
    getBirthday(val) {
      let arr = val.split('-')
      if (arr.length > 2)
        this.birthday.year = arr.shift()

      this.birthday.day = arr.pop()
      this.birthday.month = parseInt(arr.pop())
    }
  }
}
</script>

<style scoped>
.avatar-float-btn {
  left: 0;
  bottom: 0;
  border: 3px solid #fff !important;
  background: skyblue !important;
}

.avatar-clear-btn {
  top: 5px;
  left: 5px;
  border: 3px solid #fff !important;
}

.more-btn-float {
  left: 0;
  top: 16px;
}

.more-btn-float.more-deep {
  left: 0;
  top: 10px;
}

.slide-y-transition-enter-from,
.slide-y-transition-leave-to {
  opacity: 0;
}

.slide-y-transition-leave-active {
  position: absolute;
}

.phone-field >>> input {
  text-align: right;
  direction: ltr;
}
</style>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type=number] {
  -moz-appearance: textfield; /* Firefox */
}
</style>