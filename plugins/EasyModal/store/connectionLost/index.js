export const NameSpace = "connectionLost"
export const Showing = "showing"
export const Title = "title"
export const Subtitle = "subtitle"
export const Button = "button"

export const Events = {
    Click: "onClick"
}

const state = {
    [Showing]: false,
    [Events.Click]: undefined,
    [Title]: "",
    [Subtitle]: "",
    [Button]: "",
}

const getters = {
    isShow(state) {
        return state[Showing];
    },

    [Events.Click](state) {
        return state[Events.Click];
    },
    [Title](state) {
        return state[Title];
    },
    [Subtitle](state) {
        return state[Subtitle];
    },
    [Button](state) {
        return state[Button];
    },
}

const mutations = {
    [Showing](state, value) {
        state[Showing] = value;
    },
    [Events.Click](state, value) {
        return state[Events.Click] = value;
    },
    [Button](state, value) {
        return state[Button] = value;
    },
    [Title](state, value) {
        return state[Title] = value;
    },
    [Subtitle](state, value) {
        return state[Subtitle] = value;
    },
}

const actions = {
    [Showing](context, value) {
        context.commit(Showing, !!value)
    },
    [Events.Click]({commit}, value) {
        commit(Events.Click, value)
    },
    [Title]({commit}, value) {
        commit(Title, value)
    },
    [Subtitle]({commit}, value) {
        commit(Subtitle, value)
    },
    [Button]({commit}, value) {
        commit(Button, value)
    }
}

export default {
    namespaced: true,
    actions,
    getters,
    state,
    mutations
}


function getNamespacedName(name) {
    return NameSpace + "/" + name;
}