<template>
  <div>
    <b-jumbotron id="error_hero" header="Authentication Error">
        <h3>{{error}}</h3>
    </b-jumbotron>
  </div>
</template>
<script>
export default {
  name: "Error",
  data: function () {
    return {
      error: this.$route.query.error_description,
    };
  },
}
</script>
<style scoped>
@media (prefers-color-scheme: dark) {
  #error_hero{
    color: #ffffff;
    background-color: var(--alt-dark-bg);
  }
}
</style>