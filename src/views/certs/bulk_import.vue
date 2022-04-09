<template>
  <div id="users">
    <b-container fluid>
      <goBack target="CertificatePageCert"></goBack>
      <b-row>
        <b-col
          ><h1>{{ LANG_HEADER }}</h1></b-col
        >
        <b-col class="text-right">
            <h3><code>Student ID</code> column must be changed to <code>student_id</code> in the CSV.</h3>
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
  </div>
</template>
<script>
//import axios from "axios";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import goBack from '../../components/global/go_back.vue'

export default {
  name: "import_users",
  components: {
    vueDropzone: vue2Dropzone,
    goBack: goBack,
  },
  data: function () {
    return {
      DROPZONE_ACTIVE: true,
      AWARD_ID: this.$route.params.cert_id,
      AWARD_NAME: this.$attrs.prop.cert_name,
      LANG_HEADER: `Bulk Importing Certificates for ???`,
      dropzoneOptions: {
        url: `${this.$parent.API_BASE_URL}/import/award/${this.AWARD_ID}/certificates`,
        thumbnailWidth: 50,
        acceptedFiles: ".csv",
        params: {
            cert_name: this.AWARD_NAME,
        },
        headers: { Authorization: `Bearer ${this.$parent.JWT_TOKEN}` },
        dictDefaultMessage: "Drop files or click here to upload."
      },
    };
  },
  mounted: async function () {
    this.LANG_HEADER = `Bulk Importing Certificates for "${this.$attrs.prop.cert_name}"`;
    this.AWARD_ID = this.$route.params.cert_id;
    this.$refs.exceldrop.dropzone.options.url = `${this.$parent.API_BASE_URL}/import/awards/${this.AWARD_ID}/certificates`;
    this.$refs.exceldrop.dropzone.options.params.cert_name = this.AWARD_NAME;
  },
  methods: {
    complete(file, response) {
      const vm = this;
      setTimeout(function () {
        vm.LANG_HEADER = `Imported ${response.data.received.length} Certificates(s)`;
        vm.DROPZONE_ACTIVE = false;
      }, 1000);
    },
  },
};
</script>
<style scoped>
#users {
  padding-top: 2em;
  padding-left: 5em;
  padding-right: 5em;
}
</style>