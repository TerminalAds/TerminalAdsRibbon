<template>
  <v-app-bar
    app
    class="app-header"
    color="transparent"
    extension-height="56"
    fixed
    flat
    height="80"
  >
    <div
      id="kt_header"
      ref="kt_header"
      class="header d-flex justify-content-between"
      v-bind:class="headerClasses"
    >
      <div class="d-none d-md-block">
        <KTAside v-if="asideEnabled" />
      </div>

      <div
        class="d-flex align-items-center justify-content-between"
        v-bind:class="{ 'container-fluid': widthFluid, container: !widthFluid }"
      >
        <KTDropdownLanguage />

        <v-btn
          v-if="asideEnabled"
          id="kt_aside_mobile_toggle"
          dark
          min-width="32"
          text
          @click="toggleNavigation()"
        >
          <v-icon>mdi-menu</v-icon>
          {{ i18n.t("dashboard") }}
        </v-btn>

        <div class="d-flex align-items-stretch mr-3">
          <div class="header-logo">
            <router-link to="/">
              <img
                :src="DConfigs.header_logo"
                alt="Logo"
                class="logo-default max-h-40px"
              />
              <img
                :src="DConfigs.header_logo"
                alt="Logo"
                class="logo-sticky max-h-40px"
              />
            </router-link>
          </div>

          <div
            ref="kt_header_menu_wrapper"
            class="header-menu-wrapper header-menu-wrapper-left"
          >
            <div
              v-if="headerMenuEnabled"
              id="kt_header_menu"
              ref="kt_header_menu"
              class="header-menu header-menu-mobile"
              v-bind:class="headerMenuClasses"
            >
              <KTMenu />
            </div>
          </div>
        </div>

        <KTTopbar />
      </div>
      <div class="hiddenIn990 d-flex align-items-center ml-5">
        <KTExitButton />
      </div>
    </div>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";
import KTTopbar from "../../layout/header/Topbar.vue";
import KTLayoutHeader from "../../assets/js/layout/header.js";
import KTLayoutHeaderMenu from "../../assets/js/layout/header-menu.js";
import KTMenu from "../../layout/header/Menu.vue";
import KTAside from "../../layout/aside/Aside.vue";
import KTExitButton from "../../layout/header/ExitButton.vue";
import i18n from "../../plugins/EasyModal/i18n";
import KTDropdownLanguage from "../../layout/extras/dropdown/DropdownLanguage.vue";

export default {
  name: "KTHeader",
  components: {
    KTTopbar,
    KTMenu,
    KTAside,
    KTExitButton,
    KTDropdownLanguage,
  },
  data() {
    return { i18n };
  },
  mounted() {
    // Init Desktop & Mobile Headers
    KTLayoutHeader.init("kt_header", "kt_header_mobile");

    // Init Header Menu
    KTLayoutHeaderMenu.init(
      this.$refs["kt_header_menu"],
      this.$refs["kt_header_menu_wrapper"]
    );

    const headerRef = this.$refs["kt_header"];

    headerRef.querySelectorAll("a[class='menu-link']").forEach((item) => {
      item.addEventListener("click", () => {
        KTLayoutHeaderMenu.getOffcanvas().hide();
      });
    });
  },

  computed: {
    ...mapGetters(["layoutConfig", "getClasses"]),
    asideEnabled() {
      return !!this.layoutConfig("aside.self.display");
    },
    /**
     * Check if the header menu is enabled
     * @returns {boolean}
     */
    headerMenuEnabled() {
      return !!this.layoutConfig("header.menu.self.display");
    },

    /**
     * Get extra classes for header based on the options
     * @returns {null|*}
     */
    headerClasses() {
      const classes = this.getClasses("header");
      if (typeof classes !== "undefined") {
        return classes.join(" ");
      }
      return null;
    },

    /**
     * Get extra classes for header menu based on the options
     * @returns {null|*}
     */
    headerMenuClasses() {
      const classes = this.getClasses("header_menu");
      if (typeof classes !== "undefined") {
        return classes.join(" ");
      }
      return null;
    },

    /**
     * Check if header container is fluid
     */
    widthFluid() {
      return this.layoutConfig("header.self.width") === "fluid";
    },
  },

  methods: {
    toggleSecondMenu: function () {
      const a = document.getElementById("kt_content");
      const b = document.getElementById("kt_aside");
      if (
        a.classList.contains("flex-column") &&
        b.classList.contains("d-md-none")
      ) {
        b.classList.remove("d-md-none");
        a.classList.remove("flex-column");
      } else if (b.classList.contains("d-block")) {
        b.classList.add("d-md-none");
        a.classList.add("flex-column");
      }
    },
  },
};
</script>

<style>
.app-header {
  max-width: 100vw;
  overflow: hidden;
}

.app-header .v-toolbar__content {
  padding: 0;
}

@media only screen and (max-width: 990px) {
  .hiddenIn990 {
    display: none !important;
  }
}

.header {
  background-image: url("/media/bg/bg-10.jpg");
  background-position: top;
  background-size: cover;
  width: 100%;
}
</style>
