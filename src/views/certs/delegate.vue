<template>
  <div id="newcert">
    <b-container fluid>
      <goBack target="CertificatePage"></goBack>
      <b-row>
        <b-col
          ><h1>{{ LANG_HEADER }}</h1></b-col
        >
        <b-col>
          <h3>
            You have <b-badge>{{ DELEGATES_USING_LOAD }}</b-badge> out of
            <b-badge>{{ SELF_CERT_COUNT }}</b-badge> slots to delegate.
          </h3>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-card class="cards">
            <b-form @submit.prevent="processForm">
              <div v-for="index in input_index" :key="index">
                <b-container fluid>
                  <b-row>
                    <b-col>
                      <b-form-group
                        id="user_email-group"
                        label="Teacher Email:"
                        label-for="user_email"
                      >
                        <b-form-input
                          id="user_email"
                          v-model="users_email[index - 1]"
                          placeholder="Teacher Email or Name"
                          type="email"
                          required
                          class="cardsinput"
                        ></b-form-input>
                      </b-form-group>
                      <b-form-group
                        id="user_certs-group"
                        label="Number of Certificates to Delegate:"
                        label-for="user_certs"
                      >
                        <b-form-input
                          id="user_certs"
                          v-model="users_cert[index - 1]"
                          placeholder="..."
                          type="number"
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
                        variant="primary"
                        @click="lookupTeacher(index - 1)"
                        >Lookup</b-button
                      >
                    </b-col>
                  </b-row>
                </b-container>
              </div>
              <b-button @click="addTeacher" class="mr-1 mb-1" variant="success"
                >Add Teacher</b-button
              ><br>
              <b-button @click="verify" variant="primary">Verify</b-button>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import axios from "axios";
import goBack from '../../components/global/go_back.vue'

export default {
  components: {
    goBack: goBack,
  },
  name: "delegate_cert",
  data: function () {
    return {
      RESULT: null,
      LANG_HEADER: 'Delegating Certificates for Award "???"',
      input_index: 0,
      users_email: [],
      users_cert: [],
      SELF_CERT_COUNT: 0,
      lookedup_teacher: [],
      DELEGATES_USING_LOAD: 0,
    };
  },
  methods: {
    API_delegates: async function () {
      const vm = this;
      const { data } = await axios.get(
        `${vm.$parent.API_BASE_URL}/certs/${vm.$route.params.cert_id}/delegate`,
        {
          headers: {
            Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
          },
        }
      );
      if (data.data.delegates == 0) {
        vm.DELEGATES_USING_LOAD = 0;
      } else {
        Object.keys(data.data.delegates).forEach(function (key) {
          const row = data.data.delegates[key];
          const curr_user = row.max;
          vm.DELEGATES_USING_LOAD = vm.DELEGATES_USING_LOAD - curr_user;
        });
      }
    },
    lookupTeacher: async function (index) {
      const vm = this;
      const search = this.users_email[index];
      vm.lookedup_student = [];
      const loookup_data = { search_query: search };
      axios({
        method: "post",
        url: `${vm.$parent.API_BASE_URL}/users/search`,
        data: loookup_data,
        headers: {
          Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
        },
      })
        .then(async function (response) {
          const users = [];
          Object.keys(response.data.data.users).forEach(function (key) {
            const row = response.data.data.users[key];
            const name = `${row.first_name} ${row.last_name} (${row.email})`;
            const value = row.email;
            users.push({ name: name, value: value });
          });
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
          ${users.map(
            (cat) => `<option value="${cat.value}">${cat.name}</option>`
          )} ...`,
              showCancelButton: true,
              preConfirm: () => {
                return document.getElementById("select").value;
              },
            })
            .then(async function (result) {
              vm.users_email[index] = result.value;
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
    addTeacher() {
      this.input_index++;
    },
    deleteRow(e) {
      Array.prototype.remove = function (from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
      };
      const array = this.users_email;
      const array2 = this.users_cert;
      this.input_index--;
      array.remove(e);
      array2.remove(e);
    },
    remove() {
      this.input_index--;
    },
    verify() {
      const output = [];
      const vm = this;
      Object.keys(vm.users_email).forEach(function (key) {
        const row = vm.users_email[key];
        const row2 = vm.users_cert[key];
        const user = {
          user_email: row,
          user_cert: row2,
        };
        output.push(user);
      });
      const prop = {
        users: this.users_email,
        certs: this.users_cert,
        delegates_remain: this.DELEGATES_USING_LOAD,
      };
      this.$router.push({
        name: "CertificateDelegateVerify",
        params: { prop },
      });
    },
    API_cert: async function () {
      const vm = this;
      const { data } = await axios.get(
        `${vm.$parent.API_BASE_URL}/certs/${vm.$route.params.cert_id}`,
        {
          headers: {
            Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
          },
        }
      );
      vm.SELF_CERT_COUNT = data.data.certs[0].cert_max_child;
      vm.DELEGATES_USING_LOAD = data.data.certs[0].cert_max_child;
      vm.LANG_HEADER = `Delegating Certificates for Award "${data.data.certs[0].cert_name}"`;
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
    },
  },
  mounted: async function () {
    await this.API_cert();
    await this.API_delegates();
    if (this.$attrs.prop) {
      if (typeof this.$attrs.prop.users !== "undefined") {
        this.users_email = this.$attrs.prop.users;
        this.users_cert = this.$attrs.prop.certs;
        this.input_index = this.$attrs.prop.users.length;
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