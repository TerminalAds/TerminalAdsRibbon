<template>
    <button class="btn btn-outline-primary text-center" @click="click(data)">
        <i class="fa fa-crosshairs p-0"></i>
    </button>
</template>

<script>
export default {
    name: "useBtn",
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