<template>
  <div>
    <b-jumbotron v-if="$auth.isAuthenticated && this.$parent.USER_AUTHORIZED">
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
        @click="purgeAwards"
        >Purge Awards</b-button
      >
      <b-button
        class="mr-1"
        v-if="this.$parent.USER_INFO.role == 'ADMIN'"
        variant="danger"
        @click="purgeCerts"
        >Purge Certificates</b-button
      >
      <b-button
        class="mr-1"
        v-if="this.$parent.USER_INFO.role == 'ADMIN'"
        variant="danger"
        @click="purgeAll"
        >Purge Everything</b-button
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
      LANG_WELCOME: `All Actions on This Page are Destructive`,
    };
  },
  methods: {
    purgeAwards: async function () {
      const vm = this;
      this.$parent.$swal
        .fire({
          title: `Purge Awards?`,
          html:
            "<p>Are you sure you want to purge awards?</p><br><b>This action cannot be undone.<br>This deletes awards, certificates, and user associations with the award.</b><br>",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Delete",
          reverseButtons: true,
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
          html:
            "<p>Are you sure you want to purge certificates?</p><br><b>This action cannot be undone.<br>This deletes certificates only</b><br>",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Delete",
          reverseButtons: true,
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
    purgeAll: async function () {
      const vm = this;
      this.$parent.$swal
        .fire({
          title: `Purge Everything?`,
          html:
            "<p>Are you sure you want to purge everything?</p><br><b>This action cannot be undone.<br>This deletes awards, certificates, user associations with the awards, users, and departments.</b><br>",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Delete",
          reverseButtons: true,
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
  },
};
</script>
<style scoped>
</style>