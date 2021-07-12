<template>
  <div class="about">
    <search-users-form-component />
  </div>
</template>

<script>
export default {
  name: "OfficeStackDashboard",
  data(){
    return {
    }
  },
  created(){
    this.$store.state.view = 'OfficeStackDashboard';
    localStorage.setItem("view", 'OfficeStackDashboard');
    this.$store.state.view_title = 'Office Staff Dashboard';
  }
}
</script>

<style>
</style>
