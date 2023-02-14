<template>
  <div data-app :test="isOpen">
    <a @click.prevent="dialog = true" href="#" v-if="showButton">
             <span class="svg-icon svg-icon-2x btn" title="کیف پول">
               <svg
                   xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                 <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"/><circle fill="#000000" opacity="0.3" cx="20.5" cy="12.5" r="1.5"/><rect
                     fill="#000000" opacity="0.3" transform="translate(12.000000, 6.500000) rotate(-15.000000) translate(-12.000000, -6.500000) " x="3" y="3" width="18" height="7" rx="1"/><path
                     d="M22,9.33681558 C21.5453723,9.12084552 21.0367986,9 20.5,9 C18.5670034,9 17,10.5670034 17,12.5 C17,14.4329966 18.5670034,16 20.5,16 C21.0367986,16 21.5453723,15.8791545 22,15.6631844 L22,18 C22,19.1045695 21.1045695,20 20,20 L4,20 C2.8954305,20 2,19.1045695 2,18 L2,6 C2,4.8954305 2.8954305,4 4,4 L20,4 C21.1045695,4 22,4.8954305 22,6 L22,9.33681558 Z"
                     fill="#000000"/>
                 </g>
               </svg>
           </span>
    </a>
    <v-dialog
        v-model="dialog"
        hide-overlay
        transition="dialog-top-transition"
        scrollable
        max-width="800px"
    >
      <v-card>
        <v-toolbar
            outlined
            tile
            flat
        >
          <div class="row d-flex align-items-center justify-content-between">
            <div class="mr-2">
              <v-toolbar-title>شارژ کیف پول</v-toolbar-title>

            </div>
            <div class=" left-0" style="">
              <v-btn
                  icon
                  @click="dialog = false"
              >

                <v-icon small color="red" class="text-danger">close</v-icon>
              </v-btn>
            </div>
          </div>
        </v-toolbar>

        <increase-transactions></increase-transactions>


        <!--        <div style="flex: 1 1 auto;"></div>-->
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import IncreaseTransactions from "./increaseTransactions";

export default {
  name: "wallet",
  props:{
    showButton : {
      type : Boolean,
      default : true,
    }
  },
  components: {IncreaseTransactions},
  data: () => ({
    dialog: false,
    dialog2: false,
    dialog3: false,
    notifications: false,
    sound: true,
    widgets: false,
    items: [
      {
        title: 'Click Me',
      },
      {
        title: 'Click Me',
      },
      {
        title: 'Click Me',
      },
      {
        title: 'Click Me 2',
      },
    ],
    select: [
      {text: 'State 1'},
      {text: 'State 2'},
      {text: 'State 3'},
      {text: 'State 4'},
      {text: 'State 5'},
      {text: 'State 6'},
      {text: 'State 7'},
    ],
  }),
  computed:{
    isOpen(){
      let open = this.$store.getters['wallet/isOpen']
      this.dialog = open;
      return open;
    }
  },
  watch:{
    dialog(){
      this.$store.dispatch('wallet/isOpen' , this.dialog)
    }
  }
}
</script>

<style scoped>

</style>
