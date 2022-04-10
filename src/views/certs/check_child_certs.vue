<template>
  <div id="verifyInput">
    <b-container fluid>
      <b-row>
        <b-col
          ><h1>Please Verify Your Input - "{{ cert_name }}"</h1></b-col
        >
      </b-row>
    </b-container>
    <h3>Unverified students ({{ count_invalid_students }})</h3>
    <b-table
      bordered
      show-empty
      :items="invalid_students"
      :fields="invalid_fields"
    >
    </b-table>
    <h3>Verified students ({{ count_ok_students }})</h3>
    <b-table
      bordered
      show-empty
      :items="students_verified"
      :fields="success_fields"
    >
    </b-table>
    <b-container fluid>
      <b-row>
        <b-col class="text-right"
          ><b-button id="go_back" class="mr-1" @click="goBack"><b-icon icon="arrow-left"></b-icon> Go Back</b-button></b-col
        >
        <b-col class="text-left"
          ><b-button
            @click="processForm"
            id="confirm_button"
            :disabled="ok_button_disabled == 1"
            :variant="ok_button_variant"
            ><b-icon icon="check2-all" aria-hidden="true"></b-icon> Confirm</b-button
          ></b-col
        >
      </b-row>
    </b-container>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "check_child_certs",
  data: function () {
    return {
      student_ids: this.$attrs.prop.student_id,
      STATUS_TEXT: "Please input certificate data",
      RESULT: null,
      input_index: 0,
      count_invalid_students: 0,
      count_ok_students: 0,
      cert_name: this.$attrs.prop.cert_name,
      ok_student_ids: [],
      ok_student_ids_nondupe: [],
      invalid_student_ids: [],
      students: [],
      students_verified: [],
      duplicate_students: [],
      ok_button_disabled: 0,
      ok_button_variant: "success",
      invalid_students: [],
      invalid_fields: [
        {
          key: "id",
          label: "Invalid Student ID",
        },
        {
          key: "reason",
          label: "Reason",
        },
      ],
      success_fields: [
        {
          key: "id",
          label: "Student ID",
        },
        {
          key: "first_name",
          label: "First Name",
        },
        {
          key: "middle_name",
          label: "Middle Name",
        },
        {
          key: "last_name",
          label: "Last Name",
        },
        {
          key: "yog",
          label: "Year of Grad.",
        },
        {
          key: "email",
          label: "Email",
        },
        {
          key: "homeroom",
          label: "Homeroom",
        },
      ],
    };
  },
  methods: {
    verifyStudents: async function () {
      const findDuplicates = (arr) =>
        arr.filter((item, index) => arr.indexOf(item) != index);
      const vm = this;
      const output = this.students_verified;
      const errors = this.invalid_students;
      const student_ids = this.student_ids;
      const ok_student_ids = this.ok_student_ids;
      const invalid_student_ids = this.invalid_student_ids;
      const duplicates = findDuplicates(student_ids);
      if (duplicates.length > 0) {
        vm.$parent.$swal.fire({
                              customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
          title: `You have duplicate students`,
          icon: "warning",
          confirmButtonText: "Ok",
        });
      }
      this.duplicate_students = duplicates;
      const duplicate_students = this.duplicate_students;
      for (let index = 0; index < student_ids.length; index++) {
        if (duplicate_students.includes(student_ids[index])) {
          invalid_student_ids.push(student_ids[index]);
          const errorinput = {
            id: student_ids[index],
            reason: "Duplicate student [Entry]!",
          };
          errors.push(errorinput);
          continue;
        } else {
          const { data } = await axios.get(
            `${vm.$parent.API_BASE_URL}/students/${student_ids[index]}`,
            {
              headers: {
                Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
              },
            }
          );
          if (data.error) {
            invalid_student_ids.push(student_ids[index]);
            const errorinput = {
              id: student_ids[index],
              reason: "Unknown student!",
            };
            errors.push(errorinput);
          } else {
            ok_student_ids.push(student_ids[index]);
            const row = data.data.students[0];
            const student = {
              id: row.id,
              first_name: row.first_name,
              middle_name: row.middle_name,
              last_name: row.last_name,
              yog: row.yog,
              email: row.email,
              homeroom: row.homeroom,
            };
            output.push(student);
          }
        }
      }
    },
    checkforExisting: async function () {
      const vm = this;
      const output = this.students;
      const errors = this.invalid_students;
      const student_ids = this.ok_student_ids;
      const ok_student_ids = this.ok_student_ids_nondupe;
      const invalid_student_ids = this.invalid_student_ids;
      for (let index = 0; index < student_ids.length; index++) {
        const { data } = await axios.get(
          `${vm.$parent.API_BASE_URL}/certs/${vm.$route.params.cert_id}/${student_ids[index]}`,
          {
            headers: {
              Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
            },
          }
        );
        if (!data.error) {
          invalid_student_ids.push(student_ids[index]);
          const errorinput = {
            id: student_ids[index],
            reason: "Duplicate certificate [Already exists]!",
          };
          errors.push(errorinput);
        } else {
          ok_student_ids.push(student_ids[index]);
          const row = data.data.students[0];
          const student = {
            id: row.id,
            first_name: row.first_name,
            middle_name: row.middle_name,
            last_name: row.last_name,
            yog: row.yog,
            email: row.email,
            homeroom: row.homeroom,
          };
          output.push(student);
        }
      }
    },
    goBack() {
      const vm = this;
      const prop = { cert_name: vm.$attrs.prop.cert_name, student_id: vm.$attrs.prop.student_id };
      vm.$router.push({ name: "CertificatePageCert", params: { prop } });
    },
    processForm: function () {
      const vm = this;
      if (this.invalid_student_ids.length > 0) {
        vm.$parent.$swal
          .fire({
                                customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
            title: `Are you sure you want submit this with unverified students?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#FF4500",
            cancelButtonColor: "#00B32C",
            confirmButtonText: "Yes",
            reverseButtons: true,
          })
          .then((result) => {
            if (result.isConfirmed) {
              const cert_name = this.cert_name;
              const student_id = this.ok_student_ids_nondupe;
              const data = {
                certs: [{ cert_name: cert_name, student_id: student_id }],
              };
              axios({
                method: "post",
                url: `${this.$parent.API_BASE_URL}/certs/${this.$route.params.cert_id}`,
                data: data,
                headers: {
                  Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
              })
                .then(function (response) {
                  if (response.data.error) {
                    console.error(response);
                    vm.$parent.$toast.error(
                      "There was an error creating the certificate(s).",
                      { position: "top-right" }
                    );
                  } else {
                    const cert_id = vm.$route.params.cert_id;
                    vm.$parent.$toast.success(
                      "Successfully created the certificate(s).",
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
                    "There was an error creating the certificate(s).",
                    { position: "top-right" }
                  );
                  console.error(response);
                });
            }
          });
      } else {
        const cert_name = this.cert_name;
        const student_id = this.ok_student_ids;
        const data = {
          certs: [{ cert_name: cert_name, student_id: student_id }],
        };
        axios({
          method: "post",
          url: `${this.$parent.API_BASE_URL}/certs/${this.$route.params.cert_id}`,
          data: data,
          headers: {
            Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
          },
        })
          .then(function (response) {
            if (response.data.error) {
              console.error(response);
              vm.$parent.$toast.error(
                "There was an error creating the certificate(s).",
                { position: "top-right" }
              );
            } else {
              const cert_id = vm.$route.params.cert_id;
              vm.$parent.$toast.success(
                "Successfully created the certificate(s).",
                { position: "top-right" }
              );
              vm.$router.push({ name: "CertificatePage", params: { cert_id } });
            }
          })
          .catch(function (response) {
            vm.$parent.$toast.error(
              "There was an error creating the certificate(s).",
              { position: "top-right" }
            );
            console.error(response);
          });
      }
    },
  },
  mounted: async function () {
    await this.verifyStudents();
    await this.checkforExisting();
  },
  watch: {
    ok_student_ids: {
      handler: function () {
        this.count_ok_students++;
      },
    },
    invalid_student_ids: {
      handler: function () {
        this.count_invalid_students++;
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