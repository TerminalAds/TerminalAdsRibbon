<template>
  <v-autocomplete :items="list" class="rounded-xl" clearable dark hide-details label="دنبال چه خدمتی هستید؟" outlined
                  placeholder="نام سرویس مورد نظر خودرا وارد کنید..." prepend-inner-icon="mdi-text-search">
    <template v-slot:append>
      <v-btn class="mt-n2 me-n1" color="rgba(255, 255, 255, .2)" depressed fab small>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </template>

    <template v-slot:item="{item, on, attrs}">
      <v-list-item v-bind="attrs" @click="itemClickHandler(item)" v-on="on">
        <v-list-item-content>
          <v-list-item-title>
            {{ item.text }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: "findMenuPage",

  data: () => ({
    list: [],
    services: [
      {id: 1, url: 'https://core.terminalads.com'},
      {id: 2, url: 'https://core-sms.terminalads.com'},
      {id: 3, url: 'https://core-qr.terminalads.com'},
      {id: 4, url: 'https://core-robot.terminalads.com'},
      {id: 5, url: 'https://core-billboard.terminalads.com'},
      {id: 10, url: 'https://core-info.terminalads.com'},
      {id: 11, url: 'https://core-file.terminalads.com'},
      {id: 13, url: 'https://core-digi.terminalads.com'},
      {id: 14, url: 'https://core-graphic.terminalads.com'},
    ]
  }),

  mounted() {
    this.getAllMenus()
  },

  methods: {
    getAllMenus() {
      const arr = this.services.map(item => item.id)

      this.$instanceAxios.get('https://api.terminalads.com/api/category/get-all-limited')
        .then(({data}) => {
          this.list = data
            .filter(item => arr.includes(item.service_id) && (!!/[A-Za-z]+/.test(item.slug) || !!item.parent))
            .map(item => ({
              value: item.id,
              text: item.name,
              sid: item.service_id,
              slug: item.slug
            }))
        })
    },
    itemClickHandler(menuItem) {
      console.log('menu item: ', menuItem)

      const token = localStorage.getItem('id_token')
      let link = this.services.find(item => item.id === menuItem.sid).url
      link += this.services.find(item => item.id === menuItem.sid).id === 1
        ? `#/${menuItem.slug}`
        : `/?token=${token}#/${menuItem.slug}`
      const a = document.createElement('a')
      a.setAttribute('href', link)
      a.setAttribute('target', '_blank')
      a.click()
    }
  }
}
</script>

<style scoped>

</style>