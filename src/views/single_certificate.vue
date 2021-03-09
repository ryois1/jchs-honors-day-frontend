<template>
  <div id="certs">
        <b-container fluid>
            <b-row>
                <b-col><h1>{{ LANG_VIEWING_CERT }} <b-badge>{{CERT_COUNT}}</b-badge></h1></b-col>
                <b-col class="text-right" v-if="this.allowed_edit"><b-button @click="transferCert" variant="primary">Transfer Certificate</b-button>    <b-button v-if="this.CERT_MAX_CHILD >= this.totalItems" variant="primary" :disabled="DISABLED_ADD" :to="{ path: `/certificates/${this.$route.params.cert_id}/new` }">New Child Certificate</b-button></b-col>
                <b-col class="text-right" v-if="!this.allowed_edit"><h5>You are not allowed to edit this certificate</h5></b-col>
            </b-row>
        </b-container>
        <b-table :empty-html="EMTPY_TABLE" bordered show-empty :items="items" :fields="fields" :current-page="currentPage" :per-page="0">
            <template #cell(delete)="data">
                <b-button variant="danger" @click="deleteCert(data.item.cert_id)">Delete <b-icon icon="trash-fill" aria-hidden="true"></b-icon></b-button>
            </template>
        </b-table>
        <b-pagination size="md" :total-rows="totalItems" v-model="currentPage" :per-page="perPage"></b-pagination>
  </div>
</template>
<script>
import axios from "axios";

export default {
    name: "certs",
    data: function () {
        return {
            LANG_VIEWING_CERT: 'Viewing Certificate',
            CERT_COUNT: 'None',
            CERT_NAME: 'Unknown',
            CERT_OWNER_ID: 'Unknown',
            CERT_EMAIL: 'Unknown',
            CERT_OWNER_NAME: 'Unknown',
            CERT_MAX_CHILD: 0,
            allowed_edit: false,
            EMTPY_TABLE: '<p>Loading data...</p>',
            fields: [
                {
                    key: 'cert_id',
                    label: 'Certificate ID',
                },
                {
                    key: 'cert_name',
                    label: 'Certificate Name'
                },
                {
                    key: 'cert_file',
                    label: 'Certificate File'
                },
                {
                    key: 'student_id',
                    lable: 'Student ID'
                },
                {
                    key: 'student_first_name',
                    lable: 'First Name'
                },
                {
                    key: 'student_middle_name',
                    lable: 'Middle Name'
                },
                {
                    key: 'student_last_name',
                    lable: 'Last Name'
                },
                {
                    key: 'student_email',
                    lable: 'Student Email'
                },
                'delete'
            ],
            items: [],
            currentPage: 1,
            perPage: 10,
            totalItems: 0,
            DISABLED_ADD: false,
        };
    },
    methods: {
        deleteCert: async function(child_cert){
            const vm = this;
            this.$parent.$swal.fire({
                title: `Delete this certificate?`,
                html: '<p>Are you sure you want to delete this certificate?</p><br><b>This action cannot be undone.</b><br><i>Type "DELETE" below</i>',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                confirmButtonText: 'Delete',
                reverseButtons: true,
                input: 'text',
                inputAttributes: {
                    id: 'confirmDelete'
                },
            }).then(async function(result){
                if (result.isConfirmed) {
            const parent_cert = vm.$route.params.cert_id;
            let authToken = vm.$parent.JWT_TOKEN;
            if (await authToken == null){
                await this.getAuthToken();
                axios.delete(`${vm.$parent.API_BASE_URL}/certs/${parent_cert}/certs`, {
                    data: {"certs": [{"cert_id": child_cert}]},
                    headers: {
                     Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                    },
                })
                    .then(function (response) {
                        if(response.data.error){
                            console.error(response);
                            vm.$parent.$toast.error('There was an error deleting the certificate.', { position: 'top-right' });
                        }else{
                            console.log(response);
                            vm.$parent.$toast.success('Successfully deleted the certificate.', { position: 'top-right' });
                        }
                    })
                    .catch(function (response) {
                        vm.$parent.$toast.error('There was an error deleting the certificate.', { position: 'top-right' });
                        console.error(response);
                    });

            }else{
                axios.delete(`${vm.$parent.API_BASE_URL}/certs/${parent_cert}/certs`, {
                    data: {"certs": [{"cert_id": child_cert}]},
                    headers: {
                        Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                    },
                })
                    .then(function (response) {
                        if(response.data.error){
                            console.error(response);
                            vm.$parent.$toast.error('There was an error deleting the certificate.', { position: 'top-right' });
                        }else{
                            console.log(response);
                            vm.$parent.$toast.success('Successfully deleted the certificate.', { position: 'top-right' });
                        }
                        vm.API_certs().catch(error=>{
                            vm.$parent.$toast.error(`There was an error getting certificates. ${error}`, { position: 'top-right' });
                            console.error(error);
                        })
                    })
                    .catch(function (response) {
                        vm.$parent.$toast.error('There was an error deleting the certificate.', { position: 'top-right' });
                        console.error(response);
                    });
            }
                }
            })
        },
        transferCert: async function(){
            const vm = this;
            vm.$parent.$swal.fire({
                    title: `Are you sure you want transfer this certificate? (Search by Email)`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Find Teacher',
                    reverseButtons: true,
                    input: 'email',
                    preConfirm: (search) => {
                        const data = {"search_query": search}
                        return axios({
                            method: 'post',
                            url: `${this.$parent.API_BASE_URL}/users/search`,
                            data: data,
                            headers: {
                                Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                            },
                        })
                        .then(response => {
                            if (response.data.error) {
                                throw new Error(response.data.message)
                            }
                            return response.data.data.users[0];
                        })
                        .catch(error => {
                            vm.$parent.$swal.showValidationMessage(
                                `Request failed: ${error}`
                            )
                        })
                    },
                }).then((result) => {
                    const swal_result = result;
                    if (result.isConfirmed) {
                        vm.$parent.$swal.fire({
                            showCancelButton: true,
                            confirmButtonColor: '#dc3545',
                            confirmButtonText: 'Transfer',
                            title: "Are you sure you want to transfer to this user?",
                            text: `${result.value.first_name} ${result.value.last_name} (${result.value.email})`,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                console.log(swal_result);
            const vm = this;
            const data = { "certs": [{"user_id": swal_result.value.id, "cert_name": vm.CERT_NAME}]}
            axios({
                method: 'put',
                url: `${this.$parent.API_BASE_URL}/certs/${vm.$route.params.cert_id}`,
                data: data,
                headers: {
                    Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
            })
            .then(function (response) {
                if(response.data.error){
                    console.error(response);
                    vm.$parent.$toast.error('There was an error modifying the certificate.', { position: 'top-right' });
                }else{
                    console.log(response);
                    vm.$parent.$toast.success('Successfully transferred the certificate.', { position: 'top-right' });
                    vm.cert_name = '';
                }
            })
            .catch(function (response) {
                vm.$parent.$toast.error('There was an error modifying the certificate.', { position: 'top-right' });
                console.error(response);
            });
                            }
                        })
                    }
                })
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
                vm.CERT_NAME = data.data.certs[0].cert_name;
                vm.CERT_OWNER_ID = data.data.certs[0].cert_owner_id;
                vm.CERT_EMAIL = data.data.certs[0].user_email;
                vm.CERT_OWNER_NAME = data.data.certs[0].user_name;
                vm.CERT_MAX_CHILD = data.data.certs[0].cert_max_child;
            }else{
                const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/certs/${vm.$route.params.cert_id}`, {
                    headers: {
                        Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                    },
                });
                vm.CERT_NAME = data.data.certs[0].cert_name;
                vm.CERT_OWNER_ID = data.data.certs[0].cert_owner_id;
                vm.CERT_EMAIL = data.data.certs[0].user_email;
                vm.CERT_OWNER_NAME = data.data.certs[0].user_name;
                vm.CERT_MAX_CHILD = data.data.certs[0].cert_max_child;          
            }
            vm.LANG_VIEWING_CERT = `Viewing Child Certificate '${vm.CERT_NAME}'`;
        },
        API_certs: async function () {
            const vm = this;
            vm.EMTPY_TABLE = '<h3>There are no certs to show</h3>';
            const offset = vm.currentPage * vm.perPage - 10;
                const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/certs/${vm.$route.params.cert_id}/certs`, {
                    params: { offset: offset, limit: vm.perPage },
                    headers: {
                     Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                    },
                });
                if(data.count == 0){
                    vm.EMTPY_TABLE = '<h3>There are no certs to show</h3>';
                }
                vm.totalItems = data.data.certs.length;
                vm.CERT_COUNT = `${data.data.certs.length}/${vm.CERT_MAX_CHILD}`;
                console.log(data.data.certs.length > vm.CERT_MAX_CHILD);
                if(data.data.certs.length > vm.CERT_MAX_CHILD){
                    console.log("Disabling adding");
                    vm.DISABLED_ADD = true;
                }else{
                    console.log("Enabling adding");
                    vm.DISABLED_ADD = false;
                }
                vm.items = data.data.certs;
        },
    },
    mounted: async function () {
        await this.API_cert_info();
        await this.API_certs().catch(error=>{
            this.$parent.$toast.error(`There was an error getting certificates. ${error}`, { position: 'top-right' });
            console.error(error);
        })
        if(this.CERT_OWNER_ID == this.$parent.USER_INFO.user_id){
            this.allowed_edit = true;
        }else{
            this.allowed_edit = false;
        }
    },
    watch: {
        currentPage: {
            handler: function() {
                const vm = this;
                this.API_certs().catch(error=>{
                    vm.$parent.$toast.error('There was an error getting certificates.', { position: 'top-right' });
                    console.error(error);
                })
            }
        },
    }
};
</script>
<style scoped>
#certs{
    padding-top: 2em;
    padding-left: 5em;
    padding-right: 5em;
    width: 100%;
}
</style>