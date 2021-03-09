<template>
  <div>
    <b-jumbotron v-if="$auth.isAuthenticated && this.$parent.USER_AUTHORIZED">
      <template #header>{{ LANG_WELCOME }}</template>
      <hr class="my-4" />
      <b-button variant="primary" :to="{ path: `/departments` }"
        >Certificates</b-button
      >
      <b-button variant="success" :to="{ path: `/students` }"
        >Students</b-button
      >
    </b-jumbotron>
  </div>
</template>
<script>
export default {
  name: "homepage",
  data: function () {
    return {
      LANG_WELCOME: `Hello, ${this.$parent.USER_INFO.first_name}`,
    };
  },
  mounted: function () {
    if (!this.$parent.USER_INFO.first_name) {
      this.$forceUpdate();
    }
  },
};
</script>
<style scoped>
</style>