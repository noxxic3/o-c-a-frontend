<template>
  <div class="about">
    <button class="breadcrumb" v-on:click="toHome()"> &#8617; Home</button>

    <!-- Temporary links to access Dashboards before adding the automatic redirect that runs after login -->
    <!--
    <router-link to="/PatientDashboard">Patient Dashboard</router-link><br>
    <router-link to="/DoctorDashboard">Doctor Dashboard</router-link><br>
    <router-link to="/OfficeStackDashboard">OfficeStack Dashboard</router-link><br>
    <router-link to="/AdminDashboard">Admin Dashboard</router-link><br>
    <p>These links when the Navigation Guards are active will redirect if the user is authenticated</p>
    -->

    <div class="form">
      <h2>Login form</h2>
      <form v-on:submit.prevent="postRequestToAuthControllerLogin()">

        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email" minlength="3" maxlength="20" required  v-model="userEmail"><br>  

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" minlength="8" maxlength="25" required  v-model="userPassword"><br>   

        <input class="inputButton" type="submit" value="Send">

        <h3>{{$store.state.token}}</h3>
      </form>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: "Login",
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
        console.log(res.status);              // If the server responds (if the server's return is executed ...), res.status is always 200
        console.log(res.data.status_code);

        if(res.data.status_code == 200){
          //alert(this.userEmail);
          
          // We save the token and user data received after authenticating in Vuex so that they are accessible from any component
          this.$store.state.token = res.data.access_token;         // If the response res.data.status_code is not 200, then res.data.access_token will be undefined.
          this.$store.state.user_session = res.data.user;  
          this.$store.state.user_session_subtype = res.data.user_subtype;  

          // We save the token and user data received after authenticating in LocalStorage in order be able to refresh the browser and keep the authentication data. 
          // LocalStorage cannot store objects, it must be converted to a string and parsed to an object before using it.
          localStorage.setItem("token", res.data.access_token);
          localStorage.setItem("user_session", JSON.stringify(res.data.user));
          localStorage.setItem("user_session_subtype", JSON.stringify(res.data.user_subtype));

          //alert( localStorage.getItem("token") );
          console.log( this.$store.state.user_session );
          console.log( JSON.parse(localStorage.getItem("user_session")) );

          // Redirect to the corresponding Dashboard according to the role of the user received
          if (this.$store.state.user_session_subtype.role_name == 'Patient'){        // If the rolename were equal to the path name, we would not need to use conditionals to redirect.
            this.$store.state.patient_id = this.$store.state.user_session.id;
            this.$store.state.patient_image = this.$store.state.user_session.image;
            localStorage.setItem("patient_id", this.$store.state.user_session.id);
            localStorage.setItem("patient_image", this.$store.state.user_session.image);
            this.$router.push('/PatientDashboard');
          } else if (this.$store.state.user_session_subtype.role_name == 'Doctor') {
            this.$router.push('/DoctorDashboard'); 
          } else if (this.$store.state.user_session_subtype.role_name == 'OfficeStack') {
            this.$router.push('/OfficeStackDashboard'); 
          } else if (this.$store.state.user_session_subtype.role_name == 'Admin') {
            this.$router.push('/AdminDashboard'); 
          };
          

        } else if (res.data.status_code == 404) {
          alert('User not found. Check the email entered');
        } else if (res.data.status_code == 403) {                        // The 403 should be executed in the .catch(), because it is received as ERROR.
          alert('Error in Login. Incorrect password');      
        }


      })                                                  
      .catch(error => {                            // This block, the way I wrote the backend code, never executes.
        console.log(error.response);
        console.log('ERROR');
      }); 
    },
  },
};
</script>


<style scoped>

div.form {
  background-color: #ffb366;
}

</style>

