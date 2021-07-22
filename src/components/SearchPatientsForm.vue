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

    <section class="patients_search" v-if="responseShow != ''">      <!-- If instead of responseShow I put responseShow_DataToShow, the v-if is not activated, but if I write in any of the inputs, it is activated and we see that the data has arrived. It is because responseShow_DataToShow is an array and I should have used the syntax  this.$set()  to assign value to this array. -->
      <h2>Patients search result</h2>
      <div class="patientRow database_record" v-for="element in responseShow_DataToShow" v-bind:key="element['ID']" v-on:click="goToPatientDataView(element['ID'], element['Image'])">  
        <div>
          <h3>ID</h3> <p>{{element['ID']}}</p>
        </div>
        <div>
          <h3>Image</h3> 
          <img class="userImage" v-bind:src="$store.state.backendStorageURL + 'images/patients/' + element['Image']" alt="User image">
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
      // By default, the patients that have a status to be assigned treatment are shown
      axios({                 // The same request as in getRequestToPatientControllerShow() but without form validation, and filling one of the parameters of the form by default
        method: 'get',
        url: 'patients',
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
        //console.log(res);
        if(res.data.length != 0){                            // This response returns an array, can be empty but will never be null
          this.responseShow = res.data;
          //console.log(res.data);
          //this.responseShow_DataToShow[0]['a'] = 3333333;
          //console.log("AAAA: "+this.responseShow_DataToShow);
          let i;
          let patientStatus;
          for(i=0; i<res.data.length; i++){
            //console.log('>>>> ' + res.data[i].last_status_checked);
            patientStatus = {                                // We put in our responseShow_DataToShow array only the properties that interest us of the received objects. But it is not necessary to prepare an array with the data to be displayed, the necessary data can be displayed using only the necessary HTML elements in the v-for loop.
              'ID': res.data[i].id, 
              'Image': res.data[i].image, 
              'Name': res.data[i].name, 
              'Surnames': res.data[i].surnames, 
              'Birth date': res.data[i].birthdate, 
              'Height': res.data[i].height, 
              'Email': res.data[i].email, 
              'Checked': res.data[i].last_status_checked,     // If any of this data is undefined, it will be shown empty in the container where it is shown
            }
            this.responseShow_DataToShow[i] = patientStatus;
          }
          this.patientStatusToCheck = '';                     // Reinitialize the patientStatusToCheck variable. If we had activated it and not reinitialized it, we would see that in the next request it continues with a false value when it should have no value.
          this.noPatientFound = '';                           // Reinitialize
          //this.responseShow_DataToShow = res.data;
          console.log(this.responseShow_DataToShow);
        } else {
          this.noPatientFound = 'There are still no patients with status to check';
        }
      })
      .catch(error => console.log(error));
  },
  methods: {
    getRequestToPatientControllerShow(){
      this.responseShow = '';                                 // Reinitialize so that the title <h2>Patient search result</h2> does not appear if an empty response array is received.
      this.responseShow_DataToShow = [];                      // Reinitialize. In this variable, unlike this.responseShow, we do not directly assign the return of the request but we iterate it to assign, of all the elements of the received array, only the properties that we want to show. Therefore, if we do not reinitialize it and make a second request that receives fewer records than the first, for example if in the first we receive 5 array positions and in the second 3, we will see that we still have 5, where the last 2 are the ones of the previous request. This is only necessary because we process the received data and store it in responseShow_DataToShow.
      // Search Patients form validation
      let validate = true;
      if( this.patientName == '' && this.patientSurname == '' && this.patientStatusToCheck == ''){
        alert('Please, fill in at least one of the 3 fields');
        validate = false;
      };
      if( (this.patientName != '' && !isNaN(this.patientName)) || (this.patientSurname != '' && !isNaN(this.patientSurname)) ){          // isNaN = is Not a Number 
          alert('Please, do not enter numeric values ​​in the first and last name');
          validate = false;
      };
      if(this.patientStatusToCheck == 'true'){                // if  to_check == true, means that it is necessary to search the  checked  column for those with  false  value
        this.patientStatusToCheck = false;
      };
      if(validate){
        //alert('AJAX! ' + this.patientName + ' ' + this.patientSurname + ' ' + this.patientStatusToCheck);
        axios({
          method: 'get',
          url: 'patients',
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
          //console.log(res);
          if(res.data.length != 0){                 // This response returns an array, can be empty but will never be null
            //console.log('AAAAAAAAAAA');
            this.responseShow = res.data;
            //console.log(res.data);
            //this.responseShow_DataToShow[0]['a'] = 3333333;
            //console.log("AAAA: "+this.responseShow_DataToShow);
            let i;
            let patientStatus;
            for(i=0; i<res.data.length; i++){
              //console.log('>>>>>>>>>>>> ' + res.data[i].last_status_checked);
              patientStatus = {                                 // We put in our responseShow_DataToShow array only the properties that interest us of the received objects. But it is not necessary to prepare an array with the data to be displayed, the necessary data can be displayed using only the necessary HTML elements in the v-for loop.
                'ID': res.data[i].id, 
                'Image': res.data[i].image, 
                'Name': res.data[i].name, 
                'Surnames': res.data[i].surnames, 
                'Birth date': res.data[i].birthdate, 
                'Height': res.data[i].height, 
                'Email': res.data[i].email, 
                'Checked': res.data[i].last_status_checked,     // If any of this data is undefined, it will be shown empty in the container where it is shown
              }
              this.responseShow_DataToShow[i] = patientStatus;
            }
            this.patientStatusToCheck = '';                     // Reinitialize the patientStatusToCheck variable. If we had activated it and not reinitialized it, we would see that in the next request it continues with a false value when it should have no value.
            this.noPatientFound = '';                           // Reinitialize
            //this.responseShow_DataToShow = res.data;
            console.log(this.responseShow_DataToShow);

          } else {
            //alert('BBBBBBBBBBBBBBB');
            this.noPatientFound = 'No patients have been found that match the data entered';
          }
        })
        .catch(error => console.log(error));
      }
    },
    goToPatientDataView(patientID, patientImage){
      //alert("goToPatientDataView, patientID: " + patientID + ", patientImage: " + patientImage);    
      
      // patientID will have to be saved in Vuex because it will be the ID of the user that is consulted in the PatientDoctorView (Patient Data) and its DataHistory component.
      // When the Login is made, if the user is Patient, the user ID in session and the patient ID that we save in Vuex will be the same. If the user is a Doctor, when we login, we will save his user ID in Vuex and the patient's ID will be saved when this function is executed.
      this.$store.state.patient_id = patientID;
      this.$store.state.patient_image = patientImage;
      localStorage.setItem("patient_id", patientID);
      localStorage.setItem("patient_image", patientImage);
      this.$router.push('/PatientDoctorView');   
    },
  },
};
</script>

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
