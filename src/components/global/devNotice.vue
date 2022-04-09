<template>
    <div id="devNotice">
        <p><b-icon icon="exclamation-triangle"></b-icon> You are accessing this site in development mode. API calls are made to the dev API. No live user data should be used. <b-icon icon="exclamation-triangle"></b-icon></p>
    </div>
</template>
<script>
export default {
    name: "devNotice"
}
</script>
<style scoped>
    #devNotice{
        width: 100%;
        height: 25px;
        text-align: center;
        color: #000000;
        background-color: #ffff00;
    }
</style>