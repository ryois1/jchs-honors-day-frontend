<template>
  <div id="newuser">
    <b-container fluid>
      <b-row>
        <b-col><h1>Creating New Users</h1></b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-card bg-variant="light">
            <b-form @submit.prevent="processForm">
              <b-form-group
                id="user_first_name-group"
                label="User First Name:"
                label-for="user_first_name"
              >
                <b-form-input
                  ref="top"
                  id="user_first_name"
                  v-model="user_first_name"
                  type="text"
                  placeholder="First Name"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="user_last_name-group"
                label="User Last Name:"
                label-for="user_last_name"
              >
                <b-form-input
                  id="user_last_name"
                  v-model="user_last_name"
                  type="text"
                  placeholder="Last Name"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="user_email-group"
                label="User Email:"
                label-for="user_email"
              >
                <b-form-input
                  id="user_email"
                  v-model="user_email"
                  type="email"
                  placeholder="Email"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="user_role-group"
                label="User Role:"
                label-for="user_role"
              >
                <b-form-select
                  v-model="user_role"
                  :options="user_role_options"
                ></b-form-select>
              </b-form-group>
              <b-button type="submit" variant="primary">Submit</b-button>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "new_parent_cert",
  data: function () {
    return {
      STATUS_TEXT: "Please input user data",
      RESULT: null,
      user_first_name: null,
      user_last_name: null,
      user_email: null,
      user_role: null,
      user_role_options: [
        { text: "Select Role", disabled: true },
        { value: "ADMIN", text: "System Admin" },
        { value: "TEACHER", text: "Teacher" },
        { value: "DEPT_ADMIN", text: "Department Admin" },
      ],
    };
  },
  methods: {
    processForm: function () {
      const vm = this;
      vm.$parent.showLoader = true;
      const user_first_name = this.user_first_name;
      const user_last_name = this.user_last_name;
      const user_email = this.user_email;
      const user_role = this.user_role;
      const data = {
        users: [
          {
            user_first_name: user_first_name,
            user_last_name: user_last_name,
            user_email: user_email,
            user_role: user_role,
          },
        ],
      };
      axios({
        method: "post",
        url: `${this.$parent.API_BASE_URL}/users`,
        data: data,
        headers: {
          Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
        },
      })
        .then(function (response) {
          if (response.data.error) {
            console.error(response);
            vm.$parent.$toast.error("There was an error creating the user.", {
              position: "top-right",
            });
          } else {
            vm.$refs.top.focus();
            vm.$parent.$toast.success("Successfully created the user.", {
              position: "top-right",
            });
            vm.user_first_name = "";
            vm.user_last_name = "";
            vm.user_email = "";
            vm.user_role = "";
          }
        })
        .catch(function (response) {
          vm.$parent.$toast.error("There was an error creating the user.", {
            position: "top-right",
          });
          console.error(response);
        });
    },
  },
};
</script>
<style scoped>
#newuser {
  padding-top: 2em;
  padding-left: 5em;
  padding-right: 5em;
}
</style>