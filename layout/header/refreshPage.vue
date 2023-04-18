<script>
export default {
  name: "refreshPage",

  data: () => ({
    loading: false,
  }),

  mounted() {
    this.$modal.error('خطا در بارگزاری!', 'بارگزاری اطلاعات با خطا مواجه شد! لطفا دوباره تلاش نمایید', undefined,
        {
          text: 'تلاش مجدد',
          icon: 'reload',
          class: 'success w-100',
          onClick: this.reloadPage
        }, [
          {
            text: this.$t("BUTTONS.Close"),
            onClick: this.closeDialog
          }
        ])
  },

  methods: {
    reloadPage() {
      this.loading = true;
      localStorage.setItem('reloaded', JSON.stringify(true));
      window.location.reload()
    },
    closeDialog() {
      this.$root.$emit('closeModal')
    }
  }
}
</script>

<style scoped>

</style>