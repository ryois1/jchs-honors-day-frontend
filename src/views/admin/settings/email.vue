<template>
  <div id="settings">
    <b-container fluid>
      <b-row>
        <b-col
          ><h1>{{ LANG_HEADER }}</h1></b-col
        >
        <b-col
          ><p>Email Subject:</p>
          <b-form-input
            required
            class="cardsinput"
            v-model="email_subject"
            @change="editConfig('email.subject', email_subject)"
        /></b-col>
        <b-col
          ><p>Current YOG:</p>
          <b-form-input
            type="number"
            :state="formatYear"
            required
            class="cardsinput"
            v-model="email_yog"
            @change="editConfig('email.current_yog', email_yog)"
        /></b-col>
      </b-row>
      <hr class="my-4" />
      <b-row>
        <b-col>
          <h2>Senior Message</h2>
          <editor
            v-model="senior_message"
            apiKey="ibg1nvicfaus25gms43rw64hyjx02gxfuos4paacjvo7n1wc"
            :init="editorConfig"
          ></editor>
        </b-col>
      </b-row>
      <b-row class="savebutton">
        <b-col>
          <div class="text-right">
            <b-button
              variant="primary"
              @click="editConfig('email.12_message', senior_message)"
              >Save</b-button
            >
          </div>
        </b-col>
      </b-row>
      <hr class="my-4" />
      <b-row>
        <b-col>
          <h2>Junior Message</h2>
          <editor
            v-model="junior_message"
            apiKey="ibg1nvicfaus25gms43rw64hyjx02gxfuos4paacjvo7n1wc"
            :init="editorConfig"
          ></editor>
        </b-col>
      </b-row>
      <b-row class="savebutton">
        <b-col>
          <div class="text-right">
            <b-button
              variant="primary"
              @click="editConfig('email.11_message', junior_message)"
              >Save</b-button
            >
          </div>
        </b-col>
      </b-row>
      <hr class="my-4" />
      <b-row>
        <b-col>
          <h2>Sophomore Message</h2>
          <editor
            v-model="sophomore_message"
            apiKey="ibg1nvicfaus25gms43rw64hyjx02gxfuos4paacjvo7n1wc"
            :init="editorConfig"
          ></editor>
        </b-col>
      </b-row>
      <b-row class="savebutton">
        <b-col>
          <div class="text-right">
            <b-button
              variant="primary"
              @click="editConfig('email.10_message', sophomore_message)"
              >Save</b-button
            >
          </div>
        </b-col>
      </b-row>
      <hr class="my-4" />
      <b-row>
        <b-col>
          <h2>Freshman Message</h2>
          <editor
            v-model="freshman_message"
            apiKey="ibg1nvicfaus25gms43rw64hyjx02gxfuos4paacjvo7n1wc"
            :init="editorConfig"
          ></editor>
        </b-col>
      </b-row>
      <b-row class="savebutton">
        <b-col>
          <div class="text-right">
            <b-button
              variant="primary"
              @click="editConfig('email.9_message', freshman_message)"
              >Save</b-button
            >
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import axios from "axios";
import Editor from "@tinymce/tinymce-vue";

export default {
  name: "certs",
  components: {
    editor: Editor,
  },
  data: function () {
    return {
      LANG_HEADER: "Email Messages",
      senior_message: null,
      junior_message: null,
      sophomore_message: null,
      freshman_message: null,
      email_subject: null,
      email_yog: null,
      editorConfig: {
        branding: false,
        height: 500,
        menubar: false,
        browser_spellcheck: true,
        contextmenu: false,
        skin: "oxide-dark",
        content_css: "dark",
        plugins: [
          "advlist autolink lists link image charmap",
          "searchreplace visualblocks code fullscreen",
          "print preview anchor insertdatetime media",
          "paste code help wordcount table",
        ],
        toolbar:
          "undo redo | formatselect | bold italic | \
                    alignleft aligncenter alignright | \
                    bullist numlist outdent indent | help",
      },
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
  computed: {
    formatYear(e) {
      return e.length != 4 ? true : false;
    },
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
      const senior = data.data.config.find(
        (element) => element.config_name == "email.12_message"
      );
      const junior = data.data.config.find(
        (element) => element.config_name == "email.11_message"
      );
      const sophomore = data.data.config.find(
        (element) => element.config_name == "email.10_message"
      );
      const freshman = data.data.config.find(
        (element) => element.config_name == "email.9_message"
      );
      const email_subject = data.data.config.find(
        (element) => element.config_name == "email.subject"
      );
      const email_yog = data.data.config.find(
        (element) => element.config_name == "email.current_yog"
      );
      vm.senior_message = senior.config_value;
      vm.junior_message = junior.config_value;
      vm.sophomore_message = sophomore.config_value;
      vm.freshman_message = freshman.config_value;
      vm.email_subject = email_subject.config_value;
      vm.email_yog = email_yog.config_value;
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
.savebutton {
  padding-top: 1em;
}
</style>