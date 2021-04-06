import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import Vuex from 'vuex'
import router from './router'
import { domain, clientId, audience } from "../auth_config.json";
import { Auth0Plugin, getInstance } from "./auth";
import VueSweetalert2 from 'vue-sweetalert2';
import VueToast from 'vue-toast-notification';
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'sweetalert2/dist/sweetalert2.min.css';
import 'vue-toast-notification/dist/theme-default.css';

Vue.config.productionTip = false
Sentry.init({
  Vue,
  environment: process.env.NODE_ENV,
  release: process.env.PACKAGE_VERSION,
  dsn: "https://d6d8ecd5c3d74209a80952cdc8dc043a@o563821.ingest.sentry.io/5704184",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(Vuex)
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});
Vue.use(VueSweetalert2);
Vue.use(VueToast);
const instance = getInstance();
instance.$watch("loading", async loading => {
  if (!loading && instance.isAuthenticated) {
    const token = await instance.getTokenSilently();
    const AUTH_ORIGINAL_URL = localStorage.getItem('AUTH_ORIGINAL_URL');
    const AUTH_NONCE = localStorage.getItem('AUTH_NONCE');
    const data = {
      token: token,
      AUTH_ORIGINAL_URL: AUTH_ORIGINAL_URL,
      AUTH_NONCE: AUTH_NONCE,
    }
    new Vue({
      router,
      data: data,
      render: h => h(App),
    }).$mount('#app')
  } else {
    localStorage.setItem('AUTH_ORIGINAL_URL', window.location.href);
    localStorage.setItem('AUTH_NONCE', 'redirect');
    instance.loginWithRedirect({connection: 'azuread'});
  }
});

