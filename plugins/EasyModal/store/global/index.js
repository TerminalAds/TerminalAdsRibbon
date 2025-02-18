export const Loading = "loading"
export const Showing = "showing"
export const Closable = "closable"
export const PrimaryButtons = "PrimaryButtons"
export const ActionButtons = "ActionButtons"
export const Icon = "Icon"
export const DialogType = "DialogType"
export const Title = "Title"
export const Description = "Description"
export const ExtraText = "ExtraText"
export const Data = "Data"
export const Width = "Width"
export const Events = {
  Close: "onClose"
}

const state = {
  [Loading]: false,
  [Showing]: false,
  [Closable]: false,
  [PrimaryButtons]: [],
  [ActionButtons]: [],
  [Icon]: "",
  [DialogType]: "",
  [Title]: "",
  [Description]: "",
  [ExtraText]: "",
  [Width]: "",
  [Data]: "",
  [Events.Close]: undefined
}

const getters = {
  isShow(state) {
    return state[Showing];
  },
  [Closable](state) {
    return state[Closable];
  },
  [Loading](state) {
    return state[Loading];
  },
  [PrimaryButtons](state) {
    return state[PrimaryButtons];
  },
  [ActionButtons](state) {
    return state[ActionButtons];
  },
  [Icon](state) {
    return state[Icon];
  },
  [DialogType](state) {
    return state[DialogType];
  },
  [Title](state) {
    return state[Title];
  },
  [Description](state) {
    return state[Description];
  },
  [ExtraText](state) {
    return state[ExtraText];
  },
  [Width](state) {
    return state[Width];
  },
  [Events.Close](state) {
    return state[Events.Close];
  },
  [Data](state) {
    return state[Data];
  }
}

const mutations = {
  [Showing](state, value) {
    state[Showing] = value;
  },
  [Closable](state, value) {
    return state[Closable] = value;
  },
  [Loading](state, value) {
    return state[Loading] = value;
  },
  [PrimaryButtons](state, value) {
    return state[PrimaryButtons] = value;
  },
  [ActionButtons](state, value) {
    return state[ActionButtons] = value;
  },
  [Icon](state, value) {
    return state[Icon] = value;
  },
  [DialogType](state) {
    return state[DialogType];
  },
  [Title](state, value) {
    return state[Title] = value;
  },
  [Description](state, value) {
    return state[Description] = value;
  },
  [ExtraText](state, value) {
    return state[ExtraText] = value;
  },
  [Width](state, value) {
    return state[Width] = value;
  },
  [Events.Close](state, value) {
    return state[Events.Close] = value;
  },
  [Data](state, value) {
    return state[Data] = value;
  }
}

const actions = {
  [Showing](context, value) {
    context.commit(Showing, !!value)
  },
  [Closable]({commit}, value) {
    commit(Closable, !!value)
  },
  [Loading]({commit}, value) {
    commit(Loading, !!value)
  },
  [ActionButtons]({commit}, value) {
    commit(ActionButtons, value)
  },
  [PrimaryButtons]({commit}, value) {
    commit(PrimaryButtons, value)
  },
  [Icon]({commit}, value) {
    commit(Icon, value)
  },
  [DialogType]({commit}, value) {
    commit(DialogType, value)
  },
  [Title]({commit}, value) {
    commit(Title, value)
  },
  [Description]({commit}, value) {
    commit(Description, value)
  },
  [ExtraText]({commit}, value) {
    commit(ExtraText, value)
  },
  [Width]({commit}, value) {
    commit(Width, value)
  },
  [Events.Close]({commit}, value) {
    commit(Events.Close, value)
  },
  [Data]({commit}, value) {
    commit(Data, value)
  }
}

export default {
  actions,
  getters,
  state,
  mutations
}