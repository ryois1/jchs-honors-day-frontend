<template>
  <div id="certs">
    <b-container fluid>
        <b-row>
            <b-col><h1>{{ LANG_HEADER }}</h1></b-col>
        </b-row>
        <b-alert class="alertContainer" show variant="danger"><b-icon style="width: 72px; height: 72px;" icon="exclamation-triangle-fill" variant="danger"></b-icon><h3 class="verticalText" >This is the final step in the honors day process. Please verify all data is correct and greenlight to proceed.</h3></b-alert>
        <b-alert class="alertContainer" show variant="warning"><b-icon style="width: 72px; height: 72px;" icon="exclamation-triangle-fill" variant="warning"></b-icon><h3 class="verticalText" >Check ALL items before proceeding.</h3></b-alert>
        <b-list-group class="listgroup" >
          <b-list-group-item class="listgroup"><b>CONFIRM ALL PDFS ARE UPLOADED!</b></b-list-group-item>
          <b-list-group-item class="listgroup">Did you edit the YEAR OF GRADUATION in Admin -> Email Settings -> Current YOG (AND Get a toast "Updated config")</b-list-group-item>
          <b-list-group-item class="listgroup">Confirm all spelling/years are correct in award names</b-list-group-item>
          <b-list-group-item class="listgroup">Confirm student table is updated with LATEST information for students, including Year of Graduation</b-list-group-item>
          <b-list-group-item class="listgroup">Confirm parent emails are uploaded and emails are formatted correctly</b-list-group-item>
        </b-list-group>
        <h3>Please do not leave the page until it is complete.</h3>
        <b-form-checkbox
            v-model="nextDisabled"
            v-if="this.$parent.USER_INFO.role == 'ADMIN'"
            value="false"
            unchecked-value="true"
        >I acknowledge I have read and understand all of the above statements</b-form-checkbox>
        <b-button class="mr-1" :disabled="isDisabled" v-b-tooltip.hover :title="nextTooltip" variant="primary" @click="nextStep" >Next Step</b-button>
    </b-container>
  </div>
</template>
<script>
export default {
  name: "import_certs_precheck",
  data: function () {
    return {
      LANG_HEADER: "Send Emails Precheck",
      nextDisabled: true,
      nextTooltip: "Disabled until acknowledged"
    };
  },
  methods: {
    acknowledgeDisclaimer: function(){
        const vm = this;
        vm.nextDisabled = false;
        vm.nextTooltip = "Go to next step";
    },
    nextStep: function(){
        this.$router.push({ name: "AdminSendEmailsCreateJob"});
    }
  },
    watch: {
        nextDisabled(val) {
            if(!val){
                this.acknowledgeDisclaimer();
            }
        }
    },
  computed: {
    isDisabled: function () {
        if(this.nextDisabled == "false"){
            return false;
        }else{
            return true;
        }
    }
  }
};
</script>
<style scoped>
#certs {
  padding-top: 2em;
  padding-left: 5em;
  padding-right: 5em;
}
.alertContainer {
  height: 6em;
  position: relative;
  display: flex;
  align-items: center
}
</style>