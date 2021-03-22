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
            :to="{ path: `/admin/users/new` }"
            >New User</b-button
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
      <template #cell(change_role)="data">
        <b-button variant="warning" @click="changeRole(data.item.id)"
          >Change User Role</b-button
        >
      </template>
      <template #cell(delete)="data">
        <b-button variant="danger" @click="deleteUser(data.item.id)"
          >Delete <b-icon icon="trash-fill" aria-hidden="true"></b-icon
        ></b-button>
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
      LANG_HEADER: "Viewing All Users",
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
        "change_role",
        "delete",
      ],
      items: [],
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
    };
  },
  methods: {
    changeRole: async function (user_id) {
      const vm = this;
      await this.$parent.$swal
        .fire({
          title: `Select New Role for User`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Change",
          reverseButtons: true,
          input: "select",
          inputPlaceholder: "Select a role",
          inputOptions: {
            TEACHER: "Teacher",
            DEPT_ADMIN: "Department Administrator",
            ADMIN: "System Administrator",
          },
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            const data = {
              users: [{ user_role: result.value, user_id: user_id }],
            };
            console.log(data);
            axios({
              method: "put",
              url: `${vm.$parent.API_BASE_URL}/users`,
              data: data,
              headers: {
                Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
              },
            })
              .then(function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error modifying the user.",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success("Successfully modified the user.", {
                    position: "top-right",
                  });
                  vm.API_users().catch((error) => {
                    vm.$parent.$toast.error(
                      "There was an error getting users.",
                      { position: "top-right" }
                    );
                    console.error(error);
                  });
                }
              })
              .catch(function (response) {
                vm.$parent.$toast.error(
                  "There was an error modifying the user.",
                  { position: "top-right" }
                );
                console.error(response);
              });
          }
        });
    },
    deleteUser: async function (cert_id) {
      const vm = this;
      this.$parent.$swal
        .fire({
          title: `Delete this user?`,
          html:
            '<p>Are you sure you want to delete this user?</p><br><b>This action cannot be undone.<br>This DELETES certificates owned by the user.</b><br><i>Type "DELETE" below</i>',
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Delete",
          reverseButtons: true,
          input: "text",
          inputAttributes: {
            id: "confirmDelete",
          },
          inputValidator: (value) => {
            if (value != "DELETE") {
              return '<span>You must type in <b class="text-danger">DELETE</b> to delete.</span>';
            }
          },
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            axios
              .delete(`${vm.$parent.API_BASE_URL}/users/${cert_id}`, {
                headers: {
                  Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
              })
              .then(function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error deleting the user.",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success("Successfully deleted the user.", {
                    position: "top-right",
                  });
                  vm.API_users().catch((error) => {
                    vm.$parent.$toast.error(
                      "There was an error getting users.",
                      { position: "top-right" }
                    );
                    console.error(error);
                  });
                }
              })
              .catch(function (response) {
                vm.$parent.$toast.error(
                  "There was an error deleting the user.",
                  { position: "top-right" }
                );
                console.error(response);
              });
          }
        });
    },
    API_users: async function () {
      const vm = this;
      vm.EMTPY_TABLE = "<h3>There are no certs to show</h3>";
      const offset = vm.currentPage * vm.perPage - 10;
      const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/users`, {
        params: { offset: offset, limit: vm.perPage },
        headers: {
          Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
        },
      });
      if (data.count == 0) {
        vm.EMTPY_TABLE = "<h3>There are no certs to show</h3>";
      }
      vm.totalItems = data.count;
      vm.items = data.data.users;
    },
  },
  mounted: function () {
    this.API_users().catch((error) => {
      this.$parent.$toast.error(`There was an error getting users. ${error}`, {
        position: "top-right",
      });
      console.error(error);
    });
  },
  watch: {
    currentPage: {
      handler: function () {
        const vm = this;
        this.API_users().catch((error) => {
          vm.$parent.$toast.error("There was an error getting users.", {
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