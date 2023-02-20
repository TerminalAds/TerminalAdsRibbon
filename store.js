export default {
    namespaced: true,

    state: {
        sub_title: "",
        menus: [],
        wallet: {balance: 0},
        core: {},
        walletDialog: false,
    },

    getters: {
        sub_title: state => state.sub_title,
        menus: state => state.menus,
        wallet: state => state.wallet,
        user: state => state.core?.user?.length > 0 && state.core.user[0] ? state.core.user[0] : null,
        core: state => state.core,
        walletDialog: state => state.walletDialog
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
        setCore(context, obj) {
            context.commit('set_core', obj)
        },
        toggleWalletDialog(context) {
            context.commit('toggleWalletDialog')
        },
    },

    mutations: {
        set_menus(state, obj) {
            state.menus = obj
        },
        set_wallet(state, obj) {
            state.wallet = obj
        },
        set_core(state, obj) {
            state.user = obj?.user.length > 0 && obj?.user[0] ? obj?.user[0] : null;
            state.core = obj
        },
        toggleWalletDialog(state) {
            state.walletDialog = !state.walletDialog
        }
    }
};
