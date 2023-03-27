import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		topListIds:[],
		nextId:''
	},
	mutations: {
		INIT_TOPLISTIDS(state,payload){
			// console.log(payload);
			state.topListIds = payload
		},
		NEXT_ID(state,payload) {
			let index = state.topListIds.findIndex((item)=>{
				return item.id == payload
			})
			if(index != -1){
				state.nextId = state.topListIds[index+1].id
			}
			
			// console.log(state.nextId);
		}
	}
})