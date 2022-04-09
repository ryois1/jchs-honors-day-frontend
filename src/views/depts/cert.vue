<template>
  <div id="certs">
    <b-container fluid>
      <b-row>
        <b-col
          cols="8"
          ><h1>{{ LANG_HEADER }}</h1></b-col
        >
        <b-col class="text-right"
          ><b-button
            v-if="this.$parent.USER_INFO.role == 'ADMIN' && showButtons"
            variant="primary"
            :to="{name: 'CertificateNewAward'}"
            ><b-icon icon="plus-square"></b-icon> New Award</b-button
          ></b-col
        >
      </b-row>
    </b-container>
    <b-alert v-if="this.totalItems === 0 && showError" show variant="warning">No Awards</b-alert>
    <b-card-group columns>
      <b-card 
        v-for="(item) in items" :key="item.cert_id"
        :title="item.cert_name"
        border-variant="secondary"
        class="cards"
      >
        <template #header>
          <b-row>
            <b-col>
          <div>
            <div v-if="item.cert_lock == false">
              <b-icon icon="unlock-fill" variant="success" aria-hidden="true"></b-icon> Unlocked
            </div>
            <div v-if="item.cert_lock == true">
              <b-icon icon="lock-fill" variant="danger" aria-hidden="true"></b-icon> Locked
            </div>
          </div>
          </b-col>
          </b-row>
        </template>
        Max Certificate(s): <b>{{ item.cert_max_child }}</b>
        <template #footer>
          <b-row>
            <b-col>
              <b-button variant="danger" v-b-tooltip.hover title="Lock Award" class="mr-1" v-if="hasEdit && item.cert_lock == false" @click="lockAward(item.cert_id)" ><b-icon icon="lock" aria-hidden="true"></b-icon></b-button>
              <b-button variant="warning" v-b-tooltip.hover title="Unlock Award" class="mr-1" v-if="hasEdit && item.cert_lock == true" @click="unlockAward(item.cert_id)"><b-icon icon="unlock" aria-hidden="true"></b-icon></b-button>
              <b-button variant="warning" v-b-tooltip.hover title="Change Max Certificates" class="mr-1" v-if="hasEdit" @click="changeMaxCerts(item.cert_id, item.cert_owner_id, item)"><b-icon icon="pencil" aria-hidden="true"></b-icon></b-button>
              <b-button variant="warning" v-b-tooltip.hover title="Change Award Name" class="mr-1" v-if="hasEdit" @click="changeAwardName(item.cert_id, item.cert_owner_id, item)"><b-icon icon="input-cursor-text" aria-hidden="true"></b-icon></b-button>
              <b-button variant="danger" v-b-tooltip.hover title="Delete Award" class="mr-1" v-if="hasEdit" @click="deleteAward(item.cert_id, item.cert_owner_id)"><b-icon icon="trash-fill" aria-hidden="true"></b-icon></b-button>
            </b-col>
            <b-col>
              <b-button variant="primary" class="float-right" :to="{name: 'CertificatePage', params: { cert_id: item.cert_id }}"><b-icon icon="arrow-right"></b-icon> Go to Certificate</b-button>
            </b-col>
          </b-row>
      </template>
      </b-card>
    </b-card-group>
    <b-button id="go_back" class="mr-1" @click="goBack">Go Back</b-button>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "certs",
  data: function () {
    return {
      LANG_HEADER: "Awards in ???",
      EMTPY_TABLE: "<p>Loading data...</p>",
      DEPT_NAME: "???",
      USER_ROLE: this.$parent.USER_INFO.role,
      ADMINS: this.$parent.ADMINS,
      items: [],
      currentPage: 1,
      perPage: 10,
      totalItems: null,
      showError: true,
      showButtons: true,
    };
  },
  methods: {
    goBack() {
      this.$router.push({ name: "Departments"});
    },
    changeMaxCerts: async function (cert_id, cert_owner_id, item) {
      const vm = this;
      if (
        !(
          vm.$parent.USER_INFO.role == "ADMIN" ||
          vm.$parent.USER_INFO.role == "COMMITTEE"
        )
      ) {
        if (cert_owner_id != vm.$parent.USER_INFO.user_id) {
          vm.$parent.$toast.error("No permissions.", { position: "top-right" });
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
          title: `Enter New Amount`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Change",
          reverseButtons: true,
          input: "text",
          inputValue: item.cert_max_child,
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            const data = {
              certs: [{ new_max: result.value, cert_id: cert_id }],
            };
            axios({
              method: "put",
              url: `${vm.$parent.API_BASE_URL}/certs/${cert_id}/max`,
              data: data,
              headers: {
                Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
              },
            })
              .then(function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error modifying the award.",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success(
                    "Successfully modified the award.",
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
                  "There was an error modifying the award.",
                  { position: "top-right" }
                );
                console.error(response);
              });
          }
        });
    },
    changeAwardName: async function (cert_id, cert_owner_id, item) {
      const vm = this;
      if (
        !(
          vm.$parent.USER_INFO.role == "ADMIN" ||
          vm.$parent.USER_INFO.role == "COMMITTEE"
        )
      ) {
        if (cert_owner_id != vm.$parent.USER_INFO.user_id) {
          vm.$parent.$toast.error("No permissions.", { position: "top-right" });
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
          title: `Enter New Award Name`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Change",
          reverseButtons: true,
          input: "text",
          inputValue: item.cert_name,
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            const data = {
              certs: [{ cert_name: result.value }],
            };
            axios({
              method: "put",
              url: `${vm.$parent.API_BASE_URL}/certs/${cert_id}`,
              data: data,
              headers: {
                Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
              },
            })
              .then(function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error modifying the award.",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success(
                    "Successfully modified the award.",
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
                  "There was an error modifying the award.",
                  { position: "top-right" }
                );
                console.error(response);
              });
          }
        });
    },
    deleteAward: async function (cert_id, cert_owner_id) {
      const vm = this;
      if (
        !(
          vm.$parent.USER_INFO.role == "ADMIN" ||
          vm.$parent.USER_INFO.role == "COMMITTEE"
        )
      ) {
        if (cert_owner_id != vm.$parent.USER_INFO.user_id) {
          vm.$parent.$toast.error("No permissions.", { position: "top-right" });
          return;
        }
      }

      this.$parent.$swal
        .fire({
                              customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
          title: `Delete this award?`,
          html:
            "<p>Are you sure you want to delete this award?</p><br><b>This action cannot be undone.</b><br>",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Delete",
          reverseButtons: true,
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            axios
              .delete(`${vm.$parent.API_BASE_URL}/certs/${cert_id}`, {
                headers: {
                  Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
              })
              .then(function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error deleting the award.",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success("Successfully deleted the award.", {
                    position: "top-right",
                  });
                }
                vm.API_certs().catch((error) => {
                  vm.EMTPY_TABLE = "<h3>There are no awards to show</h3>";
                  vm.totalItems = 0;
                  vm.items = [];
                  console.error(error);
                });
              })
              .catch(function (response) {
                vm.$parent.$toast.error(
                  "There was an error deleting the award.",
                  { position: "top-right" }
                );
                console.error(response);
              });
          }
        });
    },
    lockAward: async function (cert_id) {
      const vm = this;
      if (
        !(
          vm.$parent.USER_INFO.role == "ADMIN"
        )
      ) {
          vm.$parent.$toast.error("No permissions.", { position: "top-right" });
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
          title: `Lock this award?`,
          html:
            "<p>Are you sure you want to lock this award?<br>Nobody will be able to edit the award after it has been locked",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          confirmButtonText: "Lock",
          reverseButtons: true,
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            axios
              .get(`${vm.$parent.API_BASE_URL}/certs/${cert_id}/lock`, {
                headers: {
                  Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
              })
              .then(function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error locking the award.",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success("Successfully locked the award.", {
                    position: "top-right",
                  });
                }
                vm.API_certs().catch((error) => {
                  console.error(error);
                });
              })
              .catch(function (response) {
                vm.$parent.$toast.error(
                  "There was an error locking the award.",
                  { position: "top-right" }
                );
                console.error(response);
              });
          }
        });
    },
    unlockAward: async function (cert_id) {
      const vm = this;
      if (
        !(
          vm.$parent.USER_INFO.role == "ADMIN"
        )
      ) {
          vm.$parent.$toast.error("No permissions.", { position: "top-right" });
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
          title: `Unlock this award?`,
          html:
            "<p>Are you sure you want to unlock this award?<br>Users with permission will be able edit the award",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#ffc107",
          confirmButtonText: "Unlock",
          reverseButtons: true,
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            axios
              .get(`${vm.$parent.API_BASE_URL}/certs/${cert_id}/unlock`, {
                headers: {
                  Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
              })
              .then(function (response) {
                if (response.data.error) {
                  console.error(response);
                  vm.$parent.$toast.error(
                    "There was an error unlocking the award.",
                    { position: "top-right" }
                  );
                } else {
                  vm.$parent.$toast.success("Successfully unlocked the award.", {
                    position: "top-right",
                  });
                }
                vm.API_certs().catch((error) => {
                  console.error(error);
                });
              })
              .catch(function (response) {
                vm.$parent.$toast.error(
                  "There was an error unlocking the award.",
                  { position: "top-right" }
                );
                console.error(response);
              });
          }
        });
    },
    API_certs: async function () {
      const vm = this;
      const { data } = await axios.get(
        `${vm.$parent.API_BASE_URL}/dept/${vm.$route.params.dept_id}/certs`,
        {
          headers: {
            Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
          },
        }
      );
      if (data.error) {
        vm.EMTPY_TABLE = "<h3>There are no awards to show</h3>";
        vm.totalItems = 0;
        vm.items = [];
      } else {
        vm.totalItems = data.count;
        vm.items = data.data.certs;
      }
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
      if(data.error){
        vm.LANG_HEADER = `There was an error loading the department: ${data.message}.`
        vm.showError = false;
        vm.showButtons = false;
      }
      vm.DEPT_NAME = data.data.depts[0].department_name;
      vm.LANG_HEADER = `Awards in "${vm.DEPT_NAME}"`;
    },
  },
  mounted: function () {
    this.API_dept();
    this.API_certs().catch((error) => {
      console.error(error);
    });
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
  computed: {
    hasEdit () {
      if(this.$parent.ADMINS.includes(this.$parent.USER_INFO.role)){
        return true;
      }else{
        return false;
      }
    }
  }
};
</script>
<style scoped>
#certs {
  padding-top: 2em;
  padding-left: 5em;
  padding-right: 5em;
}
</style>