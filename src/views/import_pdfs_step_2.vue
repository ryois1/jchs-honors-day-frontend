<template>
  <div id="certs">
    <b-container fluid>
      <b-row>
        <b-col
          ><h1>{{ LANG_HEADER }}</h1></b-col
        >
        <b-col
          ><h3>
            You need to upload
            <b-badge>{{ this.CERTS_NEEDED - this.UPLOADED_COUNT }}</b-badge> out
            of <b-badge>{{ this.CERTS_NEEDED }}</b-badge> certificates
          </h3></b-col
        >
      </b-row>
      <b-row>
        <b-col>
          <vue-dropzone
            ref="myVueDropzone"
            id="dropzone"
            v-on:vdropzone-success="dropzoneUploaded"
            :options="dropzoneOptions"
            :duplicateCheck="true"
          ></vue-dropzone>
        </b-col>
      </b-row>
      <div id="certstable">
        <b-row>
          <b-col>
            <b-table
              :tbody-tr-class="rowClass"
              bordered
              show-empty
              :items="CERTS_NEEDED_ARRAY"
              :fields="fields"
            >
            </b-table>
          </b-col>
        </b-row>
      </div>
    </b-container>
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
    const vm = this;
    return {
      LANG_HEADER: "Importing PDFs - Step 2 - PDFs",
      LANG_HEADER_RIGHT: "You must upload ??? PDFs",
      UPLOADED_COUNT: 0,
      CERTS_NEEDED: 0,
      CERTS_NEEDED_ARRAY: [],
      dropzoneOptions: {
        url: `${this.$parent.API_BASE_URL}/import/pdf`,
        thumbnailWidth: 50,
        accept: function (file, done) {
          if (
            vm.CERTS_NEEDED_ARRAY.find(
              (element) => (element.cert_file_name = file.name)
            )
          ) {
            done();
          } else {
            done("Invalid file name");
          }
        },
        acceptedFiles: "application/pdf",
        headers: { Authorization: `Bearer ${this.$parent.JWT_TOKEN}` },
      },
      fields: [
        {
          key: "cert_id",
          label: "Certificate ID",
        },
        {
          key: "cert_name",
          label: "Certificate Name",
        },
        {
          key: "cert_student_id",
          lable: "Certificate Student ID",
        },
        {
          key: "cert_student_first_name",
          label: "Certificate Student First Name",
        },
        {
          key: "cert_student_last_name",
          label: "Certificate Student Last Name",
        },
      ],
    };
  },
  methods: {
    dropzoneUploaded: async function () {
      this.UPLOADED_COUNT++;
    },
  },
  watch: {
    UPLOADED_COUNT: {
      handler: function () {
        const vm = this;
        if (vm.UPLOADED_COUNT == vm.CERTS_NEEDED) {
          vm.$parent.isLoading = true;
          setTimeout(function () {
            const prop = {
              certs_needed_count: vm.CERTS_NEEDED,
              certs_need: vm.CERTS_NEEDED_ARRAY,
              uploaded_count: vm.UPLOADED_COUNT,
            };
            vm.$router.push({ name: "ImportCertsPDFsDone", params: { prop } });
          }, 5000);
        }
      },
    },
  },
  created: function () {
    const vm = this;
    this.CERTS_NEEDED = vm.$attrs.prop.certs_need.length;
    this.CERTS_NEEDED_ARRAY = vm.$attrs.prop.certs_need;
    this.LANG_HEADER_RIGHT = `You must upload ${vm.$attrs.prop.certs_needed_count} PDFs`;
    setTimeout(function () {
      vm.$parent.isLoading = false;
    }, 1000);
  },
};
</script>
<style scoped>
#certs {
  padding-top: 2em;
  padding-left: 5em;
  padding-right: 5em;
}
#certstable {
  padding-top: 2em;
}
#dropzone {
  height: 400px;
}
</style>