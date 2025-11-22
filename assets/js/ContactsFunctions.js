import axios from "axios";
import Vue from "vue";

const axiosapiurl = Vue.prototype.$payamakApi2;

let axiosApi = axios.create({
  baseURL: axiosapiurl,
  timeout: 15000,
});

export function deleteContactFromTag({ contact, tag, deleteFrom }) {
  return new Promise((resolve, reject) => {
    axiosApi
      .delete(`contact/${contact}`, {
        deleteFrom,
        phone_tag: tag,
      })
      .then((data) => resolve(data))
      .catch((err) => {
        reject(err);
        console.log("failed to delete contact from tag: ", err);
      });
  });
}

export function updateContact(slug, data) {
  console.log("save: ", slug, data);

  return new Promise((resolve, reject) => {
    axiosApi
      .post(`contact/update/${slug}`, data)
      .then((data) => resolve(data))
      .catch((err) => {
        console.log("error in save contact: ", err);
        if (!!err?.response?.data?.message)
          console.log(err.response.data.message);
        // this.$toast.error(err.response.data.message, {timeout: 5000})
        reject(err);
      });
  });
}
