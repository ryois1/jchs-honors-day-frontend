<template>
  <div id="newcert">
    <b-container fluid>
      <b-row>
        <b-col><h1>Creating Award</h1></b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-card bg-variant="light">
            <b-form @submit.prevent="processForm">
              <b-form-group
                id="cert_name-group"
                label="Award Name:"
                label-for="cert_name"
                description="Alphanumerical characters"
              >
                <b-form-input
                  id="cert_name"
                  ref="top"
                  v-model="cert_name"
                  type="text"
                  placeholder="Name"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="cert_max_child-group"
                label="Max Certificates:"
                label-for="cert_max_child"
                description="Numbers Only"
              >
                <b-form-input
                  id="cert_max_child"
                  v-model="cert_max_child"
                  type="number"
                  placeholder="Number"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="dept-group"
                label="Department:"
                label-for="dept"
              >
                <b-form-select
                  v-model="cert_dept"
                  :options="depts"
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
      STATUS_TEXT: "Please input certificate data",
      RESULT: null,
      cert_name: null,
      cert_max_child: null,
      cert_dept: null,
      depts: [{ text: "Select Department", disabled: true }],
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
      Object.keys(data.data.depts).forEach(function (key) {
        const row = data.data.depts[key];
        const user = {
          value: row.dept_id,
          text: row.dept_name,
        };
        vm.depts.push(user);
      });
    },
    processForm: function () {
      const vm = this;
      vm.$parent.showLoader = true;
      const cert_name = this.cert_name;
      const cert_max_child = this.cert_max_child;
      const cert_dept = this.cert_dept;
      const data = {
        certs: [
          {
            cert_name: cert_name,
            cert_max_child: cert_max_child,
            cert_dept: cert_dept,
          },
        ],
      };
      axios({
        method: "post",
        url: `${this.$parent.API_BASE_URL}/certs`,
        data: data,
        headers: {
          Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
        },
      })
        .then(function (response) {
          if (response.data.error) {
            console.error(response);
            vm.$parent.$toast.error(
              "There was an error creating the certificate.",
              { position: "top-right" }
            );
          } else {
            vm.$refs.top.focus();
            vm.$parent.$toast.success("Successfully created the certificate.", {
              position: "top-right",
            });
            vm.cert_name = "";
            vm.cert_max_child = "";
          }
        })
        .catch(function (response) {
          vm.$parent.$toast.error(
            "There was an error creating the certificate.",
            { position: "top-right" }
          );
          console.error(response);
        });
    },
  },
  mounted: function () {
    this.API_depts().catch((error) => {
      this.$parent.$toast.error(
        `There was an error getting departments. ${error}`,
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