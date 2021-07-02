<template>
  <div>
    
    <!-- Search Users Form -->
    <!--<button v-on:click="getRequestToUserControllerIndex()">Get all users</button>-->

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
                                                                        <!--Esta es una mejor forma para mostrar lo que quiero de los objetos recibidos del array que procesarlo y cambiarle el nombre de las propiedades como hice en SearchPatientsForm, ya que si en un futuro quiero que el método show() del Controller devuelva valores de más columnas, se puede hacer sin necesidad de retocar el retorno -->
      <div v-for="element in responseShow" v-bind:key="element.id"  class="database_record">      <!--Esto tendría que ser una tabla HTML-->
        <!--<p>{{element}}</p>-->
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
            Realmente estas imágenes de los roles que no son 'Patient' tendrían que recibirse de la petición, pero en la lógica del 
            UserController store() y update() solo he asignado imagen por defecto al paciente si este no sube imagen.
            En los otros roles no he puesto posibilidad de subir imagen y en el backend no les he asignado aún imagen por defecto.
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
        <input type="date" id="birthdate" name="birthdate" required  v-model="userBirthdateEdit"><br>     <!-- type="date"  incluye un calendario para la selección de la fecha y la proporciona en formato YYYY-MM-DD: 2020-11-30.  Si no se introduce fecha, la variable será una string vacía.  -->

        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email" minlength="3" maxlength="20" required  v-model="userEmailEdit"><br>                <!-- type="email"  valida automáticamente que el email introducido tenga una @ -->

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" minlength="8" maxlength="12" required  v-model="userPasswordEdit"><br>    <!-- The <input type="password"> defines a password field (characters are masked) -->

        <div v-if="userRole == 'Patient'">
          <label for="image">Image:</label><br>                                                   <!-- Aunque el campo  image  en la BD está en la tabla Users y por lo tanto, se puede guardar imagen para todos los usuarios sean del rol que sean, en la aplicación en los dashboards para los usuarios que no son paciente no se ha pensado poner imagen de usuario, ya que la app es un servicio para el paciente y no se quiere sobrecargar de imágenes -->
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
Esta variable se tendrá que eliminar cuando almacenemos en Vuex el valor de response.data.access_token  
que recibiremos del retorno de la petición de la vista Login. Entonces en los headers de las peticiones, vez de response_data_acces_token
enviaremos la varuable de Vuex en la que hayamos almacenado el valor del token.
*/

export default {
  name: "SearchUsersForm",
  /*props: {
    msg: String
  }*/

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
    attach(){                        //  ++++++++++++
      this.userImageEdit = this.$refs.file.files[0];            // Solo queremos enviar el único archivo que se ha adjuntado
      console.log('>>>> element files array   >>>> ', this.$refs.file);             // Si vemos la propiedad  .files del elemento type="file" vemos que es un array que tendrá todos los archivos que se hayan añadido a ese elemento.
      console.log('>>>> element file selected >>>> ', this.$refs.file.files[0]);
    },

    //// AJAX Requests
    /*
    getRequestToUserControllerIndex(){
      axios.get('http://localhost/8_TFG/ObesityControlApp/public/api/users')
      .then(res => {
        console.log(res);
        this.responseIndex = res.data;    
        })
      .catch(error => console.log(error));
    },
    */
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
          url: 'http://localhost/8_TFG/ObesityControlApp/public/api/users',
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
            this.responseShow = res.data;    // Si recibe 0 posiciones igualmente hay que reinicializar el array para que no se sigan mostrando las anteriores, también podríamos haber hecho:  this.responseShow = res.data = '';
            this.noUserFound = 'No users have been found that match the data entered';
          }
        })
        .catch(error => console.log(error));
      };

    },
    
    putRequestToUserControllerUpdate(){
      // Solamente necesita el ID del usuario para enviar al backend, en User es la única PK
      // Al modificar, se modificará de User ya que es donde están los datos de registro que podrian ser modificados.
      //    ...si además queremos modificar el rol, tendríamos que borrar el registro del SubTipo correspondiente y crearlo en SupTipo que queramos (con la misma PK que sería también FK), recuerda que la columna PK de los SubTipos no són autoincrment a diferencia de la de User, con lo cual, no habría problema al eliminar registro de que quede una posición de la PK autoincrement vacía, ya que no quedaría ninguna vacía.    
      //    ...de todas maneras, en este caso no tiene sentido modificar el rol, ya que un paciente no será doctor o viceversa ni un doctor personal de oficina o viceversa, y el rol de administrador será un rol limitado que no se va a estar cambiando con frecuencia. En última instancia, si se quiere modificar el rol siempre se puede eliminar el usuario y volverlo a crear.
   
      if( (this.userNameEdit != '' && !isNaN(this.userNameEdit)) || (this.userSurnameEdit != '' && !isNaN(this.userSurnameEdit)) ){          // isNaN = is Not a Number 
          alert('Please, do not enter numeric values ​​in the first and last name');
      } else {

        ////////////////////////////////////////////
        
        let formData = new FormData();                               //  ++++++++++++     // Para enviar archivos a través de AJAX, tenemos que usar un objeto de tipo FormData
        //formData.append('role_name', this.userRole);                 //  ++++++++++++ 
        formData.append('user_name', this.userNameEdit);                 //  ++++++++++++
        formData.append('user_surnames', this.userSurnameEdit);          //  ++++++++++++
        formData.append('user_birthdate', this.userBirthdateEdit);       //  ++++++++++++
        formData.append('user_email', this.userEmailEdit);               //  ++++++++++++
        formData.append('user_password', this.userPasswordEdit);         //  ++++++++++++
        
        formData.append('user_image', this.userImageEdit);           //  ++++++++++++      <<----  Aquí le asignamos el valor del file del formulario que ahora sí lo adjuntamos y en attach() cojemos el file que queremos. Antes no lo adjuntaba y se asignaba la variable  this.userImage  entera sin coger del array files el que quería.
        
        formData.append('patient_height', this.patientHeightEdit);       //  ++++++++++++
        formData.append('doctor_specialty', this.doctorSpecialtyEdit);   //  ++++++++++++
        formData.append('_method', 'PUT');                      //  <<<<<<<++++++++++++  PUT
        console.log('>> formData >> ', formData);
        
        /////////////////////////////////////////////

        axios({
          method: 'post',                                       //  <<<<<<<++++++++++++
          url: 'http://localhost/8_TFG/ObesityControlApp/public/api/users/' + this.userID + "/" + this.userRole,
          //headers: {"Content-type": "application/json"},
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': 'multipart/form-data',
          },         //  ++++++++++++       // Para enviar archivos a través de AJAX, tenemos que poner este valor de header que equivale al valor del atributo  enctype="multipart/form-data"  que ponemos en el elemento <form> cuando queremos enviar archivos.
          //params: data,
          data: formData,                                         //  ++++++++++++
          
        })

        /////////////////////////////////////////////////////////////////////////////////////////////
        /*
        axios.put('http://localhost/8_TFG/ObesityControlApp/public/api/users/' + this.userID + "/" + this.userRole,      // <<---   El ID del usuario lo tenemos que coger del retorno de la petición al método show(), ya que este usuario es el que se quiere consultar, no el usuario que está en sesión.
        {                                           
          
          user_name: this.userNameEdit,
          user_surnames: this.userSurnameEdit,
          user_birthdate: this.userBirthdateEdit,
          user_email: this.userEmailEdit,
          user_password: this.userPasswordEdit,

          user_image: this.userImageEdit,                // Solo se inserta en Patient

          patient_height: this.patientHeightEdit,        // Solo se inserta en Patient
          doctor_specialty: this.doctorSpecialtyEdit,    // Solo se inserta en Doctor    // recuerda que en la BD es  speciality

        }) 
        */
        .then(res => {
          console.log(res);
          if(res.status == 200){
            this.getRequestToUserControllerShow();             // No hace falta enviar parámetros porque los valores que introdujo el usuario en el fomulario están en los datos Vue 
          } else {
              alert("The user could not be updated, please try again later");
          };
        })
        .catch(error => {
          console.log(error);
          console.log(error.response);               // el .response equivaldría al objeto res  que consultamos en el .then()
          console.log(error.response.status);
          alert('Existing email address, please try another');
        });
        
        /////////////////////////////////////////////////////////////////////////////////////////////
        this.showEditForm = ''; 
      };
    },

    deleteRequestToUserControllerDestroy(userID, userRole){
      //alert('User ID to delete: ' + userID);
      // Al eliminar se tendrá que eliminar de User y del SubTipo y de las tablas que tenga asociadas
      // Con lo cual, hay que enviar el ID de User y el rol para que el backend no tenga que buscar en todos los subtipos a ver donde encuentra el ID.
      // MySQL update autoincrement column when delete 1 register: no se deben actualizar los valores de la columna autoincrement porque pueden haber otras tablas referenciandolo  https://stackoverflow.com/questions/2214141/auto-increment-after-delete-in-mysql
      
      //axios.delete('http://localhost/8_TFG/ObesityControlApp/public/api/users/' + userID + '/' + userRole)
      
      axios({
        method: 'delete',
        url: 'http://localhost/8_TFG/ObesityControlApp/public/api/users/' + userID + '/' + userRole,
        headers: {
        'Authorization': 'Bearer ' + this.$store.state.token,
        }
      })
      .then(res => { 
        console.log(res);
        if(res.status == 200){
          this.getRequestToUserControllerShow();             // No hace falta enviar parámetros porque los valores que introdujo el usuario en el fomulario están en los datos Vue 
        } else {
            alert("The user could not be deleted, please try again later");
        };       
      })
      .catch(error => console.log(error));
    },

  }

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
