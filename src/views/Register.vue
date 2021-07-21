<template>
  <div class="about">
    <button class="breadcrumb" v-on:click="toDashboard()"> &#8617; Dashboard</button>

    <div class="form">
      <h2>Register form</h2>
      <form v-on:submit.prevent="postRequestToUserControllerStore()"  enctype="multipart/form-data">      <!-- enctype="multipart/form-data" it is not necessary to put it here because it is already put in the AJAX request, try if it works by removing it -->

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
        <input type="date" id="birthdate" name="birthdate" min="1940-01-01" max="2002-01-01" required  v-model="userBirthdate"><br>  

        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email" minlength="3" maxlength="20" required  v-model="userEmail"><br>           

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" minlength="8" maxlength="12" required  v-model="userPassword"><br>  

        <div v-if="userRole == 'Patient'">
          <label for="image">Image:</label><br>                                                      <!-- Although the image field in the DB is in the Users table and therefore, an image can be stored for all users regardless of their role, at the moment it has only been thought for patients -->
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
      userRole: '',                  // Can be organized into objects
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
    // Attach the image file to the form data
    attach(){                        //  ++++++++++++
      this.userImage = this.$refs.file.files[0];                                    // We only want to send the only file that has been attached
      console.log('>>>> element files array   >>>> ', this.$refs.file);             // If we see the .files property of the type="file" element, we see that it is an array that will have all the files that have been added to that element.
      console.log('>>>> element file selected >>>> ', this.$refs.file.files[0]);
    },
    
    postRequestToUserControllerStore(){
      //alert('POST request to UserController store()');

      if( (this.userName != '' && !isNaN(this.userName)) || (this.userSurname != '' && !isNaN(this.userSurname)) ){          // Form validation   // isNaN = is Not a Number 
        alert('Please, do not enter numeric values ​​in the first and last name');
      } else {

        // http://localhost/8_TFG/ObesityControlApp/public/api/users
        /*
        let data = {
          role_name: this.userRole,                      // It is added in all User subtypes
          user_name: this.userName,       
          user_surnames: this.userSurname,  
          user_birthdate: this.userBirthdate,  
          user_email: this.userEmail,   
          user_password: this.userPassword,  
          user_image: this.userImage,                    // Only added in Patient
          patient_height: this.patientHeight,            // Only added in Patient
          doctor_specialty: this.doctorSpecialty,        // Only added in Doctor    // remember that in the DB the field is called  speciality
        };
        */
        
        let formData = new FormData();                               //  ++++++++++++     // To send files through AJAX, we have to use an object of type FormData
        formData.append('role_name', this.userRole);                 //  ++++++++++++ 
        formData.append('user_name', this.userName);                 //  ++++++++++++
        formData.append('user_surnames', this.userSurname);          //  ++++++++++++
        formData.append('user_birthdate', this.userBirthdate);       //  ++++++++++++
        formData.append('user_email', this.userEmail);               //  ++++++++++++
        formData.append('user_password', this.userPassword);         //  ++++++++++++
        formData.append('user_image', this.userImage);               //  ++++++++++++     // Here we assign the value of the form file that we now attach in the attach() method where we take the file we want. Before I did not attach it and the entire variable this.userImage was assigned without taking the file I wanted from the files array.
        formData.append('patient_height', this.patientHeight);       //  ++++++++++++
        formData.append('doctor_specialty', this.doctorSpecialty);   //  ++++++++++++
        console.log('>> formData >> ', formData);

        axios({
          method: 'post',
          url: 'users',
          //headers: {"Content-type": "application/json"},
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': 'multipart/form-data'
          },         //  ++++++++++++       // To send files through AJAX, we have to put this header value 'Content-Type' which is equivalent to the value of the enctype="multipart/form-data" attribute that we put in the <form> element when we want to send files.
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
          console.log(error.response);               // The .response attribute would be equivalent to the  res  object that we query in the .then()
          console.log(error.response.status);
          alert('Existing email address, please try another');
        });       
      };
    },
  },
};
</script>

<style scoped>

div.form {
  background-color: #ffb366;
}

form input[type=date], input[type=number] {
  width: 30%;
}
</style>
