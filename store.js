export default {
    namespaced: true,

    state: {
        sub_title: "",
        menus: [],
        wallet: {balance: 0},
        pack: {},
        user: {},
        core: {}
    },

    getters: {
        sub_title: state => state.sub_title,
        menus: state => state.menus,
        wallet: state => state.wallet,
        pack: state => state.pack,
        user: state => state.user,
        core: state => state.core
    },

    actions: {
        setTitle(context, title) {
            context.commit('sub_title', title)
        },
        setMenus(context, obj) {
            context.commit('set_menus', obj)
        },
        setWallet(context, obj) {
            context.commit('set_wallet', obj)
        },
        setPack(context, obj) {
            context.commit('set_pack', obj)
        },
        setUser(context, obj) {
            context.commit('set_user', obj)
        },
        setCore(context, obj) {
            context.commit('set_core', obj)
        }
    },

    mutations: {
        set_menus(state, obj) {
            state.menus = obj
        },
        set_wallet(state, obj) {
            state.wallet = obj
        },
        set_pack(state, obj) {
            state.pack = obj
        },
        set_user(state, obj) {
            state.user = obj
        },
        set_core(state, obj) {
            state.core = obj
        }
    }
};
