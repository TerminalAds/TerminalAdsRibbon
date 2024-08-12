export default {
    namespaced: true,

    state: {
        sub_title: "",
        menus: [],
        wallet: {balance: null},
        new_wallet: {balance: null},
        core: {},
        walletDialog: false,
        withdrawDialog: false,
        DLoading: {
            menus: false,
            user: false,
            wallet: false
        },
        sectionStatus: {
            menus: true,
            user: true,
            wallet: true
        },
        autoReload: {
            time: null,
            timer: false,
            route: ''
        }
    },

    getters: {
        sub_title: state => state.sub_title,
        menus: state => state.menus,
        wallet: state => state.wallet,
        new_wallet: state => state.new_wallet,
        user: state => state.core?.user?.length > 0 && state.core.user[0] ? state.core.user[0] : null,
        core: state => state.core,
        walletDialog: state => state.walletDialog,
        withdrawDialog: state => state.withdrawDialog,
        DLoading: state => state.DLoading,
        sectionStatus: state => state.sectionStatus,
        hasTimer: state => state.autoReload.timer,
        timerHasTime: state => !!state.autoReload.time
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
        setNewWallet(context, obj) {
            context.commit('set_new_wallet', obj)
        },
        setCore(context, obj) {
            context.commit('set_core', obj)
        },
        toggleWalletDialog({commit}, input) {
            commit('toggleWalletDialog', input)
        },
        toggleWithdrawDialog({commit}, input) {
            commit('toggleWithdrawDialog', input)
        },
        toggleLoading({commit}, {field, status}) {
            commit('toggle_loading', {field, status})
        },
        setSectionStatus({commit}, {field, status}) {
            commit('set_section_status', {field, status})
        },
        setTimer({commit}, timer) {
            commit('set_timer', timer)
        },
        stopTimer({commit}) {
            commit('stop_timer')
        }
    },

    mutations: {
        set_menus(state, obj) {
            state.menus = obj
        },
        set_wallet(state, obj) {
            state.wallet = obj
        },
        set_new_wallet(state, obj) {
            state.new_wallet.balance = obj
        },
        set_core(state, obj) {
            state.user = obj?.user.length > 0 && obj?.user[0] ? obj?.user[0] : null;
            state.core = obj
        },
        toggleWalletDialog(state, input) {
            state.walletDialog = input
        },
        toggleWithdrawDialog(state, input) {
            state.withdrawDialog = input
        },
        toggle_loading(state, {field, status}) {
            state.DLoading[field] = status
        },
        set_section_status(state, {field, status}) {
            state.sectionStatus[field] = status
        },
        set_timer(state, timer) {
            state.autoReload = timer
        },
        stop_timer(state) {
            state.autoReload.route = null
            state.autoReload.timer = false
        },
    }
};
