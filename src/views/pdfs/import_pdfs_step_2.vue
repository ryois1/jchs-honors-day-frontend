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
              bordered
              show-empty
              :items="formartedItems"
              :fields="fields"
            >
              <template #cell(status)="data">
                <p v-if="data.item.status=='uploaded'">Uploaded</p>
                <p v-if="data.item.status=='nofile'">Not Uploaded</p>
              </template>
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
      LANG_HEADER: "Importing PDFs - Step 2 - Upload PDFs",
      LANG_HEADER_RIGHT: "You must upload ??? PDFs",
      UPLOADED_COUNT: 0,
      CERTS_NEEDED: 0,
      CERTS_NEEDED_ARRAY: [],
      dropzoneOptions: {
        url: `${vm.$parent.API_BASE_URL}/import/pdf`,
        thumbnailWidth: 10,
        acceptedFiles: "application/pdf",
        headers: { Authorization: `Bearer ${vm.$parent.JWT_TOKEN}` },
        dictDefaultMessage: "Drop files or click here to upload."
      },
      fields: [
        {
          key: "status",
          label: "Upload Status",
        },
        {
          key: "cert_id",
          label: "Certificate ID",
        },
        {
          key: "department_name",
          label: "Department",
        },
        {
          key: "cert_name",
          label: "Certificate Name",
        },
        {
          key: "cert_file_name",
          label: "File Name",
        },
        {
          key: "cert_student_id",
          label: "Student ID",
        },
        {
          key: "cert_student_first_name",
          label: "Student First Name",
        },
        {
          key: "cert_student_last_name",
          label: "Student Last Name",
        },
      ],
    };
  },
  methods: {
    getVariant (status) {
      switch (status) {
        case 'uploaded':
          return 'success'
        case 'nofile':
          return 'danger'
      }
    },
    dropzoneUploaded: async function (file, response) {
      const vm = this;
      console.log(response);
      const index = vm.CERTS_NEEDED_ARRAY.findIndex((obj => obj.cert_id == response.data.cert_id));
      vm.CERTS_NEEDED_ARRAY[index].status = "uploaded";
      vm.UPLOADED_COUNT++;
    },
  },
  watch: {
    UPLOADED_COUNT: {
      handler: function () {
        const vm = this;
        if (vm.UPLOADED_COUNT == vm.CERTS_NEEDED) {
          vm.$parent.$swal.fire({
                                customClass: {
            popup: 'popup-dark',
            title: 'popup-dark-text',
            content: 'popup-dark-text',
            input: 'popup-dark-input',
          },
            title: `Uploads complete!`,
            icon: "success",
            confirmButtonText: "Dismiss",
          });
        }
      },
    },
  },
  computed: {
    formartedItems () {
      const vm = this;
      if (!vm.CERTS_NEEDED_ARRAY) return []
      return vm.CERTS_NEEDED_ARRAY.map(item => {
        item._rowVariant = vm.getVariant(item.status)
        return item
      })
    }
  },
  created: function () {
    const vm = this;
    vm.CERTS_NEEDED = vm.$attrs.prop.certs_need.length;
    vm.CERTS_NEEDED_ARRAY = vm.$attrs.prop.certs_need;
    vm.LANG_HEADER_RIGHT = `You must upload ${vm.$attrs.prop.certs_needed_count} PDFs`;
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
</style>