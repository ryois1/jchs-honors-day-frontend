<template>
  <div id="newcert">
    <b-container fluid>
      <b-row>
        <b-col><h1>{{LANG_HEADER}}</h1></b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-card class="cards">
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
                  class="cardsinput"
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
                  class="cardsinput"
                ></b-form-input>
              </b-form-group>
              <b-button type="submit" variant="primary">Submit</b-button>
            </b-form>
          </b-card>
      <br>
      <b-button id="go_back" @click="goBack" variant="primary">Go Back</b-button>
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
      LANG_HEADER: "Creating Award in ???",
      STATUS_TEXT: "Please input certificate data",
      DEPT_NAME: "",
      DEPT_ID: "",
      RESULT: null,
      cert_name: null,
      cert_max_child: null,
      cert_dept: null,
      depts: [{ text: "Select Department", disabled: true }],
    };
  },
  methods: {
    goBack() {
      const prop = { dept_id: this.$route.params.dept_id };
      this.$router.push({ name: "DepartmentsCertificates", params: { prop } });
    },
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
      vm.DEPT_NAME = data.data.depts[0].department_name;
      if (
        vm.$parent.USER_INFO.role == "ADMIN" ||
        vm.$parent.USER_INFO.role == "DEPT_ADMIN" ||
        vm.$parent.USER_INFO.role == "COMMITTEE"
      ) {
        vm.LANG_HEADER = `Creating Award in "${vm.DEPT_NAME}"`;
        vm.DEPT_ID = vm.$route.params.dept_id;
      } else {
        vm.LANG_HEADER = `Creating Award in "${vm.DEPT_NAME}"`;
        vm.DEPT_ID = vm.$route.params.dept_id;
      }
    },
    processForm: function () {
      const vm = this;
      vm.$parent.showLoader = true;
      const cert_name = this.cert_name;
      const cert_max_child = this.cert_max_child;
      const cert_dept = vm.DEPT_ID;
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
      console.error(error);
    });
    this.API_dept().catch((error) => {
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