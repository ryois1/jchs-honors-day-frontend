<template>
    <div id="accesslevel" :style="style" v-if="showAdmin">
        <p><b-icon v-if="showIcons" icon="exclamation-triangle"></b-icon> Your access level is: <b v-html="accessLevel"></b><em v-if="canHide" style="padding-left: 20px;" @click="hideLevel()">Dismiss</em> <b-icon v-if="showIcons" icon="exclamation-triangle"></b-icon></p>
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
            canHide: true,
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
                vm.canHide = false;
                return 'System Administrator, Full System Access';
            }else if(role == "COMMITTEE"){
                vm.style.backgroundColor = "var(--primary-dark-bg)";
                return "Honors Day Committee, Full Departments Access";
            }else if(role == "DEPT_ADMIN"){
                vm.style.backgroundColor = "var(--primary-dark-bg)";
                return "Department Chair, Limited Department Access";
            }else if(role == "TEACHER"){
                vm.style.backgroundColor = "var(--primary-dark-bg)";
                return "Teacher/Staff, Limited Awards Access";
            }
            return "Unknown";
        },
        showIcons: function(){
            return (!this.canHide);
        },
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