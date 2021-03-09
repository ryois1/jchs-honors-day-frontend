import Vue from 'vue';
import VueRouter from 'vue-router';
import { authGuard } from "../auth/authGuard";
const homepage = () => import(/* webpackChunkName: "homepage" */ '../views/homepage.vue');
const certificates = () => import(/* webpackChunkName: "certificates" */ '../views/certificates.vue');
const single_certificate = () => import(/* webpackChunkName: "single_certificate" */ '../views/single_certificate.vue');
const new_certificate_parent = () => import(/* webpackChunkName: "new_certificate_parent" */ '../views/new_certificate_parent.vue');
const new_certificate_child = () => import(/* webpackChunkName: "new_certificate_child" */ '../views/new_certificate_child.vue');
const check_child_certs = () => import(/* webpackChunkName: "check_child_certs" */ '../views/check_child_certs.vue');
const students = () => import(/* webpackChunkName: "students" */ '../views/students.vue');
const admin_index = () => import(/* webpackChunkName: "admin_index" */ '../views/admin/index.vue');
const admin_users = () => import(/* webpackChunkName: "admin_users" */ '../views/admin/users.vue');
const admin_settings = () => import(/* webpackChunkName: "admin_settings" */ '../views/admin/settings.vue');
const authNewUser = () => import(/* webpackChunkName: "authNewUser" */ '../views/auth/new_user.vue');
const unknownUser = () => import(/* webpackChunkName: "unknownUser" */ '../views/unknown_user.vue');
const admin_new_user = () => import(/* webpackChunkName: "admin_new_user" */ '../views/admin/new_user.vue');
const import_pdfs_1 = () => import(/* webpackChunkName: "import_pdfs_1" */ '../views/import_pdfs_step_1.vue');
const import_pdfs_2 = () => import(/* webpackChunkName: "import_pdfs_2" */ '../views/import_pdfs_step_2.vue');
const admin_email = () => import(/* webpackChunkName: "admin_email" */ '../views/admin/email.vue');

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: homepage,
    beforeEnter: authGuard,
    meta: {
      title: 'Home',
      visible: true
    },
  },
  {
    path: '/certificates',
    name: 'Certificates',
    component: certificates,
    beforeEnter: authGuard,
    meta: {
      title: 'Certificates',
      visible: true
    },
  },
  {
    path: '/certificates/new',
    name: 'CertificateNewParent',
    component: new_certificate_parent,
    beforeEnter: authGuard,
    meta: {
      title: 'New Parent Certificate',
      visible: true
    },
  },
  {
    path: '/certificates/import/step/1',
    name: 'ImportCertsPDFs1',
    component: import_pdfs_1,
    props: true,
    beforeEnter: authGuard,
    meta: {
      title: 'Importing Certificate',
      visible: true
    },
  },
  {
    path: '/certificates/import/step/2',
    name: 'ImportCertsPDFs2',
    component: import_pdfs_2,
    props: true,
    beforeEnter: authGuard,
    meta: {
      title: 'Importing Certificate',
      visible: true
    },
  },
  {
    path: '/certificates/:cert_id',
    name: 'CertificatePage',
    component: single_certificate,
    beforeEnter: authGuard,
    meta: {
      title: 'Viewing Certificate',
      visible: true
    },
  },
  {
    path: '/certificates/:cert_id/new',
    name: 'CertificatePageChild',
    component: new_certificate_child,
    beforeEnter: authGuard,
    props: true,
    meta: {
      title: 'New Child Certificates',
      visible: true
    },
  },
  {
    path: '/certificates/:cert_id/new/verify',
    name: 'CertificatePageChildVerify',
    component: check_child_certs,
    beforeEnter: authGuard,
    props: true,
    meta: {
      title: 'Very Child Certificates',
      visible: true
    },
  },
  {
    path: '/students',
    name: 'Students',
    component: students,
    beforeEnter: authGuard,
    meta: {
      title: 'Students',
      visible: true
    },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: admin_index,
    beforeEnter: authGuard,
    meta: {
      title: 'Admin',
      visible: true
    },
  },
  {
    path: '/admin/settings/email',
    name: 'AdminEmail',
    component: admin_email,
    beforeEnter: authGuard,
    meta: {
      title: 'Admin Email',
      visible: true
    },
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: admin_users,
    beforeEnter: authGuard,
    meta: {
      title: 'Admin Users',
      visible: true
    },
  },
  {
    path: '/admin/users/new',
    name: 'AdminNewUser',
    component: admin_new_user,
    beforeEnter: authGuard,
    meta: {
      title: 'Add New User Admin',
      visible: true
    },
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: admin_settings,
    beforeEnter: authGuard,
    meta: {
      title: 'Admin Settings',
      visible: true
    },
  },
  {
    path: '/auth/new_user',
    name: 'AuthNewUser',
    component: authNewUser,
    meta: {
      title: 'Sign Up',
      visible: true
    },
  },
  {
    path: '/unknown_user',
    name: 'UnknownUser',
    component: unknownUser,
    meta: {
      title: 'Unknown User',
      visible: true
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});
router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);

  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  if (nearestWithTitle) document.title = `${nearestWithTitle.meta.title} | JCS Honors Day`;

  Array.from(
    document.querySelectorAll('[data-vue-router-controlled]'),
  ).map((el) => el.parentNode.removeChild(el));

  if (!nearestWithMeta) return next();

  nearestWithMeta.meta.metaTags
    .map((tagDef) => {
      const tag = document.createElement('meta');

      Object.keys(tagDef).forEach((key) => {
        tag.setAttribute(key, tagDef[key]);
      });

      tag.setAttribute('data-vue-router-controlled', '');

      return tag;
    })
    .forEach((tag) => document.head.appendChild(tag));

  next();
});

export default router;