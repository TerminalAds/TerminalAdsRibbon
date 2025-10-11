<script>
import i18n from "../../plugins/EasyModal/i18n";

export default {
  name: "refreshPage",

  data: () => ({
    loading: false,
  }),

  mounted() {
    this.$modal.error(
      i18n.t("loading_error.title"),
      i18n.t("loading_error.message"),
      undefined,
      {
        text: i18n.t("text"),
        icon: "reload",
        class: "success w-100",
        onClick: this.reloadPage,
      },
      [
        {
          text: i18n.t("BUTTONS.Close"),
          onClick: this.closeDialog,
        },
      ]
    );
  },

  methods: {
    reloadPage() {
      this.loading = true;
      localStorage.setItem("reloaded", JSON.stringify(true));
      window.location.reload();
    },
    closeDialog() {
      this.$root.$emit("closeModal");
    },
  },
};
</script>

<style scoped></style>
