<template>
  <div>
    <b-navbar
      v-if="$auth.isAuthenticated && this.$parent.USER_AUTHORIZED"
      toggleable="lg"
      type="dark"
      variant="dark"
    >
      <b-navbar-brand :to="{ path: '/' }">JCS Honors Day</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ path: '/' }" :active="$route.name == 'Home'"
            >Home</b-nav-item
          >
          <b-nav-item
            :to="{ path: '/departments' }"
            :active="$route.name.startsWith('Departments')"
            >Departments</b-nav-item
          >
          <b-nav-item
            :to="{ path: '/students' }"
            :active="$route.name == 'Students'"
            >Students</b-nav-item
          >
          <b-nav-item
            :to="{ path: '/admin' }"
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            :active="$route.name.startsWith('Admin')"
            >Admin</b-nav-item
          >
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown
            :text="`Hi ${this.$parent.USER_INFO.first_name}`"
            right
          >
            <b-dropdown-item @click="this.$parent.logout"
              >Sign Out</b-dropdown-item
            >
          </b-nav-item-dropdown>
          <b-nav-text
            >Your role: {{ROLE}}</b-nav-text
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
    ROLE(){
      if(this.$parent.USER_INFO.role=='ADMIN'){
        return "System Administrator";
      }else if (this.$parent.USER_INFO.role=='DEPT_ADMIN'){
        return "Department Administrator";
      }else{
        return "Teacher";
      }
    },
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