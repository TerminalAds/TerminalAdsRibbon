export default {
	namespaced: true,

	state: {
		sub_title: "",
		menus: [],
		wallet: {balance: null},
		new_wallet: {balance: null},
		core: {},
		walletDialog: false,
	},

	getters: {
		sub_title: state => state.sub_title,
		menus: state => state.menus,
		wallet: state => state.wallet,
		new_wallet: state => state.new_wallet,
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
		setNewWallet(context, obj) {
			context.commit('set_new_wallet', obj)
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
		set_new_wallet(state, obj) {
			// console.log('new wallet: ', obj)
			state.new_wallet.balance = obj
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
