<template>
    <footer class="footer mt-auto py-3">
        <b-navbar type="dark" variant="dark">
            <b-navbar-nav>
                <b-nav-text class="text-white">{{FOOTER}}</b-nav-text>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-text class="text-white">For help, please contact Alan Reece at <u><a class="" target="_blank" href="https://outlook.office.com/mail/0/deeplink/compose?to=areece@jcboe.net&subject=Awards%20Portal%20Help">areece@jcboe.net</a></u> or at Main Campus extension 1611</b-nav-text>
            </b-navbar-nav>
        </b-navbar>
    </footer>
</template>
<script>
export default {
  name: "footer",
  data: function () {
    return {
      FOOTER: `Designed and developed by Russell Payne 2021 - Version: ${this.$parent.VUE_APP_VER ? this.$parent.VUE_APP_VER : "dev build"}`,
    };
  },
};
</script>