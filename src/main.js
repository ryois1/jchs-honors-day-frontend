import Vue from 'vue'
import App from './App.vue'
import { LayoutPlugin, CardPlugin, TablePlugin, FormPlugin, FormCheckboxPlugin, FormInputPlugin, PaginationPlugin, NavPlugin, NavbarPlugin, JumbotronPlugin, InputGroupPlugin, ImagePlugin, TooltipPlugin, ButtonPlugin, FormGroupPlugin, AlertPlugin, FormSelectPlugin, BadgePlugin } from 'bootstrap-vue';
import { BootstrapVueIcons } from 'bootstrap-vue'
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
  dsn: 'https://56b17f822420443c863ec6f82e80e163@o568401.ingest.sentry.io/5713429',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 0.3,
});
Vue.use(LayoutPlugin)
Vue.use(CardPlugin)
Vue.use(TablePlugin)
Vue.use(FormPlugin)
Vue.use(FormCheckboxPlugin)
Vue.use(FormInputPlugin)
Vue.use(PaginationPlugin)
Vue.use(NavPlugin)
Vue.use(NavbarPlugin)
Vue.use(JumbotronPlugin)
Vue.use(InputGroupPlugin)
Vue.use(ImagePlugin)
Vue.use(TooltipPlugin)
Vue.use(ButtonPlugin)
Vue.use(FormGroupPlugin)
Vue.use(AlertPlugin)
Vue.use(FormSelectPlugin)
Vue.use(BadgePlugin)

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

