<template>
    <div id="sign_up_form">
        <b-container class="bv-example-row">
            <b-row>
                <b-col>
                    <b-form @submit.prevent="processForm">
                    <h3>Sign Up</h3>
                        <b-form-group id="first_name_group" label-for="first_name" label="First Name:">
                            <input required type="text" id="first_name" v-model="first_name" class="form-control form-control-lg"/>
                        </b-form-group>
                        <b-form-group id="last_name_group" label-for="last_name" label="Last Name:">
                            <input required type="text" id="last_name" v-model="last_name" class="form-control form-control-lg"/>
                        </b-form-group>
                        <b-form-group id="email_group" label-for="email" label="Email:">
                            <input required type="email" id="email" v-model="email" class="form-control form-control-lg" />
                        </b-form-group>
                        <b-button type="submit" variant="primary">Sign Up</b-button>
                    </b-form>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            first_name: this.$parent.$auth.user.given_name,
            last_name: this.$parent.$auth.user.family_name,
            email: this.$parent.$auth.user.email,
        }
    },
    methods: {
        processForm: function() {
            const vm = this;
            vm.$parent.showLoader = true;
            const first_name = this.first_name;
            const last_name = this.last_name;
            const email = this.email;
            const data = { "users": [{"user_first_name": first_name, "user_last_name": last_name, "user_email": email}]}
            axios({
                method: 'post',
                url: `${this.$parent.API_BASE_URL}/users`,
                data: data,
                headers: {
                    Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
                },
            })
            .then(function (response) {
                if(response.data.error){
                    console.error(response);
                    vm.$parent.$toast.error('There was an error signing up.', { position: 'top-right' });
                }else{
                    console.log(response);
                    vm.$parent.$toast.success('Successfully signed up.', { position: 'top-right' });
                    vm.$router.push({ name: 'Home'});
                    vm.$forceUpdate();
                }
            })
            .catch(function (response) {
                vm.$parent.$toast.error('There was an error signing up.', { position: 'top-right' });
                console.error(response);
            });
        },
    },
}
</script>
<style scoped>
#sign_up_form{
    padding-top: 2em;
    padding-left: 5em;
    padding-right: 5em;
}
</style>