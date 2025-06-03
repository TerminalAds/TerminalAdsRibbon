<template>
  <router-view v-if="$route.name !== 'contacts'" @fetch="fetchContacts()"/>

  <v-card v-else class="pa-4" flat>
    <template v-if="!!tagList.length">
      <v-window v-model="selectedTag" vertical>
        <v-window-item v-for="n in tagList" :key="n.id">
          <v-card class="phone-list-bg rounded-lg position-relative" flat height="120">
            <v-row align="center" class="fill-height" justify="center" no-gutters>
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-btn class="me-2" color="white" depressed fab small v-bind="attrs" @click="reloadTable()" v-on="on">
                    <v-icon>mdi-reload</v-icon>
                  </v-btn>
                </template>

                <span>بارگیری مجدد لیست</span>
              </v-tooltip>

              <div class="text-center white--text">
                <h2>{{ n.name }}</h2>
                <span v-if="isSharedPhonebook" class="ma-2 font-small">اشتراک گذاشته شده</span>
              </div>
            </v-row>

            <div style="position: absolute; top: 10px; left: 5px;">
              <contacts-menu :phone-tag="tagList[selectedTag]" :selected-ids="selectedRows" dark
                             @reload="reloadTable()">
                <template v-slot:list-item>
                  <v-list-item @click="$refs.contactTags.editingTag(n)">
                    <v-list-item-icon>
                      <v-icon>mdi-tag-edit-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>ویرایش گروه</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="$refs.contactTags.deleteTag(n.id)">
                    <v-list-item-icon>
                      <v-icon color="error">mdi-delete-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>حذف گروه</v-list-item-title>
                  </v-list-item>
                </template>
              </contacts-menu>
            </div>
          </v-card>
        </v-window-item>
      </v-window>

      <v-card :disabled="loading || loadPhones" :loading="loading || loadPhones"
              class="d-flex justify-center justify-md-space-between pa-2" flat>
        <v-btn :disabled="tagList.length <= 1" class="d-none d-md-block" color="#B71C1C" icon
               @click="prev(selectedTag)">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>

        <div class="d-flex align-start">
          <contacts-tags ref="contactTags" v-model="menu" :tag-list.sync="tagList" @reload="fetchTags">
            <v-btn :color="tagList.length ? '#FF4400' : 'success'" class="mx-1" dark depressed fab x-small
                   @click="menu = true">
              <v-icon>mdi-{{ tagList.length ? 'dots-vertical' : 'plus' }}</v-icon>
            </v-btn>
          </contacts-tags>

          <v-item-group v-model="selectedTag" class="tag-items" mandatory>
            <v-item v-for="(n, i) in tagList" :key="n.id" v-slot="{ active, toggle }" class="mx-1 mb-2">
              <v-btn :color="active ? '#FF4400' : ''" :dark="active" :input-value="active" depressed
                     @click="selectItem(i)">
                <v-icon v-if="n.hasOwnProperty('owner_id')" left>mdi-share-all-outline</v-icon>
                {{ n.name }}
              </v-btn>
            </v-item>

            <v-item class="mx-1 mb-2">
              <v-btn color="success" outlined @click="$refs.contactTags.dialog = true">
                <v-icon left>mdi-plus</v-icon>
                افزودن گروه جدید
              </v-btn>
            </v-item>
          </v-item-group>
        </div>

        <v-btn :disabled="tagList.length <= 1" class="d-none d-md-block" color="#B71C1C" icon
               @click="next(selectedTag)">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-card>
    </template>

    <v-card v-else :loading="loading" class="d-flex flex-column align-center justify-center" flat>
      <v-img aspect-ratio="1" class="rounded-lg" contain src="/media/img/noPhoneTags.jpg" width="160"/>
      <v-card-title>
        لطفا ابتدا گروه جدید اضافه نمایید.
      </v-card-title>
      <v-card-actions class="justify-center">
        <contacts-tags is-btn @reload="fetchTags"/>
      </v-card-actions>
    </v-card>

    <v-card :disabled="!tagList.length" flat>
      <custom-tabs v-model="tabs" :tab-items="tabItems" grow>
        <template v-slot:staticItems>
          <v-tab-item>
            <v-card-title class="font-size-h1">
              <span v-if="!!tagList && !!tagList[selectedTag] && tagList[selectedTag].name">
                {{ tagList[selectedTag].name || 'مخاطبین' }}
              </span>
              <span v-if="!!data.data && !!data.data.length" class="font-size-h6 mx-1 grey--text">({{
                  data.total
                }})</span>
              <v-spacer/>
              <contacts-menu :phone-tag="tagList[selectedTag]" :selected-ids="selectedRows" @reload="reloadTable()"/>
            </v-card-title>

            <v-divider v-if="!loading || !loadPhones" class="mt-0 mb-1"/>
            <v-progress-linear v-else indeterminate/>

            <contacts-table v-if="!!tagList.length" v-model="selectedRows" :data="data" :loading.sync="loadPhones"
                            :phone-tag="tagList[selectedTag]" :table-props.sync="tableProps" @reload="reloadTable"/>
            <!--                            @select="selectRow"/>-->

            <template v-else>
              <v-img class="mt-3 mx-auto" contain max-height="150" max-width="150" src="media/empty/add-number-2.png"/>

              <p class="mt-2 text-center">
                <span class="font-weight-bold">{{ $t("LISTS.AddANumber") }}</span>
              </p>
            </template>
          </v-tab-item>

          <template v-if="hasPhonebookPermission('add')">
            <v-tab-item>
              <new-contact :phone-tag="tagList[selectedTag]" @reload="() => {tabs = 0;reloadTable()}"/>
            </v-tab-item>

            <v-tab-item>
              <contacts-number-view
                ref="numberView" v-model="data" :loading="loading || loadPhones" :props.sync="tableProps"
                @addBulk="importFromBulk" @changePage="(e) => fetchContacts({ ...tableProps, page: e })"
                @reload="reloadTable"/>
            </v-tab-item>

            <v-tab-item>
              <contact-import-from-excel v-if="!!tagList && !!tagList[selectedTag]" :tags="tagList[selectedTag].id"
                                         @fetch="() => {reloadTable({...tableProps, page: 1}); tabs = 0}"/>
            </v-tab-item>
          </template>
        </template>
      </custom-tabs>
    </v-card>
  </v-card>
</template>

<script>
import {mapGetters, mapState, mapActions} from "vuex";
import {debounce} from "../../install";
import ContactsMenu from "./fragments/contactsMenu.vue";
import ContactsTags from "./fragments/contactsTags.vue";
import CustomTabs from "../../plugins/customTabs/index.vue";
import ContactsTable from "./fragments/contactsTable.vue";
import NewContact from "./newContact.vue";
import ContactsNumberView from "./fragments/contactsNumberView.vue";
import ContactImportFromExcel from "./fragments/contactImportFromExcel.vue";

export default {
  name: "contacts",

  components: {
    ContactImportFromExcel,
    ContactsNumberView, NewContact, ContactsTable, ContactsTags, ContactsMenu, CustomTabs
  },

  data() {
    return {
      menu: false,
      data: {},
      loading: false,
      loadPhones: false,
      tProps: {
        search: '',
        tag: null,
        filters: {},
        status: null,
        length: 10,
        column: 'id',
        dir: 'desc',
        phone_tag_ids: [],
        page: 1
      },
      tabs: 0,
      tagList: [],
      selectedRows: [],
      toggle: 1,
      selectedTag: 0
    }
  },

  created() {
    this.selectedTag = this.selected_phonebook_index || 0
    this.$route.name === 'contacts' && this.fetchTags()
  },

  computed: {
    ...mapState('phonebook', ['selectedPhonebook', 'selected_phonebook_index']),
    ...mapGetters('phonebook', ['isSharedPhonebook']),
    tableProps: {
      get() {
        return {
          ...this.tProps,
          phone_tag_ids: [this.tagList[this.selectedTag]?.id || 0]
        }
      },
      set(val) {
        this.tProps = {
          ...val,
          phone_tag_ids: [this.tagList[this.selectedTag].id || 0]
        }
      }
    },
    tabItems() {
      let arr = [
        {text: 'لیست', icon: 'format-list-numbered'}
      ]

      let s_arr = [
        {text: 'افزودن تکی', icon: 'account-plus'},
        {text: 'افزودن گروهی', icon: 'phone-plus'},
        {text: 'افزودن اکسل', icon: 'file-excel'},
      ]

      return this.hasPhonebookPermission('add') ? [...arr, ...s_arr] : arr
    },
  },

  watch: {
    '$route.name'(val) {
      if (val === 'contacts') this.fetchTags()
    },
    toggle(val) {
      if (!!val) {
        let temp = this.data
        this.data = {}
        this.$nextTick(() => {
          setTimeout(() => {
            this.data = temp
          }, 500)
        })
      }
    }
  },

  methods: {
    ...mapActions('phonebook', ['setPhonebooksList', 'setActivePhonebook', 'setSelectedPhonebook']),
    fetchTags() {
      this.loading = true

      this.$payamakAxios.get('phoneTag')
        .then(({data}) => {
          this.tagList = data.data
          this.setPhonebooksList(data.data)

          if (!isNaN(this.selectedPhonebook) && this.selectedPhonebook != null) {
            const activeIndex = data.data.findIndex(item => item.id === this.selectedPhonebook)
            this.selectedTag = activeIndex
            this.setActivePhonebook(activeIndex)
          } else
            this.setActivePhonebook(this.selectedTag)

          this.$nextTick(() => {
            this.fetchContacts(this.tableProps)
          });
        })
        .catch(({response}) => console.log('failed in get phone tags: ', response))
        .finally(() => this.loading = false)
    },
    fetchContacts(params = this.tableProps) {
      this.loadPhones = true
      this.selectedRows = []

      this.$payamakAxios.get('contact', {params})
        .then(({data}) => this.data = data.data)
        .catch(({response}) => console.log('error in contacts: ', response))
        .finally(() => this.loadPhones = false)
    },
    reloadTable(props) {
      debounce(() => this.fetchContacts(props), 1000);
    },
    // selectRow(data) {
    //   this.setSelectedPhonebook(this.tagList[this.selectedTag].id)
    //   this.goto(`phonebook/edit/${data.phone}?change=${data.name}`)
    // },
    selectItem(index) {
      this.selectedTag = index;
      this.data = {}
      this.setActivePhonebook(index)

      this.$nextTick(() => {
        this.fetchContacts({
          ...this.tableProps,
          phone_tag_ids: this.tagList[index].id >= 0 ? [this.tagList[index].id] : [this.tagList[0].id]
        })
      })
    },
    next(index) {
      let sel = index + 1 === this.tagList.length ? 0 : index + 1

      this.selectItem(sel)
    },
    prev(index) {
      let sel = index - 1 < 0 ? this.tagList.length - 1 : index - 1

      this.selectItem(sel)
    },
    importFromBulk(e) {
      this.loading = true

      this.$payamakAxios.post('contact/store', {
        groupInsert: true,
        phone: e.join(','),
        phone_tags: [this.tagList[this.selectedTag].id]
      })
        .then(({data}) => {
          this.$toast.success(data.message ?? 'با موفقیت اضافه شد');
          this.fetchContacts()
          this.$refs.numberView.removeBulks()
        })
        .catch(({response}) => {
          this.$toast.error(response.message ?? 'خطا در افزودن شماره')
          console.log('failed to add bulk numbers: ', response)
        })
        .finally(() => this.loading = false)
    }
  },

  beforeDestroy() {
    this.setSelectedPhonebook(null)
  }
}
</script>

<style scoped>
.phone-list-bg {
  background: linear-gradient(59deg, rgb(255 68 0), rgb(255 129 0), rgb(255 194 56))
}

.phone-list-bg >>> h2 {
  font-size: 2.3rem;
}

@media screen and (min-width: 640px) {
  .phone-list-bg >>> h2 {
    font-size: 5rem;
  }
}

.tag-items >>> .v-btn {
  letter-spacing: normal !important;
}
</style>