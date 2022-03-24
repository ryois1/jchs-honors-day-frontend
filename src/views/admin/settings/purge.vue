<template>
  <div>
    <b-jumbotron id="purge_hero" v-if="$auth.isAuthenticated && this.$parent.USER_AUTHORIZED">
      <template #header>{{ LANG_WELCOME }}</template>
      <template #lead>
        Please make sure you know what you are doing and the consequences of the
        actions on this page!
      </template>
      <hr class="my-4" />
      <b-button
        class="mr-1"
        v-if="this.$parent.USER_INFO.role == 'ADMIN'"
        variant="danger"
        @click="purgeDelegates"
        ><b-icon icon="trash-fill"></b-icon> Delete All Delegations</b-button
      >
      <b-button
        class="mr-1"
        v-if="this.$parent.USER_INFO.role == 'ADMIN'"
        variant="danger"
        @click="purgeAwards"
        ><b-icon icon="award-fill"></b-icon> Purge Awards</b-button
      >
      <b-button
        class="mr-1"
        v-if="this.$parent.USER_INFO.role == 'ADMIN'"
        variant="danger"
        @click="purgeCerts"
        ><b-icon icon="award-fill"></b-icon> Purge Certificates</b-button
      >
      <b-button
        class="mr-1"
        v-if="this.$parent.USER_INFO.role == 'ADMIN'"
        variant="danger"
        @click="purgeStudents"
        ><b-icon icon="people-fill"></b-icon> Purge Students</b-button
      >
      <b-button
        class="mr-1"
        v-if="this.$parent.USER_INFO.role == 'ADMIN'"
        variant="danger"
        @click="purgeAll"
        ><b-icon icon="trash-fill"></b-icon> Purge Everything</b-button
      >
      <b-button
        class="mr-1"
        v-if="this.$parent.USER_INFO.role == 'ADMIN'"
        variant="warning"
        @click="unlockAll"
        ><b-icon icon="unlock-fill"></b-icon> Unlock All Awards</b-button
      >
    </b-jumbotron>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "homepage",
  data: function () {
    return {
      LANG_WELCOME: `Warning Area`,
    };
  },
  methods: {
    purgeAwards: async function () {
      const vm = this;
      this.$parent.$swal
        .fire({
          title: `Purge Awards?`,
                    customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
          html:
            "<p>Are you sure you want to purge awards?</p><br><b>This action cannot be undone.<br>This deletes awards, certificates, and user associations with the award.</b><br><br><b>Type \"DELETE\" below to delete.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Delete",
          reverseButtons: true,
          input: "text",
          inputAttributes: {
            id: "confirmDelete",
          },
          inputValidator: (value) => {
            if (value != "DELETE") {
              return '<span>You must type in <b class="text-danger">DELETE</b> to delete.</span>';
            }
          },
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            axios
              .delete(`${vm.$parent.API_BASE_URL}/purge/awards`, {
                headers: {
                  Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
              })
              .then(function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error purging the awards.",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success("Successfully purged the awards.", {
                    position: "top-right",
                  });
                }
              })
              .catch(function (response) {
                vm.$parent.$toast.error(
                  "There was an error purging the awards.",
                  { position: "top-right" }
                );
                console.error(response);
              });
          }
        });
    },
    purgeCerts: async function () {
      const vm = this;
      this.$parent.$swal
        .fire({
          title: `Purge Certificates?`,
                    customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
          html:
            "<p>Are you sure you want to purge certificates?</p><br><b>This action cannot be undone.<br>This deletes certificates only</b><br><br><b>Type \"DELETE\" below to delete.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Delete",
          reverseButtons: true,
          input: "text",
          inputAttributes: {
            id: "confirmDelete",
          },
          inputValidator: (value) => {
            if (value != "DELETE") {
              return '<span>You must type in <b class="text-danger">DELETE</b> to delete.</span>';
            }
          },
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            axios
              .delete(`${vm.$parent.API_BASE_URL}/purge/certs`, {
                headers: {
                  Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
              })
              .then(function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error purging the certificates.",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success("Successfully purged the certificates.", {
                    position: "top-right",
                  });
                }
              })
              .catch(function (response) {
                vm.$parent.$toast.error(
                  "There was an error purging the certificates.",
                  { position: "top-right" }
                );
                console.error(response);
              });
          }
        });
    },
    purgeStudents: async function () {
      const vm = this;
      this.$parent.$swal
        .fire({
          title: `Purge Students?`,
                    customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
          html:
            "<p>Are you sure you want to purge students?</p><br><b>This action cannot be undone.</b><br><br><b>Type \"DELETE\" below to delete.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Delete",
          reverseButtons: true,
          input: "text",
          inputAttributes: {
            id: "confirmDelete",
          },
          inputValidator: (value) => {
            if (value != "DELETE") {
              return '<span>You must type in <b class="text-danger">DELETE</b> to delete.</span>';
            }
          },
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            axios
              .delete(`${vm.$parent.API_BASE_URL}/purge/students`, {
                headers: {
                  Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
              })
              .then(function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error purging the students.",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success("Successfully purged the students.", {
                    position: "top-right",
                  });
                }
              })
              .catch(function (response) {
                vm.$parent.$toast.error(
                  "There was an error purging the students.",
                  { position: "top-right" }
                );
                console.error(response);
              });
          }
        });
    },
    purgeAll: async function () {
      const vm = this;
      this.$parent.$swal
        .fire({
          title: `Purge Everything?`,
                    customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
          html:
            "<p>Are you sure you want to purge everything?</p><br><b>This action cannot be undone.<br>This deletes awards, certificates, user associations with the awards, users, and departments.</b><br><br><b>Type \"DELETE ALL\" below to delete.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Delete",
          reverseButtons: true,
          input: "text",
          inputAttributes: {
            id: "confirmDelete",
          },
          inputValidator: (value) => {
            if (value != "DELETE ALL") {
              return '<span>You must type in <b class="text-danger">DELETE ALL</b> to delete.</span>';
            }
          },
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            axios
              .delete(`${vm.$parent.API_BASE_URL}/purge/all`, {
                headers: {
                  Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
              })
              .then(function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error purging everything.",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success("Successfully purged everything.", {
                    position: "top-right",
                  });
                }
              })
              .catch(function (response) {
                vm.$parent.$toast.error(
                  "There was an error purging everything.",
                  { position: "top-right" }
                );
                console.error(response);
              });
          }
        });
    },
    purgeDelegates: async function () {
      const vm = this;
      this.$parent.$swal
        .fire({
          title: `Purge Delegates?`,
                    customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
          html:
            "<p>Are you sure you want to purge all delegates?</p><br><b>This action cannot be undone.<br>This deletes user associations with the awards.</b><br><br><b>Type \"DELETE\" below to delete.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Delete",
          reverseButtons: true,
          input: "text",
          inputAttributes: {
            id: "confirmDelete",
          },
          inputValidator: (value) => {
            if (value != "DELETE") {
              return '<span>You must type in <b class="text-danger">DELETEL</b> to delete.</span>';
            }
          },
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            axios
              .delete(`${vm.$parent.API_BASE_URL}/purge/delegations`, {
                headers: {
                  Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
              })
              .then(function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error purging delegates.",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success("Successfully purged delegates.", {
                    position: "top-right",
                  });
                }
              })
              .catch(function (response) {
                vm.$parent.$toast.error(
                  "There was an error purging delegates.",
                  { position: "top-right" }
                );
                console.error(response);
              });
          }
        });
    },
    unlockAll: async function () {
      const vm = this;
      this.$parent.$swal
        .fire({
          title: `Unlock all awards?`,
                    customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
          html:
            "<p>Are you sure you want to unlock all awards?</p>",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Unlock",
          reverseButtons: true,
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            axios
              .delete(`${vm.$parent.API_BASE_URL}/purge/unlock`, {
                headers: {
                  Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
              })
              .then(function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error unlocking everything.",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success("Successfully unlocked everything.", {
                    position: "top-right",
                  });
                }
              })
              .catch(function (response) {
                vm.$parent.$toast.error(
                  "There was an error unlocking everything.",
                  { position: "top-right" }
                );
                console.error(response);
              });
          }
        });
    },
  },
};
</script>
<style scoped>
@media (prefers-color-scheme: dark) {
  #purge_hero{
    color: #ffffff;
    background-color: var(--alt-dark-bg);
  }
}
</style>