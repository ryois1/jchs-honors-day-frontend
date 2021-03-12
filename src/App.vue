<template>
  <div :key="$route.fullPath" @contextmenu="handler($event)" id="app">
    <loading
      :active.sync="isLoading"
      :can-cancel="onCancel"
      :is-full-page="fullPage"
    ></loading>
    <globalNav></globalNav>
    <adminNav v-if="this.$route.name.startsWith('Admin')"></adminNav>
    <router-view></router-view>
  </div>
</template>

<script>
const globalNav = () =>
  import(/* webpackChunkName: "components" */ "./components/global/navbar.vue");
const adminNav = () =>
  import(/* webpackChunkName: "components" */ "./components/admin_nav.vue");
import axios from "axios";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "App",
  components: {
    Loading,
    globalNav,
    adminNav,
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
            vm.$toast.success("Successfully logged in", {
              position: "top-right",
            });
            vm.$forceUpdate();
            vm.isLoading = false;
          }
        })
        .catch(function (response) {
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
    };
  },
  created: function () {
    this.API_me();
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
html,
body {
  height: 100%;
  width: 100%;
}
</style>
