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
            class="mr-1"
            :to="{ name: 'AdminDeptsNew' }"
            >Create Department</b-button
          >
          <b-button
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            variant="primary"
            class="mr-1"
            :to="{ name: 'AdminDeptsImport' }"
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
    >
      <template #cell(delete)="data">
        <b-button variant="danger" @click="deleteDept(data.item.dept_id)"
          >Delete <b-icon icon="trash-fill" aria-hidden="true"></b-icon
        ></b-button>
      </template>
      <template #cell(edit)="data">
        <b-button
          variant="primary"
          :to="{ name: 'AdminDeptsEdit', params: { dept_id: data.item.dept_id }}"
          >View Department Users</b-button
        >
      </template>
    </b-table>
    Total Departments: <b>{{totalItems}}</b>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "certs",
  data: function () {
    return {
      LANG_HEADER: "All Departments",
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
    deleteDept: async function (dept_id) {
      const vm = this;
      this.$parent.$swal
        .fire({
          title: `Delete this department?`,
                    customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
          html:
            "<p>Are you sure you want to delete this department?</p><br><b>This action cannot be undone.<br>This deletes certificates, awards, and user associations with the department.</b><br>",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Delete",
          reverseButtons: true,
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            axios
              .delete(`${vm.$parent.API_BASE_URL}/dept/${dept_id}`, {
                headers: {
                  Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
              })
              .then(function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error deleting the department.",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success(
                    "Successfully deleted the department.",
                    { position: "top-right" }
                  );
                }
                vm.API_depts().catch((error) => {
                  console.error(error);
                });
              })
              .catch(function (response) {
                console.error(response);
              });
          }
        });
    },
    API_depts: async function () {
      const vm = this;
      vm.isLoading = true;
      const currentPage = vm.currentPage;
      const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/dept`, {
        params: { currentPage: currentPage, limit: vm.perPage },
        headers: {
          Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
        },
      });
      if (data.data.depts == 0) {
        vm.EMTPY_TABLE = "<h3>There are no departments to show</h3>";
        vm.totalItems = 0;
        vm.items = [];
        vm.isLoading = false;
      } else {
        vm.totalItems = data.data.depts.length;
        vm.items = data.data.depts;
        vm.isLoading = false;
      }
    },
  },
  mounted: function () {
    this.API_depts().catch((error) => {
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