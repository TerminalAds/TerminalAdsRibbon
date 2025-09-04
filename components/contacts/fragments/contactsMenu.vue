<template>
  <div class="d-flex align-center">
    <slot name="toggle"/>

    <v-menu v-model="menu" :close-on-content-click="false" content-class="rounded-lg" min-width="200" offset-y right>
      <template v-slot:activator="{ on, attrs }">
        <v-btn :dark="$attrs.dark" class="mx-2" icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-card class="rounded-lg" flat>
        <v-list class="transparent" dense>
          <v-list-item v-if="!isSharedPhonebook" @click="shareModal = true">
            <v-list-item-icon>
              <v-icon>mdi-share-variant-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ i18n.t('CONTACT_MENU.SHARE') }}</v-list-item-title>
          </v-list-item>

          <v-list-item disabled @click="openPrint">
            <v-list-item-icon>
              <v-icon>mdi-printer-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ i18n.t('CONTACT_MENU.PRINT') }}</v-list-item-title>
          </v-list-item>

          <v-list-item :disabled="downLoading" @click="downloadExcel">
            <v-list-item-icon>
              <v-icon>mdi-file-excel-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ i18n.t('CONTACT_MENU.EXCEL_EXPORT') }}</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="!!selectedIds.length && hasPhonebookPermission('delete')" :disabled="loading"
                       @click="deleteSelected">
            <v-list-item-icon>
              <v-icon v-if="!loading" :color="!selectedIds.length ? '' : 'red'">mdi-delete</v-icon>
              <v-progress-circular v-else color="blue" indeterminate size="24" width="4"/>
            </v-list-item-icon>
            <v-list-item-title>{{ i18n.t('CONTACT_MENU.DELETE') }}</v-list-item-title>
          </v-list-item>

          <slot name="list-item"/>
        </v-list>
      </v-card>
    </v-menu>

    <contacts-share-tag v-model="shareModal" :tag="phoneTag"/>
  </div>
</template>

<script>
import ContactsShareTag from "./contactsShareTag.vue";
import {mapGetters} from "vuex";
import i18n from "../../../plugins/EasyModal/i18n";

export default {
  name: "contactsMenu",

  components: {ContactsShareTag},

  props: {
    phoneTag: Object,
    selectedIds: Array
  },

  data: () => ({
    i18n,
    menu: false,
    downLoading: false,
    loading: false,
    shareModal: false,
  }),

  computed: {
    ...mapGetters('phonebook', ['isSharedPhonebook']),
  },

  methods: {
    openPrint() {
      window.open()
    },
    downloadExcel() {
      this.downLoading = true

      let url = `contact${this.$route.name === 'admin.contact.monitoring' ? '/admin' : ''}/excel`

      this.$payamakAxios.get(url, {
        params: {
          phone_tag: this.phoneTag.id
        }
      })
        .then(({data}) => {
          if (data.download_url) {
            const a = document.createElement('a');
            let moment = require('moment-jalaali')
            a.setAttribute('download', 'contact-excel_' + moment().format('jYYYY-jMM-jDD HH:mm:ss'))
            a.setAttribute('href', data.download_url)

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        })
        .catch(({response}) => console.log('failed to download contact excel: ', response))
        .finally(() => this.downLoading = false)
    },
    deleteSelected() {
      this.loading = true

      this.$payamakAxios('contact/phoneTag/group', {
        phoneTag: this.phoneTag.id,
        ids: this.selectedIds.map(item => item.id)
      })
        .then(({data}) => {
          this.menu = false
          this.$emit('reload')
          this.$toast.success(i18n.t('CONTACT_MENU.DELETE_SUCCESS'))
        })
        .catch(({response}) => {
          this.$toast.error(i18n.t('CONTACT_MENU.DELETE_ERROR'))
          console.log('failed to group deleting ids: ', response)
        })
        .finally(() => this.loading = false)
    },
    editingTag() {
      console.log('refs: ', this.$refs)
    }
  }
}
</script>

<style scoped>

</style>