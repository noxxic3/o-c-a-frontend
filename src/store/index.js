import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
	prueba: 'Vuex AAA',
	token: '',
	user_session: '',
	user_session_subtype: '',
	
	patient_id: '',
	patient_image: '',
	
	view: '',                      // Current view being displayed
	view_title: '',
  },
  mutations: {},
  actions: {},
  modules: {}
});


// this.$store.state.user_session.id
