const FORCE_IRAN_MODE = false;
const IS_IR = window.location.hostname.includes(".ir");
const USER_IN_IRAN = IS_IR || FORCE_IRAN_MODE;

export const ir = (url) => {
  if (!url || typeof url !== "string") return url;
  return USER_IN_IRAN ? url.replace(/\.com/g, ".ir") : url;
};

export const IS_IRANIAN_USER = USER_IN_IRAN;
