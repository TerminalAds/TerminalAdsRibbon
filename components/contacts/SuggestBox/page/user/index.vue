<template>
  <v-card :loading="loading" class="pa-4" flat>
    <v-card-title class="pa-0">
      <v-btn :loading="loading" class="btn-send-sms" rounded style="letter-spacing: normal"
             @click="suggestText = true">
        <v-icon>mdi-plus</v-icon>
        <b>متن پیامک</b>
      </v-btn>
    </v-card-title>

    <vue-table :data="data" :headers="headers" @change="onPagination">
      <template v-slot:filters="{props, perPage}">
        <v-row no-gutters>
          <v-col class="pa-2" cols="12" lg="2" md="3">
            <v-select v-model="props.length" :items="perPage" :menu-props="{offsetY: true}" class="rounded-lg" dense
                      item-text="page" item-value="page" label="تعداد" outlined/>
          </v-col>

          <v-col class="pa-2" cols="12" lg="3" md="4">
            <v-text-field v-model="props.search" append-icon="mdi-magnify" class="rounded-lg" clearable dense
                          label="جست و جو" outlined/>
          </v-col>
        </v-row>
      </template>

      <template v-slot:index="{item}">
        {{ (item.index + 1) + ((data.current_page - 1) * data.per_page) }}
      </template>

      <template v-slot:action="{item}">
        <manage-button :data="item" :meta="metaButtons"/>
      </template>
    </vue-table>

    <custom-popup v-model="suggestText" :cons="cons" max-width="700">
      <v-card-text>
        <store-request/>
      </v-card-text>
    </custom-popup>

    <custom-popup v-model="editRequest" :cons="cons1" max-width="700">
      <v-card-text v-if="editRequest">
        <update-request :data="selectedRequest" :modal="()=> this.editRequest=false"/>
      </v-card-text>
    </custom-popup>
  </v-card>
</template>

<script>
import ManageButton from "@/view/pages/ButtonGroup/button";
import StoreRequest from "./storeRequest";
import UpdateRequest from "./updateRequest";
import {userDefaultList, userDeleteListItem} from "@/Utilities/defaultSms";

export default {
  name: "userSuggestList",

  components: {UpdateRequest, StoreRequest, ManageButton},

  data() {
    return {
      suggestText: false,
      editRequest: false,
      data: [],
      headers: [
        {value: 'index', text: 'ردیف', sortable: false, align: 'center'},
        {value: 'title', text: 'عنوان', sortable: false, align: 'center'},
        {value: 'text', text: 'متن', sortable: false, align: 'center'},
        {value: 'action', text: 'مدیریت', sortable: false, align: 'center'},
      ],
      metaButtons: {
        buttons: [
          {
            name: 'delete',
            label: 'حذف',
            icon: 'trash',
            class: 'btn-refund border-2 rounded-pill',
            action: this.action,
            status: 'phoneBook_show',
          },
          {
            name: 'edit',
            label: 'ویرایش',
            icon: 'edit',
            class: 'btn-show border-2 rounded-pill',
            action: this.action,
            status: 'phoneBook_show',
          }
        ]
      },
      cons: {
        title: 'متن پیشفرض',
      },
      cons1: {
        title: 'ویرایش متن پیشفرض',
      },
      tableProps: {
        search: '',
        length: 10,
        dir: 'desc',
      },
      timer: null,
      selectedRequest: null,
      loading: false
    }
  },

  mounted() {
    this.getData();
  },

  computed: {
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          this.getData(this.url, this.tableProps);
          return true
        case 'sm':
          this.getData(this.url, this.tableProps);
          return true
        case 'md':
          this.getData(this.url, this.tableProps);
          return false
        case 'lg':
          this.getData(this.url, this.tableProps);
          return false
        case 'xl':
          this.getData(this.url, this.tableProps);
          return false
      }
    },

  },

  watch: {
    suggestText(val) {
      if (!val)
        this.getData();
    },
    editRequest(val) {
      if (!val)
        this.getData();
    }
  },

  methods: {
    getData(params = this.tableProps) {
      this.loading = true;

      userDefaultList(params)
        .then(result => {
          this.data = result.data.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onPagination(e) {
      let props = {
        ...this.tableProps,
        ...e
      }

      this.getData(props)
    },
    action(data, action) {
      this[`${action}Action`](data);
    },
    deleteAction(data) {
      this.loading = true;

      userDeleteListItem(data.id).then(result => {
        this.getData();

        this.$modal.success('موفقیت', result.data.message);
      }).finally(() => {
        this.loading = false;
      });
    },
    editAction(data) {
      this.editRequest = true;

      this.selectedRequest = {...data};
    }
  }
}
</script>

<style scoped>

</style>