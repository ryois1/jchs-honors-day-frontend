<template>
  <div id="certs">
    <b-container fluid>
      <b-row>
        <b-col
          ><h1>{{ LANG_HEADER }}</h1></b-col
        >
        <b-col class="text-right"
          ><b-button
            v-if="
              this.$parent.USER_INFO.role == 'ADMIN' ||
              this.$parent.USER_INFO.role == 'DEPT_ADMIN'
            "
            variant="primary"
            :to="{ path: `/certificates/new` }"
            >New Parent Certificate</b-button
          ></b-col
        >
      </b-row>
    </b-container>
    <b-table
      :empty-html="EMTPY_TABLE"
      bordered
      show-empty
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
    >
      <template #cell(cert_id)="data">
        <b-button
          variant="primary"
          :to="{ path: `/certificates/${data.item.cert_id}` }"
          >View Child Certificates</b-button
        >
      </template>
    </b-table>
    <b-pagination
      size="md"
      :total-rows="totalItems"
      v-model="currentPage"
      :per-page="perPage"
    ></b-pagination>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "certs",
  data: function () {
    return {
      LANG_HEADER: "Viewing All Parent Certificates in ???",
      EMTPY_TABLE: "<p>Loading data...</p>",
      DEPT_NAME: "???",
      fields: [
        {
          key: "cert_owner_id",
          label: "Certificate Owner ID",
          thClass: "d-none",
          tdClass: "d-none",
        },
        {
          key: "cert_name",
          label: "Certificate Name",
        },
        {
          key: "user_name",
          label: "Certificate Owner",
        },
        {
          key: "user_email",
          lable: "Certificate Owner Email",
        },
        {
          key: "cert_id",
          label: "View Certificate",
        },
        {
          key: "cert_max_child",
          label: "Max Child Certificates",
        },
      ],
      items: [],
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
    };
  },
  methods: {
    API_certs: async function () {
      const vm = this;
      vm.EMTPY_TABLE = "<h3>There are no certs to show</h3>";
      const offset = vm.currentPage * vm.perPage - 10;
      const { data } = await axios.get(
        `${vm.$parent.API_BASE_URL}/dept/${vm.$route.params.dept_id}/certs`,
        {
          params: { offset: offset, limit: vm.perPage },
          headers: {
            Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
          },
        }
      );
      if (data.count == 0) {
        vm.EMTPY_TABLE = "<h3>There are no certs to show</h3>";
      }
      vm.totalItems = data.count;
      vm.items = data.data.certs;
    },
    API_dept: async function () {
      const vm = this;
      const { data } = await axios.get(
        `${vm.$parent.API_BASE_URL}/dept/${vm.$route.params.dept_id}`,
        {
          headers: {
            Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
          },
        }
      );
      vm.DEPT_NAME = data.data.depts[0].department_name;
      if (
        vm.$parent.USER_INFO.role == "ADMIN" ||
        vm.$parent.USER_INFO.role == "DEPT_ADMIN"
      ) {
        vm.LANG_HEADER = `Viewing Certificates in "${vm.DEPT_NAME}"`;
      } else {
        vm.LANG_HEADER = `Viewing Certificates You Have Access to in "${vm.DEPT_NAME}"`;
      }
    },
  },
  mounted: function () {
    this.API_dept();
    this.API_certs().catch((error) => {
      this.$parent.$toast.error(
        `There was an error getting certificates. ${error}`,
        { position: "top-right" }
      );
      console.error(error);
    });
  },
  watch: {
    currentPage: {
      handler: function () {
        const vm = this;
        this.API_certs().catch((error) => {
          vm.$parent.$toast.error("There was an error getting certificates.", {
            position: "top-right",
          });
          console.error(error);
        });
      },
    },
  },
};
</script>
<style scoped>
#certs {
  padding-top: 2em;
  padding-left: 5em;
  padding-right: 5em;
}
</style>