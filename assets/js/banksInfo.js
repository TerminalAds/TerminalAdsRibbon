const banks = [
  {
    "text": "اقتصاد نوین",
    "value": "eghtesad novin",
    "prefix": ["627412"],
    "icon": require('../../assets/img/banks/eghtesad-novin.png'),
    "color": "blue"
  },
  {
    "text": "انصار",
    "value": "ansar",
    "prefix": ["627381"],
    "icon": require('../../assets/img/banks/ansar.png'),
    "color": "blue"
  },
  {
    "text": "ایران زمین",
    "value": "iran-zamin",
    "prefix": ["505785"],
    "icon": require('../../assets/img/banks/iran-zamin.png'),
    "color": "blue"
  },
  {
    "text": "پارسیان",
    "value": "parsian",
    "prefix": ["622106", "639194", "627884"],
    "icon": require('../../assets/img/banks/parsian.png'),
    "color": "blue"
  },
  {
    "text": "پاسارگاد",
    "value": "pasargad",
    "prefix": ["639347", "502229"],
    "icon": require('../../assets/img/banks/pasargad.png'),
    "color": "#2d2a2d"
  },
  {
    "text": "تات",
    "value": "tat",
    "prefix": ["636214"],
    "icon": require('../../assets/img/banks/tat.png'),
    "color": "blue"
  },
  {
    "text": "تجارت",
    "value": "tejarat",
    "prefix": ["627353"],
    "icon": require('../../assets/img/banks/tejarat.png'),
    "color": "blue"
  },
  {
    "text": "توسعه تعاون",
    "value": "tosee-taavon",
    "prefix": ["502908"],
    "icon": require('../../assets/img/banks/taavon.png'),
    "color": "blue"
  },
  {
    "text": "توسعه صادرات ایران",
    "value": "tosee-saderat",
    "prefix": ["627648", "207177"],
    "icon": '',
    "color": "blue"
  },
  {
    "text": "حکمت ایرانیان",
    "value": "hekmat-iraniyan",
    "prefix": ["636949"],
    "icon": require('../../assets/img/banks/hekmat.png'),
    "color": "blue"
  },
  {
    "text": "دی",
    "value": "dey",
    "prefix": ["502938"],
    "icon": require('../../assets/img/banks/dey.png'),
    "color": "blue"
  },
  {
    "text": "رفاه کارگران",
    "value": "refah-kargar",
    "prefix": ["589463"],
    "icon": require('../../assets/img/banks/refah.png'),
    "color": "blue"
  },
  {
    "text": "سامان",
    "value": "saman",
    "prefix": ["621986"],
    "icon": require('../../assets/img/banks/saman.png'),
    "color": "#025afb"
  },
  {
    "text": "سپه",
    "value": "sepah",
    "prefix": ["589210"],
    "icon": require('../../assets/img/banks/sepah.png'),
    "color": "blue"
  },
  {
    "text": "سرمایه",
    "value": "sarmayeh",
    "prefix": ["639607"],
    "icon": require('../../assets/img/banks/sarmayeh.png'),
    "color": "blue"
  },
  {
    "text": "سینا",
    "value": "sina",
    "prefix": ["639346"],
    "icon": require('../../assets/img/banks/sina.png'),
    "color": "blue"
  },
  {
    "text": "شهر",
    "value": "shahr",
    "prefix": ["502806"],
    "icon": require('../../assets/img/banks/shahr.png'),
    "color": "blue"
  },
  {
    "text": "صادرات ایران",
    "value": "saderat-iran",
    "prefix": ["603769"],
    "icon": require('../../assets/img/banks/saderat.png'),
    "color": "blue"
  },
  {
    "text": "صنعت و معدن",
    "value": "sanat-madan",
    "prefix": ["627961"],
    "icon": require('../../assets/img/banks/sanat-madan.png'),
    "color": "blue"
  },
  {
    "text": "قرض الحسنه مهر ایران",
    "value": "ghorze-alhasane-mehr-iran",
    "prefix": ["606373"],
    "icon": require('../../assets/img/banks/mehre-iran.png'),
    "color": "blue"
  },
  {
    "text": "قوامین",
    "value": "ghavamin",
    "prefix": ["639599"],
    "icon": require('../../assets/img/banks/ghavamin.png'),
    "color": "blue"
  },
  {
    "text": "کارآفرین",
    "value": "karaafarin",
    "prefix": ["627488", "502910"],
    "icon": require('../../assets/img/banks/karafarin.png'),
    "color": "blue"
  },
  {
    "text": "کشاورزی",
    "value": "keshavarzi",
    "prefix": ["603770", "639217"],
    "icon": require('../../assets/img/banks/keshavarzi.png'),
    "color": "blue"
  },
  {
    "text": "گردشگری",
    "value": "gardeshgari",
    "prefix": ["505416"],
    "icon": require('../../assets/img/banks/gardeshgari.png'),
    "color": "blue"
  },
  {
    "text": "مرکزی",
    "value": "markazi",
    "prefix": ["636795"],
    "icon": require('../../assets/img/banks/markazi.png'),
    "color": "blue"
  },
  {
    "text": "مسکن",
    "value": "maskan",
    "prefix": ["628023"],
    "icon": require('../../assets/img/banks/maskan.png'),
    "color": "blue"
  },
  {
    "text": "ملت",
    "value": "melat",
    "prefix": ["610433", "991975"],
    "icon": require('../../assets/img/banks/mellat.png'),
    "color": "#e63630"
  },
  {
    "text": "ملی",
    "value": "melli-iran",
    "prefix": ["603799"],
    "icon": require('../../assets/img/banks/melli.png'),
    "color": "#d9b072"
  },
  {
    "text": "مهر اقتصاد",
    "value": "mehr-eghtesad",
    "prefix": ["639370"],
    "icon": require('../../assets/img/banks/mehre-eghtesad.png'),
    "color": "blue"
  },
  {
    "text": "پست بانک ایران",
    "value": "post-bank-iran",
    "prefix": ["627760"],
    "icon": "",
    "color": "blue"
  },
  {
    "text": "موسسه اعتباری توسعه",
    "value": "etebari-tosee",
    "prefix": ["628157"],
    "icon": "",
    "color": "blue"
  },
  {
    "text": "موسسه اعتباری کوثر",
    "value": "etebari-kosar",
    "prefix": ["505801"],
    "icon": require('../../assets/img/banks/kosar.png'),
    "color": "blue"
  }
]

const findPrefix = function (searchable) {
  return this.find(item =>
      item.prefix.includes(searchable?.substring(0, 6)))
}

Array.prototype.findPrefix = findPrefix;

export {
  banks,
  findPrefix
}