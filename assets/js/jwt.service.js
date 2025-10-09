import {setLanguageCookie} from "../../utils/languageCookie";

const ID_TOKEN_KEY = "id_token";

export const getToken = () => {
	return window.localStorage.getItem(ID_TOKEN_KEY);
};

export const saveToken = token => {
	window.localStorage.setItem(ID_TOKEN_KEY, token);
};

export const destroyToken = (origin, hash) => {
	const url = new URL(location.href);
	window.localStorage.removeItem(ID_TOKEN_KEY);
	localStorage.removeItem('reloaded');
	window.localStorage.removeItem('userInfo');

	if (url.searchParams.has('lang')) {
		setLanguageCookie(url.searchParams.get('lang'));
	}

	(!!origin && !!hash)
		? window.location.replace(`https://core.terminalads.com/#/login?call_back_origin=${origin}&call_back_hash=${hash}`)
		: window.location.origin === 'https://core.terminalads.com'
			? window.location.reload()
			: window.location.replace(`https://core.terminalads.com/#/login`);
};

export default {getToken, saveToken, destroyToken};
