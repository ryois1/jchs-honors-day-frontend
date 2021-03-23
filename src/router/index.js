import Vue from 'vue';
import VueRouter from 'vue-router';
import { authGuard } from "../auth/authGuard";
const homepage = () => import(/* webpackChunkName: "homepage" */ '../views/homepage.vue');
const certificates = () => import(/* webpackChunkName: "certificates" */ '../views/certs/certificates.vue');
const single_certificate = () => import(/* webpackChunkName: "certificates" */ '../views/certs/single_certificate.vue');
const new_certificate_parent = () => import(/* webpackChunkName: "certificates" */ '../views/certs/new_certificate_parent.vue');
const new_certificate_child = () => import(/* webpackChunkName: "certificates" */ '../views/certs/new_certificate_child.vue');
const check_child_certs = () => import(/* webpackChunkName: "certificates" */ '../views/certs/check_child_certs.vue');
const certificate_delegate = () => import(/* webpackChunkName: "certificates" */ '../views/certs/delegate.vue');
const certificate_delegate_verify = () => import(/* webpackChunkName: "certificates" */ '../views/certs/check_delegating.vue');
const certificate_delegates = () => import(/* webpackChunkName: "certificates" */ '../views/certs/delegates.vue');
const students = () => import(/* webpackChunkName: "students" */ '../views/students.vue');
const authNewUser = () => import(/* webpackChunkName: "auth" */ '../views/auth/new_user.vue');
const unknownUser = () => import(/* webpackChunkName: "auth" */ '../views/unknown_user.vue');
const admin_new_user = () => import(/* webpackChunkName: "admin" */ '../views/admin/new_user.vue');
const import_pdfs_1 = () => import(/* webpackChunkName: "import" */ '../views/import_pdfs_step_1.vue');
const import_pdfs_2 = () => import(/* webpackChunkName: "import" */ '../views/import_pdfs_step_2.vue');
const import_pdfs_done = () => import(/* webpackChunkName: "import" */ '../views/import_pdfs_done.vue');
const dept_all = () => import(/* webpackChunkName: "dept" */ '../views/depts/all.vue');
const dept_certs = () => import(/* webpackChunkName: "dept" */ '../views/depts/cert.vue');
const dept_users = () => import(/* webpackChunkName: "dept" */ '../views/depts/users.vue');
const admin_index = () => import(/* webpackChunkName: "admin" */ '../views/admin/index.vue');
const admin_users = () => import(/* webpackChunkName: "admin" */ '../views/admin/users.vue');
const admin_settings = () => import(/* webpackChunkName: "admin" */ '../views/admin/settings.vue')
const admin_email = () => import(/* webpackChunkName: "admin" */ '../views/admin/email.vue');
const admin_depts = () => import(/* webpackChunkName: "admin" */ '../views/admin/departments.vue');
const admin_depts_edit = () => import(/* webpackChunkName: "admin" */ '../views/admin/departments_edit.vue');
const admin_depts_new = () => import(/* webpackChunkName: "dept" */ '../views/admin/departments_new.vue');
const admin_depts_add = () => import(/* webpackChunkName: "admin" */ '../views/admin/departments_add_user.vue');
const admin_depts_verify = () => import(/* webpackChunkName: "admin" */ '../views/admin/departments_verify_user.vue');
const admin_students = () => import(/* webpackChunkName: "admin" */ '../views/admin/students.vue');
const admin_purge = () => import(/* webpackChunkName: "admin" */ '../views/admin/purge.vue');

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
      title: 'New Award',
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
    path: '/certificates/import/complete',
    name: 'ImportCertsPDFsDone',
    component: import_pdfs_done,
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
    path: '/certificates/:cert_id/delegates',
    name: 'CertificatePageDelegates',
    component: certificate_delegates,
    beforeEnter: authGuard,
    props: true,
    meta: {
      title: 'Delegates for Certificate',
      visible: true
    },
  },
  {
    path: '/certificates/:cert_id/delegate',
    name: 'CertificatePageDelegate',
    component: certificate_delegate,
    beforeEnter: authGuard,
    props: true,
    meta: {
      title: 'Delegate Certificates',
      visible: true
    },
  },
  {
    path: '/certificates/:cert_id/delegate/verify',
    name: 'CertificateDelegateVerify',
    component: certificate_delegate_verify,
    beforeEnter: authGuard,
    props: true,
    meta: {
      title: 'Delegate Certificates',
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
      title: 'New Certificates',
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
      title: 'Verify Certificates',
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
    path: '/departments',
    name: 'Departments',
    component: dept_all,
    beforeEnter: authGuard,
    meta: {
      title: 'Departments',
      visible: true
    },
  },
  {
    path: '/departments/:dept_id/certificates',
    name: 'DepartmentsCertificates',
    component: dept_certs,
    beforeEnter: authGuard,
    meta: {
      title: 'Department Certificates',
      visible: true
    },
  },
  {
    path: '/departments/:dept_id/users',
    name: 'DepartmentsUsers',
    component: dept_users,
    beforeEnter: authGuard,
    meta: {
      title: 'Department Users',
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
    path: '/admin/students',
    name: 'AdminStudents',
    component: admin_students,
    beforeEnter: authGuard,
    meta: {
      title: 'Students Admin',
      visible: true
    },
  },
  {
    path: '/admin/purge',
    name: 'AdminPurge',
    component: admin_purge,
    beforeEnter: authGuard,
    meta: {
      title: 'Purge',
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
    path: '/admin/departments',
    name: 'AdminDepts',
    component: admin_depts,
    beforeEnter: authGuard,
    meta: {
      title: 'Admin Departments',
      visible: true
    },
  },
  {
    path: '/admin/departments/new',
    name: 'AdminDeptsNew',
    component: admin_depts_new,
    beforeEnter: authGuard,
    meta: {
      title: 'New Department',
      visible: true
    },
  },
  {
    path: '/admin/departments/:dept_id',
    name: 'AdminDeptsEdit',
    component: admin_depts_edit,
    beforeEnter: authGuard,
    meta: {
      title: 'Edit Department Admin',
      visible: true
    },
  },
  {
    path: '/admin/departments/:dept_id/add',
    name: 'AdminDeptsAdd',
    component: admin_depts_add,
    beforeEnter: authGuard,
    props: true,
    meta: {
      title: 'Add User to Department Admin',
      visible: true
    },
  },
  {
    path: '/admin/departments/:dept_id/add/verify',
    name: 'AdminDeptAddVerify',
    component: admin_depts_verify,
    props: true,
    beforeEnter: authGuard,
    meta: {
      title: 'Verify Adding User to Department Admin',
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