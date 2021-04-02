<template>
  <div id="certs">
    <b-container fluid>
      <b-row>
        <b-col
          ><h1>{{ LANG_HEADER }}</h1></b-col
        >
      </b-row>
    </b-container>
  </div>
</template>
<script>
export default {
  name: "import_certs_done",
  data: function () {
    return {
      LANG_HEADER: "Finished Importing PDFs!",
    };
  },
  created: function () {
    const vm = this;
    vm.CERTS_NEEDED = vm.$attrs.prop.certs_needed_count;
    vm.CERTS_NEEDED_ARRAY = vm.$attrs.prop.certs_need;
    vm.LANG_HEADER = `You uploaded ${vm.$attrs.prop.uploaded_count} PDFs`;
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