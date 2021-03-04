<template>
  <div>
    <b-navbar v-if="$auth.isAuthenticated && this.$parent.USER_AUTHORIZED" toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand :to="{ path: '/' }">JCS Honors Day</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ path: '/' }" :active="$route.name == 'Home'">Home</b-nav-item>
          <b-nav-item :to="{ path: '/certificates' }" :active="$route.name.startsWith('Certificate')">Certificates</b-nav-item>
          <b-nav-item :to="{ path: '/students' }" :active="$route.name == 'Students'">Students</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item @click="this.$parent.logout">Sign Out</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>
export default {
  name: "navbar",
  computed: {
    routes() {
      return this.$router.options.routes;
    },
  },
};
</script>
<style scoped>
.navbar.navbar-dark.bg-dark {
  background-color: #000000 !important;
}
</style>