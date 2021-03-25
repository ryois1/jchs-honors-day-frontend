<template>
  <div>
    <b-jumbotron header="Connection to API lost (This system is only accessible on the JCBOE network)" lead="Error communicating to the server!">
      <b-button variant="primary" @click="window.location.reload()">Refresh</b-button>
    </b-jumbotron>
  </div>
</template>