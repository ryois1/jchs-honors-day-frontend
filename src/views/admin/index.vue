<template>
  <div>
    <b-jumbotron id="admin_hero" v-if="$auth.isAuthenticated && this.$parent.USER_AUTHORIZED">
      <template #header>{{ LANG_WELCOME }}</template>
      <hr class="my-4" />
      <h4>Quick Actions</h4>
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
        <h3><b-card-text>{{ ADMIN_STATUS.awards.total }}</b-card-text></h3>
      </b-card>
      <b-card bg-variant="dark" text-variant="white" header="Total Certificates" class="text-center">
        <h3><b-card-text>{{ ADMIN_STATUS.certificates.current }}</b-card-text></h3>
        <p>Used certificates out of {{ADMIN_STATUS.certificates.maximum}}:</p>
        <b-progress show-value v-b-tooltip.hover title="Used certificates (Currently Used/Maximum Available)" :value="ADMIN_STATUS.certificates.current" :max="ADMIN_STATUS.certificates.maximum" variant="info" striped animated="true" class="mt-2"></b-progress>
      </b-card>
      <b-card bg-variant="dark" text-variant="white" header="Total Students" class="text-center">
        <h3><b-card-text>{{ ADMIN_STATUS.students.total }}</b-card-text></h3>
        <p>Students with Awards:</p>
        <b-progress show-value v-b-tooltip.hover title="Students with an award (Students with Awards/Total Students)" :value="ADMIN_STATUS.students.withAwards" :max="ADMIN_STATUS.students.total" variant="info" striped animated="true" class="mt-2"></b-progress>
      </b-card>
      <b-card bg-variant="dark" text-variant="white" header="Total Users" class="text-center">
        <h3><b-card-text>{{ ADMIN_STATUS.users.total }}</b-card-text></h3>
      </b-card>
      <b-card bg-variant="dark" text-variant="white" header="Total Departments" class="text-center">
        <h3><b-card-text>{{ ADMIN_STATUS.departments.total }}</b-card-text></h3>
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
      ADMIN_STATUS: {},
      LANG_WELCOME: `Admin Home`
    };
  },
  methods: {
  API_admin_status: async function () {
      const vm = this;
      vm.isLoading = true;
      const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/admin/status`, {
        headers: {
          Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
        },
      });
      vm.ADMIN_STATUS = data.data;
    },
  },
    mounted: function () {
    this.API_admin_status().catch((error) => {
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