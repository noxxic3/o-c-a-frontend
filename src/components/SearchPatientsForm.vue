<template>
  <div>
    
    <div class="form">
      <h2>Search patients form</h2>
      <form v-on:submit.prevent="getRequestToPatientControllerShow()">

        <label for="name">Name:</label><br>
        <input type="text" id="name" name="name" v-model="patientName"><br>

        <label for="surname">Surnames:</label><br>
        <input type="text" id="surname" name="surname" v-model="patientSurname"><br>   

        <label for="toCheck">To check:</label><br>
        <input type="radio" id="toCheck" name="toCheck" value="true" v-model="patientStatusToCheck"><br>  

        <input class="inputButton" type="submit" value="Search">

      </form>
      <p>*You must fill in at least one of the 3 fields</p>
    </div>

    <section class="patients_search" v-if="responseShow != ''">      <!-- Si en vez de responseShow pongo responseShow_DataToShow no se activa el v-if, pero si escribo en cualquiera de los inputs, se activa y vemos que los datos sí que han llegado. Posiblemente sea porque al recibir el retorno de la petición AJAX en esa variable no se hace una asignación única sino que se hace un recorrido y los observadores de Vue quedan a la espera antes de actualizar la Vista??  -->
      <h2>Patients search result</h2>
      <div class="patientRow database_record" v-for="element in responseShow_DataToShow" v-bind:key="element['ID']" v-on:click="goToPatientDataView(element['ID'], element['Image'])">  
        
        <div>
          <h3>ID</h3> <p>{{element['ID']}}</p>
        </div>
        <div>
          <h3>Image</h3> 
          <img class="userImage" v-bind:src="'http://localhost/8_TFG/ObesityControlApp/public/storage/images/patients/'+element['Image']" alt="User image">
        </div>
        <div>
          <h3>Name</h3> <p>{{element['Name']}}</p>
        </div>
        <div>
          <h3>Surnames</h3> <p>{{element['Surnames']}}</p>
        </div>
        <div>
          <h3>Birth date</h3> <p>{{element['Birth date']}}</p>
        </div>
        <div>
          <h3>Height</h3> <p>{{element['Height']}}</p>
        </div>
        <div>
          <h3>Email</h3> <p>{{element['Email']}}</p>
        </div>
        <div v-if="element['Checked'] != null">
          <h3>Checked</h3> 
          <!--<p>{{element['Checked']}}</p>-->
          <p v-if="element['Checked'] == 0">NO</p>
        </div>

        <!--
        <div v-for="(value, key) in element" v-bind:key="key">
          <h3>{{key}}</h3> <p>{{value}}</p>
        </div> 
        -->
      
      </div>
    </section>

    <div v-if="noPatientFound != ''">    
      <p>{{noPatientFound}}</p>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

//var response_data_acces_token = '5|3PJOJrQxdDs8EoIIMnk54q9jazNDO4Pw8riSq4RV';

export default {
  name: "SearchPatientsForm",
  data(){
    return{
      patientName: '',
      patientSurname: '',
      patientStatusToCheck: '',

      responseShow: '',
      responseShow_DataToShow: [],

      noPatientFound: '',
    }
  },
  created(){


      // Por defecto se muestran los pacientes que tienen un estado a asignar tratamiento
      axios({
        method: 'get',
        url: 'http://localhost/8_TFG/ObesityControlApp/public/api/patients',
        params: {
          name: null,
          surname: null,
          checked: false,        
        },
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,                  // response_data_acces_token
        }
      })
      .then(res => {
        console.log(res);
        if(res.data.length != 0){                 // This response returns an array, can be empty but will never be null
          //alert('AAAAAAAAAAASSSSSSSSSSSSSSSSSSSSSSSSSSSSSS');
          console.log('AAAAAAAAAAASSSSSSSSSSSSSSSSSSSSSSSSSSSSSS');
          this.responseShow = res.data;
          console.log(res.data);
          //this.responseShow_DataToShow[0]['a'] = 3333333;
          console.log("AAAAAAAAAAA: "+this.responseShow_DataToShow);

          let i;
          let patientStatus;
          for(i=0; i<res.data.length; i++){
            //console.log('>>>>>>>>>>>> ' + res.data[i].last_status_checked);
            
            patientStatus = {              // Ponemos en nuestro array responseShow_DataToShow solo las propiedades que nos interesan de los objetos recibidos
              'ID': res.data[i].id, 
              'Image': res.data[i].image, 
              'Name': res.data[i].name, 
              'Surnames': res.data[i].surnames, 
              'Birth date': res.data[i].birthdate, 
              'Height': res.data[i].height, 
              'Email': res.data[i].email, 
              'Checked': res.data[i].last_status_checked,     // Si alguno de estos datos es undefined, se mostrará vacío en el contenedor donde se muestre
            }
            this.responseShow_DataToShow[i] = patientStatus;
          }

          this.patientStatusToCheck = '';                  // Reinicializamos la variable patientStatusToCheck. Si la hubiéramos activado y no la reinicializáramos veríamos que en la siguiente petición sigue con valor false cuando tendría que no tener valor.
          this.noPatientFound = '';                        // Reinicializamos
          //this.responseShow_DataToShow = res.data;
          console.log(this.responseShow_DataToShow);

        } else {
          //alert('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBSSSSSSSSSSSSSSSSSSSSS');
          this.noPatientFound = 'There are still no patients with status to check';
        }

      })
      .catch(error => console.log(error));




  },
  computed: {

  },
  methods: {
    getRequestToPatientControllerShow(){
      this.responseShow = '';                                 // Reinicializamos para que no salga el título  <h2>Patient search result</h2>  si se recibe un array vacío de respuesta.
      this.responseShow_DataToShow = [];                      // Reinicializamos. En esta variable, a diferencia de  this.responseShow  no asignamos directamente el retorno de la petición sino que la recorremos para asignar de todos los elementos del array recibido, solo las propiedades que nos interesa mostrar. Por lo tanto, si no la reinicializamos y hacemos una segunda petición que recibe menos registros que la primera, por ejemplo si en la primera recibimos 5 posiciones de array y en la segunda 3, veremos que seguimos teniendo 5, donde las 2 últimas son las de la petición anterior.
                                                              // Esto solo es necesario hacerlo porque los datos recibidos los procesamos y los almacenamos en  responseShow_DataToShow.
      let validate = true;
      if( this.patientName == '' && this.patientSurname == '' && this.patientStatusToCheck == ''){
        alert('Please, fill in at least one of the 3 fields');
        validate = false;
      };

      if( (this.patientName != '' && !isNaN(this.patientName)) || (this.patientSurname != '' && !isNaN(this.patientSurname)) ){          // isNaN = is Not a Number 
          alert('Please, do not enter numeric values ​​in the first and last name');
          validate = false;
      };
  
      if(this.patientStatusToCheck == 'true'){          // si  to_check == true, significa que hay que buscar en la columna  checked  los que tienen valor  false
        this.patientStatusToCheck = false;
      };

      if(validate){
        //alert('Petición AJAX! ' + this.patientName + ' ' + this.patientSurname + ' ' + this.patientStatusToCheck);

        /*
        axios.get('http://localhost/8_TFG/ObesityControlApp/public/api/patients', {
          params: {
            name: this.patientName,
            surname: this.patientSurname,
            checked: this.patientStatusToCheck,           
          }
        })*/
        
        axios({
          method: 'get',
          url: 'http://localhost/8_TFG/ObesityControlApp/public/api/patients',
          params: {
            name: this.patientName,
            surname: this.patientSurname,
            checked: this.patientStatusToCheck,        
          },
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token,                  // response_data_acces_token
          }
        })
        .then(res => {
          console.log(res);
          if(res.data.length != 0){                 // This response returns an array, can be empty but will never be null
            //alert('AAAAAAAAAAASSSSSSSSSSSSSSSSSSSSSSSSSSSSSS');
            console.log('AAAAAAAAAAASSSSSSSSSSSSSSSSSSSSSSSSSSSSSS');
            this.responseShow = res.data;
            console.log(res.data);
            //this.responseShow_DataToShow[0]['a'] = 3333333;
            console.log("AAAAAAAAAAA: "+this.responseShow_DataToShow);

            let i;
            let patientStatus;
            for(i=0; i<res.data.length; i++){
              //console.log('>>>>>>>>>>>> ' + res.data[i].last_status_checked);
              
              patientStatus = {              // Ponemos en nuestro array responseShow_DataToShow solo las propiedades que nos interesan de los objetos recibidos
                'ID': res.data[i].id, 
                'Image': res.data[i].image, 
                'Name': res.data[i].name, 
                'Surnames': res.data[i].surnames, 
                'Birth date': res.data[i].birthdate, 
                'Height': res.data[i].height, 
                'Email': res.data[i].email, 
                'Checked': res.data[i].last_status_checked,     // Si alguno de estos datos es undefined, se mostrará vacío en el contenedor donde se muestre
              }
              this.responseShow_DataToShow[i] = patientStatus;
            }

            this.patientStatusToCheck = '';                  // Reinicializamos la variable patientStatusToCheck. Si la hubiéramos activado y no la reinicializáramos veríamos que en la siguiente petición sigue con valor false cuando tendría que no tener valor.
            this.noPatientFound = '';                        // Reinicializamos
            //this.responseShow_DataToShow = res.data;
            console.log(this.responseShow_DataToShow);

          } else {
            //alert('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBSSSSSSSSSSSSSSSSSSSSS');
            this.noPatientFound = 'No patients have been found that match the data entered';
          }

        })
        .catch(error => console.log(error));
        
      }
    },
    goToPatientDataView(patientID, patientImage){
      //alert("goToPatientDataView, patientID: " + patientID + ", patientImage: " + patientImage);    // patientID se tendrá que guardar en Vuex porque será el ID del usuario que se consulte en la vista Patient Doctor View (Patient Data) y su componente Data History.
                                                                // Cuando se haga el Login, si el usuario es Paciente, el ID de usuario en sesión y el de paciente que guardemos en Vuex será el mismo. Si el usuario es Doctor, cuando hagamos el Login guardaremos su ID de usuario en Vuex y el del paciente lo guardaremos cuando se active esta función.   
      this.$store.state.patient_id = patientID;
      this.$store.state.patient_image = patientImage;
      localStorage.setItem("patient_id", patientID);
      localStorage.setItem("patient_image", patientImage);
      this.$router.push('/PatientDoctorView');    // Aquí tenemos que redirigir a la vista Patient Doctor View (Patient Data).
    },


  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

/* Patients search form */

div.form {
  background-color: #b7b795;
}

div.form p {
  font-size: 0.7em;
}

      /* Tablet */
      @media screen and (min-width: 768px) {                
        div.form p {
          font-size: 0.9em;
        }
      }
      
      /* Desktop */
      @media screen and (min-width: 1280px) {                
        div.form p {
          font-size: 1em;
        }
      }


/* Patients search result */

section.patients_search {
  height: 300px;
  overflow: auto;
  border: solid 2px #997300;
}

.database_record:hover > div{
  background-color: white;
  cursor: pointer;
}

.patients_search > h2 {
  font-size: 0.9em;
}

      /* Tablet */
      @media screen and (min-width: 768px) {                
        section.patients_search {
          border: solid 4px #997300;
        }
        .patients_search > h2 {
          font-size: 1.2em;
        }
      }
      
      /* Desktop */
      @media screen and (min-width: 1280px) {    
        section.patients_search {
          border: solid 6px #997300;
        }            
        .patients_search > h2 {
          font-size: 1.5em;
        }
      }

</style>
