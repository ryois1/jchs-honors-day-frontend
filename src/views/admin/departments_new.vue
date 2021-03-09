<template>
  <div id="newcert">
    <b-container fluid>
      <b-row>
        <b-col><h1>Creating Department</h1></b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-card bg-variant="light">
            <b-form @submit.prevent="processForm">
              <b-form-group
                id="cert_name-group"
                label="Department Name:"
                label-for="cert_name"
                description="Alphanumerical characters"
              >
                <b-form-input
                  id="cert_name"
                  v-model="dept_name"
                  type="text"
                  placeholder="Name"
                  required
                ></b-form-input>
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
      STATUS_TEXT: "Please input certificate data",
      RESULT: null,
      dept_name: null,
    };
  },
  methods: {
    processForm: function () {
      const vm = this;
      vm.$parent.showLoader = true;
      const dept_name = this.dept_name;
      const data = { depts: [{ dept_name: dept_name }] };
      axios({
        method: "post",
        url: `${this.$parent.API_BASE_URL}/dept`,
        data: data,
        headers: {
          Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
        },
      })
        .then(function (response) {
          if (response.data.error) {
            console.error(response);
            vm.$parent.$toast.error(
              "There was an error creating the department.",
              { position: "top-right" }
            );
          } else {
            vm.$parent.$toast.success("Successfully created the department.", {
              position: "top-right",
            });
            vm.dept_name = "";
          }
        })
        .catch(function (response) {
          vm.$parent.$toast.error(
            "There was an error creating the department.",
            { position: "top-right" }
          );
          console.error(response);
        });
    },
  },
  mounted: function () {
    this.API_depts().catch((error) => {
      this.$parent.$toast.error(
        `There was an error getting department. ${error}`,
        { position: "top-right" }
      );
      console.error(error);
    });
  },
};
</script>
<style scoped>
#newcert {
  padding-top: 2em;
  padding-left: 5em;
  padding-right: 5em;
}
</style>