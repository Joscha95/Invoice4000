<template>
    <header>
        <span @click="$emit('click','invoice:new')" >New Invoice</span>
    </header>
</template>

<script>
    export default {
        emits:['click']
    }
</script>

<style scoped>

    header{
        user-select: none;
        font-size: var(--fs2);
        border-bottom: 1px solid rgb(60, 60, 60);
        grid-area: header;
    }
</style>