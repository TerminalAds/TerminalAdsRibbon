export default {
    namespaced: true,

    state: {
        sub_title: "",
        menus: []
    },

    getters: {
        sub_title: state => state.sub_title,
        menus: state => state.menus
    },

    actions: {
        setTitle(context, title) {
            context.commit('sub_title', title)
        },
        setMenus(context, obj) {
            context.commit('set_menus', obj)
        }
    },

    mutations: {
        set_menus(state, obj) {
            state.menus = obj
        }
    }
};
