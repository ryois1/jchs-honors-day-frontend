<template>
    <div>
        <b-jumbotron v-if="$auth.isAuthenticated && this.$parent.USER_AUTHORIZED">
            <template #header>{{ LANG_WELCOME }}</template>
            <hr class="my-4">
            <b-button variant="primary" href="#">Do Something</b-button>
            <b-button variant="success" href="#">Do Something Else</b-button>
        </b-jumbotron>
    </div>
</template>
<script>
import axios from "axios";
export default {
    name: "homepage",
    data: function () {
        return {
            LANG_WELCOME: "Loading...",
        };
    },
    methods: {
        API_me: async function () {
            const vm = this;
            const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/me`, {
                headers: {
                    Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
            })
            vm.$parent.USER_INFO = data.data;
            vm.LANG_WELCOME = `Hello, ${this.$parent.USER_INFO.first_name} ${this.$parent.USER_INFO.last_name}`;
        },
    },
    mounted: function () {
        this.API_me();
    },
};
</script>
<style scoped>
</style>