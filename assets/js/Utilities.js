const smsPersianCharCounter = (text) => {
    const fa = new RegExp(/[\u0600-\u06FF]/g);
    let count = text.match(/[\u0600-\u06FF]/g)
    return count ? count.length : 0;
}

const smsLanguage = (text) => {
    let persianChar = smsPersianCharCounter(text)
    return persianChar > 0 ? Language.Persian : Language.English
}
const smsCountCalc = (text, lang) => {
    let first, second;
    let len = text.length;

    if (len === 0)
        return 1

    switch (lang) {
        case Language.English:
            first = 160;
            second = 154;
            break;

        case Language.Persian:
            first = 70;
            second = 62;
            break;
    }

    let remain = len / first;
    if (remain <= 1)
        return 1;
    if (len <= first ) {
        return 1 ;
    } else if (len<=(second + first))
        return 2;
    else
        return 2 + Math.ceil((len - 132) / 66);
}

const getTextSmsInfo = (text) => {
    let lang = smsLanguage(text),
        persianChar = smsPersianCharCounter(text),
        smsCount = smsCountCalc(text, lang)

    return {
        lang,
        persianChar,
        smsCount
    }
}

class Language {
    static Persian = new Language("Persian")
    static English = new Language("English")

    constructor(name) {
        this.name = name
    }
}

export {
    Language,
    smsCountCalc,
    smsPersianCharCounter,
    smsLanguage,
    getTextSmsInfo
}