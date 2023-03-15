import vx from './store/index'
import Vue from "vue/dist/vue.js";
import i18n from "./i18n";

import {
    ActionButtons,
    Closable,
    Data,
    Description,
    Events,
    Icon,
    Loading,
    PrimaryButtons,
    Showing,
    Title,
    Width
} from "./store/global";

export const ICONS = {
    QUESTION: require('./img/question.png'),
    INFO: require('./img/info.png'),
    SUCCESS: require('./img/success.png'),
    FAILED: require('./img/failed.png'),
    WALLET: require('./img/wallet.png'),
    WARNING: require('./img/warn.png'),
    CONNECTION: require('./img/connect.png'),
    VPN: require("./img/vpn.png"),
    PROXY: require("./img/proxy.png"),
}


function showLoading() {
    vx.dispatch(Loading, true);
    vx.dispatch(Showing, true);
    vx.dispatch(Closable, true);
}


function hideLoading() {
    vx.dispatch(Loading, false);
    vx.dispatch(Showing, false);
    vx.dispatch(Closable, false);
}

function showConnectionLost(obj) {
    if (!obj.title) obj.title = i18n.t("ConnectionLost.Title");
    if (!obj.subtitle) obj.subtitle = i18n.t("ConnectionLost.Subtitle");
    if (!obj.buttonText) obj.buttonText = i18n.t("ConnectionLost.Button");
    if (!obj.closable) obj.closable = false
    if (!obj.type) obj.type = 'CONNECTION';
    let iconType = obj.type.toUpperCase()

    vx.dispatch("connectionLost/title", obj.title)
    vx.dispatch("connectionLost/subtitle", obj.subtitle)
    vx.dispatch("connectionLost/button", obj.buttonText)
    vx.dispatch("connectionLost/onClick", obj.event)
    vx.dispatch("connectionLost/showing", true)
    vx.dispatch("connectionLost/closable", obj.closable)
    vx.dispatch(Icon, ICONS[iconType]);
}

function hideConnectionLost() {
    vx.dispatch("connectionLost/showing", false)
}

function showDialog(icon, title, description, closable, buttons, config = {}, data) {
    vx.dispatch(Icon, icon);
    vx.dispatch(Title, title);
    vx.dispatch(Description, description);
    vx.dispatch(PrimaryButtons, buttons.primary ?? []);
    vx.dispatch(ActionButtons, buttons.actions ?? []);
    vx.dispatch(Data, data);

    vx.dispatch(Closable, !closable);

    //config bind
    vx.dispatch(Width, config.width ?? 250);
    vx.dispatch(Events.Close, config.onClose ?? undefined);

    //showing
    vx.dispatch(Loading, false);
    vx.dispatch(Showing, true);
}

async function yesNo(title, message = "", defaultValue = false, data = undefined) {
    let response = undefined;
    showDialog(ICONS.QUESTION, title, message, true, {
            primary: [
                {
                    text: i18n.t("Questions.Yes"),
                    color: "#2ccb4c",
                    onClick() {
                        response = true
                    }
                }, {
                    text: i18n.t("Questions.No"),
                    icon: 'close',
                    color: "#e02020",
                    onClick() {
                        response = false
                    }
                }
            ]
        },
        {
            onClose() {
                response = defaultValue
            },
            width: 300,
        }, data);
    while (response === undefined) {
        await sleep(10)
    }
    return response;
}

async function baseDialog(icon, title, description, mainButton, actions, closable, data) {
    showDialog(icon, title, description, closable, {
            primary: [
                mainButton
            ],

            actions: [
                ...actions
            ]
        },
        {
            width: 300,
        }, data);
}

async function success(title = undefined, description = "", data = undefined, mainButton = {}, actions = [], closable = true) {
    if (mainButton === undefined) mainButton = {}
    if (!mainButton.text) mainButton.text = i18n.t("Success.defaultActionText")
    if (!mainButton.color) mainButton.color = "#2ccb4c"
    if (!mainButton.class) mainButton.class = "w-100 rounded-0"
    if (mainButton.closeOnClick === undefined) mainButton.closeOnClick = true
    if (!mainButton.onClick) mainButton.onClick = () => {
    }

    baseDialog(ICONS.SUCCESS, title ?? i18n.t("Success.Title"), description, mainButton, actions, closable, data)
}

async function info(title = undefined, description = "", data = undefined, mainButton = {}, actions = [], closable = true) {
    if (mainButton === undefined) mainButton = {}
    if (!mainButton.text) mainButton.text = i18n.t("Info.defaultActionText")
    if (!mainButton.color) mainButton.color = "#2ccb4c"
    if (!mainButton.class) mainButton.class = "w-100 rounded-0"
    if (mainButton.closeOnClick === undefined) mainButton.closeOnClick = true
    if (!mainButton.onClick) mainButton.onClick = () => {
    }

    baseDialog(ICONS.INFO, title ?? i18n.t("Info.Title"), description, mainButton, actions, closable, data)
}

async function warning(title = undefined, description = "", data = undefined, mainButton = {}, actions = [], closable = true) {
    if (mainButton === undefined) mainButton = {}
    if (!mainButton.text) mainButton.text = i18n.t("Warning.defaultActionText")
    if (!mainButton.color) mainButton.color = "#f19410"
    if (!mainButton.class) mainButton.class = "w-100 rounded-0"
    if (mainButton.closeOnClick === undefined) mainButton.closeOnClick = true
    if (!mainButton.onClick) mainButton.onClick = () => {
    }

    baseDialog(ICONS.WARNING, title ?? i18n.t("Warning.Title"), description, mainButton, actions, closable, data)
}

async function error(title = undefined, description = "", data = undefined, mainButton = {}, actions = [], closable = true) {
    if (mainButton === undefined) mainButton = {}
    if (!mainButton.text) mainButton.text = i18n.t("Error.defaultActionText")
    if (!mainButton.color) mainButton.color = "#e02020"
    if (!mainButton.class) mainButton.class = "w-100 rounded-0"
    if (mainButton.closeOnClick === undefined) mainButton.closeOnClick = true
    if (!mainButton.onClick) mainButton.onClick = () => {
    }

    baseDialog(ICONS.FAILED, title ?? i18n.t("Error.Title"), description, mainButton, actions, closable, data)
}

async function wallet(title = undefined, description = "", data = undefined, mainButton = {}, actions = [], closable = true) {
    if (mainButton === undefined) mainButton = {}
    if (!mainButton.text) mainButton.text = i18n.t("Wallet.defaultActionText")
    if (!mainButton.color) mainButton.color = "#e02020"
    if (!mainButton.class) mainButton.class = "w-100 rounded-0"
    if (mainButton.closeOnClick === undefined) mainButton.closeOnClick = true
    if (!mainButton.onClick) mainButton.onClick = () => {
    }

    baseDialog(ICONS.WALLET, title ?? i18n.t("Wallet.Title"), description, mainButton, actions, closable, data)
}

export const exp = {
    showLoading,
    hideLoading,
    showDialog,
    yesNo,
    baseDialog,
    success,
    info,
    warning,
    error,
    showConnectionLost,
    hideConnectionLost,
    wallet,
    ICONS,
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function injectDiv(id) {
    window.document.body.insertAdjacentHTML('afterbegin', `<div id='${id}'></div>`);
}

function CreateVueInstance(el) {
    // Vue.component('modalllllView' , view)
    // return new Vue({
    //     el: "#" + el,
    //     template : "<viewEasyModal></viewEasyModal>",
    //     components:{viewEasyModal},
    //     vuetify,
    //     store,
    //     i18n,
    //
    // })

    return new Vue({
        i18n
    })
}

export default {
    install(Vue) {
        let id = "modalappppp"
        injectDiv(id)
        window.ModalVue = CreateVueInstance(id)
        Vue.prototype.$modal = exp;
    }
}


