<template>
  <div id="kt_footer" class="footer bg-white py-4 d-flex flex-lg-column">
    <div class="d-flex flex-column flex-md-row align-center justify-center"
         v-bind:class="{ 'container-fluid': widthFluid, container: !widthFluid }">
      <div class="text-dark order-2 order-md-1 text-center">
        <span class="text-muted font-weight-bold mr-2">۱۴۰۱©</span>
        کلیه حقوق مادی و معنوی این سامانه محفوظ و متعلق به شرکت تبلیغاتی
        <a class="text-hover-primary" href="https://karafarinanebartar.com" target="_blank">
          کارآفرینان برتر
        </a>
        سپهر آراد می باشد ، هرگونه کپی برداری پیگرد قانونی دارد.
      </div>
      <!--end::Copyright-->
      <!--begin::Nav-->
      <!--      <div class="nav nav-dark order-1 order-md-2">-->
      <!--        <a-->
      <!--          href="https://payamakland.com/%d8%af%d8%b1%d8%a8%d8%a7%d8%b1%d9%87-%d9%85%d8%a7/"-->
      <!--          target="_blank"-->
      <!--          class="nav-link pr-3 pl-0"-->
      <!--          >درباره ما</a-->
      <!--        >-->
      <!--        <a-->
      <!--          href="https://payamakland.com/contact-us/"-->
      <!--          target="_blank"-->
      <!--          class="nav-link px-3"-->
      <!--          >تماس باما</a-->
      <!--        >-->
      <!--        <a-->
      <!--          href="https://payamakland.com/%d9%81%d8%b1%d9%85-%d8%a7%d8%b3%d8%aa%d8%ae%d8%af%d8%a7%d9%85/"-->
      <!--          target="_blank"-->
      <!--          class="nav-link pl-3 pr-0"-->
      <!--          >کارباما</a-->
      <!--        >-->
      <!--      </div>-->
      <!--end::Nav-->
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "KTFooter",

  computed: {
    ...mapGetters(["layoutConfig"]),
    widthFluid() {
      return this.layoutConfig("footer.width") === "fluid";
    }
  }
};
</script>
