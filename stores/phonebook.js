export default {
  state: {
    phonebooks_list: [],
    selected_phonebook_index: 0,
    selectedPhonebook: null,
    imported_phonebooks: {}
  },
  getters: {
    active_phonebook: state => state.phonebooks_list[state.selected_phonebook_index],
    isSharedPhonebook: (state, getters) => getters.active_phonebook?.hasOwnProperty('parent_id'),
    phonebookPermissions: (state, getters) => getters.isSharedPhonebook ? getters.active_phonebook.setting : true,
  },
  actions: {
    setPhonebooksList({commit}, list) {
      commit('set_phonebooks_list', list)
    },
    setActivePhonebook({commit}, item) {
      commit('set_active_phonebook', item)
    },
    setSelectedPhonebook({commit}, tag) {
      commit('set_selected_phonebook', tag)
    },
    updateImportedPhonebooks({commit}, input) {
      commit('set_imported_phonebooks', input)
    }
  },
  mutations: {
    set_phonebooks_list(state, list) {
      state.phonebooks_list = list
    },
    set_active_phonebook(state, index) {
      state.selected_phonebook_index = index
    },
    set_selected_phonebook(state, tag) {
      state.selectedPhonebook = tag
    },
    set_imported_phonebooks(state, input) {
      console.log('set_imported_phonebooks', input)

      state.imported_phonebooks = input
    }
  },
  namespaced: true,
};