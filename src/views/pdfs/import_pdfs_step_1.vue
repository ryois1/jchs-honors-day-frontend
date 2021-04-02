<template>
  <div id="certs">
    <b-container fluid>
      <b-row>
        <b-col
          ><h1>{{ LANG_HEADER }}</h1></b-col
        >
      </b-row>
    </b-container>
    <vue-dropzone
      ref="exceldrop"
      id="dropzone"
      v-on:vdropzone-success="step2"
      :options="dropzoneOptions"
    ></vue-dropzone>
  </div>
</template>
<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
  name: "import_certs",
  components: {
    vueDropzone: vue2Dropzone,
  },
  data: function () {
    return {
      LANG_HEADER: "Importing PDFs - Step 1 - Excel",
      dropzoneOptions: {
        url: `${this.$parent.API_BASE_URL}/import/excel`,
        thumbnailWidth: 50,
        acceptedFiles: ".csv",
        headers: { Authorization: `Bearer ${this.$parent.JWT_TOKEN}` },
      },
    };
  },
  methods: {
    step2(file, response) {
      const vm = this;
      setTimeout(function () {
        const prop = {
          certs_needed_count: response.data.received.length,
          certs_need: response.data.received,
          import_id: response.data.import_id,
        };
        vm.$router.push({ name: "ImportCertsPDFs2", params: { prop } });
      }, 1000);
    },
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