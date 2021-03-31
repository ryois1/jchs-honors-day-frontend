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
    >
      <template #cell(view)="data">
        <b-button
          variant="primary"
          :to="{name: 'DepartmentsCertificates', params: { dept_id: data.item.dept_id }}"
          >View Department Awards</b-button
        >
      </template>
    </b-table>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "certs",
  data: function () {
    return {
      LANG_HEADER: "Viewing Departments",
      EMTPY_TABLE: "<p>Loading data...</p>",
      fields: [
        {
          key: "dept_id",
          label: "Department ID",
          thClass: "d-none",
          tdClass: "d-none",
        },
        {
          key: "dept_name",
          label: "Department Name",
        },
        "view",
      ],
      items: [],
    };
  },
  methods: {
    API_depts: async function () {
      const vm = this;
      const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/dept`, {
        headers: {
          Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
        },
      });
      if (data.data.depts.length == 0) {
        vm.EMTPY_TABLE = "<h3>There are no departments to show</h3>";
      }
      vm.totalItems = data.count;
      vm.items = data.data.depts;
    },
  },
  mounted: function () {
    const vm = this;
    if (vm.$parent.ADMINS.includes(vm.$parent.USER_INFO.role)) {
      vm.LANG_HEADER = "Viewing Departments";
    }
    vm.API_depts().catch((error) => {
      console.error(error);
    });
  },
  watch: {
    currentPage: {
      handler: function () {
        this.API_depts().catch((error) => {
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