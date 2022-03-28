<template>
  <div>
    <b-navbar
      v-if="$auth.isAuthenticated && this.$parent.USER_AUTHORIZED"
      toggleable="lg"
      type="dark"
      variant="dark"
    >
      <b-navbar-brand :to="{ name: 'Home' }"><b-img-lazy src="https://awards.jchsprojects.com/static/jchs_patriots_logo_web.png" width="30" height="30" alt="JCHS Patriots Mascot" class="d-inline-block align-top"></b-img-lazy> JCHS Awards Portal</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item
            :to="{ name: 'Home' }" 
            :active="$route.name == 'Home'"
            >Home</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'Departments'}"
            :active="$route.name.includes('Departments') || $route.name.includes('Certificate')"
            >Departments</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'Admin' }"
            v-if="
              this.$parent.USER_INFO.role == 'ADMIN' ||
              this.$parent.USER_INFO.role == 'COMMITTEE'
            "
            :active="$route.name.includes('Admin')"
            >Admin</b-nav-item
          >
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown
            right
          >
            <template slot="button-content">
              <b-icon icon="person-circle"></b-icon> <em>{{this.$parent.USER_INFO.first_name + " " + this.$parent.USER_INFO.last_name}}</em>
            </template>
            <b-dropdown-item @click="this.$parent.logout"
              >Sign Out</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>
export default {
  name: "GlobalNav",
};
</script>
<style scoped>
.navbar.navbar-dark.bg-dark {
  background-color: #2E3191 !important;
}
</style>