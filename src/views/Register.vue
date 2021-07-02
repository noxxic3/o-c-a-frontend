<template>
  <div class="about">
    <button class="breadcrumb" v-on:click="toDashboard()"> &#8617; Dashboard</button>

    <div class="form">
      <h2>Register form</h2>
      <form v-on:submit.prevent="postRequestToUserControllerStore()"  enctype="multipart/form-data">      <!-- enctype="multipart/form-data" no hace falta ponerlo aquí porque ya se pone en la petición AJAX, aunque si no se pone allí creo que funciona igual? -->

        <label for="role">Choose a user role:</label>
        <select id="role" name="role" required  v-model="userRole">
          <option value="Patient">Patient</option>
          <option value="Doctor">Doctor</option>
          <option value="OfficeStack">Office Stack</option>
          <option value="Admin">Administrator</option>
        </select>  <br><br>
        
        <label for="name">Name:</label><br>
        <input type="text" id="name" name="name" minlength="2" maxlength="20"  required  v-model="userName"><br>   <!-- pattern="[A-Za-z]{2,}"  -->

        <label for="surname">Surnames:</label><br>
        <input type="text" id="surname" name="surname" minlength="2" maxlength="30" required  v-model="userSurname"><br>   

        <label for="birthdate">Birthdate:</label><br>
        <input type="date" id="birthdate" name="birthdate" min="1940-01-01" max="2002-01-01" required  v-model="userBirthdate"><br>     <!-- type="date"  incluye un calendario para la selección de la fecha y la proporciona en formato YYYY-MM-DD: 2020-11-30.  Si no se introduce fecha, la variable será una string vacía.  -->

        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email" minlength="3" maxlength="20" required  v-model="userEmail"><br>                <!-- type="email"  valida automáticamente que el email introducido tenga una @ -->

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" minlength="8" maxlength="12" required  v-model="userPassword"><br>    <!-- The <input type="password"> defines a password field (characters are masked) -->

        <div v-if="userRole == 'Patient'">
          <label for="image">Image:</label><br>                                                      <!-- Aunque el campo  image  en la BD está en la tabla Users y por lo tanto, se puede guardar imagen para todos los usuarios sean del rol que sean, en la aplicación en los dashboards para los usuarios que no son paciente no se ha pensado poner imagen de usuario, ya que la app es un servicio para el paciente y no se quiere sobrecargar de imágenes -->
          <input type="file" id="image" name="image"  ref="file"  v-on:change="attach()"> <br><br>   <!-- ++++++++++++ -->  
        
          <label for="height">Height (inches):</label><br>
          <input type="number" id="height" name="height" min="40" max="100" step=".01"  required  v-model="patientHeight"><br> 
        </div>

        <div v-if="userRole == 'Doctor'">
          <label for="specialty">Doctor's specialty:</label><br> 
          <select id="specialty" name="specialty" required  v-model="doctorSpecialty">
            <option value="Endocrine">Endocrine</option>
            <option value="Nutritionist">Nutritionist</option>
            <option value="Surgeon">Surgeon</option>
            <option value="Internal doctor">Internal doctor</option>
            <option value="Gastroenterologist">Gastroenterologist</option>
          </select>
        </div><br> 

        <input class="inputButton" type="submit" value="Send">

      </form>
    </div>

  </div>
</template>


<script>
import axios from 'axios';

//var response_data_acces_token = '5|3PJOJrQxdDs8EoIIMnk54q9jazNDO4Pw8riSq4RV';

export default {
  name: "Register",
  data(){
    return{
      userRole: '',
      userName: '',
      userSurname: '',
      userBirthdate: '',
      userEmail: '',
      userPassword: '',
      userImage: '',                 //  ++++++++++++           
      patientHeight: '',
      doctorSpecialty: '',
    }
  },
  created(){
    this.$store.state.view = 'Register';
    localStorage.setItem("view", 'Register');
    this.$store.state.view_title = this.$store.state.view;
  },
  computed: {

  },
  methods: {             
    toDashboard(){
      if(this.$store.state.user_session_subtype.role_name == 'OfficeStack'){
        this.$router.push('/OfficeStackDashboard');
      } else if(this.$store.state.user_session_subtype.role_name == 'Admin'){
        this.$router.push('/AdminDashboard');
      }
    },
    
    attach(){                        //  ++++++++++++
      this.userImage = this.$refs.file.files[0];            // Solo queremos enviar el único archivo que se ha adjuntado
      console.log('>>>> element files array   >>>> ', this.$refs.file);             // Si vemos la propiedad  .files del elemento type="file" vemos que es un array que tendrá todos los archivos que se hayan añadido a ese elemento.
      console.log('>>>> element file selected >>>> ', this.$refs.file.files[0]);
    },
    
    postRequestToUserControllerStore(){
      //alert('POST request to UserController store()');

      if( (this.userName != '' && !isNaN(this.userName)) || (this.userSurname != '' && !isNaN(this.userSurname)) ){          // isNaN = is Not a Number 
          alert('Please, do not enter numeric values ​​in the first and last name');
      } else {

        // http://localhost/8_TFG/ObesityControlApp/public/api/users
        /*
        let data = {
          role_name: this.userRole,                      // Se inserta en los subtipos de User
          user_name: this.userName,       
          user_surnames: this.userSurname,  
          user_birthdate: this.userBirthdate,  
          user_email: this.userEmail,   
          user_password: this.userPassword,  
          user_image: this.userImage,                    // Solo se inserta en Patient
          patient_height: this.patientHeight,            // Solo se inserta en Patient
          doctor_specialty: this.doctorSpecialty,        // Solo se inserta en Doctor    // recuerda que en la BD es  speciality
        };
        */
        ////////////////////////////////////////////
        
        let formData = new FormData();                               //  ++++++++++++     // Para enviar archivos a través de AJAX, tenemos que usar un objeto de tipo FormData
        formData.append('role_name', this.userRole);                 //  ++++++++++++ 
        formData.append('user_name', this.userName);                 //  ++++++++++++
        formData.append('user_surnames', this.userSurname);          //  ++++++++++++
        formData.append('user_birthdate', this.userBirthdate);       //  ++++++++++++
        formData.append('user_email', this.userEmail);               //  ++++++++++++
        formData.append('user_password', this.userPassword);         //  ++++++++++++
        formData.append('user_image', this.userImage);               //  ++++++++++++      <<----  Aquí le asignamos el valor del file del formulario que ahora sí lo adjuntamos y en attach() cojemos el file que queremos. Antes no lo adjuntaba y se asignaba la variable  this.userImage  entera sin coger del array files el que quería.
        formData.append('patient_height', this.patientHeight);       //  ++++++++++++
        formData.append('doctor_specialty', this.doctorSpecialty);   //  ++++++++++++
        console.log('>> formData >> ', formData);
        
        /////////////////////////////////////////////

        axios({
          method: 'post',
          url: 'http://localhost/8_TFG/ObesityControlApp/public/api/users',
          //headers: {"Content-type": "application/json"},
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': 'multipart/form-data'
          },         //  ++++++++++++       // Para enviar archivos a través de AJAX, tenemos que poner este valor de header que equivale al valor del atributo  enctype="multipart/form-data"  que ponemos en el elemento <form> cuando queremos enviar archivos.
          //params: data,
          data: formData,                                         //  ++++++++++++
        })
        .then(res => {                                   
          console.log(res);
          console.log(res.status);
          
          if (res.status == 200){
            alert('User registered correctly');
            if(this.$store.state.user_session_subtype.role_name == 'OfficeStack'){
              this.$router.push('/OfficeStackDashboard');
            } else {
              this.$router.push('/AdminDashboard');
            }
          } 
            
          /*
          console.log(res.data);
          console.log(res.data[0]);
          console.log(res.data[0].id);
          */
        })                                                  
        .catch(error => {
          console.log(error.response);               // el .response equivaldría al objeto res  que consultamos en el .then()
          console.log(error.response.status);
            
          alert('Existing email address, please try another');
          
        });       
      };
    },

  },

};
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

div.form {
  background-color: #ffb366;
}

form input[type=date], input[type=number] {
  width: 30%;
}

</style>
