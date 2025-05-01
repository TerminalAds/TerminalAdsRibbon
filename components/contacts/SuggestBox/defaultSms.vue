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
import {userDefaultList, userDeleteListItem} from "../../../assets/js/defaultSms";
import useBtn from "./page/component/useBtn";

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
      menu: false,
      data: [],
      columns: [
        {
          label: 'ردیف',
          transform: (val) => {
            return this.rowNumber(this.data, val);
          },
        },
        {
          label: 'عنوان',
          name: 'title',
        },
        {
          label: 'متن',
          name: 'text',
          transform(row) {
            return row.data.text.substr(0, 25) + "...";
          }
        },
        {
          label: 'انتخاب',
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
        nextButton: 'بعدی',
        previousButton: 'قبلی',
        rowsPerPageText: 'تعداد در صفحه',
        noDataText: 'داده ای برای نمایش وجود ندارد',
        placeholderSearch: 'جستجو',
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

        this.$modal.success('موفقیت', result.data.message);
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