<template>
  <div :key="$route.fullPath" id="app">
    <main>
      <loading
        :active.sync="isLoading"
        :can-cancel="onCancel"
        :is-full-page="fullPage"
      ></loading>
      <globalNav></globalNav>
      <adminNav v-if="(currentRouteName.startsWith('Admin')) && (isLoaded)"></adminNav>
      <router-view v-if="isLoaded"></router-view>
    </main>
    <globalFooter id="footer" v-if="isLoaded"></globalFooter>
  </div>
</template>

<script>
const globalNav = () =>
  import(/* webpackChunkName: "components" */ "./components/global/navbar.vue");
const adminNav = () =>
  import(/* webpackChunkName: "components" */ "./components/admin_nav.vue");
const globalFooter = () =>
  import(/* webpackChunkName: "components" */ "./components/global/footer.vue");
import axios from "axios";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "App",
  components: {
    Loading,
    globalNav,
    adminNav,
    globalFooter,
  },
  methods: {
    logout() {
      const vm = this;
      vm.$parent.$swal
        .fire({
          title: `Are you sure you want to logoff?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#FF4500",
          cancelButtonColor: "#00B32C",
          confirmButtonText: "Yes",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$auth.logout({
              returnTo: window.location.origin,
            });
          }
        });
    },
    API_me: async function () {
      const vm = this;
      await axios
        .get(`${vm.API_BASE_URL}/me`, {
          timeout: 30000,
          headers: {
            Authorization: `Bearer ${vm.JWT_TOKEN}`,
          },
        })
        .then(async function (response) {
          if (response.data.error) {
            const address = vm.$auth.user.email.split("@").pop();
            if (address == "jcboe.net") {
              vm.$router.push({ name: "AuthNewUser" });
              vm.$toast.error("There was an error logging in (Unknown User)", {
                position: "top-right",
              });
              console.error(response);
              vm.isLoading = false;
            } else {
              vm.$router.push({ name: "UnknownUser" });
              vm.isLoading = false;
            }
          } else {
            vm.USER_AUTHORIZED = true;
            vm.USER_INFO = response.data.data;
            vm.$forceUpdate();
            vm.isLoading = false;
          }
        })
        .catch(err =>{
          if(!err.status){
            vm.$router.push({ name: "APIConnLost" });
            vm.isLoading = false;
          }else{
            vm.$router.push({ name: "UnknownUser" });
            vm.isLoading = false;
          }
        });
    },
  },
  data: function () {
    return {
      // API_BASE_URL: "http://localhost:5000/api/v1",
      API_BASE_URL: "https://api.jchs-honors-day.cf/api/v1",
      USER_INFO: null,
      JWT_TOKEN: this.$parent.token,
      USER_AUTHORIZED: false,
      fullPage: true,
      onCancel: false,
      isLoading: true,
      ADMINS: ["ADMIN", "COMMITTEE", "DEPT_ADMIN"],
    };
  },
  computed: {
    currentRouteName() {
        return this.$route.name;
    },
    isLoaded(){
        return !this.isLoading;
    }
  },
  mounted: function () {
    this.API_me();
    this.$nextTick(function () {
      window.setInterval(() => {
        this.API_me();
      }, 300000);
    });
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
html {
  height: 100%;
  width: 100%;
}
main{
  min-height: calc(100vh - 72px);
}
body{
  height: 100%;
  width: 100%;
  margin-bottom: 54px; 
}
#footer {
  width: 100%;
  height: 50px;
}
</style>