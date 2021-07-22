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

	backendURL: 'http://localhost/8_TFG/ObesityControlApp/public/',
	//backendURL: 'http://localhost/10_TFG/o-c-a-backend/public/',
	backendStorageURL: 'http://localhost/8_TFG/ObesityControlApp/public/storage/',
	//backendStorageURL: 'http://localhost/10_TFG/o-c-a-backend/public/storage/',
  },
  mutations: {},
  actions: {},
  modules: {}
});


// this.$store.state.user_session.id
// this.$store.state.backendStorageURL
