# Terminal Ads Custom Popup

## Table Of Content

- [Usage](#Usage).
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

<custom-popup v-model="showMessage" :cons="cons" :max-width="maxWidth" hide-overlay :transition="name">
    <template v-slot:title>
        <v-btn icon @click="func">
            <v-icon>mdi-account</v-icon>
        </v-btn>
    </template>

    <v-card-text class="position-relative pa-0">
        <bank-cards v-model="selectedJob"/>
    </v-card-text>
</custom-popup>
```

The **cons** is the configs of component and something like this

```javascript
cons: {
    title: 'بانک های اطلاعاتی',
    buttons: [
        {text: '', type: 'submit', handler: null || this.someFunc},
        {text: '', type: 'any', handler: null || this.someFunc}
    ]
}
```

---

### Tips

Accessible attributes

```bash
max-width = [Number, String] - default: '1024' - Sets the maximum width for the component.

hide-overlay = Boolean - default: true - Sets the maximum width for the component.

hide-confirm = Boolean - default: false - Hide the confirm buttom in title.

transition = [String, Boolean] - default: undefined - Dialog animation
```