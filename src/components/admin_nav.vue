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
          <b-nav-item :to="{ name: 'Admin' }" :active="$route.name == 'Admin'"
            >Admin Home</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminDepts' }"
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            :active="$route.name == 'AdminDepts'"
            >Departments</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminAwards' }"
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            :active="$route.name == 'AdminAwards'"
            >Import Awards</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminUsers' }"
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            :active="$route.name == 'AdminUsers'"
            >Users</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminStudents' }"
            :active="$route.name == 'AdminStudents'"
            >Students</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminEmail' }"
            :active="$route.name == 'AdminEmail'"
            >Email Settings</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminSettings' }"
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            :active="$route.name == 'AdminSettings'"
            >System Settings</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminPurge' }"
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            :active="$route.name == 'AdminPurge'"
            >Purge</b-nav-item
          >
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>
export default {
  name: "navbar",
  methods: {
    checkAdmin: async function () {
      const vm = this;
      if (
        this.$parent.USER_INFO.role != "ADMIN" ||
        this.$parent.USER_INFO.role != "COMMITTEE"
      ) {
        vm.$router.push({ name: "NotAdmin" });
      }
    },
  },
};
</script>
<style scoped>
.navbar.navbar-dark.bg-dark {
  background-color: #000000 !important;
}
</style>