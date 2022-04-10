<template>
  <div id="awards">
    <b-container fluid>
      <b-row>
        <b-col
          ><h1>{{ LANG_HEADER }}</h1></b-col
        >
        <b-col class="text-right"
          >
          <b-button
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            variant="primary"
            class="mr-1"
            :to="{ name: 'AdminAwardsImport' }"
            ><b-icon icon="file-earmark-arrow-up" aria-hidden="true"></b-icon> Bulk Import</b-button
          >
        </b-col>
      </b-row>
    </b-container>
    <b-table
      :empty-html="EMTPY_TABLE"
      bordered
      show-empty
      :items="items"
      :fields="fields"
    >
      <template #cell(actions)="data">
        <b-button
          variant="primary"
          :to="{ name: 'CertificatePage', params: { dept_id: data.item.dept_id, cert_id: data.item.cert_id }}"
          ><b-icon icon="arrow-right" aria-hidden="true"></b-icon> View Award</b-button
        >
      </template>
    </b-table>
    Total Awards: <b>{{totalItems}}</b>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "awards",
  data: function () {
    return {
      LANG_HEADER: "All Awards",
      EMTPY_TABLE: "<p>Loading data...</p>",
      fields: [
        {
          key: "cert_id",
          label: "Award ID",
        },
        {
          key: "cert_name",
          label: "Award Name",
        },
        {
          key: "cert_max_child",
          label: "Max Certificates",
        },
        {
          key: "cert_lock",
          label: "Award Locked?",
        },
        "actions"
      ],
      items: [],
      totalItems: 0,
    };
  },
  methods: {
    API_awards: async function () {
      const vm = this;
      vm.isLoading = true;
      const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/certs`, {
        headers: {
          Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
        },
      });
      if (data.error) {
        vm.EMTPY_TABLE = "<h3>There are no awards to show</h3>";
        vm.totalItems = 0;
        vm.items = [];
        vm.isLoading = false;
      } else {
        vm.totalItems = data.data.certs.length;
        vm.items = data.data.certs;
        vm.isLoading = false;
      }
    },
  },
  mounted: function () {
    this.API_awards().catch((error) => {
      console.error(error);
    });
  },
  watch: {
    currentPage: {
      handler: function () {
        this.API_awards().catch((error) => {
          console.error(error);
        });
      },
    },
  },
};
</script>
<style scoped>
#awards {
  padding-top: 2em;
  padding-left: 5em;
  padding-right: 5em;
}
</style>