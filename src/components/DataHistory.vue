<template>
  <div>
    <button v-if="doctorID == '' && (this.responsePatientSatesShow == '' || this.daysFromLastState > 7)" class="displayStoreForm" v-on:click="displayStoreForm()">{{button}}</button>
    <p v-else-if="doctorID == ''"> {{daysToANewStatus}} days left before you can insert a new status</p>
    
    <!-- Patient new status form-->
    <div class="newStatusForm" v-if="displayForm == 'true'">
      <h2>Patient status form</h2>
      <form v-on:submit.prevent="postRequestToPatientStateControllerStore()">
        <label for="weight">Weight:</label><br>
        <input type="number" id="weight" name="weight" min="20" max="800" step=".1"  v-model="inputWeight"  required><br>

        <label for="musclemass">Muscle mass (%):</label><br>
        <input type="number" id="musclemass" name="musclemass" min="10" max="60" step="1"  v-model="inputMusclemass"  required><br>      <!-- Valid ranges:  https://www.healthline.com/health/muscle-mass-percentage -->

        <label for="fatmass">Fat mass (%):</label><br>
        <input type="number" id="fatmass" name="fatmass" min="0" max="80" step="1"  v-model="inputFatmass"  required><br>                <!-- Valid ranges:  https://www.healthline.com/health/exercise-fitness/ideal-body-fat-percentage#for-women -->
        
        <label for="bloodpressure">Blood pressure [Systolic] (optional):</label><br>
        <input type="number" id="bloodpressure" name="bloodpressure" min="60" max="250" step="1"  v-model="inputBloodpressure"><br>      <!-- Valid ranges:  https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings -->  <!-- https://www.mayoclinic.org/es-es/diseases-conditions/low-blood-pressure/symptoms-causes/syc-20355465 -->

        <label for="cholesterol">Cholesterol (optional):</label><br>
        <input type="number" id="cholesterol" name="cholesterol" min="180" max="260" step="1"  v-model="inputCholesterol"><br>           <!-- Valid ranges:  https://www.healthline.com/health/high-cholesterol/levels-by-age#children -->
        
        <input class="inputButton" type="submit" value="Send">
      </form>
    </div>

    <!--Patient Status section -->
    <section class="patient_status">
      <h2>Patient's status history</h2>
      <div class="database_record" v-for="element in responsePatientSatesShow" v-bind:key="element.date"  v-on:click="getRequestToPatientTreatmentControllerShow(element)" >      <!-- element.date must be the attribute that we use as key to identify the rendered element, since element.id is the same, since it represents the current user -->
        <!--<div> <h3>ID</h3> <p>{{ element.patient_id }}</p> </div>-->
        <div> <h3>Date</h3> <p>{{ element.date }}</p> </div>
        <div> <h3>Weight</h3> <p>{{ element.weight }}</p> </div>
        <div> <h3>IMC</h3> <p>{{ element.IMC }}</p> </div>
        <div> <h3>Muscle mass</h3> <p>{{ element.muscle_mass }}</p> </div>
        <div> <h3>Fat mass</h3> <p>{{ element.fat_mass }}</p> </div>
        <div> <h3>Blood pressure</h3> <p>{{ element.blood_pressure }}</p> </div>
        <div> <h3>Cholesterol</h3> <p>{{ element.cholesterol }}</p> </div>
        <div>                  
          <!-- <button class="editStatus" v-if="doctorID == '' || !element.checked" v-on:click="editForm(element.patient_id, element.date, element.weight, element.muscle_mass, element.fat_mass, element.blood_pressure, element.cholesterol)">Edit</button> -->   <!-- Use an icon instead of a button -->
          <i class="fas fa-edit" v-if="doctorID == '' && !element.checked" v-on:click="editForm(element.patient_id, element.date, element.weight, element.muscle_mass, element.fat_mass, element.blood_pressure, element.cholesterol)"></i>
                                                                                  <!-- editForm() sends the parameters of the current/selected state -->
        </div>
      </div> 
    </section>

    <!--Edit Patient Status form -->
    <div v-if="showEditForm != ''" class="form">
      <h2>Patient status edit form</h2>
      Status Date to edit: {{statusDateToEdit}}
      <form v-on:submit.prevent="putRequestToPatientStateControllerUpdate()">
        <label for="weight">Weight:</label><br>
        <input type="number" id="weight" name="weight" min="20" max="800" step=".1"  v-model="statusWeight"><br>

        <label for="musclemass">Muscle mass (%):</label><br>
        <input type="number" id="musclemass" name="musclemass" min="10" max="60" step="1"  v-model="statusMuscleMass"><br>  

        <label for="fatmass">Fat mass (%):</label><br>
        <input type="number" id="fatmass" name="fatmass" min="0" max="80" step="1"  v-model="statusFatMass"><br>   
        
        <label for="bloodpressure">Blood pressure [Systolic] (optional):</label><br>
        <input type="number" id="bloodpressure" name="bloodpressure" min="60" max="250" step="1"  v-model="statusBloodPressure"><br>  

        <label for="cholesterol">Cholesterol (optional):</label><br>
        <input type="number" id="cholesterol" name="cholesterol" min="180" max="260" step="1"  v-model="statusCholesterol"><br>  
        
        <input class="inputButton" type="submit" value="Send">
      </form>
      <button class="hideEditFormButton" v-on:click="showEditForm = ''">Hide</button>
      <!-- <button v-on:click="showEditForm = ''">SendButtonTest</button> -->
    </div>

    <!--Patient Status Treatment section -->
    <section class="patient_status_treatment">

      <h2>Patient Status's Treatment Section</h2>
      <div class="treatments">

        <div class="treatmentComponent treatment_component_1">
          <div>
            <h3>Patient status date</h3>
          </div>
          <p>{{statusDateSelected}}</p>
        </div>

        <!-- This is if i had double looped for the remaining sections, but not correct in this case -->
        <!--
        <div class="treatmentComponent treatment_component_2345" v-for="(value, key) in responsePatientTreatmentShow_DataToShow" v-bind:key="key"> 
          <div class="componentTitle">
            <h3>{{ key }}</h3>
            <div>
              <button v-if="doctorID != ''"  v-on:click="getRequestToTreatmentControllersIndex(key)">Edit treatment</button>
              <button>display</button>
            </div>
          </div>
          <div class="componentContent">
            <div v-for="(value, subKey) in value" v-bind:key="subKey">
              <h4>{{ subKey }}</h4> 
              <p>{{ value }}</p>
            </div>
          </div>
        </div>
        --> 

        <div class="treatmentComponent treatment_component_2345" v-if="responsePatientTreatmentShow_DataToShow"> 
          <div class="componentTitle">
            <h3>Diet</h3>
            <i class="fas fa-edit"  v-if="doctorID != ''"  v-on:click="getRequestToTreatmentControllersIndex('Diet'), updateTreatment = true"></i>
            <input type="checkbox" id="diet_display"/>     
            <label for="diet_display">   <i class="fas fa-chevron-circle-down" ></i>  </label> 
            <div class="componentContent">
              <div>
                <h4>Diet ID</h4> 
                <p>{{responsePatientTreatmentShow_DataToShow["Diet"].diet_id}}</p>
              </div>
              <div>
                <h4>Diet image</h4> 
                <!-- http://localhost/8_TFG/ObesityControlApp/public/images/treatments/medications/2.jpg -->
                <!-- <img v-bind:src="responsePatientTreatmentShow_DataToShow['Diet'].diet_image" alt="Diet image"> -->
                <img v-bind:src="'http://localhost/8_TFG/ObesityControlApp/public/storage/images/treatments/'+responsePatientTreatmentShow_DataToShow['Diet'].diet_image" alt="Diet image">
              </div>
              <div>
                <h4>Diet name</h4> 
                <p>{{responsePatientTreatmentShow_DataToShow["Diet"].diet_name}}</p>
              </div>
              <div>
                <h4>Diet description</h4> 
                <p class="descriptionStyle">{{responsePatientTreatmentShow_DataToShow["Diet"].diet_description}}</p>
              </div>
            </div>   
          </div>
        </div>

        <div class="treatmentComponent treatment_component_2345" v-if="responsePatientTreatmentShow_DataToShow"> 
          <div class="componentTitle">
            <h3>Physical Activity</h3>
            <i class="fas fa-edit"  v-if="doctorID != ''"  v-on:click="getRequestToTreatmentControllersIndex('Physical Activity'), updateTreatment = true"></i>
            <input type="checkbox" id="activity_display"/>   
            <label for="activity_display">   <i class="fas fa-chevron-circle-down" ></i>  </label>  
            <div class="componentContent">
              <div>
                <h4>Physical activity ID</h4> 
                <p>{{responsePatientTreatmentShow_DataToShow["Physical Activity"].physical_activities_id}}</p>
              </div>
              <div>
                <h4>Physical activity image</h4> 
                <!-- <img v-bind:src="responsePatientTreatmentShow_DataToShow['Physical Activity'].physical_activities_image" alt="Physical Activity image"> -->
                <img v-bind:src="'http://localhost/8_TFG/ObesityControlApp/public/storage/images/treatments/'+responsePatientTreatmentShow_DataToShow['Physical Activity'].physical_activities_image" alt="Physical Activity image">
              </div>
              <div>
                <h4>Physical activity name</h4> 
                <p>{{responsePatientTreatmentShow_DataToShow["Physical Activity"].physical_activities_name}}</p>
              </div>
              <div>
                <h4>Physical activity description</h4> 
                <p class="descriptionStyle">{{responsePatientTreatmentShow_DataToShow["Physical Activity"].physical_activities_description}}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="treatmentComponent treatment_component_2345" v-if="responsePatientTreatmentShow_DataToShow"> 
          <div class="componentTitle">
            <h3>Medication</h3>
            <i class="fas fa-edit"  v-if="doctorID != ''"  v-on:click="getRequestToTreatmentControllersIndex('Medication'), updateTreatment = true"></i>
            <input type="checkbox" id="medication_display"/>     
            <label for="medication_display">   <i class="fas fa-chevron-circle-down" ></i>  </label> 
            <div class="componentContent"  >
              <div>
                <h4>Medication ID</h4> 
                <p>{{responsePatientTreatmentShow_DataToShow["Medication"].medication_id}}</p>
              </div>
              <div>
                <h4>Medication image</h4> 
                <!-- <img v-bind:src="responsePatientTreatmentShow_DataToShow['Medication'].medication_image" alt="Medication image"> -->
                <img v-bind:src="'http://localhost/8_TFG/ObesityControlApp/public/storage/images/treatments/'+responsePatientTreatmentShow_DataToShow['Medication'].medication_image" alt="Medication image">
              </div>
              <div>
                <h4>Medication name</h4> 
                <p>{{responsePatientTreatmentShow_DataToShow["Medication"].medication_name}}</p>
              </div>
              <div>
                <h4>Medication description</h4> 
                <p class="descriptionStyle">{{responsePatientTreatmentShow_DataToShow["Medication"].medication_posology}}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="treatmentComponent treatment_component_2345" v-if="responsePatientTreatmentShow != ''">     <!-- The conditional cannot be responsePatientTreatmentShow.observations! = '' Because as long as responsePatientTreatmentShow has no value, the .observations property will not exist. However, in the HTML elements inside the v-if we can consult it because this content will only be executed when the responsePatientTreatmentShow has a value. -->
          <div class="componentTitle">
            <h3>Observations</h3>
            <i class="fas fa-edit"   v-if="doctorID != ''"  v-on:click="getRequestToTreatmentControllersIndex('Observations'), updateTreatment = true"></i>
            <input type="checkbox" id="observations_display"/>       
            <label for="observations_display">   <i class="fas fa-chevron-circle-down" ></i>  </label>   
            <div  class="componentContent" >
              <div class="descriptionStyle">{{ responsePatientTreatmentShow.observations }}</div>
            </div>
          </div>
        </div>

        <!--<p>{{responsePatientTreatmentShow.patient_state_date}}</p>-->
      </div>

      <div v-if="responsePatientTreatmentShow == ''">
        <p class="messageNotTreatment">Treatment not yet assigned for the status of this date</p>  <br>
        <button class="assignTreatment" v-if="doctorID != ''" v-on:click="getRequestToTreatmentControllersIndex('Diet'), assignTreatment = true">Select<br>diet</button> 
        <button class="assignTreatment" v-if="doctorID != ''" v-on:click="getRequestToTreatmentControllersIndex('Physical Activity'), assignTreatment = true">Select<br>activity</button> 
        <button class="assignTreatment" v-if="doctorID != ''" v-on:click="getRequestToTreatmentControllersIndex('Medication'), assignTreatment = true">Select<br>medication</button> 
        <button class="assignTreatment" v-if="doctorID != ''" v-on:click="getRequestToTreatmentControllersIndex('Observations'), assignTreatment = true">Select<br>observations</button> 
      </div>

    </section>

    <button class="saveStatusTreatment" v-if="doctorID != '' && responsePatientTreatmentShow != '' && updateTreatment" v-on:click="putRequestToPatientTreatmentControllersUpdate()">Update<br>treatment</button>        <!-- If we are editing, when we have finished selecting the new records for each component of the treatment, we must press this button to update the database. -->
    <button class="saveStatusTreatment" v-if="doctorID != '' && responsePatientTreatmentShow == '' && assignTreatment && newTreatmentComplete" v-on:click="postRequestToPatientTreatmentControllerStore()">Assign<br>treatment</button>

    <!--Treatment Selection  (Treatments Displayed) -->     <!-- Here only the treatment records are selected, when they are selected, the update treatment or assign treatment buttons prior to this section will be pressed --> 
    <div class="edit_status_treatment_selection" v-if="treatmentsDisplayed != ''" >
      <h2>{{treatmentsDisplayed}}</h2>

      <section v-for="element in responseTreatmentIndex" v-bind:key="element.id">
        <div>
          <div><span>ID: </span>{{element.id}}</div>
          <!-- <button v-on:click="selectTreatment(treatmentsDisplayed, element.id)">Select</button> -->
          <input type="radio" v-show="treatmentsDisplayed == 'Diets'" name="Diets" v-bind:value="element.id"  v-on:click="selectTreatment(treatmentsDisplayed, element.id)" />
          <input type="radio" v-show="treatmentsDisplayed == 'Physical Activities'" name="Physical Activities" v-bind:value="element.id"  v-on:click="selectTreatment(treatmentsDisplayed, element.id)" />
          <input type="radio" v-show="treatmentsDisplayed == 'Medications'" name="Medications" v-bind:value="element.id"  v-on:click="selectTreatment(treatmentsDisplayed, element.id)" />
        </div>
        <div><span>Name: </span>{{element.name}}</div>
        <div>
          <img v-bind:src="'http://localhost/8_TFG/ObesityControlApp/public/storage/images/treatments/'+element.image" alt="Treatment image" >
        </div>
        <div class="description">
          <input type="checkbox" v-bind:id="element.id"/>       
          <label v-bind:for="element.id"> 
            <span>Description: </span> 
            <i class="fas fa-chevron-circle-down"></i>  
          </label>                                            
          <div>{{element.description}}</div>       <!-- If the variable of the interpolation has no value, the element is not visible -->
          <div>{{element.posology}}</div>          <!-- One of the treatments doesn't have .description property, it has .posology property -->
        </div> 
      </section>

    </div>

    <!-- Observations edition -->
    <div class="edit_status_treatment_observation" v-if="updateObservation != ''">
      <h3>{{updateObservation}}</h3>
      <label for="observationForPatientStatus">Write observation for the patient's status</label><br>
      <textarea id="observationForPatientStatus" name="observationForPatientStatus" rows="4" cols="50" maxlength="1000" placeholder="Maximum 1000 characters..." v-model="newTreatment.observations">
      </textarea>
      <!--<p>{{newTreatment.observations}}</p> -->
      <br>
      <!--<button v-on:click="selectTreatment('Observations', null)">Ok</button>-->
    </div>

  </div>
</template>


<script>
import axios from 'axios';

//var response_data_acces_token = '5|3PJOJrQxdDs8EoIIMnk54q9jazNDO4Pw8riSq4RV'; 

//var patientID = 1;               // It is implemented as a Vue data because we must access the ID of the patient user in session saved in Vuex and it cannot be accessed from outside the Vue instance (see patientID data).
//var doctorID = '';               // It is implemented as a computed property because its value is calculated from the user role that we have stored in Vuex (see doctorID computed property).

export default {
  name: "DataHistory",
  data(){
    return {
      button: 'Add new status',
      displayForm: '',

      responsePatientSatesShow: '',                 // Array with patient statuses
      lastStateDate: '',
      
      responsePatientTreatmentShow: '',
      responsePatientTreatmentShow_DataToShow: '',
      
      showEditForm: '',
      statusDateToEdit: '',               
      statusWeight: '',
      statusMuscleMass: '',
      statusFatMass: '',
      statusBloodPressure: '',
      statusCholesterol: '',

      statusPatientID: '',                  
      statusDateSelected: '',
      
      patientID: this.$store.state.patient_id,       //  this.$store.state.patient_id  is only set in the Login view if the role is Patient or in the DoctorDashboard view when a patient is selected.
  
      responseTreatmentIndex: '',
      treatmentsDisplayed: '',
      updateObservation: '',

      newTreatment: {
        diet: '',
        medication: '',
        physical_activity: '',
        observations: '',
      },

      assignTreatment: false,
      updateTreatment: false,

      //Patient new status form
      inputWeight: '',
      inputMusclemass: '',
      inputFatmass: '',
      inputBloodpressure: '',
      inputCholesterol: '',

      responseShow: '',
    }
  },
  computed: {
    // Here in Computed Properties we cannot mount responsePatientTreatmentShow_DataToShow because we should do so by querying properties that may not yet exist of responsePatientTreatmentShow.
    newTreatmentComplete(){
      let x;
      let bool = true;
      for (x in this.newTreatment) {
        if(this.newTreatment[x]== ''){
          bool = false;
        }
      }
      return bool;
    },
    doctorID(){
      if (this.$store.state.user_session_subtype.role_name != 'Patient') {
      // When the user in session is Doctor or Admin, the computed property doctorID will have the value of their ID, therefore, the edit and add treatment buttons will be seen.
        return this.$store.state.user_session.id;
      } else {
      // When the user in session is Patient, the computed property doctorID will have no value, therefore, the edit and add treatment buttons will NOT be seen.
        return '';
      }
    },
    daysFromLastState(){
      const date1 = new Date(this.lastStateDate);              // Last status date
      const date2 = new Date();                                // Current date
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays;
    },
    daysToANewStatus(){
      return 7 - this.daysFromLastState;
    },
  },

  created(){
    // Request to receive records of the states of the patient in session ( GET request to PatientStateController Show() )
    //alert('>>>>> '+ this.patientID);
    this.getRequestToPatientStateControllerShow();
  },

  methods:{
    displayStoreForm(){            // For the Store Form we need a function because in addition to modifying this.displayForm, we rename the button. In the Edit Form instead, we only need to modify this.showEditForm.
      if (this.displayForm == '') {
        this.button = 'Hide form';
        this.displayForm = 'true';
      } else if (this.displayForm == 'true') {
        this.button = 'Add new status';
        this.displayForm = '';
      }
    },

    editForm(elementID, elementDate, elementWeight, elementMuscleMass, elementFatMass, elementBloodPressure, elementCholesterol){
      this.showEditForm = 'edit';
      this.statusPatientID = elementID;       // <<-- I think it is not necessary, since all the element.patient_id / elementID / this.statusPatientID will be the same this.patientID that we have sent in the request that is made in created(). Although if we want to visually separate the received data from the sent data, it is fine but data is repeated.
      this.statusDateToEdit = elementDate;
      this.statusWeight = elementWeight;
      this.statusMuscleMass = elementMuscleMass;
      this.statusFatMass = elementFatMass;
      this.statusBloodPressure = elementBloodPressure;
      this.statusCholesterol = elementCholesterol;
    },
    // Here the treatments that are selected are temporarily saved (in the newTreatment Vue data) until they are saved in the Database
    selectTreatment(treatment, id){
      // Assigns the ID of the selected treatment to the newTreatment object.
      // Another way would be to assign the value directly from the v-on:click if we used the dynamic property notation (this.newTreatment[treatment]), thus we would avoid conditionals. For that, the newTreatment object should have the names of its properties matching treatmentsDisplayed value or vice versa.
      if(treatment == 'Diets'){
        this.newTreatment.diet = id;
      } else if(treatment == 'Medications'){
        this.newTreatment.medication = id;
      } else if(treatment == 'Physical Activities'){
        this.newTreatment.physical_activity = id;
      };
      //alert(JSON.stringify(this.newTreatment));
    },

    /////// AJAX requests
    // Retrieves the states of a patient
    getRequestToPatientStateControllerShow(){
      axios({
        method: 'get',
        url: 'http://localhost/8_TFG/ObesityControlApp/public/api/patientstates/' + this.patientID,
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,                  // response.data.access_token
        }
      })
      .then(res => {
        console.log(res);
        //alert(this.responsePatientSatesShow);
        if(res.data.length != 0){            // If there are no status, the treatment request is not invoked, thus, the sections of these are not executed
          this.responsePatientSatesShow = res.data.reverse();  
          //console.log(">>>>>>>>>>>>>>>>>>");
          //console.log(this.responsePatientSatesShow[0]);
          // Default request to receive the treatment assigned to the last status of the patient
          this.getRequestToPatientTreatmentControllerShow(this.responsePatientSatesShow[0]);               
          this.lastStateDate = this.responsePatientSatesShow[0].date;
        };  
      })
      .catch(error => console.log(error));
    },
    
    // Request to send data of the current patient's status in session.
    // POST request to PatientStateController Store()
    postRequestToPatientStateControllerStore(){                     
      let d = new Date();
      //alert(this.$store.state.user_session.id);    
      //alert(this.$store.state.patient_id); 
      let data = {
        userID: this.$store.state.patient_id,                                       
        date: d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate(),

        weight: this.inputWeight,
        IMC: this.inputWeight/Math.pow(1.80, 2),           // The height of the user we have to take from the session data
        musclemass: this.inputMusclemass,
        fatmass: this.inputFatmass,
        bloodpressure: this.inputBloodpressure,
        cholesterol: this.inputCholesterol
      };
      axios({
        method: 'post',
        url: 'http://localhost/8_TFG/ObesityControlApp/public/api/patientstates',
        params: data,
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-type': 'application/json',
        }
      })
      .then(res => {                                
        console.log(res);
        console.log(res.status);
        if(res.status == 200){
          this.displayForm = '';
          this.getRequestToPatientStateControllerShow();
          //this.getRequestToPatientTreatmentControllerShow({patient_id: this.statusPatientID, date: this.statusDateSelected});
        } else {
          alert("Status could not be assigned correctly, please try again later");
        };
      })
      .catch(error => console.log(error.response));       // The .response property of the error object, if there has been an error, gives us the information of the error that has been generated in the backend.
    },
    
    // Request to update data of the current patient's status in session.
    putRequestToPatientStateControllerUpdate(){
      //alert("putRequestToPatientStateControllerUpdate() - Show edit for id: " );
      let data = {          
        userID: this.patientID,                     // These first two properties are not necessary, since the value of these is sent in the URL, which is what the backend queries, because it does not query these properties of the received object. Try to delete them and see if something goes wrong. Where these properties are needed is in the POST request, since here all the columns of the table have to be filled.
        date: this.statusDateToEdit,

        weight: this.statusWeight,
        IMC: this.statusWeight/Math.pow(1.80, 2),   // We have to take the height of the user from the session data
        musclemass: this.statusMuscleMass,
        fatmass: this.statusFatMass,
        bloodpressure: this.statusBloodPressure,
        cholesterol: this.statusCholesterol 
      };
      axios({
        method: 'put',                                    
        url: 'http://localhost/8_TFG/ObesityControlApp/public/api/patientstates/' + this.patientID + "/" + this.statusDateToEdit,
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
        },        
        data: data,
      }) 
      .then(res => {                                
        console.log(res);
        console.log(res.status);
        if(res.status == 200){
          this.showEditForm = '';
          this.getRequestToPatientStateControllerShow();
        } else {
          alert("Treatment could not be assigned correctly, please try again later");
        };
      })
      .catch(error => console.log(error));
    },

    // Request to receive the treatment assigned to the selected status of the patient
    // GET request to PatientTreatmentController Show()
    getRequestToPatientTreatmentControllerShow(element){
      // If another status of the patient is selected, first we clear the data that was requested for the previously selected status
      this.responseTreatmentIndex = "";
      this.treatmentsDisplayed = "";
      this.updateObservation = "";
      // Data request for the actual selected patient status
      this.statusPatientID = element.patient_id;
      this.statusDateSelected = element.date;
      //alert("Show treatment for date: " + element.date);       // The patient ID should not be taken from the user in session, because the doctor also has access here, and when the doctor is here, then patientID is null.
      axios({
        method: 'get',
        url: 'http://localhost/8_TFG/ObesityControlApp/public/api/patienttreatments/' + element.patient_id + "/" + element.date,
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,                  // response.data.access_token
        }
      })
      .then(res => {
        console.log(res);
        console.log('AAAAAAAAAAAA ' + res.data);
        if (res.data){
          this.responsePatientTreatmentShow = res.data;      // This response returns a single object
          // The properties that will be displayed through a loop are assigned to a dedicated object.
          // Here we use a dedicated object in which we will put the properties to be displayed. It is not recommended to do so because the template does not have to show all.
          this.responsePatientTreatmentShow_DataToShow = {
            //stateDate: this.responsePatientTreatmentShow.patient_state_date,
            'Diet': this.responsePatientTreatmentShow.diet,           // If we allow these columns to be null in the DB, I don't know if the backend when transforming the record to an object puts a null value in its properties or puts an empty string. In any case, when this happens the v-for loop does not render responsePatientTreatmentShow_DataToShow, it stays with the value of the previous rendering. Ok, that may be because here we are assigning to an object and it is not reactive unless we use the way of assignment for Vue objects?
            'Physical Activity': this.responsePatientTreatmentShow.physical_activity,
            'Medication': this.responsePatientTreatmentShow.medication,
            //'Observations': '',         
          };
          /*
            We assign the default values that the properties of newTreatment will have in case the doctor, when updating treatment, does not modify all the subtreatments. Those that the doctor does not modify will be sent to the backend already with the value they had, because this way it will be able to directly insert the received object without putting conditionals.
            Note that if the res.data object is not received (if an empty response arrives), newTreatment will have its properties empty, with value "". These will be filled in the selectTreatment() function, when the doctor wants to assign treatment to some user status.
            The problem is that when invoking this default function for the last status of the patient, if this status has value...
          */
          this.newTreatment.diet = this.responsePatientTreatmentShow.diet.diet_id;
          this.newTreatment.medication = this.responsePatientTreatmentShow.medication.medication_id; 
          this.newTreatment.physical_activity = this.responsePatientTreatmentShow.physical_activity.physical_activities_id; 
          this.newTreatment.observations = this.responsePatientTreatmentShow.observations;
          console.log('BBBBBBBBBBBBB ' + res.data);
        } else {
            this.responsePatientTreatmentShow = '';  
            this.responsePatientTreatmentShow_DataToShow = '';
            // If there is no data, we must also delete the values of the temporary object that may have remained with those of a previous request (in which there could be data) and we save them in this previous request in case (to foresee) the action that the doctor was going to do later was to modify.
            this.newTreatment.diet = '';
            this.newTreatment.medication = ''; 
            this.newTreatment.physical_activity = ''; 
            this.newTreatment.observations = '';
        };
      })
      .catch(error => console.log(error));
    },

    ////////////////////////////////////////////////////////
    // DOCTOR view REQUESTS
    ////////////////////////////////////////////////////////
    getRequestToTreatmentControllersIndex(treatment){          // There is no TreatmentController in the backend, there are several Treatments that have their own Controller. From this request, the index() method of the corresponding controller is invoked.
      //alert(treatment);
      let resource = '';
      let treatmentsSectionTitle = '';
      if (treatment == 'Diet') {
        resource = 'diets';
        treatmentsSectionTitle = 'Diets';
        //treatmentRequest();
        // GET request to TreatmentControllers Index()              // Request to receive the available list of any of the treatments 
        axios({
          method: 'get',
          url: 'http://localhost/8_TFG/ObesityControlApp/public/api/'+ resource,
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token,  //'27|c8ssbxyALQKzuzzzrr2zd6wpiqQ87nmDGhs2KP0V',
          }
        })
        .then(res => {
          console.log(res);
          this.responseTreatmentIndex = res.data;  
          this.updateObservation = '';                              // If we had opened the section to add observation, we close it because now we are going to show the list of some of the treatments.
          this.treatmentsDisplayed = treatmentsSectionTitle;    
          })
        .catch(error => console.log(error));

      } else if (treatment == 'Medication') {
        resource = 'medications';
        treatmentsSectionTitle = 'Medications';
        //treatmentRequest();
        // GET request to TreatmentControllers Index()              // Request to receive the available list of any of the treatments 
        axios({
          method: 'get',
          url: 'http://localhost/8_TFG/ObesityControlApp/public/api/'+ resource,
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token,  //'27|c8ssbxyALQKzuzzzrr2zd6wpiqQ87nmDGhs2KP0V',
          }
        })
        .then(res => {
          console.log(res);
          this.responseTreatmentIndex = res.data;  
          this.updateObservation = '';                              // If we had opened the section to add observation, we close it because now we are going to show the list of some of the treatments.
          this.treatmentsDisplayed = treatmentsSectionTitle;    
          })
        .catch(error => console.log(error));

      } else if (treatment == 'Physical Activity') {
        resource = 'physicalactivities';
        treatmentsSectionTitle = 'Physical Activities';
        //treatmentRequest();
        // GET request to TreatmentControllers Index()              // Request to receive the available list of any of the treatments 
        axios({
          method: 'get',
          url: 'http://localhost/8_TFG/ObesityControlApp/public/api/'+ resource,
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token,  //'27|c8ssbxyALQKzuzzzrr2zd6wpiqQ87nmDGhs2KP0V',
          }
        })
        .then(res => {
          console.log(res);
          this.responseTreatmentIndex = res.data;  
          this.updateObservation = '';                              // If we had opened the section to add observation, we close it because now we are going to show the list of some of the treatments.
          this.treatmentsDisplayed = treatmentsSectionTitle;    
          })
        .catch(error => console.log(error));

      } else if (treatment == 'Observations') {                     // If this option is executed, it will not be necessary to make the request.
        treatmentsSectionTitle = 'Write Observation';
        this.treatmentsDisplayed = '';
        this.updateObservation = treatmentsSectionTitle; 
      };
      
      /*
      let _this = this;                                        // The request is put inside a function so that it can be executed only from the necessary conditional. As inside a function, 'this' points outside the Vue instance, the scope of 'this' is saved in the variable '_this' so that it can be executed from there.
      let this_token = '';
      this_token = this.my_token;                              // Seems that _this scope forcing doesn't work with the $store object.
      alert(this.$store.state.token);
      alert(typeof this_token);
      alert(this.my_token);
      function treatmentRequest(){
        // If I put the AJAX request here, I have to use  let _this = this;  to invoke  _this  instead of  this  from within,
        // but it still seems that it does not work when the Vuex $store object is invoked: this.$store.state.token, even if we assign its value previously to a Vue variable or data.
        // Could use Axios global or Vuex async actions to make the reusable request.
      }
      */
    },

    postRequestToPatientTreatmentControllerStore(){
      // Verify that the doctor has assigned all the treatment values (this.newTreatmentComplete computed property)
      if(!this.newTreatmentComplete){
        alert("Incomplete treatment assignment");
      // If the doctor has assigned all of them, we make the request...
      } else {
        //alert("Correct!");
        let d = new Date();
        let data = {                                            // The same object as in the PUT request is sent to PatientTreatment
            patient_id: this.statusPatientID,
            patient_state_date: this.statusDateSelected,
            treatment_date: d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate(),

            diet: this.newTreatment.diet,
            medication: this.newTreatment.medication,     
            physical_activity: this.newTreatment.physical_activity,
            observations: this.newTreatment.observations,
          
            doctor: this.doctorID,
        };
        axios({
          method: 'post',
          url: 'http://localhost/8_TFG/ObesityControlApp/public/api/patienttreatments',
          data: data,
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token,
            //'Content-type': 'application/json',
          }
        }).then(res => {
          console.log(res);
          console.log(res.status);
          if(res.status == 200){
            this.assignTreatment = false;
            this.updateObservation = '';      
            this.treatmentsDisplayed = ''; 
            this.getRequestToPatientTreatmentControllerShow({patient_id: this.statusPatientID, date: this.statusDateSelected});
            
          } else {
            alert("Treatment could not be assigned correctly, please try again later");
          };
        })                                                  
        .catch(error => console.log(error.response));
      };
    },
    
    putRequestToPatientTreatmentControllersUpdate(){     
      //alert("Request to update changes in DB PatientTreatment. Patient_id: "+ this.responsePatientTreatmentShow.patient_id + ". Patient state date: " + this.responsePatientTreatmentShow.patient_state_date);
      /* 
        When a status is clicked, a request is made to PatientTreatment show() and the treatment data for that status is received, including the status date, which is located in a property of responsePatientTreatmentShow.
        When the EditTreatment button is clicked (they are in each component of the selected 'Current treatment'), none of the responsePatientTreatmentShow properties are modified.
        When the 'Add' button is clicked, the patient's ID must also be sent, but remember that this request is made by the doctor, thus, the patient's id will not be the one of the user in session but the one of the patient to whom the treatment belongs (ID that is also in responsePatientTreatmentShow).
      */
      // We verify that the doctor has made any changes to the treatment before sending the data. We cannot directly compare objects (converting them to some type that can be compared beforehand) because responsePatientTreatmentShow has more properties than newTreatment.
      if (this.newTreatment.diet == this.responsePatientTreatmentShow.diet.diet_id &&
          this.newTreatment.medication == this.responsePatientTreatmentShow.medication.medication_id && 
          this.newTreatment.physical_activity == this.responsePatientTreatmentShow.physical_activity.physical_activities_id && 
          this.newTreatment.observations == this.responsePatientTreatmentShow.observations) {
          alert('You have not made any changes to the treatment. Please, edit the treatment component you want to modify');    
      } else {
        //alert('Changes saved!');
        let dataEdit = {
          diet: this.newTreatment.diet,
          medication: this.newTreatment.medication,     
          physical_activity: this.newTreatment.physical_activity,
          observations: this.newTreatment.observations
        };
        axios({
          method: 'put',                                    
          url: 'http://localhost/8_TFG/ObesityControlApp/public/api/patienttreatments/' + this.responsePatientTreatmentShow.patient_id + "/" + this.responsePatientTreatmentShow.patient_state_date,
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token,
          },        
          data: dataEdit,     
        })
        .then(res => {
          console.log(res);
          console.log(res.status);
          if(res.status == 200){
            this.updateTreatment = false;
            this.updateObservation = '';      
            this.treatmentsDisplayed = ''; 
            this.getRequestToPatientTreatmentControllerShow({patient_id: this.responsePatientTreatmentShow.patient_id, date: this.responsePatientTreatmentShow.patient_state_date});
          } else {
            alert("Treatment could not be updated correctly, please try again later");
          };
        })  
        .catch(error => console.log(error)); 
      }
    },
  }
};
</script>


<style scoped>

/* Edit form */
div.form {
  background-color: #E6E656;
} 

form input[type=number] {
  width: 30%;
  height: 16px;
}

    /* Tablet */
    @media screen and (min-width: 768px) {                
      form input[type=number] {
        width: 20%;
        height: 20px;
      }
    }
    
    /* Desktop */
    @media screen and (min-width: 1280px) {                
      form input[type=number] {
        width: 20%;
        height: 22px;
      }
    }

/* Patient status section */
section.patient_status {
  height: 300px;
  overflow: auto;
}

section.patient_status .fas{
  margin: 5% 0;
  font-size: 15px;
}

section.patient_status .fas:hover{
  color: orange;
}

section.patient_status h2{
  font-size: 0.9em;
}

    /* Tablet */
    @media screen and (min-width: 768px) {                
      section.patient_status .fas{
        margin: 10% 0;
        font-size: 20px;
      }
      section.patient_status h2{
        font-size: 1.2em;
      }
    }
    
    /* Desktop */
    @media screen and (min-width: 1280px) {                
      section.patient_status .fas{
        margin: 20% 0;
        font-size: 25px;
      }
      section.patient_status h2{
        font-size: 1.5em;
      }
    }

.database_record:hover > div{
  background-color: white;
  cursor: pointer;
}

/* Patient status treatment */
section.patient_status_treatment h2{
  font-size: 0.9em;
}

.patient_status_treatment button.assignTreatment{
  color: white;
  background-color: #b38600;

  width: 90px;
  height: 30px;

  border: 2px solid grey;
  box-sizing: border-box;
  transition: all 0.5s;
  
  font-size: 0.6em;
}

.patient_status_treatment button.assignTreatment:hover{
  background-color: #f3f3f3;
  border: 2px solid black;
  color: black;
  font-weight: bold;
}

.patient_status_treatment p.messageNotTreatment{
  font-size: 0.7em;
}

.treatments {
	display:flex;
	flex-wrap: wrap;
	justify-content: center;
}

.treatments .treatmentComponent {
	background-color: white;
	border: solid 1px black;
	margin: 2px;
	font-size: 0.6em;
}

.treatment_component_1 {
	width: 70%;
}

.treatment_component_1 > p {
	font-weight: bold;
}

.treatment_component_1 div {
	background-color: #7A7A52;
	color: white;
	padding: 1px 0;
}

.treatment_component_2345 {
	width: 100%;
}

.treatment_component_2345 .componentContent .descriptionStyle {            /* *********************************** */
  padding: 0.5% 3%;
}

.componentTitle {
	background-color: #7A7A52;
}

.componentTitle > h3 {
	margin-left: 20%;
	color: white;
	display: inline-block;
}

.componentTitle > h3 + i {
	padding-left: 20px;
	padding-right: 10px;
}

.componentTitle i {
	font-size: 2em;
	color: white;
	display: inline-block;
	float: right;
	margin-top: 10px;
}
		
.componentTitle i:hover {
	color: orange;
}


.componentContent > div {
	border: solid 1px lightgrey;
	background-color: white;
}

.componentContent img {
	width: 90%;
}

		
	/* Display status treatment content functionality */
.treatmentComponent > div > input[type="checkbox"] {
	display: none;
}

.treatmentComponent > div > .componentContent {
	display: block;
}

.treatmentComponent > div > input:checked ~ div {
	display: none;
}

.treatmentComponent > div > input:checked + label > i {
	transform: rotate(180deg);
}

    /* Tablet */
    @media screen and (min-width: 768px) {  
      section.patient_status_treatment h2{
        font-size: 1.2em;
      }              
      .patient_status_treatment button.assignTreatment{
            width: 120px;
            height: 45px;
            font-size: 0.8em;
      }
      .patient_status_treatment p.messageNotTreatment{
        font-size: 0.9em;
      }
      .treatments .treatmentComponent {
        margin: 5px;
        font-size: 0.8em;
      }
      .treatment_component_1 {
        width: 60%;
      }
      .treatment_component_2345 {
        width: 48%;
      }
      .componentContent img {
        width: 80%;
      }
    }
      
    /* Desktop */
    @media screen and (min-width: 1280px) {                
      section.patient_status_treatment h2{
        font-size: 1.5em;
      }  
      .patient_status_treatment button.assignTreatment{
            width: 150px;
            height: 43px;
            font-size: 0.9em;
      }
      .patient_status_treatment p.messageNotTreatment{
        font-size: 1.1em;
      }
      .treatments .treatmentComponent {
        font-size: 0.9em;
      }
      .treatment_component_1 {
        width: 50%;
      }
      .componentTitle i {
        margin: 10px;
      }
    }



/* Edit treatment section */ 
.edit_status_treatment_selection, .edit_status_treatment_observation {
	font-size: 0.7em;
}

.edit_status_treatment_selection h2{
  font-size: 1.3em;
}


.edit_status_treatment_selection > section {
	margin: 5px 0;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}

.edit_status_treatment_selection > section > div {
	background-color: #ffcc80;
	border: solid 1px;
	width: 100%;
	padding: 5px 0;
}

.edit_status_treatment_selection > section > div.description {
	width: 100%;
}

.edit_status_treatment_selection > section > .description > div {            /* ************************************* */
  padding: 0.5% 3%;
}

.edit_status_treatment_selection > section > div > input[type=radio] {
	float: right;
	margin-top: -10px;
	width: 30px;                            /* Width or height give more active area to the input[type = radius] element but do not make it visually bigger */
	
	/*border-radius: 50px;
	height: 30px;
	width: 30px;*/
}

.edit_status_treatment_selection > section > div span, .edit_status_treatment_selection > section > div label {
	font-weight: bold;
}

.edit_status_treatment_selection > section > div > img {
	width: 40%;
}

.edit_status_treatment_observation > textarea {
	width: 90%; 
}

    /* Tablet */
    @media screen and (min-width: 768px) {                
      .edit_status_treatment_selection, .edit_status_treatment_observation {
        font-size: 0.8em;
      }
      
      .edit_status_treatment_selection h2{
        font-size: 1.4em;
      }
      
      .edit_status_treatment_selection > section {
        margin: 7px 0;
      }

      .edit_status_treatment_selection > section > div {
        width: 33%;
      }

      .edit_status_treatment_selection > section > div.description {
        width: 99%;
      }
      .edit_status_treatment_selection > section > div > img {
        width: 30%;
      }
      .edit_status_treatment_observation > textarea {
        width: 60%;
      }
    }
      
    /* Desktop */
    @media screen and (min-width: 1280px) {                
      .edit_status_treatment_selection, .edit_status_treatment_observation {
        font-size: 0.9em;
      }
      .edit_status_treatment_selection h2{
        font-size: 1.5em;
      }
      .edit_status_treatment_selection > section {
        margin: 9px 0;
      }
    }
	  
/* Display treatment description functionality */
.edit_status_treatment_selection > section > .description > input[type="checkbox"] {
	display: none;
}

.edit_status_treatment_selection > section > .description > div {
	display: none;
}

.edit_status_treatment_selection > section > .description > input:checked ~ div {
	display: block;
}


.edit_status_treatment_selection > section > div label > i {
	margin-left: 20px;
	font-size: 1.7em;
}

.edit_status_treatment_selection > section > div label > i:hover {
  color: #994d00;
}

.edit_status_treatment_selection > section > .description > input:checked + label > i {
	transform: rotate(180deg);
}


/* Edit treatment section buttons */
.saveStatusTreatment {
  color: white;
  background-color: #997300;

  width: 90px;
  height: 30px;

  border: 2px solid grey;
  box-sizing: border-box;
  font-size: 0.6em;
  transition: all 0.5s;
  margin-top: 20px;
}

.edit_status_treatment_observation > button {
  color: white;
  background-color: #595959;

  width: 70px;
  height: 20px;

  border: 2px solid grey;
  box-sizing: border-box;
  font-size: 0.6em;
  transition: all 0.5s;
  margin-top: 20px;
}

.saveStatusTreatment:hover, .edit_status_treatment_observation > button:hover {
	background-color: #f3f3f3;
  border: 2px solid black;
  color: black;
  font-weight: bold;
}

    /* Tablet */
    @media screen and (min-width: 768px) {                
      .saveStatusTreatment {
        width: 120px;
        height: 45px;
        font-size: 0.8em;
      }
      .edit_status_treatment_observation > button{
        width: 110px;
        height: 30px;
        font-size: 0.8em;			
      }
    }
      
    /* Desktop */
    @media screen and (min-width: 1280px) {                
      .saveStatusTreatment {
        width: 150px;
        height: 43px;
        font-size: 0.9em;
      }
      .edit_status_treatment_observation > button{
        width: 120px;
        height: 35px;
        font-size: 0.8em;			
      }
    }
	  

.hideEditFormButton {
  color: white;
  background-color: #595959;

  width: 70px;
  height: 20px;

  border: 2px solid grey;
  box-sizing: border-box;
  line-height: 0px;
  font-size: 0.6em;
  transition: all 0.5s;
  margin-top: 20px;
}

.hideEditFormButton:hover {
	background-color: #f3f3f3;
    border: 2px solid black;
    color: black;
    font-weight: bold;
}

    /* Tablet */
    @media screen and (min-width: 768px) {                
      .hideEditFormButton {
        width: 100px;
        height: 30px;
        font-size: 0.8em;
      }
    }
        
    /* Desktop */
    @media screen and (min-width: 1280px) {                
      .hideEditFormButton {
        width: 130px;
        height: 33px;
        font-size: 0.9em;
      }
    }
	  

/* PatientDashboard */
button.displayStoreForm {
  color: white;
  background-color: #b38600;

  width: 90px;
  height: 30px;

  border: 2px solid grey;
  box-sizing: border-box;
  font-size: 0.6em;
  transition: all 0.5s;
  margin-top: 20px;
}

button.displayStoreForm:hover {
  background-color: #f3f3f3;
  border: 2px solid black;
  color: black;
  font-weight: bold;
}


    /* Tablet */
    @media screen and (min-width: 768px) {                
      button.displayStoreForm {
        width: 120px;
        height: 45px;
        font-size: 0.8em;
      }
    }
    
    /* Desktop */
    @media screen and (min-width: 1280px) {                
      button.displayStoreForm {
        width: 150px;
        height: 43px;
        font-size: 0.9em;
      }
    }


/* PatientStatusDataForm*/
div.newStatusForm {
  background-color: #ffbf00;
} 

.newStatusForm form input[type=number] {
  width: 30%;
  height: 16px;
}

    /* Tablet */
    @media screen and (min-width: 768px) {                
      .newStatusForm form input[type=number] {
        width: 20%;
        height: 20px;
      }
    }
    
    /* Desktop */
    @media screen and (min-width: 1280px) {                
      .newStatusForm form input[type=number] {
        width: 20%;
        height: 22px;
      }
    }

</style>
