<template>
  <div id="certs">
    <b-container fluid>
      <b-row>
        <b-col
          ><h1>{{ LANG_HEADER }}</h1></b-col
        >
        <b-col class="text-right"
          ><b-button
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            variant="primary"
            :to="{ path: `/admin/departments/new` }"
            >Create Department</b-button
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
    >
      <template #cell(delete)="data">
        <b-button variant="danger" @click="deleteDept(data.item.dept_id)"
          >Delete <b-icon icon="trash-fill" aria-hidden="true"></b-icon
        ></b-button>
      </template>
      <template #cell(edit)="data">
        <b-button
          variant="primary"
          :to="{ path: `/admin/departments/${data.item.dept_id}` }"
          >Edit Department</b-button
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
      LANG_HEADER: "Viewing All Departments",
      EMTPY_TABLE: "<p>Loading data...</p>",
      fields: [
        {
          key: "dept_id",
          label: "Department ID",
        },
        {
          key: "dept_name",
          label: "Department Name",
        },
        "edit",
        "delete",
      ],
      items: [],
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
    };
  },
  methods: {
    API_depts: async function () {
      const vm = this;
      vm.EMTPY_TABLE = "<h3>There are no departments to show</h3>";
      const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/dept`, {
        headers: {
          Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
        },
      });
      if (data.count == 0) {
        vm.EMTPY_TABLE = "<h3>There are no departments to show</h3>";
      }
      vm.totalItems = data.count;
      vm.items = data.data.depts;
    },
  },
  mounted: function () {
    if (this.$parent.USER_INFO.role != "ADMIN") {
      this.LANG_HEADER = "Viewing Departments You are In";
    }
    this.API_depts().catch((error) => {
      this.$parent.$toast.error(
        `There was an error getting departments. ${error}`,
        { position: "top-right" }
      );
      console.error(error);
    });
  },
  watch: {
    currentPage: {
      handler: function () {
        const vm = this;
        this.API_depts().catch((error) => {
          vm.$parent.$toast.error("There was an error getting departments.", {
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