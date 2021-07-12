<template>
  <div class="about">
    <search-patients-form-component />
  </div>
</template>

<script>
export default {
  name: "DoctorDashboard",
  data(){
    return {
    }
  },
  created(){
    this.$store.state.view = 'DoctorDashboard';
    localStorage.setItem("view", 'DoctorDashboard');
    this.$store.state.view_title = 'Doctor Dashboard';
  }
}
</script>

<style>
</style>