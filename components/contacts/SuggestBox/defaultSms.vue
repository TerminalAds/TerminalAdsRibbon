<template>
  <v-card :loading="loading" flat>
    <v-card-text>
      <div class="bg-white" style="max-height: 18rem;overflow: auto">
        <data-table
            :columns="columns"
            :data="data"
            :orderDir="tableProps.dir"
            :per-page="[10, 25, 50, 100, 400]"
            :translate="translate"
            @on-table-props-changed="reloadTable"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { userDefaultList, userDeleteListItem } from "../../../assets/js/defaultSms";
import useBtn from "./page/component/useBtn";
import i18n from "../../../plugins/EasyModal/i18n";

export default {
  name: "defaultSms",

  props: {
    inputBox: {
      require: true
    },
    titleBox: {
      type: String,
      require: true
    }
  },

  created() {
    this.getData()
  },

  data() {
    return {
      i18n,
      menu: false,
      data: [],
      columns: [
        {
          label: i18n.t('table.index'),
          transform: (val) => {
            return this.rowNumber(this.data, val);
          },
        },
        {
          label: i18n.t('table.title'),
          name: 'title',
        },
        {
          label: i18n.t('table.text'),
          name: 'text',
          transform(row) {
            return row.data.text.substr(0, 25) + "...";
          }
        },
        {
          label: i18n.t('table.select'),
          name: 'select',
          handler: this.useAction,
          component: useBtn,
          event: 'click'
        }
      ],
      tableProps: {
        search: '',
        filters: {},
        status: null,
        length: 10,
        column: 'id',
        dir: 'desc',
      },
      translate: {
        nextButton: i18n.t('table.next'),
        previousButton: i18n.t('table.previous'),
        rowsPerPageText: i18n.t('table.rows_per_page'),
        noDataText: i18n.t('table.no_data'),
        placeholderSearch: i18n.t('table.search_placeholder'),
      },
      timer: null,
      loading: false
    }
  },

  methods: {
    debounce(fn, delay = 700) {
      clearTimeout(this.timer);

      this.timer = setTimeout(fn, delay)
    },
    getData() {
      this.loading = true;

      userDefaultList(this.tableProps).then(result => {
        this.data = result.data.data;
      }).finally(() => {
        this.loading = false;
      });
    },
    reloadTable(props) {
      this.tableProps = props;

      this.debounce(this.getData);
    },
    deleteAction(data) {
      this.loading = true;

      userDeleteListItem(data.id).then(result => {
        this.getData();

        this.$modal.success(i18n.t('modal.success'), result.data.message);
      }).finally(() => {
        this.loading = false;
      });
    },
    useAction(data) {
      const selector = this.inputBox;
      const title = this.titleBox;

      this.$emit('selected')
      setTimeout(() => {
        title.$emit('input', data.title);
      }, 250);

      setTimeout(() => {
        title.$emit("update:search-input", data.title);
      }, 250);

      setTimeout(() => {
        selector.$emit('input', data.text);
      }, 250);
    }
  }
}
</script>

<style scoped>

</style>
