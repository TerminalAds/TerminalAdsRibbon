import vx from './store/index'
import Vue from "vue/dist/vue.js";
import i18n from "./i18n";

import {
  ActionButtons,
  Closable,
  Data,
  Description,
  ExtraText,
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
  CONNECTION: 'data:image/png;base64,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',
  VPN: require("./img/vpn.png"),
  PROXY: require("./img/proxy.png"),
}


function showLoading(extraText = null) {
  vx.dispatch(Loading, true);
  vx.dispatch(ExtraText, extraText);
  vx.dispatch(Showing, true);
  vx.dispatch(Closable, true);
}


function hideLoading() {
  vx.dispatch(Loading, false);
  vx.dispatch(ExtraText, null);
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


