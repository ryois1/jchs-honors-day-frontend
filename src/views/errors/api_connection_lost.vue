<template>
  <div>
    <b-jumbotron id="error_hero" header="Connection to API lost" lead="Error communicating to the server! (This system is only accessible on the JCBOE network)">
      <b-button variant="primary" @click="window.location.reload()">Refresh</b-button>
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