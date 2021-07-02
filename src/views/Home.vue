<template>
  <div>
    <img  class="isotype" src="../assets/images/Cover.svg" alt="Welcome picture" ><br>

    <p>Obesity Control App is the official web application of the Obesity Control Center to offer obesity treatments. Here you can record the evolution of your physical condition and receive the appropriate treatment provided by our specialists.</p>

    <!--<news-component />-->

  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "ObesityControlCenter",
  /*components: {
    HelloWorld
  }*/
  data(){
    return{
    }
  },
  created(){
    this.$store.state.view = 'ObesityControlCenter';
    localStorage.setItem("view", 'ObesityControlCenter');
    this.$store.state.view_title = 'Obesity Control Center';
    //alert(this.$store.state.view);
  }
};
</script>

<style scoped>
  img {
    width: 60%;
    padding: 35px 0 10px 0;
  }

  p {
    margin: 10px 7%;
    font-size: 0.7em;
  }

        /* Tablet */
      @media screen and (min-width: 768px) {                
        img {
          width: 40%;
        }
        p {
          margin: 25px 15%;
          font-size: 0.9em;
        }

      }
      
      /* Desktop */
      @media screen and (min-width: 1280px) {                
        img {
          width: 30%;
        }
        p {
          margin: 30px 20%;
          font-size: 1em;
        }
      }

</style>