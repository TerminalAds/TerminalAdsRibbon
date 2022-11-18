const state = {
    sub_title: ""
};

const getters = {
    sub_title: state=> state.sub_title
};

const actions = {
    setTitle(context , title){
        context.commit('sub_title', title)
    }};

const mutations = {
};

export default {
    namespaced : true,
    state,
    actions,
    mutations,
    getters
};
