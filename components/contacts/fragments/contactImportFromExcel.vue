<template>
  <v-card class="pa-4 mx-auto" flat>
    <v-card-title class="pa-0 flex-wrap">
      <v-row no-gutters>
        <v-col cols="12">
          <v-alert border="left" color="success" colored-border elevation="2">
            <a class="text-break" download="phonebookExcel.xlsx" href="/assets/xlsx/contacts_save.xlsx">
              <v-icon color="success" right>mdi-download</v-icon>
              دانلود و استفاده از فایل نمونه اکسل
            </a>
          </v-alert>
        </v-col>

        <v-col class="mt-4" cols="12">
          <!--          :disabled="!selectedRow || !selectedRow.id"-->
          <v-card id="uploader" ref="uploader"
                  class="mx-auto d-flex justify-center align-center rounded-xl flex-column overflow-hidden" height="200"
                  outlined @click="dragEvent" @dragleave="dragEvent" @dragover="dragEvent" @drop="dragEvent">
            <v-icon size="68" style="opacity: .4">mdi-cloud-upload-outline</v-icon>
            <v-card-title class="justify-center">آپلود فایل</v-card-title>
            <v-card-text class="text-center pt-0 text-break">
              برای آپلود بکشید و رها کنید یا
              <v-btn class="mx-1" color="primary" min-width="75" small>
                اینجا
              </v-btn>
              کلیک کنید
            </v-card-text>
          </v-card>
        </v-col>

        <v-col class="mt-3" cols="12">
          <v-card v-show="!!filesPreview && !!filesPreview.length" :loading="upLoading" class="mx-auto pa-2 rounded-lg"
                  flat outlined>
            <div v-for="(item, i) in filesPreview" :key="i" class="pa-1 text-center">
              <v-list-item>
                <v-list-item-avatar :color="item.color || 'success'" class="white--text" size="64">
                  <v-icon>mdi-{{ !!item.color ? !!item.status ? 'check' : 'close' : 'check' }}</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-text="item.name"/>
                </v-list-item-content>

                <v-list-item-action>
                  <div v-if="!upLoading && (!item.status || !item.color)" class="text-left fill-height">
                    <v-btn icon @click="removeFileFromUpload">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </v-list-item-action>
              </v-list-item>
            </div>
          </v-card>
        </v-col>

        <v-col class="pa-2 d-none" cols="12" md="6">
          <v-file-input ref="fileInput" v-model="excelFile" :error-messages="errors.input"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        clear-icon="mdi-close-circle-outline" clearable dense label="بارگذاری فایل اکسل"
                        outlined prepend-icon="" variant="underlined" @change="handleFileUpload"/>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-actions class="justify-end">
      <v-btn :disabled="!excelFile" :loading="upLoading" class="btn-accept ma-0" depressed @click="sendFile">
        ارسال
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "contactImportFromExcel",

  props: {
    tags: [Number, String]
  },

  data: () => ({
    errors: {},
    excelFile: undefined,
    filesPreview: [],
    upLoading: false,
  }),

  methods: {
    dragEvent(e) {
      e.stopPropagation();
      e.preventDefault()
      let uploader = this.$refs.uploader

      if (e.type === 'dragover' && !uploader.$el.classList.contains('drag-over'))
        uploader.$el.classList.add('drag-over')
      else if (e.type === 'dragleave' && uploader.$el.classList.contains('drag-over'))
        uploader.$el.classList.remove('drag-over')
      else if (e.type === 'drop') {
        uploader.$el.classList.remove('drag-over');
        const files = e.target.files || e.dataTransfer.files

        this.excelFile = files[0]
        this.handleFileUpload(files[0])
      } else if (e.type === 'click') {
        this.$refs.fileInput.$refs.input.click()
      }
    },
    handleFileUpload(event) {
      this.filesPreview[0] = {
        name: event.name
      }
      this.$forceUpdate()
    },
    sendFile() {
      let data = new FormData();

      data.append('excelFile', this.excelFile);
      data.append('phone_tags', [this.tags]);

      this.upLoading = true

      this.$payamakAxios.post('contact/store', data)
        .then(({data}) => {
          this.$toast.success(data?.message || 'با موفقیت اضافه شد');
          this.$emit('fetch')
        })
        .catch(({response}) => console.log('failed to add bulk numbers: ', response))
        .finally(() => this.upLoading = false)
    },
    removeFileFromUpload() {
      this.filesPreview = []
      this.excelFile = null
    },
  }
}
</script>

<style scoped>

</style>