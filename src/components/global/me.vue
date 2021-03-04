<template>
    <div>
    </div>
</template>
<script>
import axios from "axios";
export default {
    name: "me_check",
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