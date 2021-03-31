<template>
  <div id="awards">
    <b-container fluid>
      <b-row>
        <b-col
          ><h1>{{ LANG_HEADER }}</h1></b-col
        >
        <b-col class="text-right">
          <b-button
            class="mr-1"
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            variant="primary"
            @click="downloadTemplate"
            >Download CSV Template</b-button
          >
        </b-col>
      </b-row>
    </b-container>
    <vue-dropzone
      v-if="this.DROPZONE_ACTIVE"
      ref="exceldrop"
      id="dropzone"
      v-on:vdropzone-success="complete"
      :options="dropzoneOptions"
    ></vue-dropzone>
    <h3>Please specify department ID in the <code>dept_id</code> column. You can find these in the "Departments" page</h3>
  </div>
</template>
<script>
import axios from "axios";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
  name: "import_awards",
  components: {
    vueDropzone: vue2Dropzone,
  },
  data: function () {
    return {
      LANG_HEADER: "Bulk Importing Awards",
      DROPZONE_ACTIVE: true,
      dropzoneOptions: {
        url: `${this.$parent.API_BASE_URL}/import/awards`,
        thumbnailWidth: 50,
        acceptedFiles: ".csv",
        headers: { Authorization: `Bearer ${this.$parent.JWT_TOKEN}` },
      },
    };
  },
  methods: {
    downloadTemplate: async function () {
      const vm = this;
      axios
        .get(`${vm.$parent.API_BASE_URL}/templates/awards`, {
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
    complete(file, response) {
      const vm = this;
      setTimeout(function () {
        vm.LANG_HEADER = `Imported ${response.data.received.length} Awards(s)`;
        vm.DROPZONE_ACTIVE = false;
      }, 1000);
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