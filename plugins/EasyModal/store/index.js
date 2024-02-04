import Vuex from "vuex";
import global from './global/index'
import connectionLost from "./connectionLost/index";

export default new Vuex.Store({
    modules: {
        global,
        connectionLost
    }
})