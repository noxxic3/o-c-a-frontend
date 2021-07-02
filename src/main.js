import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import './assets/css/main.css';                          // CSS

Vue.config.productionTip = false;

// Import components
import Header from './components/Header.vue'  
Vue.component('header-component', Header);       // Component HTML name, el siguiente parámetro es a cual se le asigna

import UserAccount from './components/UserAccount.vue'  
Vue.component('user-account-component', UserAccount);     

import DataHistory from './components/DataHistory.vue'  
Vue.component('data-history-component', DataHistory);    

import SearchPatientsForm from './components/SearchPatientsForm.vue'            // ManagePatients
Vue.component('search-patients-form-component', SearchPatientsForm);            

import SearchUsersForm from './components/SearchUsersForm.vue'                  // ManageUsers
Vue.component('search-users-form-component', SearchUsersForm);   

import ManageTreatments from './components/admin-dashboard/ManageTreatments.vue'  
Vue.component('manage-treatments-component', ManageTreatments);  


//import News from './components/home/News.vue'  
//Vue.component('news-component', News);

//import PatientStatusDataForm from './components/patient-dashboard/PatientStatusDataForm.vue'  
//Vue.component('patient-status-data-form-component', PatientStatusDataForm);

//import CurrentTreatment from './components/CurrentTreatment.vue'  
//Vue.component('current-treatment-component', CurrentTreatment);  

//import RegisterForm from './components/register/RegisterForm.vue'  
//Vue.component('register-form-component', RegisterForm);  

//import LoginForm from './components/login/LoginForm.vue'  
//Vue.component('login-form-component', LoginForm);       


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
