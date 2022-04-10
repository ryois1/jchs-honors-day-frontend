<template>
  <div id="sending">
    <b-container fluid>
      <b-row>
        <b-col><h1>{{ LANG_HEADER }}</h1></b-col>
      </b-row>
        <b-alert v-if="this.job_status == 'created' " class="alertContainer" show variant="warning"><b-icon animation="spin" style="width: 72px; height: 72px;" icon="arrow-clockwise" variant="warning"></b-icon><h3 class="verticalText"> Created job. Waiting for job to run. (This could take up to a minute)</h3></b-alert>
        <b-alert v-if="this.job_status == 'running' " class="alertContainer" show variant="info"><b-icon animation="spin" style="width: 72px; height: 72px;" icon="arrow-clockwise" variant="info"></b-icon><h3 class="verticalText"> Job is running.</h3></b-alert>
        <b-alert v-if="this.job_status == 'finished' " class="alertContainer" show variant="success"><b-icon style="width: 72px; height: 72px;" icon="check-circle" variant="success"></b-icon><h3 class="verticalText"> Job finished.</h3></b-alert>
        <code>{{logOut}}</code>
    </b-container>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "certs",
  data: function () {
    return {
      LANG_HEADER: "Sending Honors Day Emails",
      seconds: 10,
      job_status: "created",
      job_id: this.$route.params.job_id,
      job_logs: [],
    };
  },
  methods: {
    getJob: function(){
        const vm = this;
        if(vm.job_status == "created" || vm.job_status == "running"){
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
                vm.job_status = response.data.data.job[0].status;
            }
        })
        .catch(function (response) {
            vm.$parent.$toast.error("There was an error getting the job.", { position: "top-right" });
            console.error(response);
        });
        }
    },
    getJobLogs: function(){
        const vm = this;
        if(vm.job_status == "running" || vm.job_status == "finished"){
        axios({
            method: "get",
            url: `${this.$parent.API_BASE_URL}/jobs/${vm.job_id}/logs`,
            headers: {
                Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
            },
        })
        .then(function (response) {
            if (response.data.error) {
                console.error(response);
            } else {
                vm.job_logs = response.data.data.logs;
            }
        })
        .catch(function (response) {
            vm.$parent.$toast.error("There was an error getting the job logs.", { position: "top-right" });
            console.error(response);
        });
        }
    }
  },
    mounted: function () {
      const vm = this;
      vm.$nextTick(function () {
        window.setInterval(() => {
          this.getJob();
          this.getJobLogs();
        }, 1000);
      });
    },
    computed: {
        logOut: function() {
            const vm = this;
            let output = "";
            vm.job_logs.forEach(log =>{
                const str = log.log_time;
                const date = moment(str);
                const dateComponent = date.local().format('MM/DD/YYYY');
                const timeComponent = date.local().format('hh:mm:ss A');
                output += `[${dateComponent} ${timeComponent}] - ${log.log}\n`;
            })
            return output;
        },
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
code {
  display: block;
  white-space: pre-wrap   
}
</style>