<template>
  <div>
    <b-jumbotron v-if="$auth.isAuthenticated && this.$parent.USER_AUTHORIZED">
      <template #header>{{ LANG_WELCOME }}</template>
      <hr class="my-4" />
      <b-button
        class="mr-1"
        v-if="this.$parent.USER_INFO.role == 'ADMIN'"
        variant="primary"
        @click="downloadCertsCSV"
        >Download CSV</b-button
      >
      <b-button
        v-if="this.$parent.USER_INFO.role == 'ADMIN'"
        variant="primary"
        :to="{ path: `/certificates/import/step/1` }"
        >Import PDFs</b-button
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
      LANG_WELCOME: `Admin`,
    };
  },
  methods: {
    downloadCertsCSV: async function () {
      const vm = this;
      axios
        .get(`${vm.$parent.API_BASE_URL}/certs_csv`, {
          headers: {
            Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
          },
        })
        .then(function (response) {
          if (response.data.error) {
            console.error(response);
            vm.$parent.$toast.error("There was an error downloading the CSV.", {
              position: "top-right",
            });
          } else {
            let blob = new Blob([response.data.data.csv], {
                type: "application/octet-stream",
              }),
              url = window.URL.createObjectURL(blob);
            let tempLink = document.createElement("a");
            tempLink.style.display = "none";
            tempLink.href = url;
            tempLink.setAttribute("download", response.data.data.file_name);
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(url);
            vm.$parent.$toast.success("Successfully downloaded the CSV.", {
              position: "top-right",
            });
          }
        })
        .catch(function (response) {
          vm.$parent.$toast.error("There was an error downloading the CSV.", {
            position: "top-right",
          });
          console.error(response);
        });
    },
  },
};
</script>
<style scoped>
</style>