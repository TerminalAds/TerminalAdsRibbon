import Vuex from "vuex";
import store from "./store";

export default {
    install(Vue, options) {
        Vue.use(Vuex);

        options.store.registerModule("ribbon", store);

        Vue.mixin({
            data() {
                return {
                    ribbon_header: options.headers,
                    core_url: options.core_url,
                    server_id:options.server_id
                }
            },
            methods: {
                setSubTitle(title) {
                    store.state.sub_title = title;
                },
                ribbon_can(permission) {
                    const abilities = options.permissions();

                    return abilities.indexOf(permission + ':active') >= 0 || abilities.indexOf(permission + ':show') >= 0;
                }
            }
        });

        Vue.component("terminal_title_ribbon", require("./Ribbon").default);
    }
};