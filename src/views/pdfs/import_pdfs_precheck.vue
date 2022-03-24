<template>
  <div id="certs">
    <b-container fluid>
        <b-row>
            <b-col><h1>{{ LANG_HEADER }}</h1></b-col>
        </b-row>
        <h2>Check ALL items before proceeding.</h2>
<b-list-group class="listgroup" >
  <b-list-group-item class="listgroup">Did you edit the YEAR OF GRADUATION in Admin -> Email Settings -> Current YOG (AND Get a toast "Updated config")</b-list-group-item>
  <b-list-group-item class="listgroup">Confirm all spelling/years are correct in award names</b-list-group-item>
  <b-list-group-item class="listgroup">Confirm student table is updated with LATEST information for students, including Year of Graduation</b-list-group-item>
</b-list-group>

        <h3>You may import multiple times.</h3>
        <h3>To prepare the CSV file, please input PDF file names into the <code>cert_file</code> column.</h3>
        <b-button class="mr-1" v-if="this.$parent.USER_INFO.role == 'ADMIN'" variant="primary" @click="downloadCertsCSV" >Download CSV</b-button>
        <b-button class="mr-1" :disabled="nextDisabled" v-b-tooltip.hover :title="nextTooltip" variant="primary" @click="nextStep" >Next Step</b-button>
    </b-container>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "import_certs_precheck",
  data: function () {
    return {
      LANG_HEADER: "Import PDFs Pre Check",
      nextDisabled: true,
      nextTooltip: "Disabled until CSV is downloaded"
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
            vm.nextDisabled = false;
            vm.nextTooltip = "Go to next step";
          }
        })
        .catch(function (response) {
          vm.$parent.$toast.error("There was an error downloading the CSV.", {
            position: "top-right",
          });
          console.error(response);
        });
    },
    nextStep: function(){
        this.$router.push({ name: "ImportCertsPDFs1"});
    }
  },
  created: function () {
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