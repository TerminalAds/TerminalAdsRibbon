<template>
  <!-- <custom-popup v-model="dialog" max-width="600" persistent :cons="cons"> -->
  <v-card>
    <v-card-title class="headline">آپلود فایل اکسل جوایز</v-card-title>

    <v-card-text>
      <qr-picker v-model="form.qr_id" />
      <v-alert border="left" color="success" colored-border elevation="2">
        <a download="payamakland.xlsx" href="/assets/xlsx/gameAward.xlsx">
          <v-icon color="success" right>mdi-download</v-icon>
          دانلود و استفاده از فایل نمونه اکسل
        </a>
      </v-alert>
      <div
        ref="uploader"
        class="uploader-zone mx-auto d-flex justify-center align-center rounded-xl flex-column overflow-hidden my-4"
        :class="{ 'drag-over': isDragging }"
        @click="triggerFileInput"
        @dragenter.prevent="isDragging = true"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <v-icon
          style="opacity: 0.4"
          size="68"
          :color="isDragging ? 'primary' : 'rgba(33, 150, 243, 0.3) '"
        >
          mdi-cloud-upload-outline
        </v-icon>

        <div class="text-center mt-3">
          <div class="text-h6 font-weight-medium">
            {{ form.file ? form.file.name : "آپلود فایل اکسل" }}
          </div>
          <div class="text-body-2 grey--text mt-1">
            فایل را اینجا بکشید و رها کنید یا
            <span class="primary--text text-decoration-underline"
              >کلیک کنید</span
            >
          </div>
        </div>
      </div>

      <v-card
        v-if="form.file"
        outlined
        class="pa-2 mt-3"
        :color="uploadError ? 'error lighten-4' : 'success lighten-5'"
      >
        <v-list-item dense>
          <v-list-item-avatar
            :color="uploadError ? 'error' : 'success'"
            class="white--text"
            size="64"
          >
            <v-icon dark>
              {{ uploadError ? "mdi-close" : "mdi-check" }}
            </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="text-subtitle-1">
              {{ form.file.name }}
            </v-list-item-title>
            <v-list-item-subtitle class="caption">
              {{ (form.file.size / 1024 / 1024).toFixed(2) }} MB
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn icon color="grey" @click="clearFile">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-card>

      <input
        ref="fileInput"
        type="file"
        accept=".xlsx,.xls"
        style="display: none"
        @change="handleFileSelect"
      />
    </v-card-text>
    <v-spacer />

    <v-card-actions class="d-flex space justify-content-space-between">
      <v-btn class="btn-delete" @click="closeDialog">
        <v-icon>mdi-close</v-icon> انصراف</v-btn
      >

      <v-btn
        :loading="uploading"
        class="btn-get-code rounded-lg"
        :disabled="!form.file || uploading || uploadError"
        @click="uploadExcel"
      >
        <v-icon>mdi-plus</v-icon>
        ثبت جوایز
      </v-btn>
    </v-card-actions>
  </v-card>
  <!-- </custom-popup> -->
</template>

<script>
import qrPicker from "./qrPicker.vue";
export default {
  components: { qrPicker },
  props: {
    value: Boolean,
  },

  data: () => ({
    cons: {
      title: "اکسل جوایز بازی",
      icon: "microsoft-excel",
    },
    dialog: false,
    uploading: false,
    isDragging: false,
    uploadError: false,
    form: {
      qr_id: null,
      file: null,
    },
  }),

  watch: {
    value(v) {
      this.dialog = v;
      if (!v) this.resetForm();
    },
    dialog(v) {
      this.$emit("input", v);
    },
  },

  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleFileSelect(e) {
      const file = e.target.files[0];
      this.validateAndSetFile(file);
    },

    handleDrop(e) {
      this.isDragging = false;
      const file = e.dataTransfer.files[0];
      this.validateAndSetFile(file);
    },

    validateAndSetFile(file) {
      if (!file) return;

      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        this.$toast.error("فقط فایل‌های .xlsx و .xls مجاز هستند");
        return;
      }

      if (file.size > maxSize) {
        this.$toast.error("حجم فایل بیشتر از 10 مگابایت است");
        return;
      }

      this.form.file = file;
      this.uploadError = false;
    },

    clearFile() {
      this.form.file = null;
      this.uploadError = false;
      this.$refs.fileInput.value = "";
    },

    resetForm() {
      this.form.file = null;
      this.form.qr_id = null;
      this.uploadError = false;
      this.isDragging = false;
    },

    closeDialog() {
      this.resetForm();
      this.dialog = false;
      this.$emit("imported");
    },

    async uploadExcel() {
      if (!this.form.file) return;

      this.uploading = true;
      this.uploadError = false;

      const fd = new FormData();
      fd.append("qr_id", this.form.qr_id || "");
      fd.append("file", this.form.file);

      try {
        const res = await this.requestApiPostPayamak("game/award/import", fd);

        this.$toast.success("فایل جوایز با موفقیت پردازش شد");
        // this.$emit("imported");
        this.closeDialog();
      } catch (err) {
        console.error(err);
        this.$toast.error(err.response?.data?.message || "خطا در پردازش فایل");
        this.uploadError = true;
      } finally {
        this.uploading = false;
        this.closeDialog();
      }
    },
  },
};
</script>

<style scoped>
.uploader-zone {
  height: 200px;
  width: 100%;
  border: 2px dashed #bdbdbd !important;
  background-color: #fafafa !important;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  position: relative;
}

.uploader-zone:hover {
  background-color: #f5f5f5;
  border-color: #58aaf7 !important;
}

.uploader-zone.drag-over {
  border: 2px dashed #1976d2 !important;
  transform: scale(1.02);
  background-color: rgba(33, 150, 243, 0.33) !important;
}

.uploader-zone * {
  pointer-events: none;
}

.success-border {
  border-color: #4caf50 !important;
}

.error-border {
  border-color: #ff5252 !important;
}
.space {
  justify-content: space-between !important;
}
</style>
