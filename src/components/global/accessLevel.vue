<template>
    <div id="accesslevel" v-if="showAdmin">
        <p>Your access level is: <b>{{accessLevel}}</b><em style="padding-left: 20px;" @click="hideLevel()">Hide</em></p>
    </div>
</template>
<script>
export default {
    name: "accessLevel",
    methods: {
        hideLevel: function() {
            this.$parent.showAccessLevel = false;
        },
    },
    computed: {
        showAdmin: function() {
            const vm = this;
            return(vm.$parent.ADMINS.includes(vm.$parent.USER_INFO.role));
        },
        accessLevel: function () {
            const role = this.$parent.USER_INFO.role;
            if(role == "ADMIN"){
                return "System Administrator, Full System Access";
            }else if(role == "COMMITTEE"){
                return "Honors Day Committee, Full Departments Access";
            }else if(role == "DEPT_ADMIN"){
                return "Department Chair, Limited Department Access";
            }else if(role == "TEACHER"){
                return "Teacher/Staff, Limited Awards Access";
            }
            return "Unknown";
        }
    }
}
</script>
<style scoped>
    #accesslevel{
        width: 100%;
        height: 25px;
        text-align: center;
        color: #ffffff;
        background-color: var(--primary-dark-bg);
    }
</style>