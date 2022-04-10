<template>
  <div>
    <b-jumbotron id="admin_hero" v-if="$auth.isAuthenticated && this.$parent.USER_AUTHORIZED">
      <template #header>{{ LANG_WELCOME }}</template>
      <hr class="my-4" />
      <b-button
        class="mr-1"
        v-if="this.$parent.USER_INFO.role == 'ADMIN'"
        variant="primary"
        :to="{ name: 'ImportCertsPDFsPreCheck' }"
        ><b-icon icon="file-earmark-medical"></b-icon> Import PDFs</b-button
      > 
      <b-button
        class="mr-1"
        v-if="this.$parent.USER_INFO.role == 'ADMIN'"
        variant="primary"
        :to="{ name: 'AdminSendEmailsPrecheck' }"
        ><b-icon icon="envelope"></b-icon> Send Emails</b-button
      > 
      <b-button
        class="mr-1"
        v-if="this.$parent.USER_INFO.role == 'ADMIN'"
        variant="primary"
        :to="{ name: 'AdminStudentsImport' }"
        ><b-icon icon="people"></b-icon> Import Students</b-button
      >
      <b-button
        class="mr-1"
        v-if="this.$parent.USER_INFO.role == 'ADMIN'"
        variant="primary"
        :to="{ name: 'AdminUsersImport' }"
        ><b-icon icon="people-fill"></b-icon> Import Users</b-button
      >
    </b-jumbotron>
    <b-container fluid>
    <b-card-group deck>
      <b-card bg-variant="dark" text-variant="white" header="Total Awards" class="text-center">
        <h3><b-card-text>{{awardsTotal}}</b-card-text></h3>
      </b-card>
      <b-card bg-variant="dark" text-variant="white" header="Total Certificates" class="text-center">
        <h3><b-card-text>{{certsTotal}}</b-card-text></h3>
      </b-card>
      <b-card bg-variant="dark" text-variant="white" header="Total Students" class="text-center">
        <h3><b-card-text>{{studentsTotal}}</b-card-text></h3>
      </b-card>
      <b-card bg-variant="dark" text-variant="white" header="Total Users" class="text-center">
        <h3><b-card-text>{{usersTotal}}</b-card-text></h3>
      </b-card>
    </b-card-group>
    </b-container>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "homepage",
  data: function () {
    return {
      LANG_WELCOME: `Admin Home`,
      awardsTotal: 0,
      studentsTotal: 0,
      usersTotal: 0,
      certsTotal: 0,
    };
  },
  methods: {
  API_awards: async function () {
      const vm = this;
      vm.isLoading = true;
      const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/certs`, {
        headers: {
          Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
        },
      });
      if (data.data.certs.length == 0) {
        vm.awardsTotal = 0;
        vm.isLoading = false;
      } else {
        vm.awardsTotal = data.data.certs.length;
        vm.isLoading = false;
      }
    },

  API_students: async function () {
      const vm = this;
      vm.isLoading = true;
      const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/students`, {
        headers: {
          Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
        },
      });
      if (data.data.students.length == 0) {
        vm.studentsTotal = 0;
        vm.isLoading = false;
      } else {
        vm.studentsTotal = data.data.students.length;
        vm.isLoading = false;
      }
    },

  API_users: async function () {
      const vm = this;
      vm.isLoading = true;
      const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
        },
      });
      if (data.data.users.length == 0) {
        vm.usersTotal = 0;
        vm.isLoading = false;
      } else {
        vm.usersTotal = data.data.users.length;
        vm.isLoading = false;
      }
    },

    API_certs: async function () {
      const vm = this;
      vm.isLoading = true;
      const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/all_certs`, {
        headers: {
          Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
        },
      });
      if (data.error) {
        vm.certsTotal = 0;
        vm.isLoading = false;
      } else {
        vm.certsTotal = data.data.length;
        vm.isLoading = false;
      }
    },
  },
    mounted: function () {
    this.API_certs().catch((error) => {
      console.error(error);
    });
    this.API_students().catch((error) => {
      console.error(error);
    });
    this.API_users().catch((error) => {
      console.error(error);
    });
    this.API_awards().catch((error) => {
      console.error(error);
    });
  },
};
</script>
<style scoped>
@media (prefers-color-scheme: dark) {
  #admin_hero{
    color: #ffffff;
    background-color: var(--alt-dark-bg);
  }
}
</style>