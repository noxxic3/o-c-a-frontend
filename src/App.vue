<template>
  <div id="app">

    <header-component id="header" />
    <user-account-component id="navigation"/>       <!-- Se podría llamar navigation, aunque en esta app solo se usa para mostrar los botones relacionados con la sesión de usuario -->

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
    // Verificamos si hay datos de sesión en LocalStorage y si los hay, los guardamos en Vuex
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
      
       // Cuando refrescamos la página del navegador, Vue Router redirige por defecto a /login, con lo cual hay que redirigir manualmente a la vista en la que se estaba. 
      if (view == 'ObesityControlCenter'){  // Recuerda la próxima vez guardar el nombre de la ruta de la vista en vez de el nombre del archivo de la vista, así se puede aprovechar.
        this.$router.replace('/');
      } else if (view == 'PatientDataDoctorView'){
        this.$router.replace('/PatientDoctorView');
      } else {
        this.$router.replace(view);         // En el caso de las otras vistas coincide el nombre del archivo con el de la ruta, aunque falta el '/' antes del nombre pero parece que los métodos de $router lo perdonan.   
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
