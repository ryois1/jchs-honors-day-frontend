<template>
  <div id="certs">
    <b-container fluid>
      <b-row>
        <b-col
          ><h1>{{ LANG_HEADER }}</h1></b-col
        >
      </b-row>
    </b-container>
    <b-alert v-if="this.totalItems == 0" show variant="warning">There are no departments to show</b-alert>
    <b-card-group columns >
      <b-card 
        v-for="(item) in items" :key="item.dept_id"
        :title="item.dept_name"
        border-variant="secondary"
        class="cards"
      >
        <b-button :to="{name: 'DepartmentsCertificates', params: { dept_id: item.dept_id }}" variant="primary">Go to Department</b-button>
      </b-card>
    </b-card-group>
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
      totalItems: 0,
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