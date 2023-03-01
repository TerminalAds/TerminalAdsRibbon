# Terminal Ads Ribbon Title.

## Table Of Content.
- [Dependency](#Dependency).
- [Usage](#Usage).
- [Update](#Update).
- [Tips](#Tips).

-----

### Dependency.

1. Vue.
2. Vue Router.
3. Vuex.
4. Axios.
5. Vuetify.

### Usage.
First clone this repository in your project or add as submodule.

```bash
git clone git@github.com:RezaParsian/TerminalAdsRibbon.git
```

or

```bash
git submodule add git@github.com:RezaParsian/TerminalAdsRibbon.git path/where/you/want

#for example.
git submodule add git@github.com:RezaParsian/TerminalAdsRibbon.git src/core/plugins/TitleRibbon

#if module dosen`t clone successfuly try these 2 stpes.
git submodule init
git submodule update
```

then import **install.js** in _main.js_.

```javascript
import TerminalTitleRibbon from "./core/plugins/TitleRibbon/install";
```

after that you must use this as **plugin**.

```javascript
Vue.use(TerminalTitleRibbon, ({
    store,
    axios,                                                                  // an inctance of axios *reqire*
    config: () => ({                                                        // global configs for layout & dashboard
        dashboardConfig,                                                    // dashboard data
        static_top_menu,                                                    // links in top of menu
        header_logo: store.getters.headerLogo,                              // set a getter in config.getters store
    }),
    headers: {
        Authorization: "Bearer " + localStorage.getItem("id_token"),        // send Authorization with Bearer anytime.
        Accept: 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
    },
    permissions: () => window.Vue.$ability.j[0].actions,                    // this plugin need user permission for check user access.
    core_url: process.env.VUE_APP_CoreLandUrl,
    front_url: 'https://core.terminalads.com',
    sid: 2                                                                  // send ID for each project
}))
```

> **notice** *
> ```bash
> config field must have objects like this:
> ```
> ```javascript
> let dashboardConfig = {
>     announcement: {
>         img: 'https://core-robot.terminalads.com/advertisement-billboard-6097659-5013090.png', // url
>         text: 'آگهی ثبت شده', // any
>         url: router.resolve({name: 'send.sms.divar'}).href // page to go
>     },
>     numbers: {
>         img: require('./assets/img/rp.png'), // require from local assets
>         text: 'شماره ها',
>         url: router.resolve({name: 'divar.report'}).href
>     },
>     counter: new Promise((resolve) => {
>      resolve({
>        announcement:0,
>        numbers:0,
>      });
>    })
> }
> 
> let static_top_menu = [
>    {name: 'تعرفه', slug: 'https://google.com'},
> ]

- --

> **now** It's ready for use in **router.js**

find **redirect: "/dashboard"** and set this lines

```javascript
routes: [
    {
        path: "/",
        redirect: "/dashboard",
        component: () => import("./core/plugins/TitleRibbon/index"), // set Layoiut component from TerminalDashboard
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                component: () => import("./core/plugins/TitleRibbon/Dashboard") // set Dashboard component from TerminalDashboard
            },
            ...{} // other children
        ],
    },
    ...{} // other routes
]
// other file contents
```

it's almost done, But before that let me explain how this plugin works.

we have route like below

```jsonpath
{
    path: "explain",
    name: "explain",
    component: () => import("path/to/vue")
}
```

this route doesn't show any **ribbon** to user if you want to show the **ribbon** you must change that like below

```jsonpath
{
    path: "explain",
    name: "explain",
    meta: {
      has_ribbon : true,
      title : "Title Name"
    },
    component: () => import("path/to/vue")
}
```

**The last** important thing is to add the following settings to the routes:    
if this route is main or like dashboard and most have not a white background

```jsonpath
{
    path: "explain",
    name: "explain",
    meta: {main_page: true},
    component: () => import("path/to/vue")
}
```

### Update.

```git
git submodule update --remote
```

### Tips

> **On each installation of your project you need to run these steps.**
> ```git
> git submodule init
> git submodule update
>```

> if you need **subTitle** just call _setSubTitle_ method in your component.
> ```js
> this.setSubTitle("subTitle");
> ```