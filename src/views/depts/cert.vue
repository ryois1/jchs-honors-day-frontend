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
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            variant="primary"
            :to="{name: 'CertificateNewParent'}"
            >New Award</b-button
          ></b-col
        >
      </b-row>
    </b-container>
    <b-table
      :empty-html="EMTPY_TABLE"
      bordered
      show-empty
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="0"
    >
      <template #cell(cert_id)="data">
        <b-button
          variant="primary"
          :to="{name: 'CertificatePage', params: { cert_id: data.item.cert_id }}"
          >View Certificates</b-button
        >
      </template>
      <template #cell(cert_max_child)="data">
        <div class="container">
          <div class="col">
            <p>
              {{ data.item.cert_max_child }}
              <span class="pull-right">
                <b-button
                  variant="warning"
                  v-if="hasEdit"
                  @click="
                    changeMaxCerts(data.item.cert_id, data.item.cert_owner_id)
                  "
                  >Change Max Certs</b-button
                >
              </span>
            </p>
          </div>
        </div>
      </template>
      <template #cell(cert_lock)="data">
        <div>
            <div v-if="data.item.cert_lock == false">
              <b-icon icon="unlock-fill" variant="success" aria-hidden="true"></b-icon> Unlocked
              <b-button
                variant="danger"
                v-if="hasEdit"
                @click="lockAward(data.item.cert_id)"
                >Lock</b-button>
            </div>
            <div v-if="data.item.cert_lock == true">
              <b-icon icon="lock-fill" variant="danger" aria-hidden="true"></b-icon> Locked
              <b-button
                variant="warning"
                v-if="hasEdit"
                @click="unlockAward(data.item.cert_id)"
                >Unlock</b-button>
            </div>
        </div>
      </template>
      <template #cell(delete)="data">
        <div>
          <p v-if="!hasEdit">No Permissions</p>
          <b-button
            variant="danger"
            v-if="hasEdit"
            @click="deleteAward(data.item.cert_id, data.item.cert_owner_id)"
            >Delete <b-icon icon="trash-fill" aria-hidden="true"></b-icon
          ></b-button>
        </div>
      </template>
    </b-table>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "certs",
  data: function () {
    return {
      LANG_HEADER: "Viewing All Awards in ???",
      EMTPY_TABLE: "<p>Loading data...</p>",
      DEPT_NAME: "???",
      USER_ROLE: this.$parent.USER_INFO.role,
      fields: [
        {
          key: "cert_owner_id",
          label: "Award Owner ID",
          thClass: "d-none",
          tdClass: "d-none",
        },
        {
          key: "cert_name",
          label: "Award Name",
        },
        {
          key: "cert_id",
          label: "View Award",
        },
        {
          key: "cert_max_child",
          label: "Max Certificates",
        },
        {
          key: "cert_lock",
          label: "Award Status",
        },
        {
          key: "delete",
          label: "Delete",
        }
      ],
      items: [],
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
    };
  },
  methods: {
    changeMaxCerts: async function (cert_id, cert_owner_id) {
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
          title: `Enter New Amount`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Change",
          reverseButtons: true,
          input: "text",
          inputPlaceholder: "Number",
        })
        .then(async function (result) {
          if (result.isConfirmed) {
            const data = {
              certs: [{ new_max: result.value, cert_id: cert_id }],
            };
            console.log(data);
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
      vm.DEPT_NAME = data.data.depts[0].department_name;
      if (
        vm.$parent.USER_INFO.role == "ADMIN" ||
        vm.$parent.USER_INFO.role == "DEPT_ADMIN" ||
        vm.$parent.USER_INFO.role == "COMMITTEE"
      ) {
        vm.LANG_HEADER = `Viewing Awards in "${vm.DEPT_NAME}"`;
      } else {
        vm.LANG_HEADER = `Viewing Awards in "${vm.DEPT_NAME}"`;
      }
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