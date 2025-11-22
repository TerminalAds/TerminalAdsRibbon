import axios from "axios";
import { getToken } from "./jwt.service";
import Vue from "vue";

const axiosapiurl = Vue.prototype.$payamakApi;

const api = axios.create({
  baseURL: axiosapiurl,
  timeout: 15000,
  headers: {
    common: {
      Authorization: getToken() ? `Bearer ${getToken()}` : null,
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
    },
  },
});

async function userDefaultList(params) {
  return await api.get("/request/text/user", {
    params,
  });
}

async function userDeleteListItem(id) {
  return await api.delete(`/request/text/user/${id}`);
}

async function userStoreItem(data) {
  return await api.post("request/text/user", data);
}

async function userUpdateItem(id, data) {
  return await api.requestApiPut("request/text/user/" + id, data);
}

async function adminDefaultList(params) {
  return await api.get("/request/text/admin", {
    params,
  });
}

async function adminGenerateDefaultList(id, data) {
  return await api.post(`request/text/admin/${id}/generate`, data);
}

async function adminRejectDefaultList(id, params) {
  return await api.delete(`/request/text/admin/${id}`, {
    params,
  });
}

export {
  userDefaultList,
  userDeleteListItem,
  userStoreItem,
  userUpdateItem,
  adminDefaultList,
  adminGenerateDefaultList,
  adminRejectDefaultList,
};
