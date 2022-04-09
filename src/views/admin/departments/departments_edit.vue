<template>
  <div id="certs">
    <b-container fluid>
      <goBack target="AdminDepts"></goBack>
      <b-row>
        <b-col
          ><h1>{{ LANG_HEADER }}</h1></b-col
        >
        <b-col class="text-right"
          ><b-button
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            variant="primary"
            :to="{
              name: 'AdminDeptsAdd', params: { dept_id: this.$route.params.dept_id }
            }"
            >Add Existing User to Department</b-button
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
      <template #cell(role)="data">
        <p v-if="data.item.role=='ADMIN'">System Administrator</p>
        <p v-if="data.item.role=='COMMITTEE'">Honors Day Committee</p>
        <p v-if="data.item.role=='DEPT_ADMIN'">Department Chair</p>
        <p v-if="data.item.role=='TEACHER'">Teacher</p>
      </template>
      <template #cell(actions)="data">
        <b-button variant="danger" @click="deleteUser(data.item.id)"
          ><b-icon icon="trash-fill" aria-hidden="true"></b-icon> Delete</b-button>
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
import goBack from '../../../components/global/go_back.vue'
export default {
  components: {
    goBack
  },
  name: "certs",
  data: function () {
    return {
      LANG_HEADER: "Users in Department ???",
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
          label: "Email",
        },
        {
          key: "role",
          label: "Role",
        },
        "actions",
      ],
      items: [],
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
    };
  },
  methods: {
    deleteUser: async function (user_id) {
      const vm = this;
      this.$parent.$swal
        .fire({
          title: `Remove this user?`,
                    customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
          html:
            "<p>Are you sure you want to remove this user from the department?</p><br><b>THIS DOES NOT DELETE USERS, use Admin > Users<br>This DOES NOT delete certificates.</b><br>",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Delete",
          reverseButtons: true,
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            axios
              .delete(
                `${vm.$parent.API_BASE_URL}/dept/${vm.$route.params.dept_id}/users/${user_id}`,
                {
                  headers: {
                    Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                  },
                }
              )
              .then(function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error removing the user.",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success("Successfully removing the user.", {
                    position: "top-right",
                  });
                  vm.API_users().catch((error) => {
                    console.error(error);
                  });
                }
              })
              .catch(function (response) {
                vm.$parent.$toast.error(
                  "There was an error removing the user.",
                  { position: "top-right" }
                );
                console.error(response);
              });
          }
        });
    },
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
      vm.LANG_HEADER = `Users in "${data.data.depts[0].department_name}"`;
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