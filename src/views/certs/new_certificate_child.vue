<template>
  <div id="newcert">
    <b-container fluid>
      <b-row>
        <b-col><h1>Creating Child Certificate</h1></b-col>
        <b-col
          ><h3>
            You have <b-badge>{{ this.certs_remaining }}</b-badge> out of
            <b-badge>{{ this.max_certs }}</b-badge> certificates remaining
          </h3></b-col
        >
      </b-row>
      <b-row>
        <b-col>
          <b-card bg-variant="light">
            <b-form @submit.prevent="processForm">
              <b-form-group
                id="cert_name-group"
                label="Certificate Name:"
                label-for="cert_name"
                description="Alphanumerical characters"
              >
                <b-form-input
                  disabled
                  id="cert_name"
                  v-model="cert_name"
                  type="text"
                  placeholder="Name"
                  required
                ></b-form-input>
              </b-form-group>
              <div v-for="index in input_index" :key="index">
                <b-container fluid>
                  <b-row>
                    <b-col>
                      <b-form-group
                        id="student_id-group"
                        label="Student ID or Name:"
                        label-for="student_id"
                      >
                        <b-form-input
                          id="student_id"
                          v-model="student_id[index - 1]"
                          placeholder="Student ID or Name"
                          required
                        ></b-form-input>
                      </b-form-group>
                    </b-col>
                    <b-col>
                      <h4>Actions</h4>
                      <b-button variant="danger" @click="deleteRow(index - 1)"
                        >Remove</b-button
                      >
                      <b-button
                        :disabled="!isNaN(student_id[index - 1])"
                        variant="primary"
                        @click="lookupStudent(index - 1)"
                        >Lookup</b-button
                      >
                      <b-form-group
                        v-for="student in lookedup_student"
                        :key="student"
                      >
                        <b-form-radio
                          v-model="student_id[index - 1]"
                          :value="student.id"
                          >{{
                            `${student.first_name} ${student.last_name} (${student.id})`
                          }}</b-form-radio
                        >
                      </b-form-group>
                      <div v-if="!isNaN(student_id[index - 1])">
                        <p>Disabled when input is a student ID</p>
                      </div>
                    </b-col>
                  </b-row>
                </b-container>
              </div>
              <b-button @click="addStudent" variant="success"
                >Add Student</b-button
              >
              <b-button @click="verify" variant="primary">Check Input</b-button>
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
      input_index: 0,
      max_certs: null,
      current_certs_count: 0,
      certs_remaining: 0,
      cert_name: null,
      student_id: [],
      lookedup_student: [],
    };
  },
  methods: {
    addStudent() {
      if (this.max_certs == this.current_certs_count) {
        this.$parent.$toast.error("No more certificate slots.", {
          position: "top-right",
        });
      } else {
        this.input_index++;
        this.current_certs_count++;
        this.certs_remaining--;
        this.lookedup_student = [];
      }
    },
    deleteRow(e) {
      Array.prototype.remove = function (from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
      };
      const array = this.student_id;
      this.input_index--;
      this.current_certs_count--;
      this.certs_remaining++;
      array.remove(e);
    },
    lookupStudent: async function (index) {
      const vm = this;
      let authToken = vm.$parent.JWT_TOKEN;
      const search = this.student_id[index];
      vm.lookedup_student = [];
      const loookup_data = { search_query: search };
      if ((await authToken) == null) {
        await this.getAuthToken();
        const { data } = await axios.post(
          `${vm.$parent.API_BASE_URL}/students/search`,
          loookup_data,
          {
            headers: {
              Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
            },
          }
        );
        const output = [];
        Object.keys(data.data.students).forEach(function (key) {
          const row = data.data.students[key];
          const cert = {
            id: row.id,
            first_name: row.first_name,
            middle_name: row.middle_name,
            last_name: row.last_name,
            yog: row.yog,
            email: row.email,
            homeroom: row.homeroom,
          };
          output.push(cert);
        });
        vm.lookedup_student = output;
      } else {
        const { data } = await axios.post(
          `${vm.$parent.API_BASE_URL}/students/search`,
          loookup_data,
          {
            headers: {
              Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
            },
          }
        );
        const output = [];
        if (data.error) {
          vm.$parent.$toast.error(`${data.message}`, { position: "top-right" });
        }
        Object.keys(data.data.students).forEach(function (key) {
          const row = data.data.students[key];
          const cert = {
            id: row.id,
            first_name: row.first_name,
            middle_name: row.middle_name,
            last_name: row.last_name,
            yog: row.yog,
            email: row.email,
            homeroom: row.homeroom,
          };
          output.push(cert);
        });
        vm.lookedup_student = output;
      }
    },
    remove() {
      this.input_index--;
    },
    verify() {
      const prop = { cert_name: this.cert_name, student_id: this.student_id };
      this.$router.replace({
        name: "CertificatePageChildVerify",
        params: { prop },
      });
    },
    API_certs: async function () {
      const vm = this;
      axios
        .get(
          `${vm.$parent.API_BASE_URL}/certs/${vm.$route.params.cert_id}/certs`,
          {
            headers: {
              Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
            },
          }
        )
        .then(function (response) {
          vm.certs_remaining = vm.max_certs;
          vm.current_certs_count = response.data.data.certs.length;
          vm.certs_remaining = vm.max_certs - vm.current_certs_count;
        })
        .catch(function () {
          vm.current_certs_count = 0;
          vm.certs_remaining = vm.max_certs;
        });
    },
    API_cert_info: async function () {
      const vm = this;
      let authToken = vm.$parent.JWT_TOKEN;
      if ((await authToken) == null) {
        await this.getAuthToken();
        const { data } = await axios.get(
          `${vm.$parent.API_BASE_URL}/certs/${vm.$route.params.cert_id}`,
          {
            headers: {
              Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
            },
          }
        );
        vm.cert_name = data.data.certs[0].cert_name;
        vm.max_certs = data.data.certs[0].cert_max_child;
      } else {
        const { data } = await axios.get(
          `${vm.$parent.API_BASE_URL}/certs/${vm.$route.params.cert_id}`,
          {
            headers: {
              Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
            },
          }
        );
        vm.cert_name = data.data.certs[0].cert_name;
        vm.max_certs = data.data.certs[0].cert_max_child;
      }
    },
  },
  mounted: async function () {
    await this.API_cert_info();
    await this.API_certs();
    if (this.$attrs.prop) {
      if (typeof this.$attrs.prop.student_id !== "undefined") {
        this.student_id = this.$attrs.prop.student_id;
        this.input_index = this.$attrs.prop.student_id.length;
        this.certs_remaining =
          this.max_certs - this.$attrs.prop.student_id.length;
      }
      if (typeof this.$attrs.prop.cert_name !== "undefined") {
        this.cert_name = this.$attrs.prop.cert_name;
      }
    }
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