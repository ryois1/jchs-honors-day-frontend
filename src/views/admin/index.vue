<template>
  <div>
    <b-jumbotron v-if="$auth.isAuthenticated && this.$parent.USER_AUTHORIZED">
      <template #header>{{ LANG_WELCOME }}</template>
      <hr class="my-4" />
      <b-button
        v-if="this.$parent.USER_INFO.role == 'ADMIN'"
        variant="primary"
        :to="{ name: 'ImportCertsPDFsPreCheck' }"
        >Import PDFs</b-button
      >
    </b-jumbotron>
  </div>
</template>
<script>
export default {
  name: "homepage",
  data: function () {
    return {
      LANG_WELCOME: `Admin`,
    };
  },
};
</script>
<style scoped>
</style>