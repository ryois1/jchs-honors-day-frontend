<template>
    <div id="newcert">
        <b-container fluid>
            <b-row>
                <b-col><h1>Creating Parent Certificate</h1></b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-card bg-variant="light">
                    <b-form @submit.prevent="processForm">
                        <b-form-group id="cert_name-group" label="Certificate Name:" label-for="cert_name" description="Alphanumerical characters">
                            <b-form-input id="cert_name" v-model="cert_name" type="text" placeholder="Name" required></b-form-input>
                        </b-form-group>
                        <b-button type="submit" variant="primary">Submit</b-button>
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
            cert_name: this.$parent.STATION_ID,
        };
    },
    methods: {
        processForm: function() {
            const vm = this;
            vm.$parent.showLoader = true;
            const cert_name = this.cert_name;
            const data = { "certs": [{"cert_name": cert_name}]}
            axios({
                method: 'post',
                url: `${this.$parent.API_BASE_URL}/certs`,
                data: data,
                headers: {
                    Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
            })
            .then(function (response) {
                if(response.data.error){
                    console.error(response);
                    vm.$parent.$toast.error('There was an error creating the certificate.', { position: 'top-right' });
                }else{
                    console.log(response);
                    vm.$parent.$toast.success('Successfully created the certificate.', { position: 'top-right' });
                    vm.cert_name = '';
                }
            })
            .catch(function (response) {
                vm.$parent.$toast.error('There was an error creating the certificate.', { position: 'top-right' });
                console.error(response);
            });
        },
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