<template>
  <div id="students">
    <b-container fluid>
      <goBack/>
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
            ><b-icon icon="file-earmark-arrow-down" aria-hidden="true"></b-icon> Download CSV Template</b-button
          >
        </b-col>
      </b-row>
    </b-container>
    <h4>Please note that Aspen does not verify email syntax and validity! This import function will kickback emails that do not follow the standard email address syntax.</h4>
    <vue-dropzone
      v-if="this.DROPZONE_ACTIVE"
      ref="exceldrop"
      id="dropzone"
      v-on:vdropzone-success="complete"
      :options="dropzoneOptions"
    ></vue-dropzone>
  </div>
</template>
<script>
import axios from "axios";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import goBack from '../../../components/global/go_back.vue'
export default {
  name: "import_students",
  components: {
    vueDropzone: vue2Dropzone,
    goBack: goBack,
  },
  data: function () {
    return {
      LANG_HEADER: "Importing Parent Emails",
      DROPZONE_ACTIVE: true,
      dropzoneOptions: {
        url: `${this.$parent.API_BASE_URL}/import/parent_emails`,
        thumbnailWidth: 50,
        acceptedFiles: ".csv",
        headers: { Authorization: `Bearer ${this.$parent.JWT_TOKEN}` },
        dictDefaultMessage: "Drop files or click here to upload."
      },
    };
  },
  methods: {
    goBack() {
      this.$router.push({ name: ""});
    },
    downloadTemplate: async function () {
      const vm = this;
      axios
        .get(`${vm.$parent.API_BASE_URL}/templates/parent_emails`, {
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
        vm.LANG_HEADER = `Imported ${response.data.received.length} Parent Emails(s)\n Skipped ${response.data.skipped.length} due to invalid data.`;
        vm.DROPZONE_ACTIVE = false;
      }, 1000);
    },
  },
};
</script>
<style scoped>
#students {
  padding-top: 2em;
  padding-left: 5em;
  padding-right: 5em;
}
</style>