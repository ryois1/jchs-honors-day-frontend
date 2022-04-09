<template>
    <b-button class="m-1" @click="goBack"><b-icon icon="arrow-left"></b-icon> Go Back</b-button>
</template>
<script>
export default {
    props: {
        target: String,
        nav_prop: Object
    },
    methods: {
        goBack() {
            const props = this.nav_prop;
            this.$router.push({ name: this.target, params: { props } });
        },
    }
}
</script>