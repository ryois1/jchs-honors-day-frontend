<template>
  <div>
    <b-jumbotron header="Connection to API lost" lead="Error communicating to the server! (This system is only accessible on the JCBOE network)">
      <b-button variant="primary" @click="window.location.reload()">Refresh</b-button>
    </b-jumbotron>
  </div>
</template>