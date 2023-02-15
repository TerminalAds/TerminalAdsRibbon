import DashboardAxios from "axios";
import Vuex from "vuex";
import store from "./store";

export default {
    install(Vue, options) {
        Vue.use(Vuex);

        options.store.registerModule("ribbon", store);

        Vue.prototype.$DashboardAxios = DashboardAxios.create({
            baseURL: options.core_url,
            timeout: 15000,
            headers: options.headers,
        });

        Vue.mixin({
            data: () => ({
                core_url: options.core_url,
                headers: options.headers,
                front_url: options.front_url,
                config: options.config(),
                sid: options.sid
            }),
            methods: {
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
                    return x ? new Intl.NumberFormat('en-US', {style: 'decimal'}).format(x) : "-";
                }
            }
        });
    }
};