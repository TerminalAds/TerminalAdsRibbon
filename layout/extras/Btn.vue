<template>
    <div>
        <div >
<!--          v-if="$can(meta.permission_prefix + 'edit')"-->
            <button
                    class="btn btn-edit btn-sm m-1" @click="action(data, 'edit')"><span class="fa fa-pencil-alt"></span></button>

<!--          v-if="$can(meta.permission_prefix + 'delete')"-->
          <button
              class="btn btn-show m-1 btn-sm"@click="action(data, 'show')"><span class="fa fa-eye"></span></button>
            <button
                    class="btn btn-delete m-1 btn-sm"@click="action(data, 'delete')"><span class="fa fa-trash"></span></button>
          <button
                    class="btn btn-download m-1 btn-sm"@click="action(data, 'download')"><span class="fa fa-download"></span></button>


        </div>
    </div>
</template>

<script>
export default {
  mounted() {
  },

  props: {
        data:{},

        action:{
            type:Function
        },meta:{
            type:Object
        }
    },



}
</script>
