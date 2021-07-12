<template>
  <div class="about">
    <div class="manageButtons">
      <button v-on:click="managePatients()">Manage patients</button>
      <button v-on:click="manageUsers()">Manage users</button>
      <button v-on:click="manageTreatments()">Manage treatments</button>
    </div>
    <search-patients-form-component v-if="showManagePatients" />
    <search-users-form-component v-if="showManageUsers" />
    <manage-treatments-component v-if="showManageTreatments" />
  </div>
</template>

<script>
export default {
  name: "AdminDashboard",
  data(){
    return {
      showManagePatients: false,
      showManageUsers: false,
      showManageTreatments: false,
    }
  },
  created(){
    this.$store.state.view = 'AdminDashboard';
    localStorage.setItem("view", 'AdminDashboard');
    this.$store.state.view_title = 'Admin Dashboard';
  },
  methods: {
    managePatients(){
      this.showManagePatients = !this.showManagePatients;
      this.showManageUsers = false;
      this.showManageTreatments = false;
    },
    manageUsers(){
      this.showManagePatients = false;
      this.showManageUsers = !this.showManageUsers;
      this.showManageTreatments = false;
    },
    manageTreatments(){
      this.showManagePatients = false;
      this.showManageUsers = false;
      this.showManageTreatments = !this.showManageTreatments; 
    },
  }
}
</script>

<style scoped>
div.manageButtons{
  display: flex;
  justify-content: space-around;

  margin: 15px auto;
  width: 70%;
}

div.manageButtons button{
  color: white;
  background-color: #ad8302;

  width: 90px;
  height: 30px;

  border: 2px solid grey;
  box-sizing: border-box;
  transition: all 0.5s;
  
  font-size: 0.6em;  
}

div.manageButtons button:hover{
	  background-color: #f3f3f3;
    border: 2px solid black;
    color: black;
    font-weight: bold;
}

      /* Tablet */
      @media screen and (min-width: 768px) {  
        div.manageButtons{
          margin-top: 40px;
          justify-content: center;
          margin: 20px auto;
          width: 50%;
        }  
        div.manageButtons button{
              width: 120px;
              height: 45px;
              font-size: 0.8em;
              margin: auto;
        }
      }
      
      /* Desktop */
      @media screen and (min-width: 1280px) {
        div.manageButtons button{
              width: 150px;
              height: 43px;
              font-size: 0.9em;
        }
      }
</style>
