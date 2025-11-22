import Vue from "vue";

function setLanguageCookie(lang) {
  const domain = Vue.prototype.$terminal; // **Crucial:** Note the leading dot
  const days = 365;
  let expires = "";

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }

  document.cookie =
    "lang=" +
    lang +
    expires +
    "; path=/; domain=" +
    domain +
    "; SameSite=Lax; secure";
}

function getLanguageCookie() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; lang=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export { setLanguageCookie, getLanguageCookie };
