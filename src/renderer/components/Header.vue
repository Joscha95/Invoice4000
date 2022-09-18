<template>
    <header>
        <span @click="$emit('click','invoice:new')" >New Invoice</span>
        <span @click="$emit('click','settings')" >Settings</span>
        <span @click="$emit('click','client:delete')" >Delete Client</span>
        <span @click="$emit('click','client:add')" >Add Client</span>
    </header>
</template>

<script>
    export default {
        emits:['click']
    }
</script>

<style scoped>
    header span{
        padding: .5em;
        display: inline-block;
        cursor: pointer;
    }

    header{
        user-select: none;
        font-size: var(--fs2);
        border-bottom: 1px solid rgb(60, 60, 60);
        grid-area: header;
    }
</style>