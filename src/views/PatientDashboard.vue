<template>
  <div class="about">
    <img id="profileImage" v-bind:src="$store.state.backendStorageURL + 'images/patients/' + $store.state.patient_image" alt="Patient image" ><br>
                          <!-- "http://localhost/8_TFG/ObesityControlApp/public/        images/patients/"+ patient.image  -->  <!-- The  patient.image  would be taken from the state of the user stored in the frontend, on this page it would not be necessary to make AJAX request -->
    <data-history-component />
  </div>
</template>

<script>
export default {
  name: "PatientDashboard",
  data(){
    return{
    }
  },
  created(){
    this.$store.state.view = 'PatientDashboard';
    localStorage.setItem("view", 'PatientDashboard');
    this.$store.state.view_title = 'Patient Dashboard';
  },
  methods: {
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
</style>
