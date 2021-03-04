<template>
  <div id="certs">
        <b-container fluid>
            <b-row>
                <b-col><h1>Viewing All Parent Certificates</h1></b-col>
                <b-col class="text-right"><b-button v-if="this.$parent.USER_INFO.role == 'ADMIN'" variant="primary" :to="{ path: `/certificates/new` }">New Parent Certificate</b-button>  <b-button v-if="this.$parent.USER_INFO.role == 'ADMIN'" variant="primary" @click="downloadCertsCSV">Download CSV</b-button></b-col>
            </b-row>
        </b-container>
        <b-table :empty-html="EMTPY_TABLE" bordered show-empty :items="items" :fields="fields" :current-page="currentPage" :per-page="0">
            <template #cell(cert_id)="data">
                <b-button variant="primary" :to="{ path: `/certificates/${data.item.cert_id}` }">View Child Certificates</b-button>
            </template>
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
            EMTPY_TABLE: '<p>Loading data...</p>',
            fields: [
                {
                    key: 'cert_owner_id',
                    label: 'Certificate Owner ID',
                    thClass: 'd-none', 
                    tdClass: 'd-none'
                },
                {
                    key: 'cert_name',
                    label: 'Certificate Name'
                },
                {
                    key: 'user_name',
                    label: 'Certificate Owner'
                },
                {
                    key: 'user_email',
                    lable: 'Certificate Owner Email'
                },
                {
                    key: 'cert_id',
                    label: 'View Certificate',
                },
                'delete'
            ],
            items: [],
            currentPage: 1,
            perPage: 10,
            totalItems: 0,
        };
    },
    methods: {
        downloadCertsCSV: async function(){
            const vm = this;
            const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/certs_csv`, {
                headers: {
                    Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
            });
            let blob = new Blob([data.data.csv], { type: "application/octet-stream" }),
            url = window.URL.createObjectURL(blob);
            let tempLink = document.createElement("a");
            tempLink.style.display = "none";
            tempLink.href = url;
            tempLink.setAttribute("download", data.data.file_name);
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(url);
        },
        deleteCert: async function(cert_id){
            const vm = this;
            this.$parent.$swal.fire({
                title: `Are you sure you want delete this certificate (THIS IS PERMANENT)?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#FF4500',
                cancelButtonColor: '#00B32C',
                confirmButtonText: 'Yes',
                reverseButtons: true,
                input: 'text',
                inputAttributes: {
                    id: 'confirmDelete'
                },
                inputValidator: (value) => {
                    if (value != 'DELETE') {
                        return '<span>You must type in <b class="text-danger">DELETE</b> to delete.</span>'
                    }
                }
            }).then(async function(result){
                if (result.isConfirmed) {
            console.log(cert_id);
            let authToken = vm.$parent.JWT_TOKEN;
            if (await authToken == null){
                await this.getAuthToken();
                axios.delete(`${vm.$parent.API_BASE_URL}/certs/${cert_id}`, {
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
                axios.delete(`${vm.$parent.API_BASE_URL}/certs/${cert_id}`, {
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
        API_certs: async function () {
            const vm = this;
            vm.EMTPY_TABLE = '<h3>There are no certs to show</h3>';
            const offset = vm.currentPage * vm.perPage - 10;
            let authToken = vm.$parent.JWT_TOKEN;
            if (await authToken == null){
                await this.getAuthToken();
                const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/certs`, {
                    params: { offset: offset, limit: vm.perPage },
                    headers: {
                     Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                    },
                });
                if(data.count == 0){
                    vm.EMTPY_TABLE = '<h3>There are no certs to show</h3>';
                }
                vm.totalItems = data.count;
                vm.items = data.data.certs;
            }else{
                const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/certs`, {
                    params: { offset: offset, limit: vm.perPage },
                    headers: {
                        Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                    },
                });
                if(data.count == 0){
                    vm.EMTPY_TABLE = '<h3>There are no certs to show</h3>';
                }
                vm.totalItems = data.count;
                vm.items = data.data.certs;
            }
        },
    },
    mounted: function () {
        this.API_certs().catch(error=>{
            this.$parent.$toast.error(`There was an error getting certificates. ${error}`, { position: 'top-right' });
            console.error(error);
        })
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
        }
    }
};
</script>
<style scoped>
#certs{
    padding-top: 2em;
    padding-left: 5em;
    padding-right: 5em;
}
</style>