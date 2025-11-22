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

async function sendPatternSms(data) {
  return await api.post("/admin/message/send/pattern/", data);
}

async function sendMassPatternSms(pattern, data) {
  return await api.post(`/pattern/mass/excel/${pattern}`, data);
}

export { sendPatternSms, sendMassPatternSms };
