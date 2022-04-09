<template>
    <div id="accesslevel" :style="style" v-if="showAdmin">
        <p>Your access level is: <b>{{accessLevel}}</b><em style="padding-left: 20px;" @click="hideLevel()">Dismiss</em></p>
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
    data: function () {
        return {
            style: {
                backgroundColor: "",
            }
        };
    },
    computed: {
        showAdmin: function() {
            const vm = this;
            return(vm.$parent.ADMINS.includes(vm.$parent.USER_INFO.role));
        },
        accessLevel: function () {
            const vm = this;
            const role = this.$parent.USER_INFO.role;
            if(role == "ADMIN"){
                vm.style.backgroundColor = "#ff0000";
                return "!! System Administrator, Full System Access";
            }else if(role == "COMMITTEE"){
                vm.style.backgroundColor = "#000000";
                return "Honors Day Committee, Full Departments Access";
            }else if(role == "DEPT_ADMIN"){
                vm.style.backgroundColor = "#000000";
                return "Department Chair, Limited Department Access";
            }else if(role == "TEACHER"){
                vm.style.backgroundColor = "#000000";
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