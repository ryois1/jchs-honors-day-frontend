<template>
  <div id="newcert">
    <b-container fluid>
      <b-row>
        <b-col
          ><h1>{{ LANG_HEADER }}</h1></b-col
        >
        <b-col>
          <h3>
            You have <b-badge>{{ DELEGATES_USING_LOAD }}</b-badge> out of
            <b-badge>{{ SELF_CERT_COUNT }}</b-badge> spots to delegate.
          </h3>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-card bg-variant="light">
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
                          type="email"
                          required
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
                      <b-form-group
                        v-for="user in lookedup_teacher"
                        :key="user"
                      >
                        <b-form-radio
                          v-model="users_email[index - 1]"
                          :value="user.email"
                          >{{
                            `${user.first_name} ${user.last_name} (${user.email})`
                          }}</b-form-radio
                        >
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-container>
              </div>
              <b-button @click="addTeacher" class="mr-1" variant="success"
                >Add Teacher</b-button
              >
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
export default {
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
      vm.lookedup_teacher = [];
      const loookup_data = { search_query: search };
      const { data } = await axios.post(
        `${vm.$parent.API_BASE_URL}/users/search`,
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
      Object.keys(data.data.users).forEach(function (key) {
        const row = data.data.users[key];
        const cert = {
          id: row.id,
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email,
        };
        output.push(cert);
      });
      vm.lookedup_teacher = output;
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
      const prop = { users: this.users_email, certs: this.users_cert, delegates_remain: this.DELEGATES_USING_LOAD };
      this.$router.replace({
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