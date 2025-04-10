import DashboardAxios from "axios";
import Vuex, {mapActions} from "vuex";
import ribbon from "./stores/ribbon";
import phonebook from "./stores/phonebook";
import money from './Mony.json';
import VueOffline from 'vue-offline'
import modal from './plugins/EasyModal/index'

let timer = null;

export default {
  install(Vue, options) {
    Vue.use(Vuex);
    Vue.use(VueOffline)
    Vue.use(modal)

    options.store.registerModule("ribbon", ribbon);
    options.store.registerModule("phonebook", phonebook);

    Vue.prototype.$instanceAxios = options.axios
    Vue.prototype.$DashboardAxios = DashboardAxios.create({
      baseURL: options.core_url,
      timeout: 15000,
      headers: {
        common: options.headers
      },
    });
    Vue.prototype.$payamakAxios = options.axios.create({
      baseURL: 'https://sms-api.terminalads.com/api/',
      timeout: 15000,
      headers: options.headers,
    })

    Vue.mixin({
      data: () => ({
        core_url: options.core_url,
        DHeaders: options.headers,
        front_url: options.front_url,
        DConfigs: options.config(),
        sid: options.sid
      }),
      methods: {
        ...mapActions("ribbon", ["setWallet"]),
        setSubTitle(title) {
          store.state.sub_title = title;
        },
        ribbon_can(permission) {
          const abilities = options.permissions();

          return abilities.indexOf(permission + ':active') >= 0 || abilities.indexOf(permission + ':show') >= 0;
        },
        persianNum(input) {
          try {
            if (input === undefined || input == null) return "";
            let str1 = input.toString().trim();
            if (str1 === '') return '';
            str1 = str1.replace(/0/img, '۰');
            str1 = str1.replace(/1/img, '۱');
            str1 = str1.replace(/2/img, '۲');
            str1 = str1.replace(/3/img, '۳');
            str1 = str1.replace(/4/img, '۴');
            str1 = str1.replace(/5/img, '۵');
            str1 = str1.replace(/6/img, '۶');
            str1 = str1.replace(/7/img, '۷');
            str1 = str1.replace(/8/img, '۸');
            str1 = str1.replace(/9/img, '۹');
            return str1;
          } catch (e) {
          }
        },
        currency(x) {
          try {
            return x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
          } catch (e) {
            return x;
          }

          // return x >= 0 ? new Intl.NumberFormat('en-US', {style: 'decimal'}).format(x) : "0";
        },
        setWalletData(data) {
          let walletInfo = money.data[data.currency.toLowerCase()]
          let user_wallet = {
            'icon': walletInfo.icon,
            'color': walletInfo.color,
            'balance': data.balance
          }
          this.setWallet(user_wallet)
          localStorage.setItem('user_wallet', JSON.stringify(user_wallet));
        },
        setCookie(cname, cvalue, exdays) {
          let d = new Date();
          d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
          let expires = "expires=" + d.toUTCString();
          document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        },
        getCookie(cname, def = "") {
          let name = cname + "=";
          let decodedCookie = decodeURIComponent(document.cookie);
          let ca = decodedCookie.split(';');
          for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
              c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
              return c.substring(name.length, c.length);
            }
          }
          return def;
        },
        setToken() {
          let url = window.location.href;
          const start = url.indexOf("?");
          const end = url.indexOf("#");
          url = url.substring(start, end);
          let token = url.split('=')[0];
          let dataToken = url.split('=')[1];
          if (dataToken) {
            saveToken(dataToken);
            console.log('token set: ', dataToken)
            // this.$store.commit('isAuthenticated', true);
            return document.URL.substr(end)
          }
          return false
        },
        debounce: (fn, delay) => debounce(fn, delay),
        hasPhonebookPermission(value, target = null) {
          let p

          if (!!target)
            p = this.isInShareListPhonebook(target) ? target.setting : true
          else
            p = options.store.getters['phonebook/phonebookPermissions']

          return typeof p === 'object' ? p[value] : true
        },
        isInShareListPhonebook(target) {
          return target.hasOwnProperty('parent_id')
        },
        datetime(input, type, utc = false) {
          if (!input) return '-';

          if (type === 'datetime') {
            return `${this.jalalian(input)} ${this.getTime(input)}`;
          } else {
            return `${this.jalalian(input)}`
          }
        },
        copyLink(str, isLink = true, message = null) {
          let link = str

          if (!link.startsWith('http') && isLink)
            link = 'https://' + link

          try {
            if (!!navigator.clipboard)
              navigator.clipboard.writeText(link);
            else {
              let textArea = document.createElement("textarea");
              textArea.value = link;

              // Avoid scrolling to bottom
              textArea.style.top = "0";
              textArea.style.left = "0";
              textArea.style.position = "fixed";

              document.body.appendChild(textArea);
              textArea.focus();
              textArea.select();

              try {
                let successful = document.execCommand('copy');
                let msg = successful ? 'successful' : 'unsuccessful';
                console.log('Fallback: Copying text command was ' + msg);
              } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
                this.$toast.error('خطا در رونوشت لینک.')
              }

              document.body.removeChild(textArea);
            }
          } catch (e) {
            this.$toast.error('خطا در رونوشت لینک.')
          }

          this.$toast.info(message || 'لینک کپی شد.')
        },
        goto(route, query = {}) {
          this.$router.push({path: "/" + route, query: query})
        },
        nowDateTimeString(sp = '-') {
          let moment = require('moment-jalaali')
          return moment().format(`YYYY${sp}MM${sp}DD HH:mm:ss`)
        }
      }
    });

    Array.prototype.removeDuplicateInArray = function (target) {
      const uniqueTags = new Map(this.map(item => [item[target], item]))
      return [...uniqueTags.values()]
    };

    window.ribbonCan = (permission) => {
      if (!permission)
        return true;

      const abilities = options.permissions();

      return abilities.indexOf(permission + ':active') >= 0
          || abilities.indexOf(permission + ':show') >= 0;
    };
  }
};

function debounce(fn, delay) {
  clearTimeout(timer);

  timer = setTimeout(fn, delay)
}

export {
  debounce
}