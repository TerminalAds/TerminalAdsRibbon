<template>
  <div :style="{backgroundImage: `url('media/bg/bg-10.jpg')`}"
       class="bgi-no-repeat bgi-no-repeat bgi-size-cover rounded-lg fill-height"
       style="min-height: 180px; background-position: center">

    <div class="card-body d-flex flex-column">
      <span class="text-white font-weight-bolder font-size-h6">{{ i18n.t('package.title') }}</span>

      <span v-if="pack && pack.title && pack.expire" class="text-white font-weight-bolder mt-3"
            style="font-size: 8pt" v-text="packTitle"/>
      <span v-else class="text-white font-weight-bolder mt-3"
            style="font-size: 8pt">{{ i18n.t('package.no') }}</span>

      <div class="mt-12">
        <b-progress v-b-tooltip.hover="progressTitle" :animated="true" :max="pack.expire" :striped="true"
                    :value="expire === '∞' ? this.pack.expire : expire" :variant="packVariant" height="18px"
                    show-value/>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import i18n from "../../plugins/EasyModal/i18n";

export default {
  name: "userPack",
  data(){
    return{i18n}
  },
  computed: {
    ...mapGetters("ribbon", ["core"]),
    pack() {
      return this.core?.pack?.length > 0 && this.core?.pack[0]
    },
    diff() {
      let expireDate = this.pack.expired_at;

      let moment = require('moment-jalaali');
      let now = moment().format('YYYY-MM-DD HH:mm:ss')
      let diff = moment(expireDate).diff(now, 'days')
      return diff >= 0 ? diff : 0
    },
    expire() {
      let expire_date = this.pack.expired_at

      if (!expire_date) {
        return "∞"
      }
      return this.diff
    },
    packTitle() {
      return this.pack?.title && this.pack.title?.length > 0
          ? this.pack.title + ' ' + this.pack.expire + i18n.t('package.day')
          : ''
    },
    progressTitle() {
      if (this.expire === '∞') {
        return i18n.t('package.no_limit')
      } else {
        let moment = require('moment-jalaali');
        let ex = moment().to(this.pack.expired_at)
        return ex.indexOf('پیش') >= 0 ? i18n.t('package.expired') + ex : i18n.t('package.expiration') + ex + i18n.t('package.other')
      }
    },
    packVariant() {
      if (this.expire === '∞')
        return 'primary'
      else {
        return (this.pack.expire * 20 / 100) < this.diff ? 'primary' : 'danger'
      }
    }
  }
}
</script>

<style scoped>

</style>