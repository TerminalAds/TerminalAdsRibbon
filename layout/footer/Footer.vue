<template>
  <div id="kt_footer" class="footer bg-white py-4 d-flex flex-lg-column">
    <div class="d-flex flex-column flex-md-row align-center justify-center"
         v-bind:class="{ 'container-fluid': widthFluid, container: !widthFluid }">
      <div class="text-dark order-2 order-md-1 text-center">
        <span class="text-muted font-weight-bold mr-2">{{ i18n.t('year') }}©</span>
        {{i18n.t('text1')}}
        <a class="text-hover-primary" href="https://karafarinanebartar.com" target="_blank">
          {{i18n.t('text2')}}
        </a>
        {{i18n.t('text3')}}
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import i18n from "../../plugins/EasyModal/i18n";

export default {
  name: "KTFooter",
  data(){
    return {i18n}
  },
  computed: {
    ...mapGetters(["layoutConfig"]),
    widthFluid() {
      return this.layoutConfig("footer.width") === "fluid";
    }
  }
};
</script>
