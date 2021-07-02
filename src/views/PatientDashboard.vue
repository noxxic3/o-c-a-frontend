<template>

  <div class="about">
    
    <img id="profileImage" v-bind:src="'http://localhost/8_TFG/ObesityControlApp/public/storage/images/patients/'+$store.state.patient_image" alt="Patient image" ><br>
                          <!-- "http://localhost/8_TFG/ObesityControlApp/public/        images/patients/"+ patient.image  -->  <!-- el  patient.image se cogería del estado del usuario almacenado en el frontend, en esta página no sería necesario hacer petición AJAX -->
    <!--                                                             
    <button class="displayStoreForm" v-on:click="displayStoreForm()">{{button}}</button>
    -->
    <!--<patient-status-data-form-component v-if="displayForm == 'true'" />-->
    <data-history-component />
    <!--<current-treatment-component />-->


  </div>

</template>

<script>

export default {
  name: "PatientDashboard",
  data(){
    return{

      /*
      button: 'Add new status',
      displayForm: '',
      */

    }
  },
  created(){
    this.$store.state.view = 'PatientDashboard';
    localStorage.setItem("view", 'PatientDashboard');
    this.$store.state.view_title = 'Patient Dashboard';
  },
  methods: {

  /*
    displayStoreForm(){
      if (this.displayForm == '') {
        this.button = 'Hide form';
        this.displayForm = 'true';
      } else if (this.displayForm == 'true') {
        this.button = 'Add new status';
        this.displayForm = '';
      }
    }

  */

  }
}

</script>

<style scoped>

  img#profileImage {
    width: 100px; 
    height: 100px;
    border-radius: 50%;
    margin-top: 10px;
  }

      /* Tablet */
      @media screen and (min-width: 768px) {                
        img#profileImage {
          width: 140px; 
          height: 140px;  
          margin-top: 20px;
        }
      }
      
      /* Desktop */
      @media screen and (min-width: 1280px) {                
        img#profileImage {
          width: 160px; 
          height: 160px;  
          margin-top: 20px;
        }
      }


/*

button.displayStoreForm {
  color: white;
  background-color: #CC9900;

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


      
      @media screen and (min-width: 768px) {                
		    button.displayStoreForm {
          width: 120px;
          height: 45px;
          font-size: 0.8em;
        }
      }
      
     
      @media screen and (min-width: 1280px) {                
        button.displayStoreForm {
          width: 150px;
          height: 43px;
          font-size: 0.9em;
        }

      }
*/

</style>
