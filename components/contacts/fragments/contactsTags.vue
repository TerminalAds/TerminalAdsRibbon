<template>
  <div>
    <slot>
      <v-btn v-if="!picker && !!tagList && !!tagList.length" class="mx-1 rounded-lg white--text" color="#FF4400"
             depressed @click="computedValue = true">
        انتخاب گروه
      </v-btn>

      <v-btn v-else-if="picker && !!tagList && !!tagList.length" class="mx-1" color="success" icon outlined
             @click="computedValue = true">
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-btn v-else class="mx-1 text-none" color="#FF4400" outlined @click="dialog = true">
        <v-icon left>mdi-plus</v-icon>
        ایجاد گروه
      </v-btn>
    </slot>

    <custom-popup v-model="computedValue" :cons="cons" :loading="loading" max-width="640">
      <v-card :loading="loading" flat>
        <v-card-title>
          <v-text-field v-model="search" append-icon="mdi-magnify" class="rounded-lg" clearable dense hide-details
                        label="جستجو" outlined/>
        </v-card-title>

        <v-card-title v-if="!addNew" class="justify-end">
          <v-btn class="rounded-lg btn-accept ma-0" depressed min-width="110"
                 @click="dialog = true">
            <v-icon left>mdi-plus</v-icon>
            افزودن گروه
          </v-btn>
        </v-card-title>

        <transition-group name="slide-y-transition">
          <div v-for="(tag, i) in computedList" :key="tag.id">
            <v-hover v-if="!!tagList" v-slot="{hover}">
              <v-list-item :class="{'blue lighten-5': !!picker && tagList.map(t => t.id).includes(tag.id)}"
                           :link="!!picker" @click="handleSelection(tag)">
                <v-list-item-icon class="align-self-center">
                  <v-icon>mdi-{{ isInShareListPhonebook(tag) ? 'share-all' : 'tag' }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ tag.name }}</v-list-item-title>
                <template v-if="hover && !picker">
                  <v-list-item-action v-if="hasPhonebookPermission('edit', tag)" class="mx-1">
                    <v-btn icon small @click.stop="editingTag(tag)">
                      <v-icon small>mdi-pencil-outline</v-icon>
                    </v-btn>
                  </v-list-item-action>

                  <v-list-item-action class="mx-1 justify-center">
                    <v-btn v-if="hasPhonebookPermission('delete', tag)" icon small @click.stop="deleteTag(tag.id)">
                      <v-icon small>mdi-trash-can-outline</v-icon>
                    </v-btn>

                    <v-icon v-else small>mdi-share-all-outline</v-icon>
                  </v-list-item-action>
                </template>

                <v-card-actions v-else-if="!!picker">
                  <v-simple-checkbox :value="tagInList(tag.id)" color="blue lighten-2" @click="handleSelection(tag)"/>
                </v-card-actions>
              </v-list-item>
            </v-hover>
          </div>
        </transition-group>
      </v-card>
    </custom-popup>

    <custom-popup v-model="dialog" :cons="{title: 'ایجاد گروه جدید'}" hide-confirm max-width="640"
                  reloadable @close="closeDialog" @reload="reloadMakeDialog">
      <div class="pa-2">
        <custom-tabs v-model="tabs" :tab-items="[{text: 'افزودن گروه با نام دلخواه'}, {text: 'انتخاب گروه پیشفرض'}]"
                     grow>
          <template v-slot:staticItems>
            <v-tab-item class="pa-2">
              <v-card flat>
                <v-card-title>
                  نام مورد نظر خود را وارد نمایید
                </v-card-title>

                <v-card-text>
                  <v-text-field v-model="tagName" autofocus clear-icon="mdi-close-circle-outline" clearable dense
                                hide-details label="نام گروه" outlined @keydown.enter="addTag"/>
                </v-card-text>

                <v-card-actions class="justify-end">
                  <v-btn class="rounded-lg white--text" color="red" depressed @click="closeDialog">
                    انصراف
                  </v-btn>
                  <v-btn :loading="loading" class="rounded-lg" color="green" dark depressed @click="addTag">
                    <span v-if="canEdit">ویرایش</span>
                    <span v-else>ذخیره</span>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-tab-item>

            <!-- default groups made by admins -->
            <v-tab-item class="pa-2">
              <div v-if="loading" class="text-center pa-4 d-flex flex-column align-center">
                <v-progress-circular class="mb-2" color="warning" indeterminate size="35" width="5"/>
                <span>درحال بارگیری دسته‌بندی‌ها...</span>
              </div>

              <template v-else>
                <template v-for="(item, i) in defaultGroups">
                  <v-list-item :key="i" @click="selectDefault(item)">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"/>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-simple-checkbox
                        :color="!initIndeterminate(item) ? 'primary' : ''"
                        :indeterminate="initIndeterminate(item)"
                        :value="!!tempMakeDefault && !!tempMakeDefault[item.id]"
                        @click="selectDefault(item)"/>
                    </v-list-item-action>
                  </v-list-item>

                  <template v-if="item.children && !!item.children.length">
                    <div class="mb-2 ps-4 d-flex align-start">
                      <v-icon class="me-4">mdi-arrow-left-bottom</v-icon>
                      <div class="w-100">
                        <v-card v-for="(child, j) in item.children" :key="j"
                                class="pa-4 rounded-lg d-flex align-center flex mb-2" outlined
                                @click="selectDefault(child)">
                          {{ child.name }}
                          <v-spacer/>
                          <v-simple-checkbox
                            :value="!!tempMakeDefault[item.id] && tempMakeDefault[item.id].includes(child.id)"/>
                        </v-card>
                      </div>
                    </div>
                  </template>
                </template>

                <v-card-actions class="justify-end">
                  <v-btn :disabled="!tempMakeDefault" :loading="loading"
                         class="rounded-lg white--text" color="green" depressed @click="makeByDefault()">
                    <v-icon left>mdi-content-save-plus</v-icon>
                    <span>ساخت گروه</span>
                  </v-btn>
                </v-card-actions>
              </template>
            </v-tab-item>
          </template>
        </custom-tabs>
      </div>
    </custom-popup>

    <custom-popup v-model="getGroupNamesDialog" :cons="nameCons" max-width="400">
      <v-card class="pa-4" flat>
        <v-card-title>انتخاب گروه و زیرگروه</v-card-title>

        <v-radio-group v-model="groupRadio" dense hide-details>
          <v-radio label="گروه به همراه زیر گروه ها اضافه شود" value="children"/>
          <v-radio label="گروه انتخاب شده فقط اضافه شود" value="group"/>
        </v-radio-group>
      </v-card>
    </custom-popup>
  </div>
</template>

<script>
import CustomPopup from "../../../plugins/popup/customPopup.vue";
import CustomTabs from "../../../plugins/customTabs/index.vue";

export default {
  name: "contactsTags",

  components: {CustomPopup, CustomTabs},

  props: {
    value: Boolean,
    picker: Boolean,
    tagList: [Array, null],
    immediate: Boolean,
    isBtn: Boolean,
    addNew: Boolean,
  },

  data() {
    return {
      cons: {
        title: 'انتخاب گروه',
        buttons: [
          {type: 'submit', handler: this.submitTags},
          {type: 'close', handler: () => this.search = ''},
        ]
      },
      tabs: 1,
      menu: false,
      dialog: false,
      editedTag: {},
      loading: false,
      list: [],
      tagName: '',
      tempTags: [],
      defaultGroups: [],
      tempMakeDefault: {},
      search: '',
      groupRadio: 'children',
      getGroupNamesDialog: false,
      nameCons: {
        title: 'ساخت گروه پیشفرض',
        buttons: [
          {type: 'submit', handler: this.initGroups}
        ]
      }
    }
  },

  created() {
    this.fetchTags()
  },

  computed: {
    computedValue: {
      get() {
        return this.value || this.menu
      },
      set(val) {
        this.menu = val
        this.$emit('input', val)
      }
    },
    canEdit() {
      return !!this.editedTag && !!Object.keys(this.editedTag)?.length
    },
    computedList() {
      return this.list.filter(item => !this.search || item.name.indexOf(this.search) >= 0)
    }
  },

  watch: {
    tagList: {
      deep: true,
      handler(val) {
        this.tempTags = Array.from(new Set([...this.tempTags, ...val]))
      }
    },
    dialog(val) {
      (!!val && !this.defaultGroups.length) && this.getDefaultGroups()
    }
  },

  methods: {
    fetchTags(callReload = false) {
      this.loading = true

      this.$payamakAxios.get('phoneTag')
        .then(({data}) => {
          this.list = data.data
          this.$emit('update:tagList', data.data)

          try {
            if (this.picker) {
              let arr = this.tagList?.map(t => t.id) || []
              this.tempTags = data.data.filter(item => arr.includes(item.id))
            }

            if (callReload)
              this.$emit('reload')
          } catch (e) {
            console.log(e)
          }
        })
        .catch(({response}) => console.log('failed in get phone tags: ', response))
        .finally(() => this.loading = false)
    },
    addTag() {
      let tags = this.list.map(item => item.name.trim());
      if (tags.includes(this.tagName.trim())) return this.$toast.error('نام تکراری میباشد');

      if (this.canEdit) {
        this.updateTag();
        return;
      }
      this.loading = true

      this.$payamakAxios.post('phoneTag/store', {
        name: this.tagName
      })
        .then(({data}) => {
          this.$toast.success('برچسب با موفقیت اضافه شد.');
          this.fetchTags(true)
          this.$emit('reload')
          this.closeDialog()
        })
        .catch(({response}) => console.log('failed in store tag: ', response))
        .finally(() => this.loading = false)
    },
    async deleteTag(id) {
      if (await this.$modal.yesNo('تایید حذف گروه؟')) {
        this.loading = true

        this.$payamakAxios.post('contact/deleteTag', {
          phoneTag: id
        })
          .then(({data}) => {
            this.$toast.success('برچسب با موفقیت حذف شد');
            this.fetchTags(true)
            this.closeDialog()
          })
          .catch(({response}) => console.log('failed to delete tag: ', response))
          .finally(() => this.loading = false)
      }
    },
    editingTag(tag) {
      this.editedTag = tag
      this.tagName = tag.name
      this.dialog = true
    },
    updateTag() {
      this.loading = true

      this.$payamakAxios.post(`phoneTag/update/${this.editedTag.id}`, {
        name: this.tagName
      })
        .then(({data}) => {
          this.$toast.success('برچسب با موفقیت ویرایش شد');
          this.fetchTags(true)
          this.closeDialog()
        })
        .catch(({response}) => console.log('failed to delete tag: ', response))
        .finally(() => this.loading = false)
    },
    closeDialog() {
      this.tagName = ''
      this.dialog = false
      this.editedTag = {}
    },
    tagInList(id) {
      return !!this.tempTags.find(item => item.id === id)
    },
    handleSelection(tag) {
      if (!this.picker) return

      let arr = this.tempTags

      if (!!arr.find(item => item.id === tag.id)) {
        let index = arr.findIndex(item => item.id === tag.id);
        arr.splice(index, 1);
      } else {
        arr.push(tag);
      }

      this.tempTags = arr
    },
    submitTags() {
      let arr = [...this.tempTags]

      if (this.immediate) {
        this.$emit('submitTag', arr);
        this.$root.$emit('submitTag', arr)
      }
    },
    getDefaultGroups() {
      this.loading = true

      this.$payamakAxios.get('phoneTag/groups/get')
        .then(({data}) => this.defaultGroups = data.data)
        .finally(() => this.loading = false)
    },
    selectDefault(item) {
      let obj = this.tempMakeDefault

      if (!!item.parent_id) {
        let index = obj[item.parent_id]?.findIndex(p => p === item.id)

        if (index >= 0)
          obj[item.parent_id].splice(index, 1)
        else
          obj[item.parent_id] = !!obj[item.parent_id] ? [...obj[item.parent_id], item.id] : [item.id]

        !obj[item.parent_id]?.length && (delete obj[item.parent_id])
      } else {
        let parent = this.defaultGroups.find(p => p.id === item.id);

        if (obj[item.id]?.length === parent?.children?.length)
          delete obj[item.id];
        else
          obj[item.id] = parent.children.map(c => c.id);
      }

      this.tempMakeDefault = {...obj}
    },
    initGroups() {
      let ids = []
      let keys = Object.keys(this.tempMakeDefault)

      if (this.groupRadio === 'children')
        ids = keys.map(item => this.tempMakeDefault[item])
      else
        ids = keys

      this.makeByDefault(true, ids.flat());
    },
    makeByDefault(rec = false, ids = []) {
      let values = Object.values(this.tempMakeDefault)

      if (!rec && values.some(item => !item.length) && values.some(item => !!item.length)) {
        this.getGroupNamesDialog = true
        return
      }

      let keys = Object.keys(this.tempMakeDefault)
      let arr = []
      if (keys.every(item => !!this.tempMakeDefault[item].length))
        arr = keys.map(item => this.tempMakeDefault[item])
      else
        arr = keys

      this.loading = true
      this.$payamakAxios.post('phoneTag/groups/make', {
        group_id: rec ? ids : arr.flat()
      })
        .then(({data}) => {
          this.$toast.success(data.message || 'گروه(های) انتخاب شده با موفقیت اضافه شدند.')
          this.tempMakeDefault = {}
          this.dialog = false
          this.$emit('reload')
          this.fetchTags()
        })
        .catch(({response}) => {
          this.$toast.error(response?.data?.message || 'خطا در افزودن گروه پیشفرض!')
        })
        .finally(() => this.loading = false);
    },
    reloadMakeDialog() {
      this.getDefaultGroups()
      this.tagName = ''
      this.tempMakeDefault = {}
    },
    initIndeterminate(item) {
      let group = this.defaultGroups.find(p => p.id === item.id)
      let parent = this.tempMakeDefault?.[item.id]

      return !!parent
        && parent?.length !== group.children?.length
    }
  }
}
</script>

<style scoped>

</style>