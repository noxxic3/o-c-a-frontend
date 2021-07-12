import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import './assets/css/main.css';                          // Global CSS

Vue.config.productionTip = false;

// Import components & HTML tag name assignment
import Header from './components/Header.vue'  
Vue.component('header-component', Header);    

import UserAccount from './components/UserAccount.vue'  
Vue.component('user-account-component', UserAccount);     

import DataHistory from './components/DataHistory.vue'                          // This should be divided into 2 components: PatientStatusHistoryAndTreatments & TreatmentSelection (that would share content with ManageTreatments) 
Vue.component('data-history-component', DataHistory);                           

import SearchPatientsForm from './components/SearchPatientsForm.vue'            // I should rename it to ManagePatients
Vue.component('search-patients-form-component', SearchPatientsForm);            

import SearchUsersForm from './components/SearchUsersForm.vue'                  // I should rename it to ManageUsers
Vue.component('search-users-form-component', SearchUsersForm);   

import ManageTreatments from './components/admin-dashboard/ManageTreatments.vue'  
Vue.component('manage-treatments-component', ManageTreatments);      

// Vue instance
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
