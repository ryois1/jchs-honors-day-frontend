<template>
    <div id="newcert">
        <b-container fluid>
            <b-row>
                <b-col><h1>Creating Child Certificate</h1></b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-card bg-variant="light">
                    <b-form @submit.prevent="processForm">
                        <b-form-group id="cert_name-group" label="Certificate Name:" label-for="cert_name" description="Alphanumerical characters">
                            <b-form-input id="cert_name" v-model="cert_name" type="text" placeholder="Name" required></b-form-input>
                        </b-form-group>
                        <div v-for="index in input_index" :key="index">
                            <b-form-group id="student_id-group" label="Student ID:" label-for="student_id">
                            <b-form-input id="student_id" :formatter="formatStudentID" v-model="student_id[index-1]" type="number"  placeholder="Student ID" required></b-form-input>
                            </b-form-group>
                        </div>
                        <b-button @click="addStudent" variant="success">Add Student</b-button>   <b-button @click="verify" variant="primary">Check Input</b-button>
                    </b-form>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>
<script>
import axios from "axios";
export default {
    name: "new_parent_cert",
    data: function () {
        return {
            STATUS_TEXT: 'Please input certificate data',
            RESULT: null,
            input_index: 0,
            cert_name: null,
            student_id: [],
        };
    },
    methods: {
        addStudent(){
            this.input_index++;
        },
        remove(){
            this.input_index--;
        },
        formatStudentID(e){
            return String(e).substring(0,7);
        },
        verify(){
            const prop = {'cert_name': this.cert_name, 'student_id': this.student_id}
            this.$router.replace({name:'CertificatePageChildVerify', params:{prop}});
        },
        API_cert_info: async function () {
            const vm = this;
            let authToken = vm.$parent.JWT_TOKEN;
            if (await authToken == null){
                await this.getAuthToken();
                const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/certs/${vm.$route.params.cert_id}`, {
                    headers: {
                     Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                    },
                });
                vm.cert_name = data.data.certs[0].cert_name;
            }else{
                const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/certs/${vm.$route.params.cert_id}`, {
                    headers: {
                        Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                    },
                });
                vm.cert_name = data.data.certs[0].cert_name;
            }
        },
    },
    mounted: function () {
        this.API_cert_info();
        if(typeof this.$attrs.prop.student_id !== "undefined"){
            this.student_id = this.$attrs.prop.student_id;
            this.input_index = this.$attrs.prop.student_id.length;
        }
        if(typeof this.$attrs.prop.cert_name !== "undefined"){
            this.cert_name = this.$attrs.prop.cert_name;
        }
    },
};
</script>
<style scoped>
#newcert{
    padding-top: 2em;
    padding-left: 5em;
    padding-right: 5em;
}
</style>