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
            :active="$route.name.includes('AdminDepts')"
            >Departments</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminAwards' }"
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            :active="$route.name.includes('AdminAwards')"
            >Import Awards</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminUsers' }"
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            :active="$route.name.includes('AdminUsers')"
            >Users</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminStudents' }"
            :active="$route.name.includes('AdminStudents')"
            >Students</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminEmail' }"
            :active="$route.name.includes('AdminEmail')"
            >Email Settings</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminSettings' }"
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            :active="$route.name.includes('AdminSettings')"
            >System Settings</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminPurge' }"
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            :active="$route.name.includes('AdminPurge')"
            >Purge</b-nav-item
          >
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>
export default {
  name: "AdminNav",
  methods: {
    checkAdmin: async function () {
      const vm = this;
      if (!vm.$parent.ADMINS.includes(vm.$parent.USER_INFO.role)) {
        vm.$router.push({ name: "Home" });
      }
    },
  },
  mounted: async function () {
    await this.checkAdmin();
  },
};
</script>
<style scoped>
.navbar.navbar-dark.bg-dark {
  background-color: #000000 !important;
}
</style>