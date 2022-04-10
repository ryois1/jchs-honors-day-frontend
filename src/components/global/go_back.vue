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
            const target = this.target;
            if(target){
                this.$router.push({ name: target, params: { props } });
                return;
            }else{
                this.$router.go(-1);
            }
        },
    }
}
</script>