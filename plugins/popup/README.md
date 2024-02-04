# Terminal Ads Custom Popup

## Table Of Content

- [Usage](#Usage).
- [Slots](#Slots).
- [Tips](#tips).

---

### Usage

**First** you should import the whole TitleRibbon and write the below line in **main.js**:

```javascript
import CustomPopup from "./core/plugins/TitleRibbon/plugins/popup/customPopup"
```

then use that as global component in main.js

```javascript
Vue.component('customPopup', CustomPopup)
```

now you can use this component like this

```html

<custom-popup v-model="showMessage" :cons="cons" :max-width="maxWidth" max-heigth="maxHeight" hide-overlay scrollable
              reloadable :transition="name">
    <template v-slot:extension>
        <v-tabs v-model="tab" grow >
            <v-tabs-slider/>
            <v-tab v-for="(item, i) in tabItems" v-if="item.condition">
                <v-icon>mdi-{{ item.icon }}</v-icon>
                {{ item.title }}
            </v-tab>
        </v-tabs>
    </template>
    
    <template v-slot:title>
        <v-btn icon @click="func">
            <v-icon>mdi-account</v-icon>
        </v-btn>
    </template>

    <v-card-text class="position-relative pa-0">
        <bank-cards v-model="selectedJob"/>
    </v-card-text>
    
    <template v-slot:action></template>
</custom-popup>
```

The **cons** is the configs of component and something like this

```javascript
cons: {
    title: 'title',
    buttons: [
        {text: '', type: 'submit', handler: null || this.someFunc || () => func, disabled: false || () => func},
        {type: 'any', handler: null || this.someFunc || () => func}
    ]
}
```

---

###Slots

```
action    - The action buttons on the bottom of dialog
default   - The daault slot for content
extension - The slot used to replace with default header
title     - The extra buttons or text in header
```

---

### Tips

Accessible attributes

```bash
hide-confirm  = Boolean               - default: false          - Hide the confirm buttom in title.

hide-overlay  = Boolean               - default: true           - Sets the maximum width for the component.

max-width     = [Number, String]      - default: '1024'         - Sets the maximum width for the component.

max-height    = [Number, String]      - default: undefined      - Sets the minimum height for the component.

reloadable    = Boolean               - default: false          - When set to true, a bnt shows on header for reload all slots

scrollable    = Boolean               - default: false          - When set to true, expects a v-card and a v-card-text component with a designated height

transition    = [String, Boolean]     - default: undefined      - Dialog animation
```