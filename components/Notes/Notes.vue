<template>
  <div class="card rounded-card">
    <div class="">

      <div class="container">
        <div class="card-header border-0 row mb-0 justify-content-center">
          <h3 class="card-title font-weight-bolder text-dark col-xxl-6 mb-0 text-center">
            <i class="fa fa-sticky-note fa-1x mr-3 " style="color: #0BB7AF"></i>
            یادداشت ها
          </h3>
        </div>

        <div class="separator separator-dashed mb-4"></div>

        <!--begin::تایم لاین-->
        <div class="timeline timeline-3">
          <div class="timeline-items" style="max-height: 40rem; overflow-y: scroll">
            <div class="timeline-item mx-8 border-right-0 px-0" v-for="(note , index) in notes" :key="index">
              <div class="timeline-content">
                <div class="d-flex align-items-center justify-content-between mb-3">
                  <div class="mr-2">


                    <div class="d-flex flex-row w-100">

                      <v-text-field class="form-control form-control-lg form-control-solid p-0 d-inline-block" v-if="note.inEditMode" v-model="note.editTitle"> </v-text-field>
                      <v-text-field class="form-control form-control-lg form-control-solid p-0 d-inline-block" v-else v-model="note.title" readonly> </v-text-field>
                      <div class="pt-1">
                        <span style="font-size: 8pt; color: #a1a1a1">تاریخ ایجاد</span>
                        <span class="label label-light-success font-weight-bolder label-inline ml-2" style="white-space: nowrap">  {{note.createDate}}</span>
                      </div>
                      <!--                      <span v-if="note.inEditMode" class="label label-light-info font-weight-bolder label-inline ml-2" @click="submitChanges(index)" style="cursor: pointer;margin-top: 1.8rem;white-space: nowrap">ثبت</span>-->
                      <v-btn v-if="note.inEditMode" class="submit-btn" @click="submitChanges(index)" style="cursor: pointer;white-space: nowrap">ثبت</v-btn>
                      <!--                      <span v-if="note.inEditMode" class="label label-light-danger font-weight-bolder label-inline ml-2" @click="cancelEdit(index)" style="cursor: pointer;margin-top: 1.8rem;white-space: nowrap">انصراف</span>-->
                      <v-btn v-if="note.inEditMode" class="btn-cancel" @click="cancelEdit(index)" style="cursor: pointer;white-space: nowrap">انصراف</v-btn>
                    </div>
                  </div>
                  <div class="d-flex flex-row">
                    <ul class="navi navi-hover mx-2" v-if="!note.inEditMode">
                      <li class="navi-item mx-0 px-0">
                        <v-btn block class="btn-edit mx-0 px-1" @click="note.inEditMode = true">
                          <v-icon size="20" class="mx-1" >fa-pencil-alt</v-icon>
                          ویرایش
                        </v-btn>
                      </li>
                    </ul>


                    <ul class="navi navi-hover">
                      <li class="navi-item mx-0 px-0">
                        <v-btn block class="btn-delete mx-0 px-1" @click="removeNote(index)">
                          <v-icon size="20" class="mx-1 px-1" >fa-trash-alt</v-icon>
                          حذف
                        </v-btn>
                      </li>
                    </ul>
                  </div>
                  <!--                  <div class="dropdown ml-2" data-toggle="tooltip" title="" data-placement="left"-->
                  <!--                       data-original-title="اقدامات سریع">-->
                  <!--                    <button href="#" type="button" class="btn btn-hover-light-primary btn-sm btn-icon"-->
                  <!--                            data-toggle="dropdown"-->
                  <!--                            aria-haspopup="true" aria-expanded="false">-->
                  <!--                      <i class="ki ki-more-hor icon-md"></i>-->
                  <!--                    </button>-->
                  <!--                    <div class="dropdown-menu p-0 m-0 dropdown-menu-md dropdown-menu-right" style="">-->
                  <!--                      &lt;!&ndash;begin::Navigation&ndash;&gt;-->


                  <!--                      &lt;!&ndash;end::Navigation&ndash;&gt;-->
                  <!--                    </div>-->
                  <!--                  </div>-->
                </div>

                <textarea class="form-control form-control-lg form-control-solid" rows="3"
                          placeholder="نوشتن پیام" v-if="note.inEditMode" v-model="note.editText" ></textarea>

                <textarea class="form-control form-control-lg form-control-solid" rows="3"
                          placeholder="نوشتن پیام" v-else v-model="note.text" readonly ></textarea>
              </div>
            </div>
          </div>
        </div>
        <!--end::تایم لاین-->
        <div class="separator separator-dashed my-4"></div>

        <form class="form mt-4">
          <div class="form-group">
            <v-text-field class="form-control form-control-lg form-control-solid" v-model="addNoteTitle" placeholder="عنوان یادداشت"></v-text-field>
            <textarea class="form-control form-control-lg form-control-solid" rows="3"
                      placeholder="نوشتن پیام" v-model="addNoteText"></textarea>
          </div>
          <div class="row">
            <div class="col">
              <v-btn class="btn-add-with-text" :disabled="!addNoteText.trim() || (!addNoteTitle.trim())" @click="addNote">افزودن یادداشت</v-btn>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Notes",
  data() {
    return {
      notes:[],
      addNoteText : "",
      addNoteTitle : ""
    }
  },
  created() {
    this.notes = JSON.parse(localStorage.getItem('user_notes')) ?? []
  },
  methods:{
    submitChanges(index){
      this.notes[index].title = this.notes[index].editTitle;
      this.notes[index].text = this.notes[index].editText;
      this.notes[index].inEditMode = false;
    },
    cancelEdit(index){
      this.notes[index].editTitle = this.notes[index].title;
      this.notes[index].editText = this.notes[index].text;
      this.notes[index].inEditMode = false;
    },
    addNote(){
      this.notes.push({
        title : this.addNoteTitle.trim(),
        text : this.addNoteText.trim(),
        createDate : this.nowDateTimeString(),
        editText : this.addNoteTitle.trim(),
        editTitle : this.addNoteText.trim(),
        inEditMode: false,
      })
      this.addNoteText = ""
      this.addNoteTitle = ""
    },
    async removeNote(index){
      if (await this.$modal.yesNo('آیا از حذف مطمئن هستید؟')){
        this.notes.splice(index, 1)
      }
    }
  },

  watch:{
    notes:{
      handler(){
        localStorage.setItem('user_notes' , JSON.stringify(this.notes))
      },
      deep : true
    }
  }
}
</script>

<style scoped>
.left-align {
  text-align: left;
}
</style>


