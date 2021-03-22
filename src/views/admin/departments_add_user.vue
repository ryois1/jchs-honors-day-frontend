<template>
  <div id="newcert">
    <b-container fluid>
      <b-row>
        <b-col
          ><h1>{{ LANG_HEADER }}</h1></b-col
        >
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
                          v-model="users[index - 1]"
                          placeholder="Teacher Email"
                          type="email"
                          required
                        ></b-form-input>
                      </b-form-group>
                    </b-col>
                    <b-col>
                      <h4>Actions</h4>
                      <b-button variant="danger" class="mr-1" @click="deleteRow(index - 1)"
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
                          v-model="users[index - 1]"
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
  name: "new_parent_cert",
  data: function () {
    return {
      RESULT: null,
      LANG_HEADER: "Adding users to ???",
      input_index: 0,
      users: [],
      lookedup_teacher: [],
    };
  },
  methods: {
    lookupTeacher: async function (index) {
      const vm = this;
      const search = this.users[index];
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
      const array = this.users;
      this.input_index--;
      array.remove(e);
    },
    remove() {
      this.input_index--;
    },
    verify() {
      const prop = { users: this.users };
      this.$router.replace({ name: "AdminDeptAddVerify", params: { prop } });
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
      vm.LANG_HEADER = `Adding Users to "${data.data.depts[0].department_name}"`;
    },
  },
  mounted: async function () {
    await this.API_dept();
    if (this.$attrs.prop) {
      if (typeof this.$attrs.prop.users !== "undefined") {
        this.users = this.$attrs.prop.users;
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