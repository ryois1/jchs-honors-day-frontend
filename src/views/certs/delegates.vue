<template>
  <div id="certs">
    <b-container fluid>
      <b-row>
        <b-col
          ><h1>{{ LANG_HEADER }}</h1></b-col
        >
      </b-row>
    </b-container>
    <b-table
      :empty-html="EMTPY_TABLE"
      bordered
      show-empty
      :items="items"
      :fields="fields"
    >
      <template #cell(delete)="data">
        <b-button variant="danger" @click="deleteDelegate(data.item.user_id)"
          >Delete <b-icon icon="trash-fill" aria-hidden="true"></b-icon
        ></b-button>
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
      LANG_HEADER: 'Viewing Delegates for Certificate "???"',
      EMTPY_TABLE: "<p>Loading data...</p>",
      fields: [
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
        "delete",
      ],
      items: [],
    };
  },
  methods: {
    deleteDelegate: async function (delegate_id) {
      const vm = this;
      this.$parent.$swal
        .fire({
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
                    vm.items = [];
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
    API_delegates: async function () {
      const vm = this;
      vm.EMTPY_TABLE = "<h3>There are no delegates to show</h3>";
      const { data } = await axios.get(
        `${vm.$parent.API_BASE_URL}/certs/${this.$route.params.cert_id}/delegate`,
        {
          headers: {
            Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
          },
        }
      );
      if (data.data.delegates == 0) {
        vm.EMTPY_TABLE = "<h3>There are no delegates to show</h3>";
        vm.totalItems = 0;
        vm.items = [];
      } else {
        vm.totalItems = data.count;
        vm.items = data.data.delegates;
      }
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
      vm.LANG_HEADER = `Viewing Delegated Certificates for "${data.data.certs[0].cert_name}"`;
    },
  },
  mounted: function () {
    this.API_cert_info();
    this.API_delegates().catch((error) => {
      console.error(error);
    });
  },
};
</script>
<style scoped>
#certs {
  padding-top: 2em;
  padding-left: 5em;
  padding-right: 5em;
}
</style>