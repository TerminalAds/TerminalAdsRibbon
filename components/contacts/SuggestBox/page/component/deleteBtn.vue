<template>
    <button class="btn btn-outline-danger text-center" @click="click(data)">
        <i class="fa fa-trash p-0"></i>
    </button>
</template>

<script>
export default {
    name: "deleteBtn",
    props: {
        data: {},
        name: {},
        click: {
            type: Function,
            default: () => {
            }
        }
    }
}
</script>

<style scoped>

</style>