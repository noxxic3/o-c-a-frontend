<template>
  <div class="about">
    <button class="breadcrumb" v-on:click="toHome()"> &#8617; Home</button>

    <!--
    <router-link to="/PatientDashboard">Patient Dashboard</router-link><br>
    <router-link to="/DoctorDashboard">Doctor Dashboard</router-link><br>
    <router-link to="/OfficeStackDashboard">OfficeStack Dashboard</router-link><br>
    <router-link to="/AdminDashboard">Admin Dashboard</router-link><br>
    <p>Recuerda que estos enlaces ahora que hemos puesto Navigation Guards redirigen a Login solo si el usuario está autenticado</p>
    -->
    <!--
    <login-form-component />
    -->
    <div class="form">
      <h2>Login form</h2>
      <form v-on:submit.prevent="postRequestToAuthControllerLogin()">

        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email" minlength="3" maxlength="20" required  v-model="userEmail"><br>  

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" minlength="8" maxlength="25" required  v-model="userPassword"><br>   

        <input class="inputButton" type="submit" value="Send">

        <!--<h3 v-on:click="connectVuex()">{{$store.state.prueba}}</h3>-->
        <h3>{{$store.state.token}}</h3>
  
      </form>
    </div>


  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: "Login",
  /*props: {
    msg: String
  }*/
  data(){
    return{
      responseShow: '',

      userEmail: '',
      userPassword: '',
    }
  },
  created(){
    this.$store.state.view = 'Login';
    localStorage.setItem("view", 'Login');
    this.$store.state.view_title = this.$store.state.view;
 
  },
  methods:{
    toHome(){
      this.$router.push('/');
    },
    postRequestToAuthControllerLogin(){

      axios({
        method: 'post',
        url: 'http://localhost/8_TFG/ObesityControlApp/public/api/login',
        headers: {"Content-type": "application/json"},
        data: {
          email: this.userEmail,
          password: this.userPassword,
        },                   
      })
      .then(res => {                                   
        console.log(res);
        console.log(res.status);              // OJO, parece que si el servidor responde (return...), res.status  siempre es 200
        console.log(res.data.status_code);

        /////////////////////

        if(res.data.status_code == 200){
          //alert(this.userEmail);
          
          // Guardamos el token y los datos de usuario recibidos después de autenticarnos en el objeto state de la instancia store de Vuex para que sea accesible desde cualquier componente
          this.$store.state.token = res.data.access_token;         // Si la respuesta  res.data.status_code  no es 200,  res.data.access_token  será undefined. 
          this.$store.state.user_session = res.data.user;  
          this.$store.state.user_session_subtype = res.data.user_subtype;  

          // Guardamos el token y los datos de usuario recibidos después de autenticarnos, en LocalStorage 
          // para poder refrescar el navegador y que se mantengan los datos de autenticación.
          // LocalStorage no puede almacenar objetos, hay que convertirlo en  string  y antes de usarla parsearla a objeto.
          localStorage.setItem("token", res.data.access_token);
          localStorage.setItem("user_session", JSON.stringify(res.data.user));
          localStorage.setItem("user_session_subtype", JSON.stringify(res.data.user_subtype));

          //alert( localStorage.getItem("token") );
          console.log( this.$store.state.user_session );
          console.log( JSON.parse(localStorage.getItem("user_session")) );

          // Redirigimos al Dashboard correspondiente según el rol del usuario recibido
          if (this.$store.state.user_session_subtype.role_name == 'Patient'){        
            this.$store.state.patient_id = this.$store.state.user_session.id;
            this.$store.state.patient_image = this.$store.state.user_session.image;
            localStorage.setItem("patient_id", this.$store.state.user_session.id);
            localStorage.setItem("patient_image", this.$store.state.user_session.image);
            this.$router.push('/PatientDashboard');    // Aquí tenemos que redirigir a la vista Patient Doctor View (Patient Data).
          } else if (this.$store.state.user_session_subtype.role_name == 'Doctor') {
            this.$router.push('/DoctorDashboard'); 
          } else if (this.$store.state.user_session_subtype.role_name == 'OfficeStack') {
            this.$router.push('/OfficeStackDashboard'); 
          } else if (this.$store.state.user_session_subtype.role_name == 'Admin') {
            this.$router.push('/AdminDashboard'); 
          };
          

        } else if (res.data.status_code == 404) {
          alert('User not found. Check the email entered');
        } else if (res.data.status_code == 403) {                        // Se debe de ejecutar en el .catch(), porque se recibe como ERROR.
          alert('Error in Login. Incorrect password');      
        }

        /////////////////////

      })                                                  
      .catch(error => {                            // Este bloque, tal y como tengo el código del backend, no se llega a ejecutar.
        console.log(error.response);
        console.log('ERROR');

      }); 

    },
    /*
    connectVuex(){
      this.$store.state.prueba = 'Vuex BBBB';
    },
    */

  },
};
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

div.form {
  background-color: #ffb366;
}


</style>

