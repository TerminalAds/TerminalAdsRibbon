<template>
  <v-card flat>
    <v-card-title class="white">
      <v-btn icon @click="$router.back()">
        <v-icon>mdi-arrow-right</v-icon>
      </v-btn>
      <v-spacer/>
      <v-btn :disabled="!canSave" :loading="loading" class="btn-accept" depressed rounded @click="saveEdited">
        <v-icon left>fa-save</v-icon>
        <span class="letter-spacing-none">{{ i18n.t('registration') }}</span>
      </v-btn>
    </v-card-title>

    <contacts-edit-fields v-model="info" :avatarFile.sync="avatarFile" :can-more.sync="canSave"/>
  </v-card>
</template>

<script>
import ContactsEditFields from "@/view/content/contacts/contactsEditFields.vue";
import i18n from "../../plugins/EasyModal/i18n";

export default {
  name: "newContact",

  components: {ContactsEditFields},

  props: {
    phoneTag: Object
  },

  data: () => ({
    i18n,
    avatarFile: null,
    canSave: false,
    info: {
      phone: '',
      phone_tags: [],
      avatar: null,
      preName: '',
      name: '',
      middleName: '',
      lastName: '',
      postName: '',
      alias: '',
      companyName: '',
      jobTitle: '',
      birthday: '',
      description: '',
      province_id: '',
      city_id: '',
      email: [],
      address: [],
      website: [],
      custom: [],
      date_times: []
    },
    loading: false,
  }),

  methods: {
    saveEdited() {
      this.loading = true
      let formData = new FormData()

      let obj = this.info

      let rgx = new RegExp(/[۰-۹]+/g);
      if (rgx.test(obj.phone))
        obj.phone = this.english(obj.phone)

      if (!obj.phone_tags || !obj.phone_tags.length)
        obj.phone_tags = [this.phoneTag]

      let arr = Object.entries(obj)

      arr.forEach(val => {
        if (val[0] === 'phone_tags')
          formData.append(val[0], val[1].map(item => item.id))
        else if (val[0] === 'avatar')
          formData.append(val[0], this.avatarFile ?? '');
        else if (val[1] instanceof Array)
          formData.append(val[0], JSON.stringify(val[1]))
        else
          formData.append(val[0], val[1] || '')
      })

      this.$payamakAxios.post('contact/store', formData)
        .then(({data}) => {
          this.$emit('reload')
          resetInfo(this.info)
        })
        .catch(({response}) => console.log('error in save contact: ', response))
        .finally(() => this.loading = false)

      function resetInfo(obj) {
        for (const [key, value] of Object.entries(obj)) {
          const valueType = typeof value;

          if (valueType === 'string') {
            obj[key] = ''; // Clear strings
          } else if (valueType === 'number') {
            obj[key] = 0; // Clear numbers
          } else if (valueType === 'boolean') {
            obj[key] = false; // Clear booleans
          } else if (Array.isArray(value)) {
            obj[key] = []; // Clear arrays
          } else {
            // Handle other types or leave unchanged
          }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>