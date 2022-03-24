<template>
  <div>
    <b-jumbotron id="error_hero" header="Error 403" lead="Unknown User">
      <b-button variant="primary" @click="this.$parent.logout">Logout</b-button>
    </b-jumbotron>
  </div>
</template>
<style scoped>
@media (prefers-color-scheme: dark) {
  #error_hero{
    color: #ffffff;
    background-color: var(--alt-dark-bg);
  }
}
</style>