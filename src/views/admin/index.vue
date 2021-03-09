<template>
    <div>
        <b-jumbotron v-if="$auth.isAuthenticated && this.$parent.USER_AUTHORIZED">
            <template #header>{{ LANG_WELCOME }}</template>
            <hr class="my-4">
        </b-jumbotron>
    </div>
</template>
<script>
export default {
    name: "homepage",
    data: function () {
        return {
            LANG_WELCOME: `Admin Settings`,
        };
    },
};
</script>
<style scoped>
</style>