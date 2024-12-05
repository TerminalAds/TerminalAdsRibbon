<template>
  <div>
    <v-tabs v-model="computedTabs" background-color="primary" class="rounded-lg custom-tabs" dark height="52"
            hide-slider show-arrows v-bind="$attrs" @change="$emit('change', $event)">
      <slot v-if="$slots.staticTabs" name="staticTabs"/>

      <template v-else>
        <v-tab v-for="(tab, i) in tabItems" :key="i" :disabled="getTabItemDisabled(tab)" v-bind="getProps(i)">
          <div class="cornel-left"/>
          <div class="cornel-right"/>
          <slot name="tab" v-bind:tab="tab">
            <v-icon right>mdi-{{ tab.icon }}</v-icon>
            <span class="font-weight-bold">{{ tab.text }}</span>
          </slot>
        </v-tab>
      </template>
    </v-tabs>

    <slot name="middle"/>

    <v-tabs-items v-model="computedTabs" v-bind="tabsItemsAttrs">
      <slot v-if="$slots.staticItems" name="staticItems"/>

      <template v-else>
        <v-tab-item v-for="(item, i) in windowItems" :key="i" v-bind="getProps(i, 'windowProps')">
          <slot name="item" v-bind:item="item"/>
        </v-tab-item>
      </template>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  name: "index",

  props: {
    value: [Number, String, undefined],
    tabItems: [Array, Object],
    windowItems: [Array, Object],
    tabProps: {
      type: Object,
      default: null
    },
    windowProps: {
      type: Object,
      default: null
    },
    tabsItemsAttrs: {
      type: Object,
      default: {}
    }
  },

  computed: {
    computedTabs: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },

  methods: {
    getProps(index, field = 'tabProps') {
      if (this[field] && (this[field].to || this[field].href || this[field].value)) {
        let obj = Object.assign({}, this[field])
        let to = obj.to || obj.href || obj.value

        if (to) {
          let str = to.match(/(?<=\:)(.*?)(?=\/)|(?<=\:).*/g)

          for (let i = 0; i < str.length; i++) {
            let replace = new RegExp(`:${str[i]}`, 'g')
            to = to.replace(replace, this.tabItems[index][str[i]])
          }

          if ('to' in obj)
            obj.to = to
          else if ('href' in obj)
            obj.href = to;
          else
            obj.value = to

          return obj
        }
      }

      return this[field]
    },
    getTabItemDisabled(tab) {
      if (Object.hasOwn(tab, 'disabled'))
        return typeof tab.disabled === 'boolean' ? tab.disabled : tab.disabled()
      return false
    }
  }
}
</script>

<style lang="scss">
:root {
  --current-color: '';
}

.custom-tabs {
  .v-slide-group {
    border-radius: 8px;
    padding: 8px 8px 0 8px;
  }

  .v-tab {
    &:not(.v-tab--active) {
      transition: transform .3s;

      &:hover {
        transform: translateY(-4px);
        color: white !important;

        .v-icon {
          color: white !important;
        }
      }
    }

    &:before {
      background: none !important;
    }

    &.v-tab--active {
      background: white;
      color: var(--v-primary-base);
      border-radius: 8px 8px 0 0;
      position: relative;
      border: none !important;

      .cornel-left::before,
      .cornel-left::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        transform: translateX(-100%);
      }

      .cornel-right::before,
      .cornel-right::after {
        content: '';
        position: absolute;
        right: 0;
        bottom: 0;
        transform: translateX(100%);
      }

      .cornel-right::before,
      .cornel-left::before {
        width: 10px;
        height: 10px;
        background: white;
        z-index: 1;
      }

      .cornel-right::after,
      .cornel-left::after {
        width: 20px;
        height: 20px;
        background: currentColor;
        border-radius: 50%;
        z-index: 2;
      }
    }

    &.v-tab--active:before,
    .v-tab:hover:before {
      opacity: 0 !important;
    }
  }

  @media screen and(max-width: 600px) {
    .v-slide-group__prev, .v-slide-group__next {
      display: none;
    }
  }
}
</style>