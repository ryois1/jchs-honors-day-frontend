<template>
  <div>
    <b-jumbotron id="home_hero" v-if="$auth.isAuthenticated && this.$parent.USER_AUTHORIZED">
      <template #header>{{ LANG_WELCOME }}</template>
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
@media (prefers-color-scheme: dark) {
  #home_hero{
    color: #ffffff;
    background-color: var(--alt-dark-bg);
  }
}
</style>