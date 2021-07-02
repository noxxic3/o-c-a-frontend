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
import store from '../store/index.js';                                         // Importamos el archivo de Vuex

//import __Prueba from "../views/__Prueba.vue";                                  // <<----  Prueba


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
    meta: {requiresAuth: true, requiresRoleOfficeOrAdmin: true},             // No puedo poner  requiresRoleOffice: true, requiresRoleAdmin: true  porque entonces se deberían cumplir las 2 condiciones correspondientes.
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
  
 /* {                                                                           // <<----  Prueba
    path: "/p",
    name: "__Prueba",
    component: __Prueba
  },*/
];

// Vue Router instance
const router = new VueRouter({
  routes                              // send our routes constant to the Vue Router constructor
});


////////////////////
// Navigation Guards (control de acceso para rutas para las que se necesite autenticación para acceder o rutas que pertenezcan a roles concretos)

router.beforeEach( function(to, from, next){                                 // El argumento  from no lo estamos usando, podemos poner '_' en su lugar.
    if( to.meta.requiresAuth && !store.state.token ){                          // store.state.token, store es el objeto donde hemos importado el archivo de Vuex. Recuerda que ahora estamos en el archivo routes.js, con lo cual, si queremos acceder al objeto store, hay que importarlo a este archivo, ya que no podemos acceder con this.$store..., ya que no estamos ahora dentro de ninguna instancia o componente Vue. 
		next('/login');                   //si queremos prohibir acceso y redirigir.
	} else if ( to.meta.requiresRoleAdmin && (store.state.user_session_subtype.role_name != 'Admin' ) ){
		next(false);                      //si queremos solo prohibir acceso (no accederá a esa ruta, se quedará en la actual).
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

////////////////////


// Vue Router instance export
export default router;
