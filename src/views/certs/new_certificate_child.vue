<template>
  <div id="newcert">
    <b-container fluid>
      <b-row>
        <b-col
          ><h1>{{ LANG_CREATING }}</h1></b-col
        >
        <b-col
          ><h3>
            You have <b-badge>{{ this.certs_remaining }}</b-badge> out of
            <b-badge>{{ this.max_certs }}</b-badge> certificates remaining
          </h3>
          <b-button @click="bulkImport" class="mr-1" variant="success"
            >Bulk Import</b-button
          ></b-col
        >
      </b-row>
      <b-row>
        <b-col>
          <b-card class="cards">
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
                  class="cardsinput"
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
                          class="cardsinput"
                        ></b-form-input>
                      </b-form-group>
                    </b-col>
                    <b-col>
                      <h4>Actions</h4>
                      <b-button
                        variant="danger"
                        class="mr-1"
                        @click="deleteRow(index - 1)"
                        >Remove</b-button
                      >
                      <b-button
                        :disabled="!isNaN(student_id[index - 1])"
                        variant="primary"
                        @click="lookupStudent(index - 1)"
                        >Lookup</b-button
                      >
                      <div v-if="!isNaN(student_id[index - 1])">
                        <p>Disabled when input is a student ID</p>
                      </div>
                    </b-col>
                  </b-row>
                </b-container>
              </div>
              <b-button @click="addStudent" class="mr-1 mb-1" variant="success"
                >Add Student</b-button
              ><br>
              <b-button @click="verify" variant="primary">Verify</b-button>
            </b-form>
          </b-card>
          <br>
          <b-button id="go_back" class="mr-1" @click="goBack" variant="primary">Go Back</b-button>
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
      LANG_CREATING: "Awarding Certificates for Award",
      RESULT: null,
      input_index: 0,
      max_certs: null,
      current_certs_count: 0,
      certs_remaining: 0,
      all_certs_count: 0,
      cert_name: null,
      student_id: [],
      lookedup_student: [],
    };
  },
  methods: {
    bulkImport() {
      const prop = {
        cert_name: this.cert_name,
        cert_id: this.$route.params.cert_id,
      };
      this.$router.push({
        name: "CertificatePageChildBulk",
        params: { prop },
      });
    },
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
      const search = this.student_id[index];
      vm.lookedup_student = [];
      const loookup_data = { search_query: search };
      axios({
        method: "post",
        url: `${vm.$parent.API_BASE_URL}/students/search`,
        data: loookup_data,
        headers: {
          Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
        },
      })
        .then(async function (response) {
          const students = [];
          Object.keys(response.data.data.students).forEach(function (key) {
            const row = response.data.data.students[key];
            const name = `${row.first_name} ${row.last_name} (${row.id})`;
            const value = row.id;
            students.push({ name: name, value: value });
          });
          vm.lookedup_student = students;
          await vm.$parent.$swal
            .fire({
                                  customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
              title: "Search Results",
              html: `<select id="select" name="parent" class="form-control cardsinput">
          ${students.map(
            (cat) => `<option value="${cat.value}">${cat.name}</option>`
          )} ...`,
              showCancelButton: true,
              preConfirm: () => {
                return document.getElementById("select").value;
              },
            })
            .then(async function (result) {
              vm.student_id[index] = result.value;
              vm.$forceUpdate();
            });
        })
        .catch(function (response) {
          vm.$parent.$toast.error(
            "There was an error searching, please try a different search term.",
            {
              position: "top-right",
            }
          );
          console.error(response);
        });
    },
    remove() {
      this.input_index--;
    },
    verify() {
      const prop = { cert_name: this.cert_name, student_id: this.student_id };
      this.$router.push({
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
          if (
            vm.$parent.USER_INFO.role == "ADMIN" ||
            vm.$parent.USER_INFO.role == "DEPT_ADMIN"
          ) {
            vm.certs_remaining = vm.max_certs;
            vm.all_certs_count = response.data.data.certs.length;
            vm.current_certs_count = response.data.data.certs.length;
            vm.certs_remaining = vm.max_certs - vm.current_certs_count;
          } else {
            //vm.certs_remaining = vm.max_certs;
            vm.all_certs_count = response.data.data.certs.length;
            //vm.certs_remaining = vm.max_certs - vm.current_certs_count;
          }
        })
        .catch(function () {
          vm.current_certs_count = 0;
          vm.certs_remaining = vm.max_certs;
        });
    },
    API_cert_info: async function () {
      const vm = this;
      const { data } = await axios.get(
        `${vm.$parent.API_BASE_URL}/certs/${vm.$route.params.cert_id}`,
        {
          headers: {
            Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
          },
        }
      );
      vm.cert_name = data.data.certs[0].cert_name;
      if(data.data.certs[0].cert_lock){
        vm.$parent.$swal.fire({
                              customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
          title: `This award is locked for editing.`,
          icon: "error",
          confirmButtonText: "Ok",
        });
        const prop = { dept_id: this.$route.params.dept_id, cert_id: this.$route.params.cert_id };
        this.$router.push({ name: "CertificatePage", params: { prop } });
      }
      vm.LANG_CREATING = `Awarding Certificates for Award "${data.data.certs[0].cert_name}"`;
      if (
        vm.$parent.USER_INFO.role == "ADMIN" ||
        vm.$parent.USER_INFO.role == "DEPT_ADMIN"
      ) {
        vm.max_certs = data.data.certs[0].cert_max_child;
      } else {
        vm.current_certs_count = data.data.certs[0].user_cert_current;
        vm.certs_remaining =
          data.data.certs[0].user_cert_max -
          data.data.certs[0].user_cert_current;
        vm.max_certs = data.data.certs[0].user_cert_max;
      }
    },
    goBack() {
      const prop = { dept_id: this.$route.params.dept_id, cert_id: this.$route.params.cert_id };
      this.$router.push({ name: "CertificatePage", params: { prop } });
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