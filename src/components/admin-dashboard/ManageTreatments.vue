<template>
  <div> 
    <h2 class="h2_main">Treatments</h2>
      
    <!-- Select treatment -->
    <div class="selectTreatment">
        <label for="treatmentComponent">Select treatment to list or add:</label><br> 
        <select id="treatmentComponent" name="treatmentComponent" required  v-model="treatmentComponentSelected">
          <option value="diets" selected>Diets</option>
          <option value="medications">Medication</option>
          <option value="physicalactivities">Physical Activity</option>
        </select>
    </div>

    <button class="adminButtons adminButtonsSelect1"  v-on:click="getRequestToTreatmentsControllersIndex(treatmentComponentSelected)">List</button>
    <button class="adminButtons adminButtonsSelect2" v-on:click="showAddTreatmentForm = true">Add</button>

    <!-- Add trearment form -->
    <div class="form"  v-if="showAddTreatmentForm"> 
      <h2>Add {{treatmentComponentSelected}} treatment form</h2>
      <form v-on:submit.prevent="postRequestToTreatmentsControllersStore(treatmentComponentSelected)"  enctype="multipart/form-data">   
        <label for="name">Name:</label><br>
        <input type="text" id="name" name="name" minlength="2" maxlength="40"  v-model="treatmentRecordName" required ><br>  

        <label for="image">Image:</label><br>                                                      
        <input type="file" id="image" name="image"  ref="file"   v-on:change="attach()"  required> <br><br>            
        
        <label for="treatmentDescription">Write treatment description:</label><br>
        <textarea id="treatmentDescription" name="treatmentDescription" required
                  rows="4" cols="50" maxlength="5000" placeholder="Maximum 5000 characters..."  v-model="treatmentRecordDescription" >
        </textarea> <br>

        <input class="inputButton" type="submit" value="Send"><br>
        <button class="adminButtons adminButtonsHide" v-on:click="showAddTreatmentForm = false">Hide</button>
      </form>
    </div>

    <!-- Treatment Results -->
    <div v-if="responseTreatmentIndex != ''"  class="manage_treatments_results">       <!-- Add general box style to it -->
      <h2>{{treatmentsDisplayed}}</h2>
      <section v-for="element in responseTreatmentIndex" v-bind:key="element.id">
        <div>
          <div><span>ID: </span>{{element.id}}</div>
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
        <div>
          <button class="adminButtons2"  v-on:click="editForm(treatmentComponentSelected, element)">Edit</button>
          <button class="adminButtons2"  v-on:click="deleteRequestToTreatmentsControllersDestroy(treatmentComponentSelected, element.id)">Delete</button>
        </div>
      </section>
    </div>

    <!-- Edit Treatment Form -->
    <div class="form formEdit" v-if="showEditTreatmentForm">
      <h2>Edit treatment Form</h2>
      <form v-on:submit.prevent="putRequestToTreatmentsControllersUpdate(treatmentComponentToEdit, treatmentRecordIdToEdit)"  enctype="multipart/form-data">
        <label for="nameToEdit">Name:</label><br>
        <input type="text" id="nameToEdit" name="name" minlength="2" maxlength="40"  v-model="treatmentRecordNameToEdit" required ><br>  

        <label for="imageToEdit">Image:</label><br>                                                      
        <input type="file" id="imageToEdit" name="image"  ref="file"   v-on:change="attachToEdit()" > <br><br>            
        
        <label for="treatmentDescriptionToEdit">Write treatment description:</label><br>
        <textarea id="treatmentDescriptionToEdit" name="treatmentDescription" required
                  rows="4" cols="50" maxlength="5000" placeholder="Maximum 5000 characters..."  v-model="treatmentRecordDescriptionToEdit" >
        </textarea> <br>

        <input class="inputButton" type="submit" value="Update">
      </form>
      <button class="adminButtons adminButtonsHide" v-on:click="showEditTreatmentForm = false">Hide</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "ManageTreatments",
  data(){
    return {                                      // Should organize data into objects
      responseTreatmentIndex: '',
      treatmentComponentSelected: '',
      treatmentsDisplayed: '',
      // Show form
      showAddTreatmentForm: false,
      showEditTreatmentForm: false,
      // Add form
      treatmentRecordName: '',
      treatmentRecordImage: '',
      treatmentRecordDescription: '',
      // Edit form
      treatmentComponentToEdit: '',
      treatmentRecordIdToEdit: '',
      treatmentRecordNameToEdit: '',
      treatmentRecordImageToEdit: '',
      treatmentRecordDescriptionToEdit: '',
    }
  },
  methods: {
    editForm(treatmentComponentSelected, element){
      /*
      Here the request is not made, only the form is shown and the values of the v-for iteration to be edited are saved
      so that the HTML form can access them. The form will be the one that invokes the request.
      */ 
      this.showEditTreatmentForm = true;
      this.treatmentComponentToEdit = treatmentComponentSelected;  // If the user subsequently selects another treatmentComponent (Diet, etc.) the one he was going to edit will not be affected unless he presses the edit button again.
      //console.log(element);
      this.treatmentRecordIdToEdit = element.id;
      this.treatmentRecordNameToEdit = element.name;
      //this.treatmentRecordImageNameToEdit = element.image;       // We don't really need to save the name of the image because what the user will modify will be the file, not the name, and if he doesn't add a new file, in the backend there is the logic to keep the old file.
      if(this.treatmentComponentToEdit == 'medications'){
        this.treatmentRecordDescriptionToEdit = element.posology;
      } else {
        this.treatmentRecordDescriptionToEdit = element.description;
      }
    },
    attach(){                                //  ++++++++++++
      this.treatmentRecordImage = this.$refs.file.files[0];                         // We only want to send the only file that has been attached.
      console.log('>>>> element files array   >>>> ', this.$refs.file);             // If we see the .files property of the type="file" element, we see that it is an array that will have all the files that have been added to that element.
      console.log('>>>> element file selected >>>> ', this.$refs.file.files[0]);
    },
    attachToEdit(){                       
      this.treatmentRecordImageToEdit = this.$refs.file.files[0];
    },

    //// AJAX Requests
    getRequestToTreatmentsControllersIndex(resource){             // resource = treatmentComponentSelected
      this.showAddTreatmentForm = false;
      this.showEditTreatmentForm = false;
      let treatmentsSectionTitle = '';
      // Depending on the treatment that the user has selected, we put the correct title of the section that will show the results
      if (resource == 'diets') {
        treatmentsSectionTitle = 'Diets';
      } else if(resource == 'medications'){
        treatmentsSectionTitle = 'Medications';
      } else if(resource == 'physicalactivities'){
        treatmentsSectionTitle = 'Physical Activities';
      }
      // GET request to TreatmentControllers Index()              // Request to receive the available list of any of the treatments 
      axios({
        method: 'get',
        url: 'http://localhost/8_TFG/ObesityControlApp/public/api/'+ resource,     
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,  
        }
      })
      .then(res => {
        console.log(res);
        console.log(res.data);
        if(res.data.length != 0){
          this.responseTreatmentIndex = res.data;  
          this.treatmentsDisplayed = treatmentsSectionTitle;  
        } else {
          alert("There are no " +resource+ " stored in the database, add one with the 'Add' button");
          this.responseTreatmentIndex = '';  
        }  
      })
      .catch(error => console.log(error));
    },

    postRequestToTreatmentsControllersStore(resource){
      //alert('postRequestToTreatmentsControllersStore() for treatment: ' + resource);
      if( (this.treatmentRecordName != '' && !isNaN(this.treatmentRecordName) ) ){              // isNaN = is Not a Number 
          alert('Please, do not enter numeric values ​​in the name');
      } else {
        let formData = new FormData();
        formData.append('name', this.treatmentRecordName);
        formData.append('image', this.treatmentRecordImage);
        formData.append('description', this.treatmentRecordDescription); 
        //console.log('>> formData >> ', formData);
        axios({
          method: 'post',
          url: 'http://localhost/8_TFG/ObesityControlApp/public/api/' + resource,
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': 'multipart/form-data'
          },
          data: formData,
        })
        .then(res => {
          console.log(res);
          console.log(res.status);
          if (res.status == 200){
            this.getRequestToTreatmentsControllersIndex(resource);        // Once added, we make a request again for the results to be displayed with the added record.
            this.treatmentRecordName = "";
            this.treatmentRecordImage = "";
            this.treatmentRecordDescription = "";
          }
        })                                                  
        .catch(error => {
          console.log(error.response);               // the .response would be equivalent to the res object that we query in the .then()
          //console.log(error.response.status);          
        }); 
      };
    },

    putRequestToTreatmentsControllersUpdate(resource, treatmentID){
      //alert('putRequestToTreatmentsControllersUpdate() for treatment: ' + resource + ' and treatment ID: ' + treatmentID);
      if( (this.treatmentRecordNameToEdit != '' && !isNaN(this.treatmentRecordNameToEdit) ) ){          // isNaN = is Not a Number 
      alert('Please, do not enter numeric values ​​in the name');
      } else {
        let formData = new FormData();
        formData.append('name', this.treatmentRecordNameToEdit);
        formData.append('image', this.treatmentRecordImageToEdit);
        formData.append('description', this.treatmentRecordDescriptionToEdit);
        formData.append('_method', 'PUT');                      //  <<<<<<<    // ++++++++++++  // PUT 
        //console.log('>> formData >> ', formData);
        axios({
          method: 'post',
          url: 'http://localhost/8_TFG/ObesityControlApp/public/api/' + resource + '/' + treatmentID,
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': 'multipart/form-data'
          },
          data: formData,
        })
        .then(res => {
          console.log(res);
          console.log(res.status);
          if (res.status == 200){
            this.getRequestToTreatmentsControllersIndex(resource);
            this.treatmentRecordNameToEdit = "";
            this.treatmentRecordImageToEdit = "";
            this.treatmentRecordDescriptionToEdit = "";
          }
        })                                                  
        .catch(error => {
          console.log(error.response);               // the .response would be equivalent to the res object that we query in the .then()
          //console.log(error.response.status);
        }); 
      };
    },

    deleteRequestToTreatmentsControllersDestroy(resource, treatmentID){
      //alert('deleteRequestToTreatmentsControllersDestroy() for treatment: ' + resource + ' and treatment ID: ' + treatmentID);
      axios({
        method: 'delete',
        url: 'http://localhost/8_TFG/ObesityControlApp/public/api/' + resource + '/' + treatmentID,
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
        },
      })
      .then(res => {
        console.log(res);
        console.log(res.status);
        if (res.status == 200){
          this.getRequestToTreatmentsControllersIndex(resource);
        }
      })                                                  
      .catch(error => {
        console.log(error.response);                 // the .response would be equivalent to the res object that we query in the .then()
        //console.log(error.response.status);
      }); 
    },
  }
};
</script>

<style scoped>
/* MANAGE TREATMENTS */

div.form {
  background-color: #ccff33;
}
div.formEdit {
  background-color: #ffff33;    
}
div.form textarea, div.formEdit textarea {
  width: 90%;
}

.manage_treatments_results {
	font-size: 0.7em;
  height: 600px;
  overflow: auto;
}
.manage_treatments_results h2 {
  font-size: 1.3em;
}
.manage_treatments_results > section {             /* edit_status_treatment_selection */
	margin: 5px 0;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}
.manage_treatments_results > section > div {
	background-color: #ffcc80;
	border: solid 1px;
	width: 100%;
	padding: 5px 0;
}
.manage_treatments_results > section > div > img {
	width: 40%;
}
.manage_treatments_results > section > div span, .manage_treatments_results > section > div label {
	font-weight: bold;
}
.manage_treatments_results > section > .description > div {
	padding: 0.5% 2%;
}

    /* Tablet */
    @media screen and (min-width: 768px) {                
      div.form textarea, div.formEdit textarea {
        width: 70%;
      }
      .manage_treatments_results {
        font-size: 0.8em;
      }
      .manage_treatments_results h2 {
        font-size: 1.4em;
      }
      
      .manage_treatments_results > section {             /* edit_status_treatment_selection */
        margin: 7px 0;
      }
      .manage_treatments_results > section > div {
        width: 33%;
      }
      .manage_treatments_results > section > div.description {
        width: 66%;
      }
      .manage_treatments_results > section {
        margin: 7px 0;
      }
    }
      
    /* Desktop */
    @media screen and (min-width: 1280px) {   
      .manage_treatments_results {
        font-size: 0.9em;
      }
      .manage_treatments_results h2 {
        font-size: 1.5em;
      }
      
      .manage_treatments_results > section {
        margin: 9px 0;
      }
    }
	  
/* Display treatment description functionality */
.manage_treatments_results > section > .description > input[type="checkbox"] {
	display: none;
}
.manage_treatments_results > section > .description > div {
	display: none;
}
.manage_treatments_results > section > .description > input:checked ~ div {
	display: block;
}

.manage_treatments_results > section > div label > i {
	margin-left: 20px;
	font-size: 1.7em;
}
.manage_treatments_results > section > div label > i:hover {
  color: #994d00;
}
.manage_treatments_results > section > .description > input:checked + label > i {
	transform: rotate(180deg);
}



.manage_treatments_results .adminButtons2 {
  display: inline-block;
  margin: 7px 3px 7px 3px;
  background-color: grey;
  color: white;
  font-size: 1.2em;
	width: 57px;
	height: auto;
}
.manage_treatments_results .adminButtons2:hover {
  background-color: white;
  border: 1px solid black;
  color: black;
  font-weight: bold;
}

      /* Tablet */
      @media screen and (min-width: 768px) {                
        .manage_treatments_results .adminButtons2 {
          font-size: 0.9em;
          width: 65px;
          height: 22px;
        }
      }
      
      /* Desktop */
      @media screen and (min-width: 1280px) {                
        .manage_treatments_results .adminButtons2 {
          width: 75px;
          height: 25px;
        }
      }


.adminButtonsHide {
  background-color: #595959;
} 
.adminButtonsHide:hover, .adminButtonsSelect1:hover, .adminButtonsSelect2:hover {
  background-color: white;
  border-color: black;
} 
.adminButtonsSelect1, .adminButtonsSelect2{
  margin: 0 1%;
  background-color: #999900;
  border-color: lightgrey;
}


.h2_main{
  font-size: 0.9em;
}
.selectTreatment{
  font-size: 0.8em;
  margin-bottom: 1%;
}
.selectTreatment select {
  width: 150px;
  margin-top: 1%;
  font-size: 0.9em;
}

      /* Tablet */
      @media screen and (min-width: 768px) {      
        .h2_main{
          font-size: 1.1em;
        }
        .selectTreatment{
          font-size: 0.9em;
        }           
        .selectTreatment select {
          width: 180px;
          font-size: 0.95em;
        }
      }
      
      /* Desktop */
      @media screen and (min-width: 1280px) {                
        .h2_main{
          font-size: 1.3em;
        }
        .selectTreatment{
          font-size: 1em;
        }           
        .selectTreatment select {
          width: 200px;
          font-size: 1.1em;
        }
      }

</style>
