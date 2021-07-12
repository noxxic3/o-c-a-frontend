<template>
  <div class="about">
    <button class="breadcrumb" v-on:click="toDashboard()"> &#8617; Dashboard</button>
    <img id="profileImage_doctorView" v-bind:src="'http://localhost/8_TFG/ObesityControlApp/public/storage/images/patients/'+$store.state.patient_image" alt="Patient image" ><br>
                          <!-- "http://localhost/8_TFG/ObesityControlApp/public/images/patients/"+ patient.id +".jpg" -->   <!-- The patient.id would be taken from the state of the user stored in the frontend, on this page it would not be necessary to make AJAX request -->
    <data-history-component />
  </div>
</template>

<script>
export default {
  name: "PatientDataDoctorView",
  data(){
    return{
    }
  },
  created(){
    this.$store.state.view = 'PatientDataDoctorView';
    localStorage.setItem("view", 'PatientDataDoctorView');
    this.$store.state.view_title = 'Patient Data Doctor View';
  },
  methods: {
    toDashboard(){
      if(this.$store.state.user_session_subtype.role_name == 'Doctor'){
        this.$router.push('/DoctorDashboard');
      } else if(this.$store.state.user_session_subtype.role_name == 'Admin'){
        this.$router.push('/AdminDashboard');
      }
    }
  },
}
</script>

<style>
  img#profileImage_doctorView {
    width: 100px; 
    height: 100px;
    border-radius: 50%;
    margin-top: 10px;
  }

      /* Tablet */
      @media screen and (min-width: 768px) {                
        img#profileImage_doctorView {
          width: 140px; 
          height: 140px;  
          margin-top: 20px;
        }
      }
      
      /* Desktop */
      @media screen and (min-width: 1280px) {                
        img#profileImage_doctorView {
          width: 160px; 
          height: 160px;  
          margin-top: 20px;
        }
      }
</style>
