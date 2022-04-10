<template>
  <div id="sending">
    <b-container fluid>
      <b-row>
        <b-col><h1>{{ LANG_HEADER }}</h1></b-col>
      </b-row>
        <b-alert v-if="this.seconds > 0" class="alertContainer" show variant="warning"><b-icon style="width: 72px; height: 72px;" icon="exclamation-triangle-fill" variant="warning"></b-icon><h3 class="verticalText" >Creating job in {{seconds}} seconds.</h3></b-alert>
        <b-alert v-if="this.job_status == 'created' " class="alertContainer" show variant="warning"><b-icon animation="spin" style="width: 72px; height: 72px;" icon="arrow-clockwise" variant="warning"></b-icon><h3 class="verticalText" >Created job. Waiting for job to run. (This could take up to a minute)</h3></b-alert>
    </b-container>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "certs",
  data: function () {
    return {
      LANG_HEADER: "Sending Honors Day Emails",
      seconds: 10,
      job_status: "not_created",
      job_id: undefined,
      getJobOn: true,
    };
  },
  methods: {
    createJob: function(){
        const vm = this;
        axios({
            method: "post",
            url: `${this.$parent.API_BASE_URL}/jobs`,
            headers: {
                Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
            },
        })
        .then(function (response) {
            if (response.data.error) {
                console.error(response);
                vm.$parent.$toast.error("There was an error creating the job.", { position: "top-right" });
            } else {
                vm.$parent.$toast.success("Successfully created the job.", {position: "top-right",});
                vm.job_id = response.data.data.job_id;
                vm.job_status = 'created';
            }
        })
        .catch(function (response) {
            vm.$parent.$toast.error("There was an error creating the job.", { position: "top-right" });
            console.error(response);
        });
    },
    getJob: async function(){
        const vm = this;
        if(vm.job_status == "created"){
        axios({
            method: "get",
            url: `${this.$parent.API_BASE_URL}/jobs/${vm.job_id}`,
            headers: {
                Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
            },
        })
        .then(function (response) {
            if (response.data.error) {
                console.error(response);
            } else {
                vm.job_id = response.data.data.job[0].job_id;
                vm.job_status = response.data.data.job[0].status;
                vm.$router.push({name: 'AdminSendEmailsExecute', params: { job_id: vm.job_id }});
            }
        })
        .catch(function (response) {
            vm.$parent.$toast.error("There was an error getting the job.", { position: "top-right" });
            console.error(response);
        });
        }
    },
  },
    mounted: function () {
      const vm = this;
      vm.$nextTick(function () {
        window.setInterval(() => {
          this.getJob();
        }, 1000);
      });
    },
    watch: {
        seconds: {
            handler(value) {
                if (value > 0) {
                    setTimeout(() => {
                        this.seconds--;
                    }, 1000);
                } else if (value == 0){
                    this.createJob();
                }
            },
            immediate: true // This ensures the watcher is triggered upon creation
        }
    }
};
</script>
<style scoped>
#sending {
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