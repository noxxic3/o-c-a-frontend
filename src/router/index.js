import Vue from "vue";

// Vue Router import and activation
import VueRouter from "vue-router";
Vue.use(VueRouter);

// Import files to assign routes 
import Home from "../views/Home.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import PatientDashboard from "../views/PatientDashboard.vue";
import DoctorDashboard from "../views/DoctorDashboard.vue";
import PatientDoctorView from "../views/PatientDoctorView.vue";
import OfficeStackDashboard from "../views/OfficeStackDashboard.vue";
import AdminDashboard from "../views/AdminDashboard.vue";
import store from '../store/index.js';                                         // Import Vuex

// Routes configuration saved on a 'routes' constant
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/register",
    name: "Register",
    // route level code-splitting, this generates a separate chunk (about.[hash].js) for this route which is lazy-loaded when the route is visited.
    //component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
    component: Register,
    meta: {requiresAuth: true, requiresRoleOfficeOrAdmin: true},       // I can't put  requiresRoleOffice: true, requiresRoleAdmin: true  because then the 2 corresponding conditions should be met.
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/PatientDashboard",
    name: "PatientDashboard",
    component: PatientDashboard,
	  meta: {requiresAuth: true, requiresRolePatient: true},
  },
  {
    path: "/DoctorDashboard",
    name: "DoctorDashboard",
    component: DoctorDashboard,
	  meta: {requiresAuth: true, requiresRoleDoctor: true},
  },
  {
    path: "/PatientDoctorView",
    name: "PatientDoctorView",
    component: PatientDoctorView,
	  meta: {requiresAuth: true, requiresRoleDoctorOrAdmin: true},
  },  
  {
    path: "/OfficeStackDashboard",
    name: "OfficeStackDashboard",
    component: OfficeStackDashboard,
	  meta: {requiresAuth: true, requiresRoleOffice: true},
  },
  {
    path: "/AdminDashboard",
    name: "AdminDashboard",
    component: AdminDashboard,
	  meta: {requiresAuth: true, requiresRoleAdmin: true},                       //  { requiresAuth: true, requiresRole: true }    if( to.meta.requiresRole && (store.state.user_session_subtype.role_name != 'Admin' ) )
  },
];

// Vue Router instance
const router = new VueRouter({
  routes                              // Send our routes constant to the Vue Router constructor
});



// Navigation Guards (access control for routes for which authentication is required to access or for routes belonging to specific roles)
router.beforeEach( function(to, from, next){                                 // We are not using the 'from' argument, we can put '_' instead.
    if( to.meta.requiresAuth && !store.state.token ){                            // store.state.token, store is the object where we have imported the Vuex file. We are now in the routes.js file, therefore, if we want to access the store object, we must import it into this file, since we cannot access it with this.$store ..., since we are not now inside no Vue instance or component.
		next('/login');                   // If we want to prohibit access and redirect.
	} else if ( to.meta.requiresRoleAdmin && (store.state.user_session_subtype.role_name != 'Admin' ) ){
		next(false);                      // If we only want to prohibit access (it will not access that route, it will stay in the current one).
	} else if ( to.meta.requiresRoleOffice && (store.state.user_session_subtype.role_name != 'OfficeStack' ) ){
		next(false);
	} else if ( to.meta.requiresRoleDoctor && (store.state.user_session_subtype.role_name != 'Doctor' ) ){
		next(false);
	} else if ( to.meta.requiresRolePatient && (store.state.user_session_subtype.role_name != 'Patient' ) ){
		next(false);
	} else if ( to.meta.requiresRoleOfficeOrAdmin && (store.state.user_session_subtype.role_name == 'Patient' || store.state.user_session_subtype.role_name == 'Doctor') ){
		next(false);
	} else if ( to.meta.requiresRoleDoctorOrAdmin && (store.state.user_session_subtype.role_name == 'Patient' || store.state.user_session_subtype.role_name == 'Office') ){
		next(false);
	} else {
		next();
	};
} );


// Vue Router instance export
export default router;
