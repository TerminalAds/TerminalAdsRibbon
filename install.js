import DashboardAxios from "axios";
import Vuex, {mapActions} from "vuex";
import store from "./store";
import money from './Mony.json';

export default {
    install(Vue, options) {
        Vue.use(Vuex);

        options.store.registerModule("ribbon", store);

        Vue.prototype.$instanceAxios = options.axios
        Vue.prototype.$DashboardAxios = DashboardAxios.create({
            baseURL: options.core_url,
            timeout: 15000,
            headers: {
                common: options.headers
            },
        });

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
                checkWalletAsync(data) {
                    let walletInfo = money.data[data.currency.toLowerCase()]
                    let user_wallet = {
                        'icon': walletInfo.icon,
                        'color': walletInfo.color,
                        'balance': data.balance
                    }
                    console.log(user_wallet)
                    this.setWallet(user_wallet)
                    console.log(user_wallet)
                    localStorage.setItem('user_wallet', JSON.stringify(user_wallet));
                },
            }
        });

        window.ribbonCan = (permission) => {
            if (!permission)
                return true;

            const abilities = options.permissions();

            return abilities.indexOf(permission + ':active') >= 0 || abilities.indexOf(permission + ':show') >= 0;
        };
    }
};