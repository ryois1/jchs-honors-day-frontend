<template>
  <div id="settings">
    <b-container fluid>
      <b-row>
        <b-col
          ><h1>{{ LANG_HEADER }}</h1></b-col
        >
      </b-row>
      <b-row>
        <b-col>
          <b-form-group id="input-group-4" v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
              v-model="settingsLock"
              id="checkboxes-4"
              :aria-describedby="ariaDescribedby"
            >
              <b-form-checkbox :value="true">Lock Settings</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
          <b-table bordered show-empty :items="items" :fields="fields">
            <template #cell(config_value)="data">
              <b-form-input
                :disabled="settingsLock"
                required
                v-model="data.item.config_value"
                @change="
                  editConfig(data.item.config_name, data.item.config_value)
                "
              />
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "certs",
  data: function () {
    return {
      LANG_HEADER: "Editing System-wide Settings",
      fields: [
        {
          key: "config_name",
          label: "Config Name",
        },
        {
          key: "config_desc",
          label: "Config Desc",
        },
        {
          key: "config_value",
          label: "Config Value",
        },
      ],
      items: [],
      settingsLock: true,
    };
  },
  methods: {
    editConfig: async function (config_name, config_value) {
      const vm = this;
      axios({
        method: "put",
        url: `${this.$parent.API_BASE_URL}/config`,
        data: {
          config: [{ config_name: config_name, config_value: config_value }],
        },
        headers: {
          Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
        },
      }).then(function (response) {
        if (response.data.error) {
          vm.$parent.$toast.error(`There was an error updating config`, {
            position: "top-right",
          });
        } else {
          vm.$parent.$toast.success(`Updated config`, {
            position: "top-right",
          });
          vm.API_config().catch((error) => {
            console.error(error);
          });
        }
      });
    },
    API_config: async function () {
      const vm = this;
      const { data } = await axios.get(`${vm.$parent.API_BASE_URL}/config`, {
        headers: {
          Authorization: `Bearer ${vm.$parent.JWT_TOKEN}`,
        },
      });
      vm.items = data.data.config;
    },
  },
  mounted: function () {
    this.API_config().catch((error) => {
      console.error(error);
    });
  },
};
</script>
<style scoped>
#settings {
  padding-top: 2em;
  padding-left: 5em;
  padding-right: 5em;
}
</style>