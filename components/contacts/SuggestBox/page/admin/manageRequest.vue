<template>
    <div class="mt-6">
        <v-tabs v-model="tab" align-with-title>
            <v-tab>اطلاعات</v-tab>
            <v-tab>ایجاد متن ها</v-tab>
            <v-tab>رد درخواست</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab" class="mt-5">
            <v-tab-item>
                <v-text-field
                        v-model="data.title"
                        outlined
                        label="عنوان"
                        placeholder="عنوان"
                        readonly
                        dense
                />

                <v-textarea
                        v-model="data.text"
                        label="متن پیامک"
                        outlined
                        readonly
                        dense
                        placeholder="متن پیامک"
                ></v-textarea>

                <v-textarea
                        v-model="data.description"
                        label="توضیحات"
                        outlined
                        readonly
                        dense
                        placeholder="توضیحات"
                ></v-textarea>
            </v-tab-item>

            <v-tab-item>
                <div class="mt-4">
                    <div class="row mx-auto">
                        <v-text-field type="number" v-model="count" label="تعداد"/>

                        <v-row class="mx-auto">
                            <v-btn class="btn-get-code mx-auto my-auto" style="letter-spacing: normal" @click="add">
                                افزودن {{count}} فیلد جدید
                            </v-btn>
                        </v-row>
                    </div>

                    <hr class="my-4">
                    <suggest-text v-for="(text,index) in texts" :key="index" v-model="texts[index]" label="پیام"/>

                    <v-row class="mt-5 mx-auto mb-2">
                        <v-btn class="btn-get-code" style="letter-spacing: normal" @click="submit">
                            ثبت درخواست
                        </v-btn>
                    </v-row>
                </div>
            </v-tab-item>

            <v-tab-item>
                <div class="mt-4">
                    <v-textarea  outlined
                                 dense
                                 label="توضیحات"
                                 placeholder="توضیحات"
                                 v-model="description"/>

                    <v-row class="mt-5 mx-auto mb-2">
                        <v-btn class="btn-refund" style="letter-spacing: normal" @click="refund">
                            حذف درخواست
                        </v-btn>
                    </v-row>
                </div>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
import {adminGenerateDefaultList, adminRejectDefaultList} from "../../../../../Utilities/defaultSms";
import SuggestText from "../../suggestInput";

export default {
    name: "manageRequest",
    components: {SuggestText},
    props: {
        data: {
            require: true
        },
        model: {
            require: true
        }
    },
    data() {
        return {
            tab: null,
            texts: [],
            description: '',
            count:0,
        }
    },
    methods: {
        submit() {
            adminGenerateDefaultList(this.data.id, {
                texts: this.texts.filter(text => text !== ''),
                type: 'generate',
            }).then(response => {
                this.texts = [''];

                this.$modal.success('موفقیت', response.data.message);

                this.model();
            });
        },
        refund() {
            adminRejectDefaultList(this.data.id, {
                detail: this.description
            }).then(response => {
                this.description = '';

                this.$modal.success('موفقیت', response.data.message);

                this.model();
            });
        },
        add(){
            for(let i=0;i<this.count;i++)
                this.texts.push('');
        }
    },
    watch: {
        selectedOption(value) {
            if (value !== 'درخواست مشاوره متن')
                this.description = undefined;
        },
    }
}
</script>

<style scoped>

</style>