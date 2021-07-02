<template>
  <div id="ComponentTemplate">

    <div id="nav">
      <!--  Los 4 botones sin condicionales   v-if
      <button class="dashboard" v-on:click="redirectToDashboard()" >Dashboard</button> <br>
      <router-link  class="register" to="/register" >Register</router-link> <br>
      -->                                                    <!--
                                                            En vez de buscar la manera de hacer que este botón se vea según la Vista a través de la cual se esté mostrando este componente, 
                                                            lo que podemos hacer es que se muestre según el rol que está en sesión.
                                                            De todas maneras necesitaremos que solo se muestre cuando el rol esté en esa Vista y no en otra (aunque tampoco quedaría mal que se vea en todas)
                                                            Para eso, podemos hacer que la Vista al cargar (created(), mounted()...) inicialize una variable que esté en Vuex, y que este componente verifique su valor, si está inicializado, muetra el botón.
                                                          --> 
      <!--
      <router-link  class="login" to="/login" >Login</router-link> <br>
      <button class="logout" v-on:click="logout()"  >Logout</button> <br>
      -->

      
      <button class="dashboard" v-on:click="redirectToDashboard()" v-if="token != '' && (view == 'ObesityControlCenter' || view == 'Login') ">Dashboard</button> <br>
      <router-link  class="register" to="/register" v-if="view == 'OfficeStackDashboard' || view == 'AdminDashboard'">Register</router-link> <br>
                                                       <!--
                                                            En vez de buscar la manera de hacer que este botón se vea según la Vista a través de la cual se esté mostrando este componente, 
                                                            lo que podemos hacer es que se muestre según el rol que está en sesión.
                                                            De todas maneras necesitaremos que solo se muestre cuando el rol esté en esa Vista y no en otra (aunque tampoco quedaría mal que se vea en todas)
                                                            Para eso, podemos hacer que la Vista al cargar (created(), mounted()...) inicialize una variable que esté en Vuex, y que este componente verifique su valor, si está inicializado, muetra el botón.
                                                             --> 
                                                      
      <router-link  class="login" to="/login" v-if="token == '' && view == 'ObesityControlCenter'">Login</router-link> <br>
      <button class="logout" v-on:click="logout()"  v-if="token != ''">Logout</button> <br>
      
      <!-- 
        <router-link to="/login">LoginSinCondicionalesParaPrueba</router-link> <br>
      -->
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "UserAccount",
  created(){
    
  },
  computed: {
    token(){
      return this.$store.state.token;           
    },
    view(){
      return this.$store.state.view;              // We access the current view value stored in Vuex
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
      // deleteRequestToAuthControllerLogout()
      this.deleteRequestToAuthControllerLogout( this.$store.state.user_session.id );
      
      // Clear token and user data from Vuex
      this.$store.state.token = '';
      this.$store.state.user_session = '';
      this.$store.state.user_session_subtype = '';
      this.$store.state.patient_id = '';
      this.$store.state.patient_image = '';
      this.$store.state.view = 'ObesityControlCenter';     // Si aquí ponemos '', el botón de Login no se verá porque hemos puesto 'ObesityControlCenter' en la condición.
                                                           // Realmente al salir borramos los datos de sesión pero si se redirige a una vista, (ver más a abajo en Redirect to Homepage donde redirigimos a la ruta de esta vista) este valor no debe estar vacío.
      
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
        url: 'http://localhost/8_TFG/ObesityControlApp/public/api/logout/' + userID,
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
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

  #nav a.router-link-exact-active {          /* exact-active aplica estilo al link que apunta a la ruta activa */
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
