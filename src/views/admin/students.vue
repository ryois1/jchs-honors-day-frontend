<template>
  <div id="students">
    <b-container fluid>
      <b-row>
        <b-col><h1>Viewing All Students</h1></b-col>
        <b-col class="text-right">
          <b-button
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            variant="primary"
            class="mr-1"
            :to="{ path: `/admin/students/import` }"
            >Bulk Import</b-button
          >
        </b-col>
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
    ></b-table>
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
  name: "students",
  data: function () {
    return {
      EMTPY_TABLE: "<p>Loading data...</p>",
      fields: [
        {
          key: "id",
          label: "Student ID",
        },
        {
          key: "first_name",
          label: "First Name",
        },
        {
          key: "middle_name",
          label: "Middle Name",
        },
        {
          key: "last_name",
          label: "Last Name",
        },
        {
          key: "yog",
          label: "Year of Grad.",
        },
        {
          key: "email",
          lable: "Email",
        },
        {
          key: "homeroom",
          label: "Homeroom",
        },
      ],
      items: [],
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
    };
  },
  methods: {
    API_students: async function () {
      const vm = this;
      vm.isLoading = true;
      const offset = vm.currentPage * vm.perPage - 10;
      let authToken = vm.$parent.JWT_TOKEN;
      if ((await authToken) == null) {
        await this.getAuthToken();
        const { data } = await axios.get(
          `${vm.$parent.API_BASE_URL}/students`,
          {
            params: { offset: offset, limit: vm.perPage },
            headers: {
              Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
            },
          }
        );
        if (data.data.students == 0) {
          vm.isLoading = false;
          vm.EMTPY_TABLE = "<h3>There are no students to show</h3>";
        }
        vm.isLoading = false;
        vm.totalItems = data.count;
        vm.items = data.data.students;
      } else {
        const { data } = await axios.get(
          `${vm.$parent.API_BASE_URL}/students`,
          {
            params: { offset: offset, limit: vm.perPage },
            headers: {
              Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
            },
          }
        );
        if (data.data.students == 0) {
          vm.isLoading = false;
          vm.EMTPY_TABLE = "<h3>There are no students to show</h3>";
        }
        vm.totalItems = data.count;
        vm.items = data.data.students;
        vm.isLoading = false;
      }
    },
  },
  mounted: function () {
    this.API_students();
  },
  watch: {
    currentPage: {
      handler: function () {
        this.API_students();
      },
    },
  },
};
</script>
<style scoped>
#students {
  padding-top: 2em;
  padding-left: 5em;
  padding-right: 5em;
  width: 100%;
}
</style>