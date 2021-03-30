<template>
  <div id="certs">
    <b-container fluid>
      <b-row>
        <b-col
          ><h1>{{ LANG_HEADER }}</h1></b-col
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
      <template #cell(role)="data">
        <p v-if="data.item.role=='ADMIN'">System Administrator</p>
        <p v-if="data.item.role=='COMMITTEE'">Honors Day Committee</p>
        <p v-if="data.item.role=='DEPT_ADMIN'">Department Chair</p>
        <p v-if="data.item.role=='TEACHER'">Teacher</p>
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
      LANG_HEADER: "Viewing All Users in Department ???",
      EMTPY_TABLE: "<p>Loading data...</p>",
      fields: [
        {
          key: "id",
          label: "User ID",
          thClass: "d-none",
          tdClass: "d-none",
        },
        {
          key: "first_name",
          label: "First Name",
        },
        {
          key: "last_name",
          label: "Last Name",
        },
        {
          key: "email",
          lable: "Email",
        },
        {
          key: "role",
          label: "Role",
        },
      ],
      items: [],
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
    };
  },
  methods: {
    API_users: async function () {
      const vm = this;
      const offset = vm.currentPage * vm.perPage - 10;
      const { data } = await axios.get(
        `${vm.$parent.API_BASE_URL}/dept/${vm.$route.params.dept_id}/users`,
        {
          params: { offset: offset, limit: vm.perPage },
          headers: {
            Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
          },
        }
      );
      if (data.data.users == 0) {
        vm.EMTPY_TABLE = "<h3>There are no users to show</h3>";
      }
      vm.totalItems = data.count;
      vm.items = data.data.users;
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
      vm.LANG_HEADER = `Viewing Users in "${data.data.depts[0].department_name}"`;
    },
  },
  mounted: function () {
    this.API_dept();
    this.API_users().catch((error) => {
      console.error(error);
    });
  },
  watch: {
    currentPage: {
      handler: function () {
        this.API_users().catch((error) => {
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