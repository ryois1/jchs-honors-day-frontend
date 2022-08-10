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
      <b-button
        class="mr-1"
        v-if="this.$parent.USER_INFO.role == 'ADMIN'"
        variant="primary"
        @click="downloadCTEReport"
        ><b-icon icon="file-earmark"></b-icon> Download State CTE Report</b-button
      > 
    </b-jumbotron>
    <b-container fluid>
    <b-card-group deck>
      <b-card bg-variant="dark" text-variant="white" header="Total Awards" class="text-center">
        <h3><b-card-text>{{ ADMIN_STATUS.awards.total }}</b-card-text></h3>
        <div id="departmentAwardsDrilldown">
          <p>Awards by Department:</p>
          <apexchart type="donut" :options="departmentAwardsDrilldownOptions" :series="departmentAwardsDrilldownData"></apexchart>
        </div>
      </b-card>
      <b-card bg-variant="dark" text-variant="white" header="Total Certificates" class="text-center">
        <h3><b-card-text>{{ ADMIN_STATUS.certificates.current }}</b-card-text></h3>
        <p>Used certificates out of {{ADMIN_STATUS.certificates.maximum}}:</p>
        <apexchart type="donut" :options="certificatesOptions" :series="certificatesData"></apexchart>
      </b-card>
      <b-card bg-variant="dark" text-variant="white" header="Total Students" class="text-center">
        <h3><b-card-text>{{ ADMIN_STATUS.students.total }}</b-card-text></h3>
        <p>Students with Awards:</p>
        <apexchart type="donut" :options="studentsOptions" :series="studentsData"></apexchart>
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
      LANG_WELCOME: `Admin Home`,
      departmentAwardsDrilldownData: [],
      departmentAwardsDrilldownOptions: {
        labels: [],
        chart: {
          type: 'donut',
        },
        legend: {
          show: false,
        }
      },
      certificatesData: [],
      certificatesOptions: {
        labels: ['Used', '2200 Average'],
        chart: {
          type: 'donut',
        },
        legend: {
          show: false,
        }
      },
      studentsData: [],
      studentsOptions: {
        labels: ['Students with Awards', 'Students without Awards'],
        chart: {
          type: 'donut',
        },
        legend: {
          show: false,
        }
      },
    };
  },
  methods: {
    downloadCTEReport: async function () {
      const vm = this;
      axios
        .get(`${vm.$parent.API_BASE_URL}/state_reporting/all_attempts`, {
          headers: {
            Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
          },
        })
        .then(function (response) {
          if (response.data.error) {
            console.error(response);
            vm.$parent.$toast.error("There was an error downloading the CSV.", {
              position: "top-right",
            });
          } else {
            let blob = new Blob([response.data.data.csv], {
                type: "application/octet-stream",
              }),
              url = window.URL.createObjectURL(blob);
            let tempLink = document.createElement("a");
            tempLink.style.display = "none";
            tempLink.href = url;
            tempLink.setAttribute("download", response.data.data.file_name);
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(url);
            vm.$parent.$toast.success("Successfully downloaded the CSV.", {
              position: "top-right",
            });
            vm.nextDisabled = false;
            vm.nextTooltip = "Go to next step";
          }
        })
        .catch(function (response) {
          vm.$parent.$toast.error("There was an error downloading the CSV.", {
            position: "top-right",
          });
          console.error(response);
        });
    },
  API_admin_status: async function () {
      const vm = this;
      vm.isLoading = true;
      const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/admin/status`, {
        headers: {
          Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
        },
      });
      vm.ADMIN_STATUS = data.data;
      vm.departmentAwardsDrilldownOptions.labels = data.data.awards.drilldown.departments;
      vm.departmentAwardsDrilldownData = data.data.awards.drilldown.amount;
      vm.certificatesData = [data.data.certificates.current, data.data.certificates.maximum-data.data.certificates.current];
      vm.studentsData = [data.data.students.withAwards, data.data.students.total-data.data.students.withAwards];
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
.apexcharts-legend-text{
  color: #ffffff !important;
  fill: white !important;
}
</style>