<template>
  <div id="verifyInput">
    <b-container fluid>
      <b-row>
        <b-col><h1>Please Verify Your Input</h1></b-col>
      </b-row>
    </b-container>
    <h3>Unverified teachers ({{ count_invalid_teachers }})</h3>
    <b-table
      bordered
      show-empty
      :items="invalid_teachers"
      :fields="invalid_fields"
    >
    </b-table>
    <h3>Verified teachers ({{ count_ok_teachers }})</h3>
    <b-table bordered show-empty :items="teachers" :fields="success_fields">
      <template #cell(checkbox)>
        <b-form-checkbox
          v-model="ok_teacher_checkboxes"
          value="verified"
          unchecked-value="not_verified"
          >I verify that this record is accurate</b-form-checkbox
        >
      </template>
    </b-table>
    <b-container fluid>
      <b-row>
        <b-col class="text-right"
          ><b-button id="go_back" @click="goBack" variant="primary"
            >Go Back</b-button
          ></b-col
        >
        <b-col class="text-left"
          ><b-button
            @click="processForm"
            id="confirm_button"
            :disabled="ok_button_disabled == 1"
            :variant="ok_button_variant"
            >Confirm</b-button
          ></b-col
        >
      </b-row>
    </b-container>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "check_teacher_input",
  data: function () {
    return {
      teacher_emails: this.$attrs.prop.users,
      STATUS_TEXT: "Please input certificate data",
      RESULT: null,
      input_index: 0,
      api_data: [],
      count_invalid_teachers: 0,
      count_ok_teachers: 0,
      ok_teacher_ids: [],
      ok_teacher_emails: [],
      ok_teacher_emails_nondupe: [],
      ok_certs: [],
      invalid_teacher_emails: [],
      ok_teacher_checkboxes: [],
      teachers: [],
      certs: this.$attrs.prop.certs,
      teachers_verified: [],
      duplicate_teachers: [],
      ok_button_disabled: 1,
      ok_button_variant: "danger",
      invalid_teachers: [],
      invalid_fields: [
        {
          key: "email",
          label: "Invalid Teacher Email",
        },
        {
          key: "reason",
          label: "Reason",
        },
      ],
      success_fields: [
        "checkbox",
        {
          key: "email",
          label: "Teacher Email",
        },
        {
          key: "delegating",
          label: "No. of Certificates Delegating",
        },
        {
          key: "teacher_first_name",
          label: "First Name",
        },
        {
          key: "teacher_last_name",
          label: "Last Name",
        },
      ],
    };
  },
  methods: {
    verifyteachers: async function () {
      const findDuplicates = (arr) =>
        arr.filter((item, index) => arr.indexOf(item) != index);
      const vm = this;
      const output = this.teachers_verified;
      const errors = this.invalid_teachers;
      const ok_certs = this.ok_certs;
      const teacher_emails = this.teacher_emails;
      const ok_teacher_emails = this.ok_teacher_emails;
      const invalid_teacher_emails = this.invalid_teacher_emails;
      const duplicates = findDuplicates(teacher_emails);
      if (duplicates.length > 0) {
        vm.$parent.$swal.fire({
          title: `You have duplicate teachers`,
          icon: "warning",
          confirmButtonText: "Ok",
        });
      }
      this.duplicate_teachers = duplicates;
      const duplicate_teachers = this.duplicate_teachers;
      for (let index = 0; index < teacher_emails.length; index++) {
        if (duplicate_teachers.includes(teacher_emails[index])) {
          invalid_teacher_emails.push(teacher_emails[index]);
          const errorinput = {
            id: teacher_emails[index],
            reason: "Duplicate teacher [Entry]!",
          };
          errors.push(errorinput);
          continue;
        } else {
          const search_data = { search_query: teacher_emails[index] };
          const { data } = await axios({
            method: "post",
            url: `${this.$parent.API_BASE_URL}/users/search`,
            data: search_data,
            headers: {
              Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
            },
          });
          if (data.error) {
            invalid_teacher_emails.push(teacher_emails[index]);
            const errorinput = {
              id: teacher_emails[index],
              reason: "Unknown teacher!",
            };
            errors.push(errorinput);
          } else {
            ok_teacher_emails.push(teacher_emails[index]);
            ok_certs.push(vm.certs[index])
            const row = data.data.users[0];
            const teacher = {
              id: row.id,
              teacher_first_name: row.first_name,
              teacher_last_name: row.last_name,
              email: row.email,
            };
            output.push(teacher);
          }
        }
      }
    },
    checkforExisting: async function () {
      const vm = this;
      const output = this.teachers;
      const api_data = this.api_data;
      const ok_certs = this.ok_certs;
      const errors = this.invalid_teachers;
      const teachers = this.teachers_verified;
      const teacher_emails = this.ok_teacher_emails;
      const ok_teacher_emails = this.ok_teacher_emails_nondupe;
      const invalid_teacher_emails = this.invalid_teacher_emails;
      const ok_teacher_ids = this.ok_teacher_ids;
      for (let index = 0; index < teacher_emails.length; index++) {
        const { data } = await axios({
          method: "get",
          url: `${this.$parent.API_BASE_URL}/certs/${vm.$route.params.cert_id}/${teachers[index].id}/delegate/check`,
          headers: {
            Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
          },
        });
        if (!data.error) {
          invalid_teacher_emails.push(teacher_emails[index]);
          vm.count_invalid_teachers++;
          const errorinput = {
            email: teacher_emails[index],
            reason: "Duplicate user [Already has delegated spots]!",
          };
          errors.push(errorinput);
          continue;
        } else {
          ok_teacher_emails.push(teacher_emails[index]);
          const row = teachers[index];
          vm.count_ok_teachers++;
          const send_data = {
            user_id: row.id,
            cert_id: vm.$route.params.cert_id,
            cert_max: ok_certs[index],
          };
          const teacher = {
            id: row.id,
            teacher_first_name: row.teacher_first_name,
            teacher_last_name: row.teacher_last_name,
            email: row.email,
            delegating: ok_certs[index],
          };
          ok_teacher_ids.push(row.id);
          output.push(teacher);
          api_data.push(send_data);
        }
      }
    },
    goBack() {
      const prop = { users: this.teacher_emails, certs: this.certs };
      this.$router.replace({ name: "CertificatePageDelegate", params: { prop } });
    },
    processForm: function () {
      const vm = this;
      if (this.invalid_teacher_emails.length > 0) {
        vm.$parent.$swal
          .fire({
            title: `Are you sure you want submit this with unverified teachers?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#FF4500",
            cancelButtonColor: "#00B32C",
            confirmButtonText: "Yes",
            reverseButtons: true,
          })
          .then((result) => {
            if (result.isConfirmed) {
              const api_data = this.api_data;
              const data = { entry: api_data };
              axios({
                method: "post",
                url: `${this.$parent.API_BASE_URL}/certs/${this.$route.params.cert_id}/delegate`,
                data: data,
                headers: {
                  Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
              })
                .then(function (response) {
                  if (response.data.error) {
                    console.error(response);
                    vm.$parent.$toast.error(
                      "There was an error delegating the certificate(s) the users(s).",
                      { position: "top-right" }
                    );
                  } else {
                    const cert_id = vm.$route.params.cert_id;
                    vm.$parent.$toast.success(
                      "Successfully delegated to sers(s).",
                      { position: "top-right" }
                    );
                    vm.$router.push({
                      name: "CertificatePage",
                      params: { cert_id },
                    });
                  }
                })
                .catch(function (response) {
                  vm.$parent.$toast.error(
                    "There was an error delegating the certificate(s) the users(s).",
                    { position: "top-right" }
                  );
                  console.error(response);
                });
            }
          });
      } else {
              const api_data = this.api_data;
              const data = { entry: api_data };
              axios({
                method: "post",
                url: `${this.$parent.API_BASE_URL}/certs/${this.$route.params.cert_id}/delegate`,
                data: data,
                headers: {
                  Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
              })
                .then(function (response) {
                  if (response.data.error) {
                    console.error(response);
                    vm.$parent.$toast.error(
                      "There was an error delegating the certificate(s) the users(s).",
                      { position: "top-right" }
                    );
                  } else {
                    const cert_id = vm.$route.params.cert_id;
                    vm.$parent.$toast.success(
                      "Successfully delegated to sers(s).",
                      { position: "top-right" }
                    );
                    vm.$router.push({
                      name: "CertificatePage",
                      params: { cert_id },
                    });
                  }
                })
                .catch(function (response) {
                  vm.$parent.$toast.error(
                    "There was an error delegating the certificate(s) the users(s).",
                    { position: "top-right" }
                  );
                  console.error(response);
                });
      }
    },
  },
  mounted: async function () {
    await this.verifyteachers();
    await this.checkforExisting();
  },
  watch: {
    ok_teacher_checkboxes: {
      handler: function () {
        function getOccurrence(array, value) {
          var count = 0;
          array.forEach((v) => v === value && count++);
          return count;
        }
        const vm = this;
        const ok_checkbox_count = getOccurrence(
          vm.ok_teacher_checkboxes,
          "verified"
        );
        if (ok_checkbox_count == vm.teachers.length) {
          vm.ok_button_variant = "success";
          vm.ok_button_disabled = 0;
        } else {
          vm.ok_button_variant = "danger";
          vm.ok_button_disabled = 1;
        }
      },
    },
  },
};
</script>
<style scoped>
#verifyInput {
  padding-top: 2em;
  padding-left: 5em;
  padding-right: 5em;
}
</style>