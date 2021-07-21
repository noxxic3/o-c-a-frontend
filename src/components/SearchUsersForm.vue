<template>
  <div>
    <!-- Search Users Form -->
    <div class="form">
      <h2>Search users form</h2>
      <form v-on:submit.prevent="getRequestToUserControllerShow()">
        <label for="name">Name:</label><br>
        <input type="text" id="name" name="name" minlength="2" maxlength="20"  v-model="userName"><br>

        <label for="surname">Surnames:</label><br>
        <input type="text" id="surname" name="surname" minlength="2" maxlength="30"  v-model="userSurname"><br>   

        <input class="inputButton" type="submit" value="Search">
      </form>
    </div>
 
    <!-- Results -->
    <section v-if="responseShow != ''"  class="users_search">
      <h2>Users search result</h2>
      <!-- This is a better way to show what I want from the objects received from the array than to process it and rename the properties as I did in SearchPatientsForm, since if in the future I want the show() method of the Controller to return values from more columns, it can be done without retouching the return -->
      <div v-for="element in responseShow" v-bind:key="element.id"  class="database_record">      <!-- This should be an HTML table, but then I couldn't put the title in every row -->
        <div> 
          <h3>ID</h3> 
          <p>{{ element.id }}</p> 
        </div>
        <div> 
          <h3>Image</h3>
          <img class="userImage" v-if="element.role_name == 'Patient'"     v-bind:src="'http://localhost/8_TFG/ObesityControlApp/public/storage/images/patients/'+element.image" alt="User image">
          <img class="userImage" v-if="element.role_name == 'Doctor'"      v-bind:src="'http://localhost/8_TFG/ObesityControlApp/public/images/users/'+'user-md-solid.svg'" alt="User image">
          <img class="userImage" v-if="element.role_name == 'OfficeStack'" v-bind:src="'http://localhost/8_TFG/ObesityControlApp/public/images/users/'+'user-nurse-solid.svg'" alt="User image">
          <img class="userImage" v-if="element.role_name == 'Admin'"       v-bind:src="'http://localhost/8_TFG/ObesityControlApp/public/images/users/'+'user-cog-solid.svg'" alt="User image">
          <!-- 
            Actually these images of the roles that are not 'Patient' would have to be received from the request to the backend, but in the logic of the UserController store() and update() I have only assigned the default image to the patient if he does not upload an image.
            In the other roles I have not put the possibility of uploading an image and in the backend I have not assigned them an image by default yet.
          -->
        </div>
        <div> 
          <h3>Name</h3> 
          <p>{{ element.name }}</p> 
        </div>
        <div> 
          <h3>Surnames</h3> 
          <p>{{ element.surnames }}</p> 
        </div>
        <div> 
          <h3>Birthdate</h3> 
          <p>{{ element.birthdate }}</p> 
        </div>
        <div> 
          <h3>Email</h3> 
          <p>{{ element.email }}</p> 
        </div>
        <div> 
          <h3>Password</h3> 
          <p>{{ element.password }}</p> 
        </div>
        <div> 
          <h3>Role</h3> 
          <p>{{ element.role_name }}</p> 
        </div>
        <div>
          <button v-on:click="editForm(element)">Edit</button>
          <button v-on:click="deleteRequestToUserControllerDestroy(element.id, element.role_name)">Delete</button>
        </div>
      </div>
    </section>

    <!-- Edit User Form -->
    <div v-if="showEditForm != ''" class="form formEdit">
      <h2>Edit User Form</h2>
      <form v-on:submit.prevent="putRequestToUserControllerUpdate()"  enctype="multipart/form-data">
        <label for="name">Name:</label><br>
        <input type="text" id="name" name="name" minlength="2" maxlength="20"  required  v-model="userNameEdit"><br>   <!-- pattern="[A-Za-z]{2,}"  -->

        <label for="surname">Surnames:</label><br>
        <input type="text" id="surname" name="surname" minlength="2" maxlength="30" required  v-model="userSurnameEdit"><br>   

        <label for="birthdate">Birthdate:</label><br>
        <input type="date" id="birthdate" name="birthdate" required  v-model="userBirthdateEdit"><br>    

        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email" minlength="3" maxlength="20" required  v-model="userEmailEdit"><br>       

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" minlength="8" maxlength="12" required  v-model="userPasswordEdit"><br>  

        <div v-if="userRole == 'Patient'">
          <label for="image">Image:</label><br>                                                
          <input type="file" id="image" name="image"  ref="file"  v-on:change="attach()"> <br><br>   <!-- ++++++++++++ -->  
        
          <label for="height">Height (inches):</label><br>
          <input type="number" id="height" name="height" min="40" max="100" step=".01"  required  v-model="patientHeightEdit"><br> 
        </div>

        <div v-if="userRole == 'Doctor'">
          <label for="specialty">Doctor's specialty:</label><br> 
          <select id="specialty" name="specialty" required  v-model="doctorSpecialtyEdit">
            <option value="Endocrine">Endocrine</option>
            <option value="Nutritionist">Nutritionist</option>
            <option value="Surgeon">Surgeon</option>
            <option value="Internal doctor">Internal doctor</option>
            <option value="Gastroenterologist">Gastroenterologist</option>
          </select>
        </div><br> 

        <input class="inputButton inputEditButton" type="submit" value="Update">
      </form>
      <button  v-on:click="showEditForm = ''">Hide</button>
    </div>

    <div v-if="noUserFound != ''">
      <p>{{noUserFound}}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

//var response_data_acces_token = '5|3PJOJrQxdDs8EoIIMnk54q9jazNDO4Pw8riSq4RV';    
/* 
This test variable will have to be deleted when we store the value of response.data.access_token in Vuex
that we will receive from the return of the Login View request. Then in the request headers, instead of response_data_acces_token
We will send the Vuex variable in which we have stored the value of the token.
*/
export default {
  name: "SearchUsersForm",
  data(){
    return{
      //responseIndex: '',
      responseShow: '',

      userName: '',
      userSurname: '',

      noUserFound: '',

      // Edit Form
      showEditForm: '',

      userRole: '',
      userID: '',
      
      userNameEdit: '',
      userSurnameEdit: '',
      userBirthdateEdit: '',
      userEmailEdit: '',
      userPasswordEdit: '',

      userImageEdit: '',                      //  ++++++++++++

      patientHeightEdit: '',
      doctorSpecialtyEdit: '',
    }
  },
  methods: {
    editForm(element){
      this.showEditForm = 'edit';

      this.userRole = element.role_name;
      this.userID = element.id;

      this.userNameEdit = element.name;
      this.userSurnameEdit = element.surnames;
      this.userBirthdateEdit = element.birthdate;
      this.userEmailEdit = element.email;
      this.userPasswordEdit = element.password;

      this.userImageEdit = element.image;

      this.patientHeightEdit = element.height;
      this.doctorSpecialtyEdit = element.speciality;
    },
    // Attach form file
    attach(){                                //  ++++++++++++
      this.userImageEdit = this.$refs.file.files[0];                                // We only want to send the only file that has been attached
      console.log('>>>> element files array   >>>> ', this.$refs.file);             // If we see the .files property of the type="file" element, we see that it is an array that will have all the files that have been added to that element.
      console.log('>>>> element file selected >>>> ', this.$refs.file.files[0]);
    },
    //// AJAX Requests
    getRequestToUserControllerShow(){
      let validate = true;
      if( this.userName == '' && this.userSurname == ''){
        alert('Please, fill in at least one of the 2 fields');
        validate = false;
      };
      if( (this.userName != '' && !isNaN(this.userName)) || (this.userSurname != '' && !isNaN(this.userSurname)) ){          // isNaN = is Not a Number 
          alert('Please, do not enter numeric values ​​in the first and last name');
          validate = false;
      };
      if(validate){
        axios({
          method: 'get',
          url: 'users',
          params: {
            name: this.userName,
            surname: this.userSurname,          
          },
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token,         // response.data.access_token,
          }
        })
        .then(res => {
          console.log(res);
          console.log(res.data);

          if(res.data.length != 0){
            this.responseShow = res.data;
            this.noUserFound = '';
          } else {
            this.responseShow = res.data;      // If it receives 0 positions, it is necessary to reinitialize the array so that the previous ones are not shown, we could also have done: this.responseShow = res.data = '';
            this.noUserFound = 'No users have been found that match the data entered';
          }
        })
        .catch(error => console.log(error));
      };
    },
    
    putRequestToUserControllerUpdate(){
      // Only the user ID is needed to send to the backend, in User it is the only PK.
      // When modifying, only User table will be modified since it is where the registry data that could be modified is.
      //    ...if we also want to modify the role, we would have to delete the corresponding SubType record and create it in the SupType we want (with the same PK which would also be FK), remember that the PK column of the SubTypes are not autoincrment unlike the User PK column, thus, there would be no problem when deleting the record that there would be an empty position of the Primary Key autoincrement, since there would be no empty position because there is no autoincrement.
      //    ...in any case, in this case it does not make sense to modify the role, since a patient will not be a doctor or vice versa nor a doctor an office staff or vice versa, and the administrator role will be a limited role that will not be changed with frequency. Ultimately, if we want to modify the role, we can always delete the user and recreate it.
   
      if( (this.userNameEdit != '' && !isNaN(this.userNameEdit)) || (this.userSurnameEdit != '' && !isNaN(this.userSurnameEdit)) ){          // isNaN = is Not a Number 
          alert('Please, do not enter numeric values ​​in the first and last name');
      } else {
        
        let formData = new FormData();                                   //  ++++++++++++     // To send files through AJAX, we have to use an object of type FormData
        //formData.append('role_name', this.userRole);                   //  ++++++++++++ 
        formData.append('user_name', this.userNameEdit);                 //  ++++++++++++
        formData.append('user_surnames', this.userSurnameEdit);          //  ++++++++++++
        formData.append('user_birthdate', this.userBirthdateEdit);       //  ++++++++++++
        formData.append('user_email', this.userEmailEdit);               //  ++++++++++++
        formData.append('user_password', this.userPasswordEdit);         //  ++++++++++++
        formData.append('user_image', this.userImageEdit);               //  ++++++++++++      // Here we assign the value of the form file that we attach and in the attach() method we take the file we want. 
        formData.append('patient_height', this.patientHeightEdit);       //  ++++++++++++
        formData.append('doctor_specialty', this.doctorSpecialtyEdit);   //  ++++++++++++
        formData.append('_method', 'PUT');                               //  ++++++++++++      // <<<<<<<  PUT
        console.log('>> formData >> ', formData);

        axios({
          method: 'post',                                         //  ++++++++++++    //  <<<<<<<
          url: 'users/' + this.userID + "/" + this.userRole,
          //headers: {"Content-type": "application/json"},
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': 'multipart/form-data',
          },         //  ++++++++++++       // To send files through AJAX, we have to put this header value 'Content-Type' which is equivalent to the value of the enctype="multipart/form-data" attribute that we put in the <form> element when we want to send files.
          //params: data,
          data: formData,                                         //  ++++++++++++
        })
        .then(res => {
          console.log(res);
          if(res.status == 200){
            this.getRequestToUserControllerShow();                // It is not necessary to send parameters because the values that the user entered in the form are in the Vue data
          } else {
              alert("The user could not be updated, please try again later");
          };
        })
        .catch(error => {
          console.log(error);
          console.log(error.response);                            // The .response attribute would be equivalent to the  res  object that we query in the .then()
          console.log(error.response.status);
          alert('Existing email address, please try another');
        });
        this.showEditForm = ''; 
      };
    },

    deleteRequestToUserControllerDestroy(userID, userRole){
      //alert('User ID to delete: ' + userID);
      /*
        When deleting, it will be necessary to delete the User and the SubType and the tables associated with it.
        Thus, in this case I send the User ID and the role in the route so that the backend does not have to search in all the subtypes to see where it finds the ID.
        MySQL update autoincrement column when deleting 1 register: the values of the autoincrement column should not be updated because there may be other tables referencing it. What can be done is to put a message on the frontend that that record no longer exists if it try to access this   https://stackoverflow.com/questions/2214141/auto-increment-after-delete-in-mysql
      */
      axios({
        method: 'delete',
        url: 'users/' + userID + '/' + userRole,
        headers: {
        'Authorization': 'Bearer ' + this.$store.state.token,
        }
      })
      .then(res => { 
        console.log(res);
        if(res.status == 200){
          this.getRequestToUserControllerShow();                   // It is not necessary to send parameters because the values that the user entered in the form are in the Vue data
        } else {
            alert("The user could not be deleted, please try again later");
        };       
      })
      .catch(error => console.log(error));
    },
  }
};
</script>

<style scoped>
  /* Search Users form */ 
  div.form {
    background-color: #a6a6a6;
    border: solid 2px #707070;
  }

  form .inputButton {
    background-color: #707070;
  }

  form .inputButton:hover {
      background-color: #f3f3f3;
      border: 2px solid black;
      color: black;
      font-weight: bold;
  }

  /* Edit Users form */ 
  div.formEdit {
    background-color: #aaaa55;
    border: solid 2px #997300;
  }

  form input[type=date], input[type=number] {
    width: 30%;
  }

  .formEdit .inputEditButton {
    background-color: #806000;
    margin-top: -25px;
  }

  .formEdit > button {
    color: white;
    background-color:#595959;

    width: 70px;
    height: 20px;

    border: 2px solid grey;
    box-sizing: border-box;
    line-height: 0px;
    font-size: 0.6em;
    transition: all 0.5s;
    margin-top: 10px;
  }

  .formEdit > button:hover {
      background-color: #f3f3f3;
      border: 2px solid black;
      color: black;
      font-weight: bold;
  }

        /* Tablet */
      @media screen and (min-width: 768px) {                
        div.form, div.formEdit {
            border: solid 4px #997300;
          }
        .formEdit > button  {
          width: 100px;
          height: 30px;
          font-size: 0.8em;
        }
      }
      
      /* Desktop */
      @media screen and (min-width: 1280px) {                
        div.form, div.formEdit {
          border: solid 6px #997300;
        }
        .formEdit > button  {
          width: 130px;
          height: 33px;
          font-size: 0.9em;
        }

        .formEdit .inputEditButton {
          margin-top: -10px;
        }
      }


  /* Users results */
  section.users_search {
    height: 400px;
    overflow: auto;
    border: solid 2px #997300;
  }

  section.users_search > h2 {
    font-size: 0.9em;
  }

  section.users_search div div{
    background-color: #bfbfbf;
    border: solid 1px #707070;
  }

  section.users_search div div button{
    display: inline-block;
    margin: 7px 3px 7px 3px;
    background-color: grey;
    color: white;
    font-size: 1.2em;
    border-radius: 50px;
    width: 40px;
    height: 40px;
  }

  section.users_search div div button:hover{
    background-color: white;
    border: 1px solid black;
    color: black;
    font-weight: bold;
  }

      /* Tablet */
      @media screen and (min-width: 768px) {                 
        section.users_search {
          border: solid 4px #997300;
        }
        section.users_search > h2 {
          font-size: 1.2em;
        }
        section.users_search div div button{
          display: block;
          margin: 10px auto;
          border-radius: 0;
          width: 60px;
          height: auto;
        }

      }
      
      /* Desktop */
      @media screen and (min-width: 1280px) {                
        section.users_search {
          border: solid 6px #997300;
        }
        section.users_search > h2 {
          font-size: 1.5em;
        }
      }

</style>
