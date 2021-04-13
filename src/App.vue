<template>
  <div :key="$route.fullPath" id="app">
    <main>
      <loading :active.sync="isLoading" :can-cancel="onCancel" :is-full-page="fullPage"></loading>
      <globalNav></globalNav>
      <adminNav v-if="(viewingAdmin) && (isLoaded)"></adminNav>
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
import * as Sentry from "@sentry/vue";
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
          timeout: 1000,
          headers: {
            Authorization: `Bearer ${vm.JWT_TOKEN}`,
          },
        })
        .then(async function (response) {
          if (response.data.error) {
              vm.$router.push({ name: "UnknownUser" });
              vm.isLoading = false;
          } else {
            vm.USER_AUTHORIZED = true;
            vm.USER_INFO = response.data.data;
            vm.$forceUpdate();
            vm.isLoading = false;
          }
        })
        .catch(async function () {
          vm.$router.push({ name: "APIConnLost" });
          vm.isLoading = false;
        });
    },
  },
  data: function () {
    return {
      API_BASE_URL: "https://api.jchs-honors-day.cf/api/v1",
      USER_INFO: null,
      JWT_TOKEN: this.$parent.token,
      ENV: process.env.NODE_ENV,
      USER_AUTHORIZED: false,
      fullPage: true,
      onCancel: false,
      isLoading: true,
      ADMINS: ["ADMIN", "COMMITTEE", "DEPT_ADMIN"],
    };
  },
  computed: {
    viewingAdmin(){
      if(this.isLoading){
        return false;
      }else{
        if(this.$route.name){
          if(this.$route.name.startsWith('Admin')){
            return true;
          }else{
            return false;
          }
        }else{
          return false
        }
      }
    },
    isLoaded(){
      return !this.isLoading;
    }
  },
  mounted: async function () {
    const vm = this;
    if(vm.$parent.AUTH_NONCE == 'redirect'){
      window.location.replace(vm.$parent.AUTH_ORIGINAL_URL);
      localStorage.setItem('AUTH_NONCE', 'noredirect');
    }
    await vm.API_me();
    await Sentry.setContext("user", {first_name: vm.USER_INFO.first_name, last_name: vm.USER_INFO.last_name, role: vm.USER_INFO.role,});
    await Sentry.setUser({ id: vm.USER_INFO.user_id, email: vm.USER_INFO.email });
    vm.$nextTick(function () {
      window.setInterval(() => {
        vm.API_me();
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