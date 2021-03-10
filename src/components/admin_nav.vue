<template>
  <div>
    <b-navbar
      v-if="$auth.isAuthenticated && this.$parent.USER_AUTHORIZED"
      toggleable="lg"
      type="dark"
      variant="dark"
    >
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ path: '/admin' }" :active="$route.name == 'Admin'"
            >Admin Home</b-nav-item
          >
          <b-nav-item
            :to="{ path: '/admin/departments' }"
            :active="$route.name=='AdminDepts'"
            >Departments</b-nav-item
          >
          <b-nav-item
            :to="{ path: '/admin/users' }"
            :active="$route.name=='AdminUsers'"
            >Users</b-nav-item
          >
          <b-nav-item
            :to="{ path: '/admin/settings/email' }"
            :active="$route.name=='AdminEmail'"
            >Email Settings</b-nav-item
          >
          <b-nav-item
            :to="{ path: '/admin/settings' }"
            :active="$route.name=='AdminSettings'"
            >System Settings</b-nav-item
          >
          <b-nav-item
            :to="{ path: '/admin/students' }"
            :active="$route.name == 'Students'"
            >Students</b-nav-item
          >
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