<template>
  <div>
    <div id="Header">
      <router-link to="/" class="isotype-link">
        <img  class="isotype" src="../assets/images/Isotype.svg" alt="Isotype image" ><br>
      </router-link>
      <h1>{{viewTitle}}</h1>
      <!--<div class="extra"></div>-->

    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  /*props: {
    msg: String
  }*/
  data(){
    return {
    }
  },
  computed: {
    viewTitle(){
      return  this.$store.state.view_title;
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  #Header{
    max-width: 90%;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .isotype-link {
 
  }

  .isotype {
    width: 50px;
    height: 50px;
    padding: 15px 0 10px 0;
  }

  h1 {
    color: white;
    font-size: 1.3em;
    flex-grow: 2;
    margin-right: 50px;
  }

  /*.extra{
    width: 50px;
  }*/

      /* Tablet */
      @media screen and (min-width: 768px) {                
        #Header{
          max-width: 80%;
        }

        .isotype {
          width: 90px;
          height: 90px;
        }

        h1 {
          font-size: 2.5em;
          margin-right: 90px;
        }

        /*.extra{
          width: 90px;
        }*/
      }
      
      /* Desktop */
      @media screen and (min-width: 1280px) {                
        #Header{
          max-width: 70%;
        }

        .isotype {
          width: 110px;
          height: 110px;
        }

        h1 {
          font-size: 3em;
          margin-right: 110px;
        }

        
        /*.extra{
          width: 110px;
        }*/
      }


</style>
