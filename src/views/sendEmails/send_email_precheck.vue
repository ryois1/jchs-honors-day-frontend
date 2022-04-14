<template>
  <div id="certs">
    <b-container fluid>
        <b-row>
            <b-col><h1>{{ LANG_HEADER }}</h1></b-col>
        </b-row>
        <b-alert class="dangerContainer" show variant="danger"><b-icon style="width: 72px; height: 72px; margin-right: 20px;" icon="exclamation-triangle-fill" variant="danger"></b-icon><h1>This is the final step in the honors day process. Please verify all data is correct and greenlight to proceed.</h1></b-alert>
        <b-alert class="alertContainer" show variant="warning"><b-icon style="width: 72px; height: 72px;" icon="exclamation-triangle-fill" variant="warning"></b-icon><h3 class="verticalText" >Check ALL items before proceeding.</h3></b-alert>
        <b-list-group class="listgroup" >
          <b-list-group-item class="listgroup"><b-form-checkbox inline v-model="selected[0]" v-if="this.$parent.USER_INFO.role == 'ADMIN'" ><b>I have confirmed all PDFs have been generated and went through the proper import procedure.</b></b-form-checkbox></b-list-group-item>
          <b-list-group-item class="listgroup"><b-form-checkbox inline v-model="selected[1]" v-if="this.$parent.USER_INFO.role == 'ADMIN'" ><b>I have confirmed an email body has been written, proofread, and changed in the system.</b> You can find this under Email Settings -> (Grade Level) Message. You <b>must</b> click the "Save" button.</b-form-checkbox></b-list-group-item>
          <b-list-group-item class="listgroup"><b-form-checkbox inline v-model="selected[2]" v-if="this.$parent.USER_INFO.role == 'ADMIN'" ><b>I have confirmed the year of graduation setting has been changed.</b> You can find this under Email Settings -> Current YOG. The textbox should be green and you should get a notice saying it has been updated sucessfully.</b-form-checkbox></b-list-group-item>
          <b-list-group-item class="listgroup"><b-form-checkbox inline v-model="selected[3]" v-if="this.$parent.USER_INFO.role == 'ADMIN'" ><b>I have confirmed that spelling of all awards and students are correct.</b></b-form-checkbox></b-list-group-item>
          <b-list-group-item class="listgroup"><b-form-checkbox inline v-model="selected[4]" v-if="this.$parent.USER_INFO.role == 'ADMIN'" ><b>I have confirmed the student table is up to date with latest information.</b></b-form-checkbox></b-list-group-item>
          <b-list-group-item class="listgroup"><b-form-checkbox inline v-model="selected[5]" v-if="this.$parent.USER_INFO.role == 'ADMIN'" ><b>I have confirmed parent emails are imported through the proper import procedure.</b> Aspen does not validate emails, however this system kicks out invalid parent emails upon import.</b-form-checkbox></b-list-group-item>
        </b-list-group>
        <h3>Please do not leave the page until it is complete.</h3>
        <b-form-checkbox
            v-model="nextDisabled"
            v-if="allAreTruthy(this.selected)"
            value="false"
            unchecked-value="true"
        >I acknowledge I have read and understand all of the above statements. I understand that failure to correctly follow the above process will cause irreparable damage.</b-form-checkbox>
        
        <p v-if="this.countdown > 0">You must wait <span>{{countdown}}</span> seconds before proceeding.</p>
        
        <span v-if="this.countdown == 0" v-b-tooltip.hover :title="nextTooltip"><b-button class="mr-1" :disabled="isDisabled"  variant="primary" @click="nextStep" >Next Step</b-button></span>
    </b-container>
  </div>
</template>
<script>
export default {
  name: "import_certs_precheck",
  data: function () {
    return {
      LANG_HEADER: "Sending Emails Checklist",
      nextDisabled: true,
      countdown: 30,
      selected: [false,false,false,false,false,false],
      nextTooltip: "Disabled until acknowledged"
    };
  },
  methods: {
    allAreTruthy(arr) {
      return arr.every(element => element);
    },
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
    },
    countdown: {
            handler(value) {
                if (value > 0) {
                    setTimeout(() => {
                        this.countdown--;
                    }, 1000);
                }
            },
            immediate: true // This ensures the watcher is triggered upon creation
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
.dangerContainer{
  height: 10em;
  position: relative;
  display: flex;
  align-items: center
}
.listgroup{
  font-size: 12pt;
}
</style>