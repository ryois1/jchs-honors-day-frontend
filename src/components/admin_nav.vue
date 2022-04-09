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
      <b-navbar-brand :to="{ name: 'Home' }"><b-img-lazy src="https://awards.jchsprojects.com/static/jchs_patriots_logo_web.png" width="30" height="30" alt="JCHS Patriots Mascot" class="d-inline-block align-top"></b-img-lazy> JCHS Awards Portal Admin</b-navbar-brand>
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'Admin' }" :active="$route.name == 'Admin'"
            ><b-iconstack><b-icon stacked icon="house"></b-icon><b-icon stacked scale="0.5" shift-v="-1" icon="gear-fill" aria-hidden="true"></b-icon></b-iconstack> Home</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminDepts' }"
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            :active="$route.name.includes('AdminDepts')"
            ><b-icon icon="grid"></b-icon> Departments</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminAwards' }"
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            :active="$route.name.includes('AdminAwards')"
            ><b-icon icon="file-earmark-arrow-up" aria-hidden="true"></b-icon> Import Awards</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminUsers' }"
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            :active="$route.name.includes('AdminUsers')"
            ><b-icon icon="people-fill" aria-hidden="true"></b-icon> Users</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminStudents' }"
            :active="$route.name.includes('AdminStudents')"
            ><b-icon icon="people" aria-hidden="true"></b-icon> Students</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminEmail' }"
            :active="$route.name.includes('AdminEmail')"
            ><b-icon icon="envelope" aria-hidden="true"></b-icon> Email Settings</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminSettings' }"
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            :active="$route.name.includes('AdminSettings')"
            ><b-icon icon="gear-fill" aria-hidden="true"></b-icon> System Settings</b-nav-item
          >
          <b-nav-item
            :to="{ name: 'AdminPurge' }"
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            :active="$route.name.includes('AdminPurge')"
            ><b-icon icon="trash-fill" aria-hidden="true"></b-icon> Purge</b-nav-item
          >
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-button right variant="danger" @click="exitAdmin">Exit Admin</b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>
export default {
  name: "AdminNav",
  methods: {
    exitAdmin() {
      this.$router.push({ name: "Home" });
    },
    checkAdmin: async function () {
      const vm = this;
      if (vm.$parent.USER_INFO.role == 'DEPT_ADMIN' || (!vm.$parent.ADMINS.includes(vm.$parent.USER_INFO.role))) {
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