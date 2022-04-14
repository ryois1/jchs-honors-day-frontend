<template>
  <div id="certs">
    <b-container fluid>
      <goBack target="DepartmentsCertificates"/>
      <b-row>
        <b-col
          ><h1>
            {{ LANG_VIEWING_CERT }} <b-badge v-if="showContents">{{ CERT_COUNT }}</b-badge>
          </h1>
          <h3 v-if="showContents">
            Your certificate slots <b-badge>{{ SELF_CERT_COUNT }}</b-badge>
          </h3></b-col
        >
        <b-col class="text-right" v-if="showContents && this.NOT_LOCKED">
          <b-button
            v-if="
              this.allowed_delegate &&
              this.$parent.ADMINS.includes(this.$parent.USER_INFO.role)
            "
            :to="{
              name: 'CertificatePageDelegate', params: { cert_id: this.$route.params.cert_id }
            }"
            class="mr-1"
            variant="primary"
            ><b-icon icon="box-arrow-up" aria-hidden="true"></b-icon> Delegate Certificates to Teachers</b-button
          >
          <b-button
            v-if="showContents && this.$parent.USER_INFO.role == 'TEACHER'"
            @click="releaseCert"
            class="mr-1"
            variant="primary"
            ><b-icon icon="box-arrow-up" aria-hidden="true"></b-icon> Return Certificates to Department Chair</b-button
          >
          <b-button
            v-if="showContents && this.CERT_MAX_CHILD >= this.totalItems && this.allowed_edit"
            variant="primary"
            :disabled="DISABLED_ADD"
            class="btn-success btn-lg"
            id="award-button"
            :to="{ name: 'CertificatePageCert', params: { cert_id: this.$route.params.cert_id } }"
            ><b-icon icon="award" aria-hidden="true"></b-icon> Award Certificates to Students</b-button
          >
          <b-tooltip v-if="this.$parent.USER_INFO.role == 'TEACHER'" show target="award-button">Click here to get started!</b-tooltip>
          </b-col
        >
        <b-col class="text-right" v-if="!this.allowed_edit && showContents"
          ><h5>You are not allowed to edit this certificate</h5></b-col
        >
      </b-row>
    </b-container>
    <b-table
      v-if="showContents && this.$parent.ADMINS.includes(this.$parent.USER_INFO.role)"
      :empty-html="DELEGATES_EMTPY_TABLE"
      bordered
      show-empty
      :items="delegates_items"
      :fields="delegates_fields"
    >
      <template #cell(actions)="data">
        <b-button variant="danger" @click="deleteDelegate(data.item.user_id)"
          ><b-icon icon="trash-fill" aria-hidden="true"></b-icon> Delete</b-button>
      </template>
    </b-table>
    <b-table
      :empty-html="EMTPY_TABLE"
      bordered
      show-empty
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
      class="table"
      v-if="showContents"
    >
      <template #cell(cert_notes)="data">
        <div v-if="data.item.cert_notes"><p>{{noteView(data.item.cert_notes)}}</p><b-button variant="primary" @click="notes('view', data.item.cert_id, data.item.cert_owner_id, data.item)"><b-icon icon="pencil-square" aria-hidden="true"></b-icon> View Note</b-button></div>
        <div v-if="!data.item.cert_notes"><b-button variant="primary" @click="notes('add', data.item.cert_id, data.item.cert_owner_id, data.item)"><b-icon icon="pencil-square" aria-hidden="true"></b-icon> Add Note</b-button></div>
      </template>
      <template #cell(student_id)="data">
        <p v-if="studentIDVisible">{{data.item.student_id}}</p>
        <p v-if="!studentIDVisible"><i>Student IDs are not shown</i></p>
      </template>
      <template #cell(actions)="data">
        <b-button
          variant="danger"
          @click="deleteCert(data.item.cert_id, data.item.cert_owner_id)"
          ><b-icon icon="trash-fill" aria-hidden="true"></b-icon> Delete</b-button>
      </template>
      <template #cell(cert_file)="data">
        <p v-if="data.item.cert_file">Uploaded</p>
        <p v-if="!data.item.cert_file">Not Uploaded</p>
      </template>
    </b-table>
    <br>
  </div>
</template>
<script>
import axios from "axios";
import goBack from '../../components/global/go_back.vue'

export default {
  components: {
    goBack: goBack,
  },
  name: "certs",
  data: function () {
    return {
      studentIDVisible: this.$parent.studentIDVisible,
      delegates_fields: [
        {
          key: "user_id",
          label: "User ID",
          thClass: "d-none",
          tdClass: "d-none",
        },
        {
          key: "user_name",
          label: "Delegate Name",
        },
        {
          key: "user_email",
          label: "Delegate Email",
        },
        {
          key: "max",
          label: "Max Allowed for Delegate",
        },
        {
          key: "current",
          label: "Currently Used by Delegate",
        },
        "actions",
      ],
      LANG_VIEWING_CERT: "Loading...",
      CERT_COUNT: "None",
      SELF_CERT_COUNT: "None",
      CERT_NAME: "Unknown",
      CERT_OWNER_ID: "Unknown",
      CERT_EMAIL: "Unknown",
      CERT_OWNER_NAME: "Unknown",
      CERT_MAX_CHILD: 0,
      SELF_MAX_CERT: 0,
      SELF_CURRENT_CERT: 0,
      allowed_edit: false,
      allowed_delegate: false,
      NOT_LOCKED: true,
      LOCKED: false,
      showContents: true,
      EMTPY_TABLE: "<p>Loading data...</p>",
      DELEGATES_EMTPY_TABLE: "<p>Loading data...</p>",
      fields: [
        {
          key: "cert_id",
          label: "Certificate ID",
          thClass: "d-none",
          tdClass: "d-none",
        },
        {
          key: "student_first_name",
          label: "First Name",
        },
        {
          key: "student_middle_name",
          label: "Middle Name",
        },
        {
          key: "student_last_name",
          label: "Last Name",
        },
        {
          key: "student_id",
          label: "Student ID",
        },
        {
          key: "student_email",
          label: "Student Email",
        },
        {
          key: "cert_name",
          label: "Certificate Name",
          thClass: "d-none",
          tdClass: "d-none",
        },
        {
          key: "cert_file",
          label: "Certificate File Status",
        },
        {
          key: "cert_notes",
          label: "Notes",
        },
        {
          key: "creator_name",
          label: "Creator Name",
        },
        "actions",
      ],
      delegates_items: [],
      items: [],
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
      delegates_totalItems: 0,
      DISABLED_ADD: false,
    };
  },
  methods: {
    deleteDelegate: async function (delegate_id) {
      const vm = this;
      if (!vm.$parent.ADMINS.includes(vm.$parent.USER_INFO.role)) {
        vm.$parent.$toast.error("No permissions.", { position: "top-right" });
        return;
      }
      if(vm.LOCKED){
          vm.$parent.$toast.error("Certificate is locked.", { position: "top-right" });
          return;
      }
      this.$parent.$swal
        .fire({
                              customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
          title: `Delete this delegation?`,
          html:
            "<p>Are you sure you want to delete this delegation?</p><br><b>This action cannot be undone.</b><br>",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Delete",
          reverseButtons: true,
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            axios
              .delete(
                `${vm.$parent.API_BASE_URL}/certs/${vm.$route.params.cert_id}/delegate/${delegate_id}`,
                {
                  headers: {
                    Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                  },
                }
              )
              .then(function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error deleting the delegate.",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success(
                    "Successfully deleted the delegate.",
                    { position: "top-right" }
                  );
                  vm.API_delegates().catch((error) => {
                    vm.delegates_items = [];
                    console.error(error);
                  });
                }
              })
              .catch(function (response) {
                vm.$parent.$toast.error(
                  "There was an error deleting the delegate.",
                  { position: "top-right" }
                );
                console.error(response);
              });
          }
        });
    },
    noteView: function(note){
      if(note.length > 20) {
         return `${note.slice(0,19)}...`;
      }
      return note;
    },
    notes: async function (action, cert_id, cert_owner_id, item) {
      const vm = this;
      let note = null;
      if (item.cert_notes === undefined){
        note = '';
      }else{
        note = item.cert_notes;
      }
      if(action == 'view' || action == 'add'){
      if (
        !(
          vm.$parent.USER_INFO.role == "ADMIN" ||
          vm.$parent.USER_INFO.role == "COMMITTEE"
        )
      ) {
        if (cert_owner_id != vm.$parent.USER_INFO.user_id) {
          await this.$parent.$swal
            .fire({
                                  customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
              title: `Notes`,
              icon: "info",
              confirmButtonText: "Close",
              reverseButtons: true,
              text: note,
          });
          return;
        }
      }
      await this.$parent.$swal
        .fire({
                              customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
          title: `Notes`,
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "OK",
          reverseButtons: true,
          input: "textarea",
          inputValue: note,
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            const data = {
              notes: result.value,
            };
            axios({
              method: "put",
              url: `${vm.$parent.API_BASE_URL}/certs/${cert_id}/notes`,
              data: data,
              headers: {
                Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
              },
            })
              .then(function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error updating the note..",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success(
                    "Successfully updated the note.",
                    {
                      position: "top-right",
                    }
                  );
                  vm.API_certs().catch((error) => {
                    console.error(error);
                  });
                }
              })
              .catch(function (response) {
                vm.$parent.$toast.error(
                  "There was an error updating the note.",
                  { position: "top-right" }
                );
                console.error(response);
              });
          }
        });
      }
      else{
      await this.$parent.$swal
        .fire({
                              customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
          title: `Notes`,
          icon: "info",
          confirmButtonText: "Close",
          reverseButtons: true,
          text: note,
        });
      }
    },
    API_delegates: async function () {
      const vm = this;
      vm.DELEGATES_EMTPY_TABLE = "<h3>There are no delegates to show</h3>";
      const { data } = await axios.get(
        `${vm.$parent.API_BASE_URL}/certs/${vm.$route.params.cert_id}/delegate`,
        {
          headers: {
            Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
          },
        }
      );
      if (data.data.delegates == 0) {
        vm.DELEGATES_EMTPY_TABLE = "<h3>There are no delegates to show</h3>";
        vm.delegates_totalItems = 0;
        vm.delegates_items = [];
      } else {
        vm.delegates_totalItems = data.count;
        vm.delegates_items = data.data.delegates;
      }
    },
    releaseCert: async function () {
      const vm = this;
      const self_current_count = vm.SELF_CURRENT_CERT;
      this.$parent.$swal
        .fire({
                              customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
          title: `Release these slots?`,
          html:
            '<b>This action can only be reversed by the department chairs or system administrators.</b>',
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Release",
          reverseButtons: true,
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            axios
              .delete(
                `${vm.$parent.API_BASE_URL}/certs/${vm.$route.params.cert_id}/release/${self_current_count}`,
                {
                  headers: {
                    Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                  },
                }
              )
              .then(function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error releasing the certificate.",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success(
                    "Successfully releasing the certificate.",
                    { position: "top-right" }
                  );
                  vm.API_delegates().catch((error) => {
                    vm.delegates_items = [];
                    console.error(error);
                  });
                }
              })
              .catch(function (response) {
                vm.$parent.$toast.error(
                  "There was an error releasing the certificate.",
                  { position: "top-right" }
                );
                console.error(response);
              });
          }
        });
    },
    deleteCert: async function (child_cert, cert_owner_id) {
      const vm = this;
      if (!vm.$parent.ADMINS.includes(vm.$parent.USER_INFO.role)) {
        if (cert_owner_id != vm.$parent.USER_INFO.user_id) {
          vm.$parent.$toast.error("No permissions.", { position: "top-right" });
          return;
        }
      }
      if(vm.LOCKED){
          vm.$parent.$toast.error("Certificate is locked.", { position: "top-right" });
          return;
      }
      this.$parent.$swal
        .fire({
                              customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
          title: `Delete this certificate?`,
          html:
            "<p>Are you sure you want to delete this certificate?</p><br><b>This action cannot be undone.</b>",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Delete",
          reverseButtons: true,
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            const parent_cert = vm.$route.params.cert_id;
            axios
              .delete(`${vm.$parent.API_BASE_URL}/certs/${parent_cert}/certs`, {
                data: { certs: [{ cert_id: child_cert }] },
                headers: {
                  Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
              })
              .then(async function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error deleting the certificate.",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success(
                    "Successfully deleted the certificate.",
                    { position: "top-right" }
                  );
                }
                await vm.API_certs().catch((error) => {
                  vm.EMTPY_TABLE = "<h3>There are no certificates to show</h3>";
                  vm.CERT_COUNT = `0/${vm.CERT_MAX_CHILD}`;
                  vm.items = [];
                  console.error(error);
                });
              })
              .catch(function (response) {
                vm.$parent.$toast.error(
                  "There was an error deleting the certificate.",
                  { position: "top-right" }
                );
                console.error(response);
              });
          }
        });
    },
    transferCert: async function () {
      const vm = this;
      vm.$parent.$swal
        .fire({
                              customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
          title: `Are you sure you want delegate this certificate? (Search by Email)`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Find Teacher",
          reverseButtons: true,
          input: "email",
          preConfirm: (search) => {
            const data = { search_query: search };
            return axios({
              method: "post",
              url: `${this.$parent.API_BASE_URL}/users/search`,
              data: data,
              headers: {
                Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
              },
            })
              .then((response) => {
                if (response.data.error) {
                  throw new Error(response.data.message);
                }
                return response.data.data.users[0];
              })
              .catch((error) => {
                vm.$parent.$swal.showValidationMessage(
                  `Request failed: ${error}`
                );
              });
          },
        })
        .then((result) => {
          const swal_result = result;
          if (result.isConfirmed) {
            vm.$parent.$swal
              .fire({
                                    customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
                showCancelButton: true,
                confirmButtonColor: "#dc3545",
                confirmButtonText: "Transfer",
                title: "Are you sure you want to delegate to this user?",
                text: `${result.value.first_name} ${result.value.last_name} (${result.value.email})`,
              })
              .then((result) => {
                if (result.isConfirmed) {
                  const vm = this;
                  const data = {
                    certs: [
                      {
                        user_id: swal_result.value.id,
                        cert_name: vm.CERT_NAME,
                      },
                    ],
                  };
                  axios({
                    method: "put",
                    url: `${this.$parent.API_BASE_URL}/certs/${vm.$route.params.cert_id}`,
                    data: data,
                    headers: {
                      Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                    },
                  })
                    .then(function (response) {
                      if (response.data.error) {
                        console.error(response);
                        vm.$parent.$toast.error(
                          "There was an error modifying the certificate.",
                          { position: "top-right" }
                        );
                      } else {
                        vm.$parent.$toast.success(
                          "Successfully transferred the certificate.",
                          { position: "top-right" }
                        );
                        vm.cert_name = "";
                      }
                    })
                    .catch(function (response) {
                      vm.$parent.$toast.error(
                        "There was an error modifying the certificate.",
                        { position: "top-right" }
                      );
                      console.error(response);
                    });
                }
              });
          }
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
      if(data.error){
        vm.LANG_VIEWING_CERT = `There was an error loading this award: "${data.message}".`;
        vm.showContents = false;
      }
      vm.CERT_NAME = data.data.certs[0].cert_name;
      vm.CERT_OWNER_ID = data.data.certs[0].cert_owner_id;
      vm.CERT_EMAIL = data.data.certs[0].user_email;
      vm.CERT_OWNER_NAME = data.data.certs[0].user_name;
      vm.CERT_MAX_CHILD = data.data.certs[0].cert_max_child;
      vm.SELF_MAX_CERT = data.data.certs[0].user_cert_max;
      vm.SELF_CURRENT_CERT = data.data.certs[0].user_cert_current;
      if(data.data.certs[0].cert_lock){
        vm.NOT_LOCKED = false;
        vm.LOCKED = true;
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
      }
      if (vm.$parent.ADMINS.includes(vm.$parent.USER_INFO.role)) {
        vm.SELF_CERT_COUNT = "Same as award";
      } else {
        if (data.data.certs[0].user_cert_current) {
          vm.SELF_CERT_COUNT = `${data.data.certs[0].user_cert_current}/${data.data.certs[0].user_cert_max}`;
        } else {
          vm.SELF_CERT_COUNT = `0/${data.data.certs[0].user_cert_max}`;
        }
      }
      vm.LANG_VIEWING_CERT = `${vm.CERT_NAME}`;
    },
    API_certs: async function () {
      const vm = this;
      const offset = vm.currentPage * vm.perPage - 10;
      const { data } = await axios.get(
        `${vm.$parent.API_BASE_URL}/certs/${vm.$route.params.cert_id}/certs`,
        {
          params: { offset: offset, limit: vm.perPage },
          headers: {
            Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
          },
        }
      );
      if (data.data.certs.length == 0) {
        vm.EMTPY_TABLE = "<h3>There are no certificates to show</h3>";
      }
      vm.totalItems = data.data.certs.length;
      if (data.data.certs.length > 0) {
        vm.CERT_COUNT = `${data.data.certs.length}/${vm.CERT_MAX_CHILD}`;
      } else {
        vm.CERT_COUNT = `0/${vm.CERT_MAX_CHILD}`;
      }
      if (data.data.certs.length > vm.CERT_MAX_CHILD) {
        vm.DISABLED_ADD = true;
      } else {
        vm.DISABLED_ADD = false;
      }
      vm.items = data.data.certs;
    },
  },
  mounted: async function () {
    const vm = this;
    if (vm.$parent.ADMINS.includes(vm.$parent.USER_INFO.role)) {
      vm.allowed_edit = true;
      vm.allowed_delegate = true;
      await this.API_cert_info();
      await this.API_delegates().catch((error) => {
        this.DELEGATES_EMTPY_TABLE = "<h3>There are no delegates to show</h3>";
        this.delegates_items = [];
        console.error(error);
      });
      await this.API_certs().catch((error) => {
        this.EMTPY_TABLE = "<h3>There are no certificates to show</h3>";
        this.CERT_COUNT = `0/${vm.CERT_MAX_CHILD}`;
        this.items = [];
        console.error(error);
      });
    } else {
      await this.API_cert_info();
      await this.API_delegates().catch((error) => {
        this.DELEGATES_EMTPY_TABLE = "<h3>There are no delegates to show</h3>";
        this.delegates_items = [];
        console.error(error);
      });
      await this.API_certs().catch((error) => {
        this.EMTPY_TABLE = "<h3>There are no certificates to show</h3>";
        this.CERT_COUNT = `0/${vm.CERT_MAX_CHILD}`;
        this.items = [];
        console.error(error);
      });
      if (vm.SELF_MAX_CERT > 0) {
        vm.allowed_edit = true;
      } else {
        vm.allowed_edit = false;
      }
      if (vm.CERT_OWNER_ID == vm.$parent.USER_INFO.user_id) {
        vm.allowed_delegate = true;
      } else {
        vm.allowed_delegate = false;
      }
    }
  },
  watch: {
    currentPage: {
      handler: function () {
        this.API_certs().catch((error) => {
          console.error(error);
        });
      },
    },
  },
};
</script>
<style scoped>
#certs {
  padding-top: 2em;
  padding-left: 5em;
  padding-right: 5em;
  width: 100%;
}
</style>