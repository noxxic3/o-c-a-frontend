<template>
  <div id="ComponentTemplate">
    <div id="nav">
      <!--  The 4 buttons without  v-if  conditionals  
      <button class="dashboard" v-on:click="redirectToDashboard()" >Dashboard</button> <br>
      <router-link  class="register" to="/register" >Register</router-link> <br>
      <router-link  class="login" to="/login" >Login</router-link> <br>
      <button class="logout" v-on:click="logout()"  >Logout</button> <br>
      -->
      
      <button class="dashboard" v-on:click="redirectToDashboard()" v-if="token != '' && (view == 'ObesityControlCenter' || view == 'Login') ">Dashboard</button> <br>
      <router-link  class="register" to="/register" v-if="view == 'OfficeStackDashboard' || view == 'AdminDashboard'">Register</router-link> <br>
          <!--
          Instead of looking for a way to make this button display according to the active View, what we can do is show it according to the role that is in session.
          In any case, we will only need it to be displayed when the role is in that View and not in another (although it would not look bad if it is seen in all the views accessed by this role).
          For that, we can make the View when loading (created (), mounted () ...) initialize a variable that is in Vuex, and that this UserAccount component check its value, if it is initialized, it shows the button.
          -->                                              
      <router-link  class="login" to="/login" v-if="token == '' && view == 'ObesityControlCenter'">Login</router-link> <br>
      <button class="logout" v-on:click="logout()"  v-if="token != ''">Logout</button> <br>
      
      <!-- <router-link to="/login">LoginWithoutConditionalsToTry</router-link> <br> -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "UserAccount",
  computed: {
    token(){
      return this.$store.state.token;           
    },
    view(){
      return this.$store.state.view;              // Access the current view value stored in Vuex
    },
    userRole(){
      return this.$store.state.user_session_subtype.role_name;           
    },
  },
  methods: {
    redirectToDashboard(){
      //alert(this.userRole);
      if( this.userRole == 'Patient' ){
        this.$router.push('/PatientDashboard');
      } else if(this.userRole == 'Doctor') {
        this.$router.push('/DoctorDashboard');
      } else if(this.userRole == 'OfficeStack') {
        this.$router.push('/OfficeStackDashboard');
      } else if(this.userRole == 'Admin') {
        this.$router.push('/AdminDashboard');
      }
    },
    logout(){
      //alert('logout!');
      this.deleteRequestToAuthControllerLogout( this.$store.state.user_session.id );
      
      // Clear token and user data from Vuex
      this.$store.state.token = '';
      this.$store.state.user_session = '';
      this.$store.state.user_session_subtype = '';
      this.$store.state.patient_id = '';
      this.$store.state.patient_image = '';
      this.$store.state.view = 'ObesityControlCenter';     // If we assign '' here, the Login button will not be seen because we have put 'ObesityControlCenter' in the condition of this button.
                                                           // Actually when we exit we delete the session data but if it is redirected to a view, (see below in Redirect to Homepage where we redirect to the path of the Homepage view), the .view value should not be empty in Vuex.
      
      // Clear data from LocalStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user_session");
      localStorage.removeItem("user_session_subtype");
      localStorage.removeItem("patient_id");
      localStorage.removeItem("patient_image");
      localStorage.removeItem("view");

      // Redirect to Homepage 
      this.$router.push('/');
    }, 
    deleteRequestToAuthControllerLogout(userID){
      axios({
        method: 'delete',
        url: 'logout/' + userID,
        headers: {
        //'Authorization': 'Bearer ' + this.$store.state.token,
        }
      })
      .then(res => { console.log(res) })
      .catch(error => console.log(error));
    },
  }
};
</script>

<style scoped>
  #ComponentTemplate{
    border: solid 2px;
  }

  #nav {
    padding: 8px 0 8px 0;
    
    display: flex;
    justify-content: space-around;
  }

  .register, .dashboard, .login, .logout {
    color: white;

    width: 70px;
    height: 20px;
    margin: auto;

    border: 2px solid grey;
	  box-sizing: border-box;
    text-decoration: none;
    line-height: 20px;
    font-size: 0.6em;
    text-align: center;
    transition: all 0.5s;
  } 
  
  .register, .login {
    line-height: 16px;
  } 

  .dashboard, .logout {
    line-height: 5px;
  } 

  .login, .logout {
    background-color: #806000;
  }

  .register {
    background-color: #994D00;
  }

  .dashboard{
    background-color: #808000;
  }  

  .register:hover, .dashboard:hover, .login:hover, .logout:hover {                              
    background-color: #f3f3f3;
    border: 2px solid black;
    color: black;
    font-weight: bold;
  } 

  #nav a.router-link-exact-active {          /* exact-active style the link pointing to the active path */
    color: #42b983;
  }

      /* Tablet */
      @media screen and (min-width: 768px) {                
        #nav {
          padding: 11px 0 11px 0;
        }
        .register, .dashboard, .login, .logout {
          width: 100px;
          height: 30px;
          font-size: 0.8em;
        }
        .register, .login {
          line-height: 24px;
        }
      }
      
      /* Desktop */
      @media screen and (min-width: 1280px) {                
        #nav {
          padding: 16px 0 16px 0;
        }
        .register, .dashboard, .login, .logout {
          width: 130px;
          height: 33px;
          font-size: 0.9em;
        }
        .register, .login {
          line-height: 27px;
        }
      }
</style>
