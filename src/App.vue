<template>
  <div id="app">

    <header-component id="header" />
    <user-account-component id="navigation"/>       <!-- <user-account-component/> could be called 'navigation', although in this app it is only used to display buttons related to the user session -->

    <router-view id="main" />
  
  </div>
</template>

<script>

export default {
  name: "App",
  data(){
    return {
    }
  },

  created(){
    // We check if there is session data in LocalStorage and if there is, we store it in Vuex
    const token = localStorage.getItem("token");

    if (token) {
      const user_session = JSON.parse( localStorage.getItem("user_session") );
      const user_session_subtype = JSON.parse( localStorage.getItem("user_session_subtype") );
      const patient_id = localStorage.getItem("patient_id");
      const patient_image = localStorage.getItem("patient_image");
      const view = localStorage.getItem("view");
  
      this.$store.state.token = token;     
      this.$store.state.user_session = user_session;  
      this.$store.state.user_session_subtype = user_session_subtype; 

      this.$store.state.patient_id = patient_id;     
      this.$store.state.patient_image = patient_image;  
      this.$store.state.view = view; 
      //alert(view);
      
       // When we refresh the browser page, Vue Router redirects by default to /login, therefore, it is necessary to manually redirect to the view the user was in.
      if (view == 'ObesityControlCenter'){  // Remember next time to save in LocalStorage the path name of the view instead of the file name of the view, in order to take advantage of it.  If it had been done like this it would only have been necessary to put  this.$router.replace(view)  instead of the whole conditional.
        this.$router.replace('/');
      } else if (view == 'PatientDataDoctorView'){
        this.$router.replace('/PatientDoctorView');
      } else {
        this.$router.replace(view);         // In the case of the other views, the file name matches the path, although the '/' is missing before the name, but it seems that the $router methods forgive it.
      }
    };
    //alert(token);
    //alert(this.$store.state.user_session_subtype.role_name);
  },
}

</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: white;
}

</style>
