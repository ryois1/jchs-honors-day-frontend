<template>
<div :key="$route.fullPath" @contextmenu="handler($event)" id="app">
    <globalNav></globalNav>
    <mecheck/>
    <router-view></router-view>
</div>
</template>

<script>
const globalNav = () => import(/* webpackChunkName: "globalNav" */ './components/global/navbar.vue');
const mecheck = () => import(/* webpackChunkName: "mecheck" */ './components/global/me.vue');

export default {
  name: 'App',
  components: {
    mecheck,
    globalNav
  },
  methods: {
    logout() {
      const vm = this;
      vm.$parent.$swal.fire({
        title: `Are you sure you want to logoff?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#FF4500',
        cancelButtonColor: '#00B32C',
        confirmButtonText: 'Yes',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.$auth.logout({
            returnTo: window.location.origin,
          });
        }
      })
    },
  },
  data: function () {
    return {
      API_BASE_URL: "http://localhost:5000/api/v1",
      USER_INFO: null,
      JWT_TOKEN: this.$parent.token,
      USER_AUTHORIZED: true,
    };
  },
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
