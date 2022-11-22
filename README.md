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
Vue.use(TerminalTitleRibbon, {
    store, // this is vuex instance.
    headers: {
        Authorization: "Bearer " + localStorage.getItem("id_token"), // send Authorization with Bearer anytime.
        Accept: 'application/json',
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
    },
    permissions: () => store.state.ability, // this plugin need user permission for check user access.
    core_url: process.env.VUE_APP_CoreLandUrl
});
```

> now It's ready for use in **Layout.vue**

find _<router-view/>_ and replace with

```html
<div>
    <!--this is our plugin.-->
    <terminal_title_ribbon/>
    
    <router-view/>
</div>
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