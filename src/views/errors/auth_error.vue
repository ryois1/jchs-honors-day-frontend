<template>
  <div>
    <b-jumbotron header="Authentication Error">
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